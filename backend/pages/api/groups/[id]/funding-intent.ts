import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { verifyAccessToken } from '@/utils/jwt'
import stripe from '@/lib/stripe'

const BANK_TRANSFER_TYPE = process.env.STRIPE_BANK_TRANSFER_TYPE || 'eu_bank_transfer'

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
    const { amount_cents } = req.body || {}

    if (!amount_cents || amount_cents <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' })
    }

    const { data: group, error: groupErr } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupErr || !group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }

    if (!group.stripe_customer_id) {
      return res.status(400).json({ success: false, error: 'Group is not activated or missing Stripe customer' })
    }

    const currency = group.currency || process.env.STRIPE_DEFAULT_CURRENCY || 'usd'

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount_cents),
      currency,
      customer: group.stripe_customer_id,
      payment_method_types: ['customer_balance'],
      metadata: {
        type: 'group_deposit',
        group_id: groupId,
        user_id: payload.userId
      }
    })

    // Create funding instructions via the Customers API using the group's Stripe customer
    const instructions = await (stripe.customers as any).createFundingInstructions(group.stripe_customer_id, {
      bank_transfer: { type: BANK_TRANSFER_TYPE },
      currency,
      funding_type: 'bank_transfer'
    })

    const { error: depErr } = await supabaseAdmin
      .from('group_deposits')
      .insert({
        group_id: groupId,
        user_id: payload.userId,
        stripe_payment_intent_id: paymentIntent.id,
        amount_cents: Number(amount_cents),
        fee_cents: 0,
        net_amount_cents: 0,
        status: 'pending',
        metadata: { funding_instructions_id: instructions.id }
      })

    if (depErr) {
      return res.status(400).json({ success: false, error: depErr.message })
    }

    return res.status(201).json({ success: true, data: { payment_intent_id: paymentIntent.id, funding_instructions: instructions } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to create funding intent' })
  }
}
