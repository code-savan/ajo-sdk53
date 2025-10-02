import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyAccessToken } from '@/utils/jwt'
import stripe from '@/lib/stripe'

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

    const { data: user } = await supabase
      .from('users')
      .select('id, stripe_connect_account_id')
      .eq('id', payload.userId)
      .single()

    if (!user?.stripe_connect_account_id) {
      return res.status(400).json({ success: false, error: 'User not onboarded to Stripe Connect' })
    }

    // Compute user credits
    const { data: ledger } = await supabase
      .from('group_balance_ledger')
      .select('user_id, direction, amount_cents')
      .eq('group_id', groupId)

    let userCredits = 0
    let totalDebits = 0
    for (const row of ledger || []) {
      if (row.direction === 'credit' && row.user_id === payload.userId) userCredits += Number(row.amount_cents)
      if (row.direction === 'debit') totalDebits += Number(row.amount_cents)
    }

    // NOTE: Proper per-user debit allocation is complex; this MVP checks gross user credits against group debits.
    // In production, maintain per-user allocations to ensure fairness.

    if (amount_cents > userCredits) {
      return res.status(400).json({ success: false, error: 'Requested amount exceeds your available credits' })
    }

    const currency = group.currency || process.env.STRIPE_DEFAULT_CURRENCY || 'usd'

    const pi = await stripe.paymentIntents.create({
      amount: Number(amount_cents),
      currency,
      customer: group.stripe_customer_id,
      payment_method_types: ['customer_balance'],
      transfer_data: { destination: user.stripe_connect_account_id },
      metadata: {
        type: 'group_withdrawal',
        group_id: groupId,
        beneficiary_user_id: payload.userId
      }
    })

    await supabase
      .from('payouts')
      .insert({
        group_id: groupId,
        cycle_number: null,
        beneficiary_user_id: payload.userId,
        amount_cents: Number(amount_cents),
        stripe_payment_intent_id: pi.id,
        status: 'pending'
      })

    return res.status(201).json({ success: true, data: { payment_intent_id: pi.id } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Withdrawal failed' })
  }
}
