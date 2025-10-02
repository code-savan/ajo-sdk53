import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    console.log('[connect/create-account] start');
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[connect/create-account] missing auth header');
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token) as any
    console.log('[connect/create-account] user', payload.userId)

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      console.log('[connect/create-account] method not allowed', req.method)
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const { data: user } = await supabase
      .from('users')
      .select('stripe_connect_account_id')
      .eq('id', payload.userId)
      .single()

    if (user?.stripe_connect_account_id) {
      console.log('[connect/create-account] existing account', user.stripe_connect_account_id)
      return res.status(200).json({ success: true, data: { account_id: user.stripe_connect_account_id } })
    }

    console.log('[connect/create-account] creating new Stripe account')
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: { user_id: payload.userId }
    })
    console.log('[connect/create-account] created', account.id)

    await supabase
      .from('users')
      .update({ stripe_connect_account_id: account.id, is_verified: false })
      .eq('id', payload.userId)

    console.log('[connect/create-account] saved to users table')
    return res.status(201).json({ success: true, data: { account_id: account.id } })
  } catch (e: any) {
    console.error('[connect/create-account] error', e?.message || e)
    return res.status(500).json({ success: false, error: 'Failed to create connect account' })
  }
}
