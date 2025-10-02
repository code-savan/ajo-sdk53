-- KYC columns for users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS stripe_identity_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_identity_status TEXT;
