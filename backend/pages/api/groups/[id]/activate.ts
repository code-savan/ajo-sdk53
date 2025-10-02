import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyAccessToken } from '@/utils/jwt'
import stripe from '@/lib/stripe'

function shuffle<T>(arr: T[]): T[] { return arr.map(v => [Math.random(), v] as const).sort((a,b)=>a[0]-b[0]).map(([,v])=>v) }

function addPeriod(date: Date, frequency: string): Date {
  const d = new Date(date)
  if (frequency === 'weekly') d.setDate(d.getDate() + 7)
  else if (frequency === 'monthly') d.setMonth(d.getMonth() + 1)
  else if (frequency === 'quarterly') d.setMonth(d.getMonth() + 3)
  return d
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const groupId = req.query.id as string

    // Load group and members
    const { data: group, error: groupErr } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupErr || !group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }

    // Only owner can activate
    const { data: owner, error: ownerErr } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', payload.userId)
      .single()

    if (ownerErr || !owner || owner.role !== 'owner') {
      return res.status(403).json({ success: false, error: 'Not authorized' })
    }

    const { data: members } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId)

    const userIds = (members || []).map(m => m.user_id)

    let beneficiaryOrder: string[] = []
    if (group.payout_order_strategy === 'random_fixed') {
      beneficiaryOrder = shuffle(userIds)
    } else {
      beneficiaryOrder = userIds // join order fallback
    }

    // Ensure Stripe customer exists for group
    let stripeCustomerId = group.stripe_customer_id as string | null
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: { group_id: groupId }
      })
      stripeCustomerId = customer.id
    }

    const now = new Date()
    const nextChargeAt = addPeriod(now, group.frequency)

    const { data: updated, error: updErr } = await supabase
      .from('groups')
      .update({
        status: 'active',
        beneficiary_order: beneficiaryOrder,
        current_cycle: 1,
        current_beneficiary_user_id: beneficiaryOrder[0] || null,
        next_charge_at: nextChargeAt.toISOString(),
        stripe_customer_id: stripeCustomerId
      })
      .eq('id', groupId)
      .select('*')
      .single()

    if (updErr) {
      return res.status(400).json({ success: false, error: updErr.message })
    }

    return res.json({ success: true, data: updated })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
