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

-- Notifications (No RLS)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('contribution_reminder','payout_available','group_invite','transaction_update','general')),
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- User Devices for Push (No RLS)
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  device_id TEXT,
  platform TEXT,
  expo_push_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_devices_user_device ON user_devices(user_id, device_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_user ON user_devices(user_id);

-- User Withdrawals (No RLS)
CREATE TABLE IF NOT EXISTS user_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  fee_cents BIGINT NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  status TEXT NOT NULL CHECK (status IN ('pending','succeeded','failed')) DEFAULT 'pending',
  external_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_withdrawals_user ON user_withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_withdrawals_status ON user_withdrawals(status);

-- User Bank Accounts (No RLS)
CREATE TABLE IF NOT EXISTS user_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_number_last4 TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'bank' CHECK (account_type IN ('bank','wallet')),
  routing_number_last4 TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  external_ref TEXT, -- processor id
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_user ON user_bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_status ON user_bank_accounts(status);
