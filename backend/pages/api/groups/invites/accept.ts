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

    const { invite_code } = (req.body || {}) as any
    if (!invite_code) return res.status(400).json({ success: false, error: 'invite_code required' })

    const { data: invite, error: invErr } = await supabase
      .from('group_invites')
      .select('id, group_id, status, expires_at')
      .eq('invite_code', invite_code)
      .single()
    if (invErr || !invite) return res.status(404).json({ success: false, error: 'Invite not found' })
    if (invite.status !== 'pending') return res.status(400).json({ success: false, error: 'Invite not pending' })
    if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) return res.status(400).json({ success: false, error: 'Invite expired' })

    // Add member if not already
    const { data: exists } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', invite.group_id)
      .eq('user_id', payload.userId)
      .maybeSingle()
    if (!exists) {
      const { error: addErr } = await supabase
        .from('group_members')
        .insert({ group_id: invite.group_id, user_id: payload.userId, role: 'member' })
      if (addErr) return res.status(400).json({ success: false, error: addErr.message })
    }

    // Mark invite accepted
    await supabase
      .from('group_invites')
      .update({ status: 'accepted', accepted_by: payload.userId, accepted_at: new Date().toISOString() })
      .eq('id', invite.id)

    return res.json({ success: true, data: { group_id: invite.group_id } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to accept invite' })
  }
}
