import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
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

    const { data: user } = await supabase
      .from('users')
      .select('id, email, stripe_customer_id')
      .eq('id', payload.userId)
      .single()

    let stripeCustomerId = user?.stripe_customer_id as string | null
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ metadata: { user_id: payload.userId, email: user?.email || '' } })
      stripeCustomerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: stripeCustomerId }).eq('id', payload.userId)
    }

    return res.status(200).json({ success: true, data: { stripe_customer_id: stripeCustomerId } })
  } catch (e: any) {
    const msg = e?.message || 'Failed to ensure customer'
    return res.status(400).json({ success: false, error: msg })
  }
}
