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
      .select('id, group_id')
      .eq('invite_code', invite_code)
      .single()
    if (invErr || !invite) return res.status(404).json({ success: false, error: 'Invite not found' })

    // Owner guard
    const { data: group, error: gErr } = await supabase
      .from('groups')
      .select('creator_user_id')
      .eq('id', invite.group_id)
      .single()
    if (gErr || !group) return res.status(404).json({ success: false, error: 'Group not found' })
    if (group.creator_user_id !== payload.userId) return res.status(403).json({ success: false, error: 'Forbidden' })

    await supabase
      .from('group_invites')
      .update({ status: 'declined' })
      .eq('id', invite.id)

    return res.json({ success: true })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to revoke invite' })
  }
}
