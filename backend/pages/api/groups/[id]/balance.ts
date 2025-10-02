import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyAccessToken } from '@/utils/jwt'

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
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const groupId = req.query.id as string

    const { data: ledger } = await supabase
      .from('group_balance_ledger')
      .select('user_id, direction, amount_cents, source')
      .eq('group_id', groupId)

    const perUserCredits: Record<string, number> = {}
    const perUserDebits: Record<string, number> = {}
    let totalCredits = 0
    let totalDebits = 0

    for (const row of ledger || []) {
      const amt = Number(row.amount_cents)
      if (row.direction === 'credit') {
        totalCredits += amt
        if (row.user_id) perUserCredits[row.user_id] = (perUserCredits[row.user_id] || 0) + amt
      } else {
        totalDebits += amt
        if (row.user_id) perUserDebits[row.user_id] = (perUserDebits[row.user_id] || 0) + amt
      }
    }

    const perUserNet: Record<string, number> = {}
    const userIds = new Set([...Object.keys(perUserCredits), ...Object.keys(perUserDebits)])
    userIds.forEach(uid => {
      perUserNet[uid] = (perUserCredits[uid] || 0) - (perUserDebits[uid] || 0)
    })

    const availableBalanceCents = totalCredits - totalDebits

    return res.json({ success: true, data: { groupId, availableBalanceCents, perUserNetCents: perUserNet } })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
