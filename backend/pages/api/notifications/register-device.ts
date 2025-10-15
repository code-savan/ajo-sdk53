import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'

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

    const { expo_push_token, device_id, platform } = req.body || {}
    console.log('[register-device] incoming', {
      user_id: (verifyAccessToken as any) ? undefined : undefined, // placeholder to avoid logging token parsing twice
      has_token: !!expo_push_token,
      token_len: typeof expo_push_token === 'string' ? expo_push_token.length : 0,
      device_id,
      platform,
      ua: req.headers['user-agent']
    })
    if (!expo_push_token || typeof expo_push_token !== 'string') {
      return res.status(400).json({ success: false, error: 'expo_push_token required' })
    }

    // Upsert device
    const did = device_id || req.headers['x-device-id'] || null
    const plt = platform || req.headers['x-device-platform'] || null
    const ua = req.headers['user-agent'] || ''

    await supabase
      .from('user_devices')
      .upsert({
        user_id: payload.userId,
        device_id: did,
        platform: plt,
        expo_push_token,
        status: 'active'
      }, { onConflict: 'user_id,device_id' })

    return res.status(200).json({ success: true, data: { expo_push_token, device_id: did, platform: plt, user_agent: ua } })
  } catch (e: any) {
    return res.status(400).json({ success: false, error: 'Failed to register device' })
  }
}
