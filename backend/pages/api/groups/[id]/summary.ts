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

    const { data: group, error: groupErr } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupErr || !group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }

    // Compute balances from ledger
    const { data: credits } = await supabase
      .from('group_balance_ledger')
      .select('amount_cents')
      .eq('group_id', groupId)
      .eq('direction', 'credit')

    const { data: debits } = await supabase
      .from('group_balance_ledger')
      .select('amount_cents')
      .eq('group_id', groupId)
      .eq('direction', 'debit')

    const sum = (rows?: { amount_cents: number }[]) => (rows || []).reduce((a, r) => a + Number(r.amount_cents), 0)

    const totalCredits = sum(credits)
    const totalDebits = sum(debits)
    const availableBalanceCents = totalCredits - totalDebits

    const duration_months = Math.ceil(Number(group.goal_amount_cents) / Number(group.contribution_amount_cents))

    return res.json({ success: true, data: { group, availableBalanceCents, duration_months } })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
