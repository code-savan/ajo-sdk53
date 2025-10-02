-- Ajo App Database Schema for Supabase
-- This schema integrates with Clerk for authentication
-- Created: 2025-01-08

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (synced with Clerk)
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

-- User wallets
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) DEFAULT 0.00 CHECK (balance >= 0),
    pending_balance DECIMAL(12,2) DEFAULT 0.00 CHECK (pending_balance >= 0),
    reserved_balance DECIMAL(12,2) DEFAULT 0.00 CHECK (reserved_balance >= 0), -- For pending group contributions
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings groups
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    admin_id TEXT NOT NULL REFERENCES users(id),
    contribution_amount DECIMAL(12,2) NOT NULL CHECK (contribution_amount > 0),
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'paused', 'cancelled')),
    max_members INTEGER DEFAULT 50 CHECK (max_members > 0),
    current_round INTEGER DEFAULT 0,
    total_rounds INTEGER,
    next_payout_date TIMESTAMP WITH TIME ZONE,
    next_recipient_id TEXT REFERENCES users(id),
    group_image_url TEXT,
    invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
    total_collected DECIMAL(12,2) DEFAULT 0.00,
    settings JSONB DEFAULT '{}', -- Group-specific settings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    position INTEGER, -- Position in payout rotation
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_contributed DECIMAL(12,2) DEFAULT 0.00,
    has_received_payout BOOLEAN DEFAULT FALSE,
    payout_received_at TIMESTAMP WITH TIME ZONE,
    payout_amount DECIMAL(12,2),
    contribution_streak INTEGER DEFAULT 0,
    last_contribution_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(group_id, user_id)
);

-- Financial transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id),
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    wallet_id UUID REFERENCES wallets(id),
    type TEXT NOT NULL CHECK (type IN ('wallet_deposit', 'wallet_withdrawal', 'group_contribution', 'group_payout', 'fee', 'refund')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    description TEXT,
    reference_id TEXT, -- External reference (Stripe payment intent, etc.)
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    payment_method TEXT, -- 'card', 'bank', 'wallet', etc.
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group contributions schedule and tracking
CREATE TABLE group_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    transaction_id UUID REFERENCES transactions(id),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'skipped')),
    paid_at TIMESTAMP WITH TIME ZONE,
    round_number INTEGER NOT NULL,
    penalty_amount DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id, due_date)
);

-- Group payouts
CREATE TABLE group_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    recipient_id TEXT NOT NULL REFERENCES users(id),
    transaction_id UUID REFERENCES transactions(id),
    round_number INTEGER NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payout_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'completed', 'failed')),
    processed_at TIMESTAMP WITH TIME ZONE,
    stripe_transfer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group invitations
CREATE TABLE group_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    invited_by TEXT NOT NULL REFERENCES users(id),
    invited_email TEXT,
    invited_phone TEXT,
    invite_code TEXT NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_by TEXT REFERENCES users(id),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('contribution_reminder', 'contribution_received', 'payout_available', 'payout_sent', 'group_invite', 'group_update', 'transaction_update', 'security_alert', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional data for the notification
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    push_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    contribution_reminders BOOLEAN DEFAULT TRUE,
    payout_alerts BOOLEAN DEFAULT TRUE,
    group_updates BOOLEAN DEFAULT TRUE,
    security_alerts BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for sensitive operations
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- 'user', 'group', 'transaction', etc.
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods (stored securely, tokens only)
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'digital_wallet')),
    brand TEXT, -- Visa, MasterCard, etc.
    last_four TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for performance optimization
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Wallets
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Groups
CREATE INDEX idx_groups_admin_id ON groups(admin_id);
CREATE INDEX idx_groups_status ON groups(status);
CREATE INDEX idx_groups_start_date ON groups(start_date);
CREATE INDEX idx_groups_invite_code ON groups(invite_code);

-- Group members
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_status ON group_members(status);

-- Transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_group_id ON transactions(group_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);

-- Group contributions
CREATE INDEX idx_group_contributions_group_id ON group_contributions(group_id);
CREATE INDEX idx_group_contributions_user_id ON group_contributions(user_id);
CREATE INDEX idx_group_contributions_due_date ON group_contributions(due_date);
CREATE INDEX idx_group_contributions_status ON group_contributions(status);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Note: Using Clerk integration with custom JWT claims
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user ID from Clerk JWT
CREATE OR REPLACE FUNCTION get_current_user_id() RETURNS TEXT AS $$
BEGIN
    -- Try to get user ID from JWT claims (Clerk integration)
    RETURN COALESCE(
        current_setting('request.jwt.claims', true)::json->>'sub',
        current_setting('request.jwt.claims', true)::json->>'user_id'
    );
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users: Can only view/edit their own profile
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (get_current_user_id() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (get_current_user_id() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (get_current_user_id() = id);

-- Wallets: Users can only access their own wallet
CREATE POLICY "Users can view their own wallet" ON wallets
    FOR SELECT USING (get_current_user_id() = user_id);

CREATE POLICY "Users can update their own wallet" ON wallets
    FOR UPDATE USING (get_current_user_id() = user_id);

-- Groups: Users can view groups they're members of or public groups
CREATE POLICY "Users can view groups they belong to" ON groups
    FOR SELECT USING (
        get_current_user_id() = admin_id OR
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_id = groups.id AND user_id = get_current_user_id()
        )
    );

CREATE POLICY "Users can create groups" ON groups
    FOR INSERT WITH CHECK (get_current_user_id() = admin_id);

CREATE POLICY "Group admins can update their groups" ON groups
    FOR UPDATE USING (get_current_user_id() = admin_id);

-- Group members: Users can view members of groups they belong to
CREATE POLICY "Users can view group members" ON group_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM group_members gm
            WHERE gm.group_id = group_members.group_id AND gm.user_id = get_current_user_id()
        )
    );

-- Transactions: Users can only view their own transactions
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (get_current_user_id() = user_id);

-- Notifications: Users can only view their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (get_current_user_id() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (get_current_user_id() = user_id);

-- Payment methods: Users can only access their own payment methods
CREATE POLICY "Users can view their own payment methods" ON payment_methods
    FOR SELECT USING (get_current_user_id() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_contributions_updated_at BEFORE UPDATE ON group_contributions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create wallet when user is created
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id) VALUES (NEW.id);
    INSERT INTO notification_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_wallet_for_new_user
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_wallet();

-- Function to handle group member insertion (assign position)
CREATE OR REPLACE FUNCTION assign_member_position()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.position IS NULL THEN
        SELECT COALESCE(MAX(position), 0) + 1
        INTO NEW.position
        FROM group_members
        WHERE group_id = NEW.group_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER assign_group_member_position
    BEFORE INSERT ON group_members
    FOR EACH ROW EXECUTE FUNCTION assign_member_position();
