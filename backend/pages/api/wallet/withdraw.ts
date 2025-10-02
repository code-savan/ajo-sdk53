import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabase } from '@/lib/supabase'
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
      return res.status(405).end('Method Not Allowed')
    }

    const { amount_cents } = req.body || {}
    if (!amount_cents || amount_cents <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' })
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, stripe_customer_id, stripe_connect_account_id')
      .eq('id', (payload as any).userId)
      .single()

    if (!user?.stripe_connect_account_id) {
      return res.status(400).json({ success: false, error: 'Payout account not set up' })
    }

    // Ensure wallet has enough balance
    const { data: ledger } = await supabase
      .from('user_wallet_ledger')
      .select('direction, amount_cents')
      .eq('user_id', (payload as any).userId)

    let credits = 0, debits = 0
    for (const row of ledger || []) {
      const amt = Number(row.amount_cents)
      if (row.direction === 'credit') credits += amt
      else debits += amt
    }
    if ((credits - debits) < Number(amount_cents)) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' })
    }

    // Create payout PI from user's cash balance to their Connect account
    const currency = process.env.STRIPE_DEFAULT_CURRENCY || 'usd'

    // Ensure customer exists
    let customerId = user?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({ metadata: { user_id: (payload as any).userId } })
      customerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', (payload as any).userId)
    }

    const pi = await stripe.paymentIntents.create({
      amount: Number(amount_cents),
      currency,
      customer: customerId!,
      payment_method_types: ['customer_balance'],
      transfer_data: { destination: user!.stripe_connect_account_id },
      metadata: { type: 'user_withdrawal', user_id: (payload as any).userId }
    })

    // Ledger pending (actual debit on success in webhook) – optional to record now

    return res.status(201).json({ success: true, data: { payment_intent_id: pi.id } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Withdrawal failed' })
  }
}
