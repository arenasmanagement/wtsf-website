-- Migration 008: Allow REMOVED status on got_talent_registrations
--
-- The status CHECK constraint was created without REMOVED in the allowed set.
-- The soft-delete feature (migration 007) added the audit columns but forgot to
-- expand the constraint, causing a 23514 check_violation on every removal attempt.
--
-- Fix: drop and recreate the constraint with REMOVED included.

ALTER TABLE got_talent_registrations
  DROP CONSTRAINT got_talent_registrations_status_check;

ALTER TABLE got_talent_registrations
  ADD CONSTRAINT got_talent_registrations_status_check
  CHECK (status = ANY (ARRAY[
    'PAYMENT_PENDING'::text,
    'CONFIRMED'::text,
    'CANCELLED'::text,
    'EXPIRED'::text,
    'REMOVED'::text
  ]));

COMMENT ON CONSTRAINT got_talent_registrations_status_check
  ON got_talent_registrations IS
  'Allowed registration statuses: PAYMENT_PENDING → CONFIRMED (after Square payment), '
  'CANCELLED (no-show/withdrawal before confirmation), EXPIRED (payment window lapsed), '
  'REMOVED (soft-deleted by admin — record preserved for audit/refund purposes).';
