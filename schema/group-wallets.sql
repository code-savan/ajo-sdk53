-- Group Wallets Schema (No RLS)
-- Run in Supabase SQL editor or migrations. Assumes extensions uuid-ossp and pgcrypto may be enabled separately if needed.

-- Groups
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_user_id TEXT NOT NULL,
  size INTEGER NOT NULL CHECK (size >= 3 AND size <= 30),
  contribution_amount_cents BIGINT NOT NULL CHECK (contribution_amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly','monthly','quarterly')),
  goal_amount_cents BIGINT NOT NULL CHECK (goal_amount_cents > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','completed')),
  payout_order_strategy TEXT NOT NULL DEFAULT 'random_fixed' CHECK (payout_order_strategy IN ('random_fixed','join_order')),
  beneficiary_order TEXT[] DEFAULT ARRAY[]::TEXT[], -- array of user ids (TEXT, since users.id is TEXT)
  current_cycle INTEGER NOT NULL DEFAULT 0,
  current_beneficiary_user_id TEXT,
  next_charge_at TIMESTAMPTZ,
  stripe_customer_id TEXT, -- group-level Stripe customer for cash balance
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_creator ON groups(creator_user_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);
CREATE INDEX IF NOT EXISTS idx_groups_next_charge_at ON groups(next_charge_at);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_groups_updated_at ON groups;
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON groups
FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Group Members
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- references users(id) which is TEXT in your setup
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_group_member ON group_members(group_id, user_id) WHERE left_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);

-- Group Deposits (Funding via bank transfer)
CREATE TABLE IF NOT EXISTS group_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  fee_cents BIGINT NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  net_amount_cents BIGINT NOT NULL CHECK (net_amount_cents >= 0),
  status TEXT NOT NULL CHECK (status IN ('pending','succeeded','failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_deposits_group ON group_deposits(group_id);
CREATE INDEX IF NOT EXISTS idx_group_deposits_user ON group_deposits(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_group_deposits_pi ON group_deposits(stripe_payment_intent_id);

-- Group Balance Ledger (immutable)
CREATE TABLE IF NOT EXISTS group_balance_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT, -- null for platform fees/adjustments
  direction TEXT NOT NULL CHECK (direction IN ('credit','debit')),
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('deposit','rotation_payout','withdrawal','fee','adjustment')),
  external_ref TEXT, -- stripe ids, etc.
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_gbl_group ON group_balance_ledger(group_id);
CREATE INDEX IF NOT EXISTS idx_gbl_user ON group_balance_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_gbl_occurred ON group_balance_ledger(occurred_at);

-- Logical Contributions per cycle
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  cycle_number INTEGER NOT NULL CHECK (cycle_number >= 1),
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  allocated_from_deposit_ids JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('covered','insufficient','refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_contribution_per_cycle ON contributions(group_id, user_id, cycle_number);
CREATE INDEX IF NOT EXISTS idx_contributions_group_cycle ON contributions(group_id, cycle_number);

-- Payouts (to beneficiaries and withdrawals)
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  cycle_number INTEGER, -- null for withdrawals
  beneficiary_user_id TEXT, -- null for withdrawals
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  stripe_payment_intent_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','succeeded','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_group ON payouts(group_id);
CREATE INDEX IF NOT EXISTS idx_payouts_cycle ON payouts(group_id, cycle_number);
CREATE UNIQUE INDEX IF NOT EXISTS uq_payouts_pi ON payouts(stripe_payment_intent_id);

-- Group Invites (No RLS)
CREATE TABLE IF NOT EXISTS group_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  invited_by TEXT NOT NULL,
  invited_email TEXT,
  invited_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_by TEXT,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_invites_group ON group_invites(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_status ON group_invites(status);
