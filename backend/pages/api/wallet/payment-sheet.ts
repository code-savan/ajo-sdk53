import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

const PLATFORM_FEE_BPS = Number(process.env.STRIPE_PLATFORM_FEE_BPS || 300)
const STRIPE_ESTIMATED_FEE_BPS = Number(process.env.STRIPE_ESTIMATED_FEE_BPS || 0)

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

    const { amount_cents } = req.body || {}
    if (!amount_cents || amount_cents <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' })
    }

    // Net intended amount; gross-up for fees to charge customer
    const intended = Number(amount_cents)
    const totalBps = PLATFORM_FEE_BPS + STRIPE_ESTIMATED_FEE_BPS
    const gross = Math.ceil(intended * (1 + totalBps / 10000))
    const platformFee = Math.max(0, gross - intended)

    // Ensure stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('id, email, stripe_customer_id')
      .eq('id', payload.userId)
      .single()

    let stripeCustomerId = user?.stripe_customer_id as string | null
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ metadata: { user_id: payload.userId, email: user?.email || '' } })
      stripeCustomerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: stripeCustomerId }).eq('id', payload.userId)
    }

    // Create ephemeral key - use a stable API version compatible with mobile SDK
    const eph = await stripe.ephemeralKeys.create(
      { customer: stripeCustomerId },
      { apiVersion: '2022-11-15' as any }
    )

    const currency = (process.env.STRIPE_DEFAULT_CURRENCY || 'usd').toLowerCase()
    // Create PaymentIntent set to save card for off-session usage
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gross,
      currency,
      customer: stripeCustomerId,
      automatic_payment_methods: { enabled: true },
      setup_future_usage: 'off_session',
      metadata: { type: 'user_deposit', user_id: payload.userId, intended_cents: intended, gross_cents: gross }
    })

    // Record pending user_deposit
    await supabase.from('user_deposits').insert({
      user_id: payload.userId,
      stripe_payment_intent_id: paymentIntent.id,
      amount_cents: gross,
      fee_cents: platformFee,
      net_amount_cents: intended,
      status: 'pending',
      metadata: { method: 'card' }
    })

    return res.status(200).json({ success: true, data: {
      paymentIntentClientSecret: paymentIntent.client_secret,
      ephemeralKeySecret: eph.secret,
      customerId: stripeCustomerId,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      paymentIntentId: paymentIntent.id
    }})
  } catch (e: any) {
    const msg = e?.message || 'Failed to create payment sheet'
    return res.status(400).json({ success: false, error: msg })
  }
}
