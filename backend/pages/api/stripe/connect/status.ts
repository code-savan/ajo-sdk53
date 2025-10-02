import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end('Method Not Allowed')
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token) as any

    const { data: user } = await supabase
      .from('users')
      .select('id, stripe_connect_account_id, is_verified')
      .eq('id', payload.userId)
      .single()

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    if (!user.stripe_connect_account_id) {
      return res.status(200).json({ success: true, data: { is_verified: false, status: 'no_account' } })
    }

    const acct = await stripe.accounts.retrieve(user.stripe_connect_account_id)
    const detailsSubmitted = acct.details_submitted
    const transfersEnabled = (acct as any).transfers_enabled

    const verified = Boolean(detailsSubmitted && transfersEnabled)

    if (verified && !user.is_verified) {
      await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', payload.userId)
    }

    return res.status(200).json({ success: true, data: { is_verified: verified, status: verified ? 'verified' : 'pending' } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Status check failed' })
  }
}
