import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { createNotification } from '../../notifications/templates'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end('Method Not Allowed')
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token) as any

    const { payment_intent_id } = req.body || {}
    if (!payment_intent_id) {
      return res.status(400).json({ success: false, error: 'Missing payment_intent_id' })
    }

    // Find the pending deposit
    const { data: dep } = await supabase
      .from('user_deposits')
      .select('*')
      .eq('user_id', payload.userId)
      .eq('stripe_payment_intent_id', payment_intent_id)
      .eq('status', 'pending')
      .single()

    if (!dep) {
      return res.status(404).json({ success: false, error: 'Pending deposit not found' })
    }

    const amount = Number(dep.amount_cents)
    const fee = Number(dep.fee_cents || 0)
    const net = Number(dep.net_amount_cents || (amount - fee))
    const currency = (process.env.STRIPE_DEFAULT_CURRENCY || 'usd').toLowerCase()

    // Mark deposit succeeded (preserving stored net and fee)
    await supabase
      .from('user_deposits')
      .update({ status: 'succeeded' })
      .eq('id', dep.id)

    // Credit ledger with exact intended amount
    await supabase.from('user_wallet_ledger').insert({
      user_id: payload.userId,
      direction: 'credit',
      amount_cents: net,
      currency,
      source: 'deposit',
      external_ref: payment_intent_id,
      meta: { kind: 'test_deposit' }
    })

    // Fee ledger (if any)
    if (fee > 0) {
      await supabase.from('user_wallet_ledger').insert({
        user_id: payload.userId,
        direction: 'debit',
        amount_cents: fee,
        currency,
        source: 'fee',
        external_ref: payment_intent_id,
        meta: { kind: 'platform_fee_test' }
      })
    }

    // Notify user
    await createNotification(payload.userId, { kind: 'wallet_deposit', amount_cents: net, currency })

    return res.status(200).json({ success: true, data: { credited_cents: net } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Test fund failed' })
  }
}
