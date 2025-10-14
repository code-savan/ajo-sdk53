import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { createNotification } from '../../notifications/templates'

// TEST ONLY: Marks a pending withdrawal as succeeded and writes a ledger debit.
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

    const { withdrawal_id } = req.body || {}
    if (!withdrawal_id) return res.status(400).json({ success: false, error: 'withdrawal_id required' })

    const { data: wd, error: wdErr } = await supabase
      .from('user_withdrawals')
      .select('id, user_id, amount_cents, status')
      .eq('id', withdrawal_id)
      .eq('user_id', payload.userId)
      .single()
    if (wdErr || !wd) return res.status(404).json({ success: false, error: 'Withdrawal not found' })
    if (wd.status !== 'pending') return res.status(400).json({ success: false, error: 'Not pending' })

    // Write ledger debit
    const { error: ledErr } = await supabase
      .from('user_wallet_ledger')
      .insert({
        user_id: wd.user_id,
        direction: 'debit',
        amount_cents: wd.amount_cents,
        currency: (process.env.STRIPE_DEFAULT_CURRENCY || 'usd').toLowerCase(),
        source: 'withdrawal',
      })
    if (ledErr) return res.status(400).json({ success: false, error: ledErr.message })

    // Mark succeeded
    const { error: upErr } = await supabase
      .from('user_withdrawals')
      .update({ status: 'succeeded' })
      .eq('id', wd.id)
    if (upErr) return res.status(400).json({ success: false, error: upErr.message })

    try {
      await createNotification(wd.user_id, { kind: 'withdrawal_succeeded', amount_cents: wd.amount_cents, currency: (process.env.STRIPE_DEFAULT_CURRENCY || 'usd').toLowerCase() })
    } catch {}

    return res.json({ success: true })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Failed to complete test withdrawal' })
  }
}
