import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

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

    const base = process.env.PUBLIC_BASE_URL?.replace(/\/$/, '') || ''
    const return_url = process.env.STRIPE_IDENTITY_RETURN_URL || `${base}/api/kyc/return`

    const session = await stripe.identity.verificationSessions.create({
      type: 'document',
      options: { document: { require_id_number: true, require_live_capture: true } },
      metadata: { user_id: payload.userId },
      return_url,
    })

    await supabase
      .from('users')
      .update({ stripe_identity_session_id: session.id, stripe_identity_status: session.status })
      .eq('id', payload.userId)

    return res.status(201).json({ success: true, data: { session_id: session.id, url: (session as any).url } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to start KYC' })
  }
}
