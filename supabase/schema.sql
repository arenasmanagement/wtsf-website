-- ═══════════════════════════════════════════════════════════════
-- WEST TENNESSEE STATE FAIR — Exhibit Registration Schema
-- Run this in your Supabase project: SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────────
-- 1. REGISTRATION SETTINGS  (one row per fair year)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exhibit_registration_settings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fair_year             integer NOT NULL DEFAULT 2026,
  registration_open     boolean NOT NULL DEFAULT false,
  open_date             timestamptz,
  close_date            timestamptz,
  notification_emails   text[]   NOT NULL DEFAULT '{"wtsfair@gmail.com","arenasmanagementco@gmail.com"}',
  checkin_info          text,
  rules_url             text,
  entry_deadline_label  text     DEFAULT 'October 1, 2026',
  entrant_instructions  text,
  notes                 text,
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (fair_year)
);

-- Seed a default 2026 row (update dates before going live)
INSERT INTO exhibit_registration_settings
  (fair_year, registration_open, open_date, close_date,
   entry_deadline_label, checkin_info, rules_url)
VALUES
  (2026, false,
   '2026-07-01 00:00:00-05',
   '2026-10-01 23:59:59-05',
   'October 1, 2026',
   'Non-Perishable exhibits: Oct 14–15, 9 AM – 5 PM. Perishable exhibits: Oct 16, 9 AM – 2 PM.',
   '/files/adult-rules.pdf')
ON CONFLICT (fair_year) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- 2. ENTRANTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exhibit_entrants (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name       text NOT NULL,
  last_name        text NOT NULL,
  address          text NOT NULL,
  city             text NOT NULL,
  state            text NOT NULL DEFAULT 'TN',
  zip              text NOT NULL,
  phone            text NOT NULL,
  email            text NOT NULL,
  entrant_type     text NOT NULL CHECK (entrant_type IN ('adult', 'youth')),
  youth_age        integer,
  youth_birthdate  date,
  youth_grade      text,
  guardian_name    text,
  guardian_phone   text,
  guardian_email   text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 3. REGISTRATIONS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exhibit_registrations (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_ref              text UNIQUE NOT NULL,         -- e.g. WTSF-ONLINE-2026-0042
  entrant_id                  uuid NOT NULL REFERENCES exhibit_entrants(id) ON DELETE RESTRICT,
  fair_year                   integer NOT NULL DEFAULT 2026,
  status                      text NOT NULL DEFAULT 'submitted'
                                CHECK (status IN ('submitted','pending_review','entered','cancelled')),
  submitted_at                timestamptz NOT NULL DEFAULT now(),
  rules_agreed                boolean NOT NULL DEFAULT false,
  entry_count                 integer NOT NULL DEFAULT 0,
  notes                       text,
  -- Staff-only fields (filled after manual entry into fair program):
  official_program_id         text,                         -- Assigned by fair program, NOT by website
  data_entry_status           text NOT NULL DEFAULT 'Pending'
                                CHECK (data_entry_status IN ('Pending','In Progress','Entered','Needs Review')),
  -- Email delivery tracking:
  confirmation_email_sent     boolean NOT NULL DEFAULT false,
  confirmation_email_error    text,
  notification_email_sent     boolean NOT NULL DEFAULT false,
  notification_email_error    text,
  -- Spam / audit:
  ip_address                  text,
  user_agent                  text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_registrations_updated_at
  BEFORE UPDATE ON exhibit_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────────────────────
-- 4. EXHIBIT ENTRIES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exhibit_entries (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id   uuid NOT NULL REFERENCES exhibit_registrations(id) ON DELETE CASCADE,
  entrant_id        uuid NOT NULL REFERENCES exhibit_entrants(id) ON DELETE RESTRICT,
  department        text NOT NULL,   -- e.g. "Non-Perishable" | "Perishable"
  division          text NOT NULL,   -- e.g. "Arts & Crafts"
  class_name        text NOT NULL,   -- e.g. "Class 14" (from entry book)
  lot               text NOT NULL,   -- e.g. "Lot 2"  (from entry book)
  entry_title       text,            -- Brief title of the exhibit
  entry_description text,            -- Optional longer description
  quantity          integer NOT NULL DEFAULT 1,
  entrant_category  text CHECK (entrant_category IN ('adult','youth')),
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 5. SEQUENCE TABLE  (for submission reference numbers)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exhibit_ref_sequence (
  fair_year  integer PRIMARY KEY,
  next_val   integer NOT NULL DEFAULT 1
);

INSERT INTO exhibit_ref_sequence (fair_year, next_val)
VALUES (2026, 1)
ON CONFLICT (fair_year) DO NOTHING;

-- Function to atomically get-and-increment the sequence
CREATE OR REPLACE FUNCTION get_next_submission_ref(p_year integer)
RETURNS text AS $$
DECLARE
  v_seq integer;
BEGIN
  UPDATE exhibit_ref_sequence
  SET next_val = next_val + 1
  WHERE fair_year = p_year
  RETURNING next_val - 1 INTO v_seq;

  IF NOT FOUND THEN
    INSERT INTO exhibit_ref_sequence (fair_year, next_val) VALUES (p_year, 2);
    v_seq := 1;
  END IF;

  RETURN 'WTSF-ONLINE-' || p_year || '-' || LPAD(v_seq::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE exhibit_registration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibit_entrants              ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibit_registrations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibit_entries               ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibit_ref_sequence          ENABLE ROW LEVEL SECURITY;

-- Public can read registration settings (to show open/closed status)
CREATE POLICY "public_read_settings"
  ON exhibit_registration_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- NO public read on entrant data
CREATE POLICY "service_role_only_entrants"
  ON exhibit_entrants FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- NO public read on registrations
CREATE POLICY "service_role_only_registrations"
  ON exhibit_registrations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- NO public read on entries
CREATE POLICY "service_role_only_entries"
  ON exhibit_entries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Sequence: service role only
CREATE POLICY "service_role_only_sequence"
  ON exhibit_ref_sequence FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to call the sequence function
GRANT EXECUTE ON FUNCTION get_next_submission_ref(integer) TO service_role;

-- ──────────────────────────────────────────────────────────────
-- 7. INDEXES
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_registrations_submitted_at
  ON exhibit_registrations(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_registrations_fair_year
  ON exhibit_registrations(fair_year);

CREATE INDEX IF NOT EXISTS idx_registrations_data_entry_status
  ON exhibit_registrations(data_entry_status);

CREATE INDEX IF NOT EXISTS idx_entrants_email
  ON exhibit_entrants(email);

CREATE INDEX IF NOT EXISTS idx_entrants_last_name
  ON exhibit_entrants(last_name);

CREATE INDEX IF NOT EXISTS idx_entries_registration_id
  ON exhibit_entries(registration_id);

CREATE INDEX IF NOT EXISTS idx_entries_department
  ON exhibit_entries(department);
