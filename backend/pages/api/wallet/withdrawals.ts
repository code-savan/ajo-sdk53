import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token) as any

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end('Method Not Allowed')
    }

    const limit = Math.min(50, Number(req.query.limit || 20))
    const { data, error } = await supabase
      .from('user_withdrawals')
      .select('id, amount_cents, fee_cents, status, external_ref, created_at')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return res.status(400).json({ success: false, error: error.message })
    return res.json({ success: true, data })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
