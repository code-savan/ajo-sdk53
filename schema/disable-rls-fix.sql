-- IMPORTANT: Run this to completely disable RLS and fix the users table
-- This will allow Clerk and your app to sync users without restrictions

-- 1. Drop ALL existing policies
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', pol.policyname);
    END LOOP;
END $$;

-- 2. Disable RLS completely
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. Grant full permissions to all roles
GRANT ALL PRIVILEGES ON TABLE users TO postgres;
GRANT ALL PRIVILEGES ON TABLE users TO anon;
GRANT ALL PRIVILEGES ON TABLE users TO authenticated;
GRANT ALL PRIVILEGES ON TABLE users TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 4. Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = false THEN 'RLS DISABLED ✓'
        ELSE 'RLS STILL ENABLED ✗'
    END as status
FROM pg_tables 
WHERE tablename = 'users';

-- 5. Test insert (optional - comment out if not needed)
-- INSERT INTO users (id, email, first_name, last_name) 
-- VALUES ('test_' || gen_random_uuid(), 'test@example.com', 'Test', 'User')
-- ON CONFLICT (id) DO NOTHING;
