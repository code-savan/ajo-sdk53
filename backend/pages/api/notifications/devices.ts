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

    const { data, error } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })

    if (error) return res.status(400).json({ success: false, error: error.message })
    return res.status(200).json({ success: true, data })
  } catch (e: any) {
    return res.status(400).json({ success: false, error: 'Failed to fetch devices' })
  }
}
