import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'

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

    const ext = String(req.query.external_ref || '')
    const source = req.query.source ? String(req.query.source) : undefined
    if (!ext) return res.status(400).json({ success: false, error: 'external_ref required' })

    let query = supabase
      .from('user_wallet_ledger')
      .select('*')
      .eq('user_id', payload.userId)
      .eq('external_ref', ext)
      .order('occurred_at', { ascending: false })
      .limit(1)

    if (source) query = query.eq('source', source)

    const { data, error } = await query
    if (error) return res.status(400).json({ success: false, error: error.message })

    const r = (data || [])[0]
    return res.status(200).json({ success: true, data: r || null })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to find transaction' })
  }
}
