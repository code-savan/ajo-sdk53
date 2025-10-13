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
    verifyAccessToken(token)

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end('Method Not Allowed')
    }

    const groupId = req.query.id as string
    const limit = Math.min(50, Number(req.query.limit || 10))

    // Pull latest events from group ledger (credits/debits)
    const { data: ledger, error } = await supabase
      .from('group_balance_ledger')
      .select('user_id, direction, amount_cents, currency, source, external_ref, occurred_at')
      .eq('group_id', groupId)
      .order('occurred_at', { ascending: false })
      .limit(limit)

    if (error) return res.status(400).json({ success: false, error: error.message })

    // Hydrate user info (name, avatar)
    const userIds = Array.from(new Set((ledger || []).map(r => r.user_id).filter(Boolean))) as string[]
    let usersMap: Record<string, { full_name?: string; profile_image_url?: string }> = {}
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, full_name, profile_image_url')
        .in('id', userIds)
      for (const u of users || []) {
        usersMap[u.id] = { full_name: u.full_name, profile_image_url: (u as any).profile_image_url }
      }
    }

    // Map to simple activity entries
    const mapTitle = (src: string, dir: string) => {
      if (src === 'deposit') return 'Deposit'
      if (src === 'rotation_payout') return 'Pickup'
      if (src === 'withdrawal') return 'Withdrawal'
      if (src === 'fee') return 'Fee'
      if (src === 'adjustment') return dir === 'credit' ? 'Credit Adjustment' : 'Debit Adjustment'
      return dir === 'credit' ? 'Credit' : 'Debit'
    }

    const activities = (ledger || []).map(r => {
      const u = r.user_id ? usersMap[r.user_id] : undefined
      return {
        title: mapTitle(String(r.source), String(r.direction)),
        direction: r.direction,
        amount_cents: r.amount_cents,
        currency: r.currency,
        external_ref: r.external_ref,
        occurred_at: r.occurred_at,
        user_id: r.user_id,
        source: r.source,
        person_name: u?.full_name || 'Member',
        avatar_url: u?.profile_image_url || null,
      }
    })

    return res.json({ success: true, data: activities })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
