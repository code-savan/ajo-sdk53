import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { verifyAccessToken } from '@/utils/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Best-effort cleanup: delete user rows (wallets, groups membership) cascades handled by FK where defined
    await supabase.from('users').delete().eq('id', payload.userId)

    return res.json({ success: true })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to delete account' })
  }
}
