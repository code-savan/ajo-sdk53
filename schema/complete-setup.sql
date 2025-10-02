-- Complete Setup for AJO App Users Table
-- Run this in Supabase SQL Editor

-- 1. Drop existing table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- 2. Create users table with all needed fields
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- Clerk user ID
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    full_name TEXT,
    profile_image_url TEXT,
    pin_hash TEXT, -- Encrypted PIN for app-specific authentication
    biometric_enabled BOOLEAN DEFAULT FALSE,
    biometric_type TEXT CHECK (biometric_type IN ('face_id', 'fingerprint', 'biometric', NULL)),
    failed_pin_attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at);

-- 4. Disable RLS (we're using Clerk for auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 5. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Grant permissions (adjust based on your Supabase setup)
GRANT ALL ON users TO postgres;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- Test the table
SELECT * FROM users LIMIT 1;
