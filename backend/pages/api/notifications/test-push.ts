import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { sendExpoPush } from '@/lib/push'

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

    const { data: tokens } = await supabase
      .from('user_devices')
      .select('expo_push_token')
      .eq('user_id', payload.userId)
      .eq('status', 'active')
    const list = (tokens || []).map((r: any) => r.expo_push_token)
    const valid = list.filter((t: any) => typeof t === 'string' && t.startsWith('ExponentPushToken'))
    if (!valid.length) return res.status(400).json({ success: false, error: 'No active tokens' })

    const result = await sendExpoPush(valid, 'Test Notification', 'This is a test push from Ajo backend', { kind: 'test' })
    return res.status(200).json({ success: true, data: result })
  } catch (e: any) {
    return res.status(400).json({ success: false, error: 'Failed to send test push' })
  }
}
