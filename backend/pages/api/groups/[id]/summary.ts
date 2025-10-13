import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase, supabaseAdmin } from '@/lib/supabase'
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
    const { data: credits } = await supabaseAdmin
      .from('group_balance_ledger')
      .select('amount_cents')
      .eq('group_id', groupId)
      .eq('direction', 'credit')

    const { data: debits } = await supabaseAdmin
      .from('group_balance_ledger')
      .select('amount_cents')
      .eq('group_id', groupId)
      .eq('direction', 'debit')

    const sum = (rows?: { amount_cents: number }[]) => (rows || []).reduce((a, r) => a + Number(r.amount_cents), 0)

    let totalCredits = sum(credits)
    const totalDebits = sum(debits)

    // Fallbacks for older flows: include succeeded group deposits or covered contributions if ledger is empty
    if (!totalCredits) {
      try {
        const { data: deps } = await supabaseAdmin
          .from('group_deposits')
          .select('net_amount_cents,status')
          .eq('group_id', groupId)
          .eq('status', 'succeeded')
        const depSum = (deps || []).reduce((a, d: any) => a + Number(d.net_amount_cents || 0), 0)
        totalCredits = depSum
      } catch {}
    }

    if (!totalCredits) {
      try {
        const { data: contribs } = await supabaseAdmin
          .from('contributions')
          .select('amount_cents,status')
          .eq('group_id', groupId)
          .eq('status', 'covered')
        const cSum = (contribs || []).reduce((a, c: any) => a + Number(c.amount_cents || 0), 0)
        totalCredits = cSum
      } catch {}
    }

    const availableBalanceCents = totalCredits - totalDebits

    const duration_months = Math.ceil(Number(group.goal_amount_cents) / Number(group.contribution_amount_cents))

    // Fetch owner data for member card
    let ownerName: string | null = null
    let ownerAvatar: string | null = null
    try {
      const { data: owner } = await supabaseAdmin
        .from('users')
        .select('full_name, profile_image_url')
        .eq('id', group.creator_user_id)
        .maybeSingle()
      ownerName = (owner as any)?.full_name || null
      ownerAvatar = (owner as any)?.profile_image_url || null
    } catch {}

    return res.json({ success: true, data: { group, availableBalanceCents, totalContributedCents: totalCredits, totalDebitedCents: totalDebits, duration_months, owner_name: ownerName, profile_image_url: ownerAvatar } })
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
