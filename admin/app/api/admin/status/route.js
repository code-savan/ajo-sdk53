import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const { user_id } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('is_confirmed, is_active')
      .eq('user_id', user_id)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ is_confirmed: !!data?.is_confirmed, is_active: data?.is_active || null })
  } catch (e) {
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 })
  }
}
