import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { verifyAccessToken } from '@/utils/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    if (req.method === 'GET') {
      const { data: memberships, error: memErr } = await supabase
          .from('group_members')
        .select('group_id, groups:group_id(*)')
        .eq('user_id', (payload as any).userId)

      if (memErr) {
        return res.status(400).json({ success: false, error: memErr.message })
        }

      const groups = (memberships || []).map((m: any) => m.groups)
      return res.json({ success: true, data: groups })
    }

    if (req.method === 'POST') {
      const {
        name,
        description,
        size,
        contribution_amount_cents,
        currency = process.env.STRIPE_DEFAULT_CURRENCY || 'usd',
        frequency,
        goal_amount_cents,
        payout_order_strategy = 'random_fixed'
      } = req.body || {}

      if (!name || !size || !contribution_amount_cents || !frequency || !goal_amount_cents) {
        return res.status(400).json({ success: false, error: 'Missing required fields' })
        }

      const { data: group, error } = await supabase
          .from('groups')
          .insert({
            name,
            description,
          creator_user_id: (payload as any).userId,
          size,
          contribution_amount_cents,
          currency,
            frequency,
          goal_amount_cents,
          status: 'draft',
          payout_order_strategy
          })
        .select('*')
        .single()

      if (error || !group) {
        return res.status(400).json({ success: false, error: error?.message || 'Failed to create group' })
      }

      const { error: addErr } = await supabase
          .from('group_members')
        .insert({ group_id: group.id, user_id: (payload as any).userId, role: 'owner' })

      if (addErr) {
        return res.status(400).json({ success: false, error: addErr.message })
      }

      const duration_months = Math.ceil(Number(goal_amount_cents) / Number(contribution_amount_cents))

      return res.status(201).json({ success: true, data: { group, duration_months } })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
