-- Migration 007: Got Talent soft-removal audit columns
-- Adds the four columns that support soft-deleting a registration
-- (setting status = 'REMOVED') while preserving all payment/audit data.
-- The status column is plain text with no constraint, so no enum change needed.

ALTER TABLE got_talent_registrations
  ADD COLUMN IF NOT EXISTS removed_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS removed_by     TEXT,
  ADD COLUMN IF NOT EXISTS removal_reason TEXT,
  ADD COLUMN IF NOT EXISTS removal_notes  TEXT;

-- Comment documents intent
COMMENT ON COLUMN got_talent_registrations.removed_at     IS 'Timestamp when registration was soft-removed (status set to REMOVED).';
COMMENT ON COLUMN got_talent_registrations.removed_by     IS 'Account ID of the admin who performed the removal.';
COMMENT ON COLUMN got_talent_registrations.removal_reason IS 'Reason code for removal (e.g. contestant_withdrew, duplicate_registration).';
COMMENT ON COLUMN got_talent_registrations.removal_notes  IS 'Free-text notes; populated when removal_reason = ''other''.';
