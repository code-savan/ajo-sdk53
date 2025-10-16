import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { createNotification } from '../../../notifications/templates'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end('Method Not Allowed')
    }

    const groupId = req.query.id as string

    const { data: group, error: gErr } = await supabase
      .from('groups')
      .select('id, name, contribution_amount_cents, currency, current_cycle, status')
      .eq('id', groupId)
      .single()

    if (gErr || !group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }
    if (group.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Group not active' })
    }

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', (payload as any).userId)
      .single()

    const currency = group.currency || process.env.STRIPE_DEFAULT_CURRENCY || 'usd'
    const amount = Number(group.contribution_amount_cents)
    const cycleNumber = Math.max(1, Number((group as any).current_cycle || 1))

    // Check user wallet balance
    const { data: walletRows } = await supabase
      .from('user_wallet_ledger')
      .select('direction, amount_cents')
      .eq('user_id', (payload as any).userId)
    let credits = 0, debits = 0
    for (const r of walletRows || []) {
      const v = Number(r.amount_cents)
      if (r.direction === 'credit') credits += v; else debits += v
    }
    const balance = credits - debits
    if (balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient wallet balance' })
    }

    // Debit user wallet and credit group wallet
    const externalRef = `grp_${groupId}_${Date.now()}`
    const inserts: any[] = [
      { user_id: (payload as any).userId, direction: 'debit', amount_cents: amount, currency, source: 'contribution', external_ref: externalRef, meta: { group_id: groupId, cycle_number: cycleNumber } },
      { group_id: groupId, user_id: (payload as any).userId, direction: 'credit', amount_cents: amount, currency, source: 'deposit', external_ref: externalRef, meta: { type: 'group_contribution', cycle_number: cycleNumber } }
    ]
    const { error: uwlErr } = await supabaseAdmin.from('user_wallet_ledger').insert(inserts[0])
    if (uwlErr) return res.status(400).json({ success: false, error: uwlErr.message })
    const { error: gblErr } = await supabaseAdmin.from('group_balance_ledger').insert(inserts[1])
    if (gblErr) return res.status(400).json({ success: false, error: gblErr.message })

    // Log recent activity (basic example)
    await supabaseAdmin.from('group_activities').insert({ group_id: groupId, actor_user_id: (payload as any).userId, action: 'contribution', amount_cents: amount, currency })

    // Upsert contribution record
    const { error: contribErr } = await supabaseAdmin
      .from('contributions')
      .upsert({ group_id: groupId, user_id: (payload as any).userId, cycle_number: cycleNumber, amount_cents: amount, status: 'covered', allocated_from_deposit_ids: [] }, { onConflict: 'group_id,user_id,cycle_number' })
    if (contribErr) return res.status(400).json({ success: false, error: contribErr.message })

    try {
      await createNotification((payload as any).userId, { kind: 'group_funded', group_name: (group as any).name || groupId, amount_cents: amount, currency }, { external_ref: externalRef, source: 'contribution', group_id: groupId })
    } catch {}

    return res.status(201).json({ success: true, data: { debited_cents: amount, external_ref: externalRef } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message || 'Contribution payment failed' })
  }
}
