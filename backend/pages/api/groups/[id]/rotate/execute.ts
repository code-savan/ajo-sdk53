import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyAccessToken } from '@/utils/jwt'
import stripe from '@/lib/stripe'

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
    verifyAccessToken(token)

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const groupId = req.query.id as string

    const { data: group, error: groupErr } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupErr || !group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }

    // Verify all members covered for current cycle
    const { data: members } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId)
    const memberIds = (members || []).map(m => m.user_id)

    const { data: covered } = await supabase
      .from('contributions')
      .select('user_id')
      .eq('group_id', groupId)
      .eq('cycle_number', group.current_cycle)
      .eq('status', 'covered')
    const coveredIds = new Set((covered || []).map(c => c.user_id))

    if (!memberIds.every(id => coveredIds.has(id))) {
      return res.status(400).json({ success: false, error: 'Not all contributions are covered' })
    }

    // Credit beneficiary wallet and optionally transfer to Connect (if auto-payout desired)
    const beneficiaryId = group.current_beneficiary_user_id
    const amount = Number(group.contribution_amount_cents) * memberIds.length
    const currency = group.currency || process.env.STRIPE_DEFAULT_CURRENCY || 'usd'

    // Credit beneficiary wallet ledger
    await supabase.from('user_wallet_ledger').insert({
      user_id: beneficiaryId,
      direction: 'credit',
      amount_cents: amount,
      currency,
      source: 'rotation_earning',
      external_ref: `rotation_${group.id}_${group.current_cycle}`,
      meta: { group_id: group.id, cycle_number: group.current_cycle }
    })

    // Advance to next cycle/beneficiary
    const order: string[] = group.beneficiary_order || []
    const currentIndex = Math.max(0, order.indexOf(beneficiaryId))
    const nextIndex = (currentIndex + 1) % Math.max(1, order.length)
    const nextBeneficiary = order[nextIndex] || beneficiaryId
    const nextCycle = group.current_cycle + 1
    const nextChargeAt = addPeriod(new Date(), group.frequency)

    await supabase
      .from('groups')
      .update({ current_cycle: nextCycle, current_beneficiary_user_id: nextBeneficiary, next_charge_at: nextChargeAt.toISOString() })
      .eq('id', groupId)

    return res.status(200).json({ success: true, data: { beneficiary_user_id: beneficiaryId, credited_amount_cents: amount, next_cycle: nextCycle } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Rotation execution failed' })
  }
}
