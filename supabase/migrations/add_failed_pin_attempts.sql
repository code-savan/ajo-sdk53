-- Migration to add failed_pin_attempts column to users table
-- This ensures existing databases have the column for PIN attempt tracking

-- Add failed_pin_attempts column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'failed_pin_attempts'
    ) THEN
        ALTER TABLE users ADD COLUMN failed_pin_attempts INTEGER DEFAULT 0;

        -- Update any existing records to have 0 failed attempts
        UPDATE users SET failed_pin_attempts = 0 WHERE failed_pin_attempts IS NULL;

        -- Add constraint to ensure non-negative values
        ALTER TABLE users ADD CONSTRAINT check_failed_pin_attempts_non_negative
        CHECK (failed_pin_attempts >= 0);
    END IF;
END $$;
