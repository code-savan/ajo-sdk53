import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'
import { createNotification } from '../notifications/templates'

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

    const { amount_cents, bank_account_id } = req.body || {}
    if (!amount_cents || amount_cents <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' })
    }
    if (!bank_account_id) {
      return res.status(400).json({ success: false, error: 'Missing bank account' })
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, stripe_customer_id, stripe_connect_account_id')
      .eq('id', (payload as any).userId)
      .single()

    // Ensure bank account belongs to user
    const { data: bank } = await supabase
      .from('user_bank_accounts')
      .select('id, status')
      .eq('id', bank_account_id)
      .eq('user_id', (payload as any).userId)
      .single()
    if (!bank || bank.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Invalid bank account' })
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
    // Pending withdrawals
    const { data: pendingRows } = await supabase
      .from('user_withdrawals')
      .select('amount_cents, status')
      .eq('user_id', (payload as any).userId)
      .eq('status', 'pending')

    const pendingSum = (pendingRows || []).reduce((a: number, r: any) => a + Number(r.amount_cents || 0), 0)
    const available = (credits - debits) - pendingSum
    if (available < Number(amount_cents)) {
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
      metadata: { type: 'user_withdrawal', user_id: (payload as any).userId, bank_account_id }
    })

    // Record pending withdrawal
    const { data: wd, error: wdErr } = await supabase
      .from('user_withdrawals')
      .insert({ user_id: (payload as any).userId, amount_cents: Number(amount_cents), status: 'pending', external_ref: pi.id })
      .select('id')
      .single()
    if (wdErr) return res.status(400).json({ success: false, error: wdErr.message })

    // Notify user
    try {
      await createNotification((payload as any).userId, { kind: 'withdrawal', amount_cents: Number(amount_cents), currency })
    } catch {}

    return res.status(201).json({ success: true, data: { payment_intent_id: pi.id, withdrawal_id: wd.id } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Withdrawal failed' })
  }
}
