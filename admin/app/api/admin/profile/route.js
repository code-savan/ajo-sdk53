import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const { user_id } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('full_name, email, phone, location, role, department, created_at, last_login, avatar_url, bio, two_factor_enabled, email_notifications, security_alerts, is_active')
      .eq('user_id', user_id)
      .maybeSingle()

    if (error) return NextResponse.json({ profile: null })
    return NextResponse.json({ profile: data || null })
  } catch (e) {
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 })
  }
}
