-- Drop existing function if it exists
DROP FUNCTION IF EXISTS rpc_verify_pin(text, text);

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

-- Also create a function to set PIN (for completeness)
DROP FUNCTION IF EXISTS rpc_set_pin(text, text);

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
