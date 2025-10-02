# Database Migration Guide

## Latest Updates

### PIN Verification RPC Functions

Run this SQL to create the RPC functions for PIN verification:

```sql
-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS rpc_verify_pin(text, text);
DROP FUNCTION IF EXISTS rpc_set_pin(text, text);

-- Create function to verify PIN
CREATE OR REPLACE FUNCTION rpc_verify_pin(
  p_user_email text,
  p_pin_plain text
)
RETURNS boolean AS $$
DECLARE
  v_user_id uuid;
  v_stored_hash text;
  v_input_hash text;
BEGIN
  -- Get user ID and PIN hash
  SELECT id, pin_hash INTO v_user_id, v_stored_hash
  FROM users
  WHERE email = lower(p_user_email)
  LIMIT 1;

  -- If user not found or no PIN hash, return false
  IF v_user_id IS NULL OR v_stored_hash IS NULL THEN
    RETURN false;
  END IF;

  -- Generate hash of input PIN with user ID as salt
  -- Using SHA256 to match the client-side implementation
  v_input_hash := encode(digest(p_pin_plain || v_user_id::text, 'sha256'), 'hex');

  -- Compare hashes
  RETURN v_input_hash = v_stored_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION rpc_verify_pin(text, text) TO authenticated;

-- Create function to set PIN
CREATE OR REPLACE FUNCTION rpc_set_pin(
  p_user_email text,
  p_pin_plain text
)
RETURNS boolean AS $$
DECLARE
  v_user_id uuid;
  v_pin_hash text;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id
  FROM users
  WHERE email = lower(p_user_email)
  LIMIT 1;

  -- If user not found, return false
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Generate hash of PIN with user ID as salt
  v_pin_hash := encode(digest(p_pin_plain || v_user_id::text, 'sha256'), 'hex');

  -- Update user's PIN hash
  UPDATE users
  SET pin_hash = v_pin_hash,
      updated_at = now()
  WHERE id = v_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION rpc_set_pin(text, text) TO authenticated;
```

### Previous Migration (RESET Script)

This guide explains how to apply the necessary database migrations to fix the PIN authentication system.

## Reset and Fresh Start (Recommended)

If you're experiencing issues with existing PIN authentication, run this first to reset everything:

```sql
-- RESET: Remove existing failed_pin_attempts column and constraints, and fix schema
DO $$
BEGIN
    -- Drop constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'check_failed_pin_attempts_non_negative'
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users DROP CONSTRAINT check_failed_pin_attempts_non_negative;
    END IF;

    -- Drop column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'failed_pin_attempts'
    ) THEN
        ALTER TABLE users DROP COLUMN failed_pin_attempts;
    END IF;

    -- Drop old first_name and last_name columns if they exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'first_name'
    ) THEN
        ALTER TABLE users DROP COLUMN first_name;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'last_name'
    ) THEN
        ALTER TABLE users DROP COLUMN last_name;
    END IF;

    -- Add full_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE users ADD COLUMN full_name TEXT;
    END IF;
END $$;

-- Reset all users' PIN attempt counts to 0 (fresh start)
-- This ensures no users are locked out
```

## Required Migrations

### 1. Add failed_pin_attempts Column (Fresh)

After running the reset above, run this SQL in your Supabase SQL Editor:

```sql
-- Migration to add failed_pin_attempts column to users table
-- This ensures the database has the column for PIN attempt tracking

-- Add failed_pin_attempts column (fresh)
ALTER TABLE users ADD COLUMN failed_pin_attempts INTEGER DEFAULT 0;

-- Update any existing records to have 0 failed attempts
UPDATE users SET failed_pin_attempts = 0;

-- Add constraint to ensure non-negative values
ALTER TABLE users ADD CONSTRAINT check_failed_pin_attempts_non_negative
CHECK (failed_pin_attempts >= 0);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_users_failed_pin_attempts ON users(failed_pin_attempts);
```

### 2. (Optional) Add RPC Functions for Enhanced Security

If you want to use server-side PIN verification (recommended for production), run this SQL:

