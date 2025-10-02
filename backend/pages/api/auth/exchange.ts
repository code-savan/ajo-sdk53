import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { generateTokens } from '@/utils/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No Supabase token provided' })
  }
  const supabaseToken = authHeader.split(' ')[1]

  try {
    const { data, error } = await supabase.auth.getUser(supabaseToken)
    if (error || !data?.user) {
      return res.status(401).json({ success: false, error: 'Invalid Supabase token' })
    }

    const tokens = generateTokens({ userId: data.user.id, email: data.user.email || '' })
    return res.json({ success: true, data: tokens })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Token exchange failed' })
  }
}
