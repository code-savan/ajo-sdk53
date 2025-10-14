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
    const payload = verifyAccessToken(token) as any

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('user_bank_accounts')
        .select('id, bank_name, account_holder_name, account_number_last4, account_type, status, created_at')
        .eq('user_id', payload.userId)
        .order('created_at', { ascending: false })
      if (error) return res.status(400).json({ success: false, error: error.message })
      return res.json({ success: true, data })
    }

    if (req.method === 'POST') {
      const { bank_name, account_holder_name, account_number, routing_number, country, currency } = req.body || {}
      if (!bank_name || !account_holder_name || !account_number) {
        return res.status(400).json({ success: false, error: 'Missing fields' })
      }
      const accLast4 = String(account_number).slice(-4)
      const routingLast4 = routing_number ? String(routing_number).slice(-4) : null
      const { data, error } = await supabase
        .from('user_bank_accounts')
        .insert({
          user_id: payload.userId,
          bank_name,
          account_holder_name,
          account_number_last4: accLast4,
          routing_number_last4: routingLast4,
          country: (country || 'US').toUpperCase(),
          currency: (currency || 'usd').toLowerCase(),
          status: 'active',
        })
        .select('id')
        .single()
      if (error) return res.status(400).json({ success: false, error: error.message })
      return res.status(201).json({ success: true, data })
    }

    res.setHeader('Allow', ['GET','POST'])
    return res.status(405).end('Method Not Allowed')
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
