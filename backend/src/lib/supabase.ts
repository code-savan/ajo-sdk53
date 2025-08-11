import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL')
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing env.SUPABASE_ANON_KEY')
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

// Client for user operations (with RLS)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export default supabase
