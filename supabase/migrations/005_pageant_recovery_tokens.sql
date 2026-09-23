-- Migration 005: Add recovery token infrastructure to pageant_registrations.
--
-- recovery_token_hash:     SHA-256 hash of a one-time secure recovery token.
--                          Raw token is never stored — only emailed once per record.
-- recovery_token_expires_at: Set to registration_closes_at for consistency with business policy.
--                          Prevents a stale recovery email from working after registration closes.
-- recovery_email_sent_at: Timestamp when the recovery email was dispatched. Audit trail only.

ALTER TABLE pageant_registrations
  ADD COLUMN IF NOT EXISTS recovery_token_hash        TEXT,
  ADD COLUMN IF NOT EXISTS recovery_token_expires_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recovery_email_sent_at     TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_pageant_reg_recovery_token
  ON pageant_registrations (recovery_token_hash)
  WHERE recovery_token_hash IS NOT NULL;

COMMENT ON COLUMN pageant_registrations.recovery_token_hash IS
  'SHA-256 hash of a one-time recovery token. Raw token sent once per email, never stored.';
COMMENT ON COLUMN pageant_registrations.recovery_token_expires_at IS
  'When the recovery token expires. Aligned with registration_closes_at, not an arbitrary short window.';
COMMENT ON COLUMN pageant_registrations.recovery_email_sent_at IS
  'Timestamp of recovery email dispatch. Audit trail — no PII, no raw token.';