```sql
-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- RPC function to set PIN (hashes on server side)
CREATE OR REPLACE FUNCTION rpc_set_pin(
  p_user_id TEXT,
  p_pin_plain TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_pin_hash TEXT;
BEGIN
  -- Validate PIN format (4 digits only)
  IF NOT p_pin_plain ~ '^[0-9]{4}$' THEN
    RAISE EXCEPTION 'PIN must be exactly 4 digits';
  END IF;

  -- Hash the PIN using bcrypt
  v_pin_hash := crypt(p_pin_plain, gen_salt('bf', 10));

  -- Update or insert user record
  INSERT INTO users (id, pin_hash, updated_at)
  VALUES (p_user_id, v_pin_hash, NOW())
  ON CONFLICT (id) DO UPDATE
  SET pin_hash = v_pin_hash,
      updated_at = NOW();

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to verify PIN
CREATE OR REPLACE FUNCTION rpc_verify_pin(
  p_user_email TEXT,
  p_pin_plain TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_stored_hash TEXT;
  v_normalized_email TEXT;
BEGIN
  -- Normalize email to lowercase
  v_normalized_email := LOWER(TRIM(p_user_email));

  -- Validate PIN format
  IF NOT p_pin_plain ~ '^[0-9]{4}$' THEN
    RETURN FALSE;
  END IF;

  -- Get stored PIN hash
  SELECT pin_hash INTO v_stored_hash
  FROM users
  WHERE LOWER(email) = v_normalized_email
  LIMIT 1;

  -- Return false if no user found
  IF v_stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Verify PIN against stored hash
  RETURN crypt(p_pin_plain, v_stored_hash) = v_stored_hash;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION rpc_set_pin(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_verify_pin(TEXT, TEXT) TO authenticated;

-- Create index on lowercase email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
```

## Step-by-Step Application

### Step 1: Reset (Clean Slate)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the **RESET** SQL from above
4. Click "Run" to execute

### Step 2: Add Column Fresh
1. Copy and paste the **fresh failed_pin_attempts column** SQL
2. Click "Run" to execute

### Step 3: (Optional) Add RPC Functions
1. Copy and paste the **RPC functions** SQL
2. Click "Run" to execute

## Alternative: Using Supabase CLI
1. Save each SQL block to separate files:
   - `reset.sql` (reset script)
   - `add_column.sql` (column addition)
   - `add_rpc.sql` (optional RPC functions)
2. Run in order:
   ```bash
   supabase db execute reset.sql
   supabase db execute add_column.sql
   supabase db execute add_rpc.sql  # optional
   ```

## Verification

After applying the migrations, verify they worked:

```sql
-- Check if failed_pin_attempts column exists with correct setup
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name = 'failed_pin_attempts';

-- Check constraint exists
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users'
AND constraint_name = 'check_failed_pin_attempts_non_negative';

-- Check if RPC functions exist (if you applied them)
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('rpc_set_pin', 'rpc_verify_pin');

-- Check that all users have 0 failed attempts (fresh start)
SELECT COUNT(*) as users_with_zero_attempts
FROM users
WHERE failed_pin_attempts = 0;
```

## Troubleshooting

If login is still not working after applying migrations:

1. **Check if user exists in database:**
   ```sql
   SELECT id, email, pin_hash, failed_pin_attempts
   FROM users
   WHERE email = 'your-email@example.com';
   ```

2. **Reset specific user's PIN attempts:**
   ```sql
   UPDATE users
   SET failed_pin_attempts = 0
   WHERE email = 'your-email@example.com';
   ```

3. **Check if PIN hash exists:**
   ```sql
   SELECT email,
          CASE WHEN pin_hash IS NOT NULL THEN 'Has PIN' ELSE 'No PIN' END as pin_status
   FROM users;
   ```

## Notes

- **Reset is RECOMMENDED** - Ensures clean state and no locked accounts
- **Migration #1 is REQUIRED** - The app needs the `failed_pin_attempts` column to track PIN attempts
- **Migration #2 is OPTIONAL** - The app has fallback client-side PIN verification if RPC functions aren't available
- The app automatically detects if RPC functions are available and uses them, otherwise falls back to client-side verification
- All existing PINs will continue to work with both verification methods
- After reset, no users will be locked out due to failed PIN attempts
