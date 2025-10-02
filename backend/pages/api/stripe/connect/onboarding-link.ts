import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    console.log('[connect/onboarding-link] start')
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[connect/onboarding-link] missing auth header')
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token) as any
    console.log('[connect/onboarding-link] user', payload.userId)

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      console.log('[connect/onboarding-link] method not allowed', req.method)
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const { data: user } = await supabase
      .from('users')
      .select('stripe_connect_account_id')
      .eq('id', payload.userId)
      .single()

    const accountId = user?.stripe_connect_account_id
    if (!accountId) {
      console.log('[connect/onboarding-link] no account found')
      return res.status(409).json({ success: false, error: 'No connect account' })
    }

    const refresh_url = process.env.STRIPE_CONNECT_REFRESH_URL as string
    const return_url = process.env.STRIPE_CONNECT_REDIRECT_URL as string
    console.log('[connect/onboarding-link] building link for', accountId)

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url,
      return_url,
      type: 'account_onboarding',
    })
    console.log('[connect/onboarding-link] created url', link.url)

    return res.status(200).json({ success: true, data: { url: link.url } })
  } catch (e: any) {
    console.error('[connect/onboarding-link] error', e?.message || e)
    return res.status(500).json({ success: false, error: 'Failed to create onboarding link' })
  }
}
