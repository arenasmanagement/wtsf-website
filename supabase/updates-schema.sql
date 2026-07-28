-- ═══════════════════════════════════════════════════════════════
-- WEST TENNESSEE STATE FAIR — Fair Updates / Subscriber System
-- Run this in your Supabase project: SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- 1. SUBSCRIBERS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                text NOT NULL,
  categories           text[] NOT NULL DEFAULT '{}',
  confirmed            boolean NOT NULL DEFAULT false,
  confirmation_token   text NOT NULL DEFAULT gen_random_uuid()::text,
  unsubscribe_token    text NOT NULL DEFAULT gen_random_uuid()::text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  confirmed_at         timestamptz,
  unsubscribed_at      timestamptz,
  ip_address           text,
  CONSTRAINT subscribers_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email
  ON subscribers (lower(email));

CREATE INDEX IF NOT EXISTS idx_subscribers_confirmed
  ON subscribers (confirmed)
  WHERE confirmed = true AND unsubscribed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_subscribers_confirmation_token
  ON subscribers (confirmation_token);

CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token
  ON subscribers (unsubscribe_token);

-- ──────────────────────────────────────────────────────────────
-- 2. ANNOUNCEMENTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  category       text NOT NULL
                   CHECK (category IN ('entertainment','tickets','exhibits','livestock','pageants','vendors','volunteers','general')),
  summary        text NOT NULL,
  body           text NOT NULL,
  published      boolean NOT NULL DEFAULT false,
  published_at   timestamptz,
  emails_sent    integer NOT NULL DEFAULT 0,
  send_status    text NOT NULL DEFAULT 'draft'
                   CHECK (send_status IN ('draft','sending','sent','error')),
  send_error     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published_at
  ON announcements (published_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_category
  ON announcements (category);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_announcements_updated_at();

-- ──────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────
ALTER TABLE subscribers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Subscribers: service role only (no public read)
CREATE POLICY "service_role_only_subscribers"
  ON subscribers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Announcements: service role only
CREATE POLICY "service_role_only_announcements"
  ON announcements FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
