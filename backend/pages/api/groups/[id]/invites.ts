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

    const groupId = req.query.id as string

    // Owner guard: creator_user_id must match
    const { data: group, error: gErr } = await supabase
      .from('groups')
      .select('id, creator_user_id, name')
      .eq('id', groupId)
      .single()
    if (gErr || !group) return res.status(404).json({ success: false, error: 'Group not found' })
    const isOwner = group.creator_user_id === payload.userId

    if (req.method === 'GET') {
      if (!isOwner) return res.status(403).json({ success: false, error: 'Forbidden' })
      const status = typeof req.query.status === 'string' ? req.query.status : undefined
      let query = supabase
        .from('group_invites')
        .select('invite_code, invited_email, invited_phone, status, expires_at, created_at, accepted_by, accepted_at')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
      if (status) query = query.eq('status', status)
      const { data, error } = await query
      if (error) return res.status(400).json({ success: false, error: error.message })
      return res.json({ success: true, data })
    }

    if (req.method === 'POST') {
      if (!isOwner) return res.status(403).json({ success: false, error: 'Forbidden' })
      const { email, phone } = (req.body || {}) as any
      if (!email && !phone) return res.status(400).json({ success: false, error: 'email or phone required' })
      const { data: invite, error } = await supabase
        .from('group_invites')
        .insert({
          group_id: groupId,
          invited_by: payload.userId,
          invited_email: email || null,
          invited_phone: phone || null,
          status: 'pending'
        })
        .select('invite_code, expires_at')
        .single()
      if (error) return res.status(400).json({ success: false, error: error.message })
      const code = invite.invite_code
      const deeplink = `ajo://invite?code=${encodeURIComponent(code)}`
      const webBase = process.env.NEXT_PUBLIC_WEB_BASE_URL || process.env.EXPO_PUBLIC_WEB_BASE_URL || ''
      const webLink = webBase ? `${webBase.replace(/\/$/, '')}/invite?code=${encodeURIComponent(code)}` : null
      return res.status(201).json({ success: true, data: { invite_code: code, expires_at: invite.expires_at, link: deeplink, web_link: webLink } })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end('Method Not Allowed')
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
