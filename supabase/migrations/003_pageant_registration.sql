-- Migration: 003_pageant_registration
-- Description: Pageant registration system tables for WTSF 2026

-- ── pageant_settings ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pageant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fair_year integer NOT NULL DEFAULT 2026,
  registration_open boolean NOT NULL DEFAULT false,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  payment_grace_days integer NOT NULL DEFAULT 7,
  entry_fee_cents integer,
  late_fee_cents integer,
  late_fee_begins_at timestamptz,
  rules_content text,
  media_release_content text,
  pageant_team_email text NOT NULL DEFAULT 'wtsfpageant@outlook.com',
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(fair_year)
);

-- Seed 2026 row
INSERT INTO pageant_settings (fair_year, registration_open, payment_grace_days, pageant_team_email)
VALUES (2026, false, 7, 'wtsfpageant@outlook.com')
ON CONFLICT (fair_year) DO NOTHING;

-- ── pageant_registrations ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pageant_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fair_year integer NOT NULL DEFAULT 2026,

  -- Division
  division_id text NOT NULL,
  division_name text NOT NULL,

  -- Status
  status text NOT NULL DEFAULT 'PAYMENT_PENDING'
    CHECK (status IN ('DRAFT', 'PAYMENT_PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED')),

  -- Contestant info
  contestant_first_name text NOT NULL,
  contestant_last_name text NOT NULL,
  contestant_dob date NOT NULL,
  contestant_age_months integer,
  contestant_school text,
  contestant_grade text,
  contestant_hair_color text,
  contestant_eye_color text,
  contestant_hobbies text,
  contestant_ambitions text,

  -- Parent/Guardian info
  guardian_name text NOT NULL,
  guardian_relationship text,
  guardian_address text NOT NULL,
  guardian_city text NOT NULL,
  guardian_state text NOT NULL DEFAULT 'TN',
  guardian_zip text NOT NULL,
  guardian_phone text NOT NULL,
  guardian_email text NOT NULL,

  -- Acknowledgments
  rules_agreed boolean NOT NULL DEFAULT false,
  media_release_agreed boolean NOT NULL DEFAULT false,
  acknowledged_at timestamptz,

  -- Payment
  amount_cents integer,
  square_payment_id text,
  square_order_id text,
  square_idempotency_key text UNIQUE,
  paid_at timestamptz,

  -- Timeline
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  payment_deadline timestamptz NOT NULL,
  confirmed_at timestamptz,
  expired_at timestamptz,
  cancelled_at timestamptz,

  -- Resume token (SHA-256 hash stored, raw sent to user)
  resume_token_hash text UNIQUE NOT NULL,

  -- Email delivery tracking
  confirmation_email_sent boolean NOT NULL DEFAULT false,
  notification_email_sent boolean NOT NULL DEFAULT false,
  confirmation_email_error text,

  -- Audit
  ip_address text,
  user_agent text
);

-- ── pageant_square_events ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pageant_square_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  square_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payment_id text,
  registration_id uuid REFERENCES pageant_registrations(id),
  processed_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_pageant_registrations_fair_year
  ON pageant_registrations(fair_year);

CREATE INDEX IF NOT EXISTS idx_pageant_registrations_division_id
  ON pageant_registrations(division_id);

CREATE INDEX IF NOT EXISTS idx_pageant_registrations_status
  ON pageant_registrations(status);

CREATE INDEX IF NOT EXISTS idx_pageant_registrations_guardian_email
  ON pageant_registrations(guardian_email);

CREATE INDEX IF NOT EXISTS idx_pageant_registrations_resume_token_hash
  ON pageant_registrations(resume_token_hash);

CREATE INDEX IF NOT EXISTS idx_pageant_registrations_payment_deadline
  ON pageant_registrations(payment_deadline)
  WHERE status = 'PAYMENT_PENDING';

CREATE INDEX IF NOT EXISTS idx_pageant_square_events_payment_id
  ON pageant_square_events(payment_id);

CREATE INDEX IF NOT EXISTS idx_pageant_square_events_registration_id
  ON pageant_square_events(registration_id);

-- ── updated_at trigger ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pageant_registrations_updated_at
  BEFORE UPDATE ON pageant_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER pageant_settings_updated_at
  BEFORE UPDATE ON pageant_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE pageant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pageant_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pageant_square_events ENABLE ROW LEVEL SECURITY;

-- service_role bypasses RLS by default in Supabase — no explicit policy needed for service_role.
-- Allow anonymous/authenticated users to READ settings (registration_open, dates, fee info).
-- This enables the public registration page to check if registration is open.
CREATE POLICY "pageant_settings_public_read"
  ON pageant_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- All other operations on settings require service_role (no INSERT/UPDATE/DELETE policy for anon).

-- pageant_registrations: no public access at all — only service_role.
-- (service_role bypasses RLS automatically in Supabase with createClient + service key)

-- pageant_square_events: no public access — only service_role.

