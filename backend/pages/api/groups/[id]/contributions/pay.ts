import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAccessToken } from '@/utils/jwt'
import { supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

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
      .select('id, contribution_amount_cents, currency, current_cycle, status')
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
      .select('id, stripe_customer_id')
      .eq('id', (payload as any).userId)
      .single()

    let customerId = user?.stripe_customer_id as string | null
    if (!customerId) {
      const customer = await stripe.customers.create({ metadata: { user_id: (payload as any).userId } })
      customerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', (payload as any).userId)
    }

    // Debit from wallet via customer_balance PI
    const currency = group.currency || process.env.STRIPE_DEFAULT_CURRENCY || 'usd'
    const amount = Number(group.contribution_amount_cents)

    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId!,
      payment_method_types: ['customer_balance'],
      metadata: { type: 'user_contribution', user_id: (payload as any).userId, group_id: groupId, cycle_number: group.current_cycle }
    })

    // Mark logical contribution as covered (finalization can also be tied to webhook if desired)
    await supabase
      .from('contributions')
      .upsert({
        group_id: groupId,
        user_id: (payload as any).userId,
        cycle_number: group.current_cycle,
        amount_cents: amount,
        status: 'covered',
        allocated_from_deposit_ids: []
      }, { onConflict: 'group_id,user_id,cycle_number' })

    // Record debit in user wallet ledger on webhook success; for now we can optimistically return
    return res.status(201).json({ success: true, data: { payment_intent_id: pi.id } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Contribution payment failed' })
  }
}
