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

    const groupId = req.query.id as string
    const { payment_intent_id } = req.body || {}

    // Find pending deposit
    const { data: dep } = await supabase
      .from('group_deposits')
      .select('*')
      .eq('group_id', groupId)
      .eq('stripe_payment_intent_id', payment_intent_id)
      .maybeSingle()

    if (!dep) {
      return res.status(404).json({ success: false, error: 'Pending deposit not found' })
    }

    const amount = Number(dep.net_amount_cents || dep.amount_cents || 0)
    const currency = 'usd'

    // Mark succeeded
    await supabase
      .from('group_deposits')
      .update({ status: 'succeeded', net_amount_cents: amount })
      .eq('id', dep.id)

    // Credit group ledger
    await supabase.from('group_balance_ledger').insert({
      group_id: groupId,
      user_id: payload.userId,
      direction: 'credit',
      amount_cents: amount,
      currency,
      source: 'deposit',
      external_ref: payment_intent_id,
      meta: { kind: 'test_deposit' }
    })

    return res.status(200).json({ success: true, data: { credited_cents: amount } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Test fund failed' })
  }
}
