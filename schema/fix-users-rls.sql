-- Fix RLS Policies for Clerk User Sync
-- This script updates the RLS policies to allow Clerk to sync users

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Allow initial user creation" ON users;

-- DISABLE RLS entirely for the users table
-- Since we're using Clerk for auth, we'll manage access at the application level
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON users TO service_role;
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT INSERT ON users TO anon;

-- Test query to verify policies
-- SELECT * FROM users;
