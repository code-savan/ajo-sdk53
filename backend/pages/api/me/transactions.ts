import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
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

    const since = typeof req.query.since === 'string' ? req.query.since : undefined
    const limit = Number(req.query.limit || 100)

    let query = supabase
      .from('user_wallet_ledger')
      .select('*')
      .eq('user_id', payload.userId)
      .order('occurred_at', { ascending: false })
      .limit(limit)

    if (since) {
      query = query.gt('occurred_at', since)
    }

    const { data, error } = await query

    if (error) {
      return res.status(400).json({ success: false, error: error.message })
    }

    const mapped = (data || []).map(r => ({
      id: r.id,
      direction: r.direction,
      amount_cents: r.amount_cents,
      currency: r.currency,
      source: r.source,
      occurred_at: r.occurred_at,
      external_ref: r.external_ref,
    }))

    return res.json({ success: true, data: mapped })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
