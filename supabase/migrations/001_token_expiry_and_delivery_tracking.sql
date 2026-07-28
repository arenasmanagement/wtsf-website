-- Migration 001: Token expiry + delivery tracking expansion
-- Run in Supabase SQL Editor BEFORE deploying code changes

-- 1. Add confirmation token expiry to subscribers
ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS confirmation_token_expires_at timestamptz;

-- Set expiry for existing unconfirmed subscribers (7 days from now, so they can still confirm)
UPDATE subscribers
  SET confirmation_token_expires_at = now() + interval '7 days'
  WHERE confirmed = false AND confirmation_token_expires_at IS NULL;

-- 2. Expand announcements delivery tracking
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS emails_targeted  integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS emails_failed    integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS batch_count      integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_attempted_at timestamptz;

-- 3. Expand send_status to include partially_failed
-- Drop and recreate the constraint to add new value
ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_send_status_check;
ALTER TABLE announcements
  ADD CONSTRAINT announcements_send_status_check
  CHECK (send_status IN ('draft','sending','sent','partially_failed','error'));

-- 4. Index for cleanup job (unconfirmed older than 7 days)
CREATE INDEX IF NOT EXISTS idx_subscribers_unconfirmed_expired
  ON subscribers (confirmation_token_expires_at)
  WHERE confirmed = false AND unsubscribed_at IS NULL;
