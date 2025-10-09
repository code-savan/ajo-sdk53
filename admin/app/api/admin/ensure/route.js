import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const { user_id, role = 'admin', full_name = null, email = null, location = null, state = null, country = null, context = null } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    // Upsert minimal row; do not fail if exists
    const { error } = await supabaseAdmin
      .from('admin_users')
      .upsert({
        user_id,
        role,
        full_name,
        email,
        location: state && country ? `${state}, ${country}` : location,
        permissions: {},
        is_active: 'pending',
        is_confirmed: false,
        avatar_url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Admin',
        context
      }, { onConflict: 'user_id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 })
  }
}
