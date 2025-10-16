import { supabaseAdmin as supabase } from '@/lib/supabase'
import { sendExpoPush } from '@/lib/push'
import { sendEmail } from '@/lib/email'

export type NotificationTemplate =
  | { kind: 'wallet_deposit'; amount_cents: number; currency: string }
  | { kind: 'group_created'; group_name: string }
  | { kind: 'group_funded'; group_name: string; amount_cents: number; currency: string }
  | { kind: 'withdrawal'; amount_cents: number; currency: string }
  | { kind: 'withdrawal_succeeded'; amount_cents: number; currency: string }

export async function createNotification(userId: string, t: NotificationTemplate, extra?: any) {
  let title = ''
  let message = ''
  let uiType = 'info' // for client rendering
  let dbType: 'contribution_reminder' | 'payout_available' | 'group_invite' | 'transaction_update' | 'general' = 'general'

  switch (t.kind) {
    case 'wallet_deposit':
      title = 'Wallet funded'
      message = `Your wallet was funded with ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})}.`
      uiType = 'success'
      dbType = 'transaction_update'
      break
    case 'group_created':
      title = 'Group created'
      message = `Your group “${t.group_name}” has been created.`
      uiType = 'success'
      dbType = 'general'
      break
    case 'group_funded':
      title = 'Contribution paid'
      message = `You paid ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})} to “${t.group_name}”.`
      uiType = 'success'
      dbType = 'transaction_update'
      break
    case 'withdrawal':
      title = 'Withdrawal requested'
      message = `Your withdrawal of ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})} is being processed.`
      uiType = 'info'
      dbType = 'transaction_update'
      break
    case 'withdrawal_succeeded':
      title = 'Withdrawal completed'
      message = `Your withdrawal of ${(t.amount_cents/100).toLocaleString('en-US',{style:'currency',currency:t.currency.toUpperCase()})} has been completed.`
      uiType = 'success'
      dbType = 'transaction_update'
      break
  }

  // Create notification row and capture id
  const baseData: any = { ...(extra || {}), via: [], ui_type: uiType, kind: (t as any).kind }
  const { data: inserted, error: insErr } = await supabase
    .from('notifications')
    .insert({ user_id: userId, title, message, type: dbType, data: baseData, read: false })
    .select('id, data')
    .single()
  if (insErr) {
    console.warn('[notifications] insert failed', insErr.message)
  }

  // Fire-and-forget Expo push
  try {
    const { data: tokens } = await supabase
      .from('user_devices')
      .select('expo_push_token')
      .eq('user_id', userId)
      .eq('status', 'active')
    const valid = (tokens || []).map((r: any) => r.expo_push_token).filter((t: any) => typeof t === 'string' && t.startsWith('ExponentPushToken'))
    if (valid.length) {
      await sendExpoPush(valid, title, message, {
        type: uiType,
        ...extra,
        notification_id: inserted?.id,
        title,
        message,
        created_at: new Date().toISOString(),
      })
      try {
        if (inserted?.id) {
          const newVia = Array.isArray(inserted.data?.via) ? [...inserted.data.via, 'push'] : ['push']
          await supabase.from('notifications').update({ data: { ...(inserted.data || {}), via: newVia } }).eq('id', inserted.id)
        }
      } catch {}
    }
  } catch {}

  // Email (honor user preference if available)
  try {
    const { data: pref } = await supabase
      .from('users')
      .select('email, email_notifications')
      .eq('id', userId)
      .single()
    if (pref?.email && (pref.email_notifications !== false)) {
      const html = `<h3>${title}</h3><p>${message}</p>`
      const resp = await sendEmail(pref.email, title, html)
      try {
        if (resp?.success && inserted?.id) {
          const newVia = Array.isArray(inserted.data?.via) ? [...inserted.data.via, 'email'] : ['email']
          await supabase.from('notifications').update({ data: { ...(inserted.data || {}), via: newVia } }).eq('id', inserted.id)
        }
      } catch {}
    }
  } catch {}
}
