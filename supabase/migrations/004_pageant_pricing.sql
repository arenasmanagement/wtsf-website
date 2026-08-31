-- Migration: 004_pageant_pricing
-- Description: Seed confirmed 2026 pageant entry fee and late fee into pageant_settings.
--
-- Pricing rules (confirmed):
--   Payment completed on or before October 10, 2026 (America/Chicago) = $55 total
--   Payment completed beginning October 11, 2026 (America/Chicago)    = $65 total
--
-- late_fee_begins_at is stored as the UTC equivalent of midnight CDT on Oct 11, 2026.
-- October 11, 2026 is in CDT (UTC-5), so midnight CDT = 2026-10-11T05:00:00Z.

UPDATE pageant_settings
SET
  entry_fee_cents    = 5500,
  late_fee_cents     = 1000,
  late_fee_begins_at = '2026-10-11T05:00:00Z',
  updated_at         = now()
WHERE fair_year = 2026;
