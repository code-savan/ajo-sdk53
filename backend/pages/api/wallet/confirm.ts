import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'
import { createNotification } from '../notifications/templates'

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

    const pi = await stripe.paymentIntents.retrieve(payment_intent_id)
    console.log('[wallet/confirm] fetched PI', { id: pi.id, status: pi.status, amount: pi.amount, currency: pi.currency })
    if (pi.status !== 'succeeded') {
      return res.status(200).json({ success: true, data: { status: pi.status } })
    }

    // Check if already credited
    const { data: existing } = await supabase
      .from('user_wallet_ledger')
      .select('id')
      .eq('user_id', payload.userId)
      .eq('external_ref', payment_intent_id)
      .maybeSingle()

    if (existing) {
      return res.status(200).json({ success: true, data: { credited: true } })
    }

    // Find the pending deposit row
    const { data: dep } = await supabase
      .from('user_deposits')
      .select('*')
      .eq('user_id', payload.userId)
      .eq('stripe_payment_intent_id', payment_intent_id)
      .maybeSingle()

    const amount = Number(dep?.amount_cents || pi.amount || 0)
    const fee = Number(dep?.fee_cents || 0)
    const net = Number(dep?.net_amount_cents || (amount - fee))
    const currency = (pi.currency || process.env.STRIPE_DEFAULT_CURRENCY || 'usd').toLowerCase()

    // Update deposit status
    await supabase
      .from('user_deposits')
      .update({ status: 'succeeded' })
      .eq('stripe_payment_intent_id', payment_intent_id)

    // Credit ledger with net
    await supabase.from('user_wallet_ledger').insert({
      user_id: payload.userId,
      direction: 'credit',
      amount_cents: net,
      currency,
      source: 'deposit',
      external_ref: payment_intent_id,
      meta: { kind: 'deposit_card' }
    })

    if (fee > 0) {
      await supabase.from('user_wallet_ledger').insert({
        user_id: payload.userId,
        direction: 'debit',
        amount_cents: fee,
        currency,
        source: 'fee',
        external_ref: payment_intent_id,
        meta: { kind: 'platform_fee' }
      })
    }

    // Notify user
    try {
      await createNotification(payload.userId, { kind: 'wallet_deposit', amount_cents: net, currency })
      console.log('[wallet/confirm] notification queued', { user_id: payload.userId, net, currency })
    } catch {}

    return res.status(200).json({ success: true, data: { credited: true } })
  } catch (e: any) {
    const msg = e?.message || 'Failed to confirm payment'
    return res.status(400).json({ success: false, error: msg })
  }
}
