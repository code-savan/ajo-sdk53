-- User Wallets Schema (No RLS)

CREATE TABLE IF NOT EXISTS user_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  fee_cents BIGINT NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  net_amount_cents BIGINT NOT NULL DEFAULT 0 CHECK (net_amount_cents >= 0),
  status TEXT NOT NULL CHECK (status IN ('pending','succeeded','failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_deposits_pi ON user_deposits(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_user_deposits_user ON user_deposits(user_id);

CREATE TABLE IF NOT EXISTS user_wallet_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('credit','debit')),
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('deposit','contribution','rotation_earning','withdrawal','fee','adjustment')),
  external_ref TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_uwl_user ON user_wallet_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_uwl_occurred ON user_wallet_ledger(occurred_at);
