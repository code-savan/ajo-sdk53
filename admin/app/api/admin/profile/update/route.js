import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const body = await req.json()
    const { user_id, full_name, phone, location, department, bio, two_factor_enabled, email_notifications, security_alerts, avatar_url, is_active, last_login } = body || {}
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const updates = {}
    if (typeof full_name !== 'undefined') updates.full_name = full_name
    if (typeof phone !== 'undefined') updates.phone = phone
    if (typeof location !== 'undefined') updates.location = location
    if (typeof department !== 'undefined') updates.department = department
    if (typeof bio !== 'undefined') updates.bio = bio
    if (typeof two_factor_enabled !== 'undefined') updates.two_factor_enabled = !!two_factor_enabled
    if (typeof email_notifications !== 'undefined') updates.email_notifications = !!email_notifications
    if (typeof security_alerts !== 'undefined') updates.security_alerts = !!security_alerts
    if (typeof avatar_url !== 'undefined') updates.avatar_url = avatar_url
    if (typeof is_active !== 'undefined') updates.is_active = is_active
    if (typeof last_login !== 'undefined') updates.last_login = last_login
    updates.updated_at = new Date().toISOString()

    if (Object.keys(updates).length === 1 && updates.updated_at) {
      return NextResponse.json({ ok: true })
    }

    const { error } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('user_id', user_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 })
  }
}
