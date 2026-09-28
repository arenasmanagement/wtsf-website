-- Migration 006: Got Talent admin accounts and invite tokens
-- Mirrors the pageant_admin_accounts / pageant_admin_invites pattern.

-- DB-backed admin accounts for Got Talent (invite-based, set their own password)
CREATE TABLE IF NOT EXISTS got_talent_admin_accounts (
  id TEXT PRIMARY KEY,                      -- e.g. "donna"
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'talent',      -- "talent" | "super"
  password_hash TEXT,                       -- scrypt(salt:derived), null until activated
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One-time invite tokens (SHA-256 hashed before storage)
CREATE TABLE IF NOT EXISTS got_talent_admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id TEXT NOT NULL REFERENCES got_talent_admin_accounts(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Donna's account (not yet activated — password set via invite link)
INSERT INTO got_talent_admin_accounts (id, email, role)
VALUES ('donna', 'butlerdr202@gmail.com', 'talent')
ON CONFLICT (id) DO NOTHING;
