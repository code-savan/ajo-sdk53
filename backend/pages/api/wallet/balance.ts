import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end('Method Not Allowed')
    }

    const { data: ledger } = await supabase
      .from('user_wallet_ledger')
      .select('direction, amount_cents')
      .eq('user_id', (payload as any).userId)

    let credits = 0
    let debits = 0
    for (const row of ledger || []) {
      const amt = Number(row.amount_cents)
      if (row.direction === 'credit') credits += amt
      else debits += amt
    }

    const balanceCents = credits - debits
    return res.json({ success: true, data: { balanceCents } })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
