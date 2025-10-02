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
