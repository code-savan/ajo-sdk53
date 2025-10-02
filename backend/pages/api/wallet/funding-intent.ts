import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

const RAW_BANK_TRANSFER_TYPE = process.env.STRIPE_BANK_TRANSFER_TYPE || ''
const VALID_TYPES = new Set(['us_bank_transfer','eu_bank_transfer','gb_bank_transfer'])
const PLATFORM_FEE_BPS = Number(process.env.STRIPE_PLATFORM_FEE_BPS || 300)
const STRIPE_ESTIMATED_FEE_BPS = Number(process.env.STRIPE_ESTIMATED_FEE_BPS || 0)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    console.log('[wallet/funding-intent] start')
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
    console.log('[wallet/funding-intent] user', payload.userId)

    const { amount_cents } = req.body || {}
    if (!amount_cents || amount_cents <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' })
    }

    // The amount_cents provided is the intended wallet credit (net). We gross-up for fees.
    const intended = Number(amount_cents)
    const totalBps = PLATFORM_FEE_BPS + STRIPE_ESTIMATED_FEE_BPS
    const gross = Math.ceil(intended * (1 + totalBps / 10000))
    const platformFee = Math.max(0, gross - intended) // includes stripe estimated if any

    // Load user and ensure stripe_customer_id exists
    const { data: user } = await supabase
      .from('users')
      .select('id, email, stripe_customer_id')
      .eq('id', payload.userId)
      .single()

    let stripeCustomerId = user?.stripe_customer_id as string | null
    if (!stripeCustomerId) {
      console.log('[wallet/funding-intent] creating stripe customer')
      const customer = await stripe.customers.create({ metadata: { user_id: payload.userId, email: user?.email || '' } })
      stripeCustomerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: stripeCustomerId }).eq('id', payload.userId)
    }

    const currency = (process.env.STRIPE_DEFAULT_CURRENCY || 'usd').toLowerCase()
    let bankTransferType = RAW_BANK_TRANSFER_TYPE
    if (!VALID_TYPES.has(bankTransferType)) {
      bankTransferType = currency === 'usd' ? 'us_bank_transfer' : (currency === 'gbp' ? 'gb_bank_transfer' : 'eu_bank_transfer')
    }

    console.log('[wallet/funding-intent] creating PI for customer', stripeCustomerId, 'amount', gross, 'currency', currency)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gross,
      currency,
      customer: stripeCustomerId,
      payment_method_types: ['customer_balance'],
      metadata: { type: 'user_deposit', user_id: payload.userId, intended_cents: intended, gross_cents: gross }
    })

    console.log('[wallet/funding-intent] creating customer funding instructions', bankTransferType)
    const instructions = await (stripe.customers as any).createFundingInstructions(stripeCustomerId, {
      bank_transfer: { type: bankTransferType },
      currency,
      funding_type: 'bank_transfer'
    })

    await supabase.from('user_deposits').insert({
      user_id: payload.userId,
      stripe_payment_intent_id: paymentIntent.id,
      amount_cents: gross, // transfer amount
      fee_cents: platformFee,
      net_amount_cents: intended, // wallet credit target
      status: 'pending',
      metadata: { funding_instructions_id: (instructions as any)?.id }
    })

    return res.status(201).json({ success: true, data: { payment_intent_id: paymentIntent.id, funding_instructions: instructions, intended_amount_cents: intended, transfer_amount_cents: gross, fee_cents: platformFee } })
  } catch (e: any) {
    console.error('[wallet/funding-intent] error', e?.message || e)
    const msg = e?.message || 'Failed to create funding intent'
    return res.status(400).json({ success: false, error: msg })
  }
}
