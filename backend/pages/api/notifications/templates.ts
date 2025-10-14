import { supabaseAdmin as supabase } from '@/lib/supabase'

export type NotificationTemplate =
  | { kind: 'wallet_deposit'; amount_cents: number; currency: string }
  | { kind: 'group_created'; group_name: string }
  | { kind: 'group_funded'; group_name: string; amount_cents: number; currency: string }
  | { kind: 'withdrawal'; amount_cents: number; currency: string }
  | { kind: 'withdrawal_succeeded'; amount_cents: number; currency: string }

export async function createNotification(userId: string, t: NotificationTemplate, extra?: any) {
  let title = ''
  let message = ''
  let type = 'info'

  switch (t.kind) {
    case 'wallet_deposit':
      title = 'Wallet funded'
      message = `Your wallet was funded with ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})}.`
      type = 'success'
      break
    case 'group_created':
      title = 'Group created'
      message = `Your group “${t.group_name}” has been created.`
      type = 'success'
      break
    case 'group_funded':
      title = 'Contribution paid'
      message = `You paid ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})} to “${t.group_name}”.`
      type = 'success'
      break
    case 'withdrawal':
      title = 'Withdrawal requested'
      message = `Your withdrawal of ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})} is being processed.`
      type = 'info'
      break
    case 'withdrawal_succeeded':
      title = 'Withdrawal completed'
      message = `Your withdrawal of ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})} has been completed.`
      type = 'success'
      break
  }

  await supabase.from('notifications').insert({ user_id: userId, title, message, type, data: extra || {}, read: false })
}
