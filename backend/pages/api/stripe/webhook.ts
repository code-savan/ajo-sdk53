import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import stripeClient from '@/lib/stripe'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export const config = {
  api: {
    bodyParser: false,
  },
}

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string
const FEE_BPS = Number(process.env.STRIPE_PLATFORM_FEE_BPS || 300)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature'] as string

  let event
  try {
    event = stripeClient.webhooks.constructEvent(buf, sig, endpointSecret)
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    // Handle Stripe Identity events
    if (event.type.startsWith('identity.verification_session.')) {
      const sess = (event.data.object as any)
      const status = sess.status as string
      const userId = sess.metadata?.user_id
      if (userId) {
        await supabase
          .from('users')
          .update({ stripe_identity_status: status, is_verified: status === 'verified' })
          .eq('id', userId)
      }
      return res.json({ received: true })
    }
  } catch (e) {}

  // Existing handler for group flows
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as any
        const meta = pi.metadata || {}
        const currency = pi.currency
        if (meta.type === 'group_deposit') {
          const groupId = meta.group_id
          const userId = meta.user_id
          const amount = Number(pi.amount_received || pi.amount)
          const fee = Math.round((FEE_BPS / 10000) * amount)
          const net = amount - fee

          await supabase
            .from('group_deposits')
            .update({ status: 'succeeded', fee_cents: fee, net_amount_cents: net })
            .eq('stripe_payment_intent_id', pi.id)

          await supabase.from('group_balance_ledger').insert({
            group_id: groupId,
            user_id: userId,
            direction: 'credit',
            amount_cents: net,
            currency,
            source: 'deposit',
            external_ref: pi.id,
            meta: { kind: 'deposit' }
          })

          if (fee > 0) {
            await supabase.from('group_balance_ledger').insert({
              group_id: groupId,
              user_id: null,
              direction: 'debit',
              amount_cents: fee,
              currency,
              source: 'fee',
              external_ref: pi.id,
              meta: { kind: 'platform_fee' }
            })
          }
        } else if (meta.type === 'group_payout') {
          const groupId = meta.group_id
          await supabase
            .from('payouts')
            .update({ status: 'succeeded' })
            .eq('stripe_payment_intent_id', pi.id)

          const amount = Number(pi.amount_received || pi.amount)

          const { data: group } = await supabase
            .from('groups')
            .select('id, contribution_amount_cents')
            .eq('id', groupId)
            .single()

          const { data: members } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId)

          const perMember = Number(group?.contribution_amount_cents || 0)
          const inserts = (members || []).map(m => ({
            group_id: groupId,
            user_id: m.user_id,
            direction: 'debit',
            amount_cents: perMember,
            currency,
            source: 'rotation_payout',
            external_ref: pi.id,
            meta: { type: 'group_payout' }
          }))

          if (inserts.length > 0) {
            await supabase.from('group_balance_ledger').insert(inserts)
          }
        } else if (meta.type === 'group_withdrawal') {
          const groupId = meta.group_id
          const userId = meta.beneficiary_user_id

          await supabase
            .from('payouts')
            .update({ status: 'succeeded' })
            .eq('stripe_payment_intent_id', pi.id)

          const amount = Number(pi.amount_received || pi.amount)
          await supabase.from('group_balance_ledger').insert({
            group_id: groupId,
            user_id: userId,
            direction: 'debit',
            amount_cents: amount,
            currency,
            source: 'withdrawal',
            external_ref: pi.id,
            meta: { type: 'group_withdrawal' }
          })
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as any
        const meta = pi.metadata || {}
        if (meta.type === 'user_deposit') {
          await supabase
            .from('user_deposits')
            .update({ status: 'failed' })
            .eq('stripe_payment_intent_id', pi.id)
        } else if (meta.type === 'group_deposit') {
          await supabase
            .from('group_deposits')
            .update({ status: 'failed' })
            .eq('stripe_payment_intent_id', pi.id)
        } else if (meta.type === 'group_payout' || meta.type === 'group_withdrawal') {
          await supabase
            .from('payouts')
            .update({ status: 'failed' })
            .eq('stripe_payment_intent_id', pi.id)
        }
        break
      }
      default:
        break
    }
    return res.json({ received: true })
  } catch (err: any) {
    return res.status(500).json({ error: 'Webhook processing error' })
  }
}
