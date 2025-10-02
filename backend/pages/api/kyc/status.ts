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
      .select('stripe_identity_session_id, is_verified')
      .eq('id', payload.userId)
      .single()

    if (!user?.stripe_identity_session_id) {
      return res.status(200).json({ success: true, data: { status: 'no_session', is_verified: !!user?.is_verified } })
    }

    const session = await stripe.identity.verificationSessions.retrieve(user.stripe_identity_session_id)

    const status = session.status
    const verified = status === 'verified'

    await supabase
      .from('users')
      .update({ stripe_identity_status: status, is_verified: verified ? true : user.is_verified })
      .eq('id', payload.userId)

    return res.status(200).json({ success: true, data: { status, is_verified: verified || !!user.is_verified } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to get KYC status' })
  }
}
