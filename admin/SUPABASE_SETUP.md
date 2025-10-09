# Supabase Setup Guide for AJO Admin

## 1. Install Dependencies

```bash
cd admin
npm install
```

## 2. Environment Variables

Create a `.env.local` file in the admin directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to get your Supabase credentials:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note**: Only the anon key is required for this setup. The service role key is not needed.

## 3. Database Setup

Run the following SQL in your Supabase SQL editor to create the admin_users table:

-- Types for status and role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_status') THEN
    CREATE TYPE admin_status AS ENUM ('active','inactive','pending','suspended');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
    CREATE TYPE admin_role AS ENUM ('super admin','admin','customer support','analyst','Compliance officer');
  END IF;
END $$;

-- Create admin_users table with proper RLS policies
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role admin_role NOT NULL DEFAULT 'admin',
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  department TEXT,
  permissions JSONB DEFAULT '{}',
  bio TEXT,
  two_factor_enabled BOOLEAN,
  email_notifications BOOLEAN,
  security_alerts BOOLEAN,
  avatar_url TEXT DEFAULT 'https://api.dicebear.com/9.x/adventurer/svg?seed=Admin',
  is_confirmed BOOLEAN DEFAULT FALSE,
  is_active admin_status NOT NULL DEFAULT 'pending',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  context JSONB
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow insert for authenticated users" ON public.admin_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin users can view own profile" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super admin' AND is_active = 'active'
    )
  );



## 4. Create Initial Admin User

To create your first admin user, you'll need to:

1. **Sign up through the admin interface** - This will create a user in `auth.users`
2. **Manually update the admin_users table** to give them super_admin role:

```sql
-- Find the user_id from auth.users table
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Insert admin record (replace the user_id with the actual ID)
INSERT INTO public.admin_users (user_id, role, permissions, is_active)
VALUES ('user-id-from-above', 'super_admin', '{}', true);
```

## 5. Authentication Flow

### Sign Up Process:
1. User fills out signup form
2. Supabase creates user in `auth.users` table
3. System creates corresponding record in `admin_users` table with 'admin' role
4. User receives email verification link
5. User must verify email before they can sign in
6. After email verification, user can sign in

### Sign In Process:
1. User enters credentials
2. Supabase authenticates user
3. System checks if user exists in `admin_users` table
4. If found and active, user is signed in
5. Last login time is updated

### Session Management:
- Sessions are managed by Supabase Auth
- Automatic session refresh
- Session status displayed in bottom-right corner
- 24-hour session duration (configurable in Supabase)

## 6. User Roles

- **super_admin**: Full access to all features
- **admin**: Standard admin access
- **support**: Support team access
- **analyst**: Read-only analytics access

## 7. Testing

1. Start the development server: `npm run dev`
2. Navigate to `/auth/signup` to create a new account
3. Check your email for verification link
4. After verification, sign in at `/auth/signin`
5. You should be redirected to the dashboard

## 8. Troubleshooting

### Common Issues:

1. **"Access denied. Admin privileges required"**
   - User exists in auth.users but not in admin_users table
   - Solution: Add user to admin_users table

2. **"Invalid email or password"**
   - Check if email is verified
   - Verify credentials are correct

3. **Environment variables not loading**
   - Ensure `.env.local` is in the admin directory
   - Restart the development server

4. **RLS policies blocking access**
   - Check if user has proper role in admin_users table
   - Verify RLS policies are correctly set up

## 9. Security Notes

- All authentication is handled by Supabase Auth
- RLS policies protect the admin_users table
- Sessions are automatically managed
- Email verification is required for new accounts
- Admin privileges are checked on every request
