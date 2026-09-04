import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wtsf_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export type AdminRole = "super" | "pageants" | "exhibits";

export interface AdminAccount {
  id: string;
  password: string;
  role: AdminRole;
}

// ── Environment helpers ────────────────────────────────────────────────────────

function getSecret(): string | null {
  return process.env.ADMIN_SECRET ?? null;
}

function getPassword(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

export function getAccounts(): AdminAccount[] {
  const raw = process.env.ADMIN_ACCOUNTS_JSON;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is AdminAccount =>
        typeof a.id === "string" &&
        typeof a.password === "string" &&
        (a.role === "super" || a.role === "pageants" || a.role === "exhibits")
    );
  } catch {
    return [];
  }
}

// ── Token computation ──────────────────────────────────────────────────────────

/**
 * Legacy token: HMAC-SHA256(secret, password)
 * Used for the ADMIN_PASSWORD super admin (backward compat).
 */
function computeLegacyToken(): string | null {
  const secret = getSecret();
  const password = getPassword();
  if (!secret || !password) return null;
  return createHmac("sha256", secret).update(password).digest("hex");
}

/**
 * Account token: HMAC-SHA256(secret, accountId:password)
 * Used for accounts from ADMIN_ACCOUNTS_JSON.
 */
function computeAccountToken(accountId: string, password: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(`${accountId}:${password}`).digest("hex");
}

// ── Existing functions (unchanged API) ────────────────────────────────────────

export function verifyAdminPassword(provided: string): boolean {
  const password = getPassword();
  if (!password) return false;
  const expected = computeLegacyToken();
  if (!expected) return false;
  // Compare provided as HMAC of itself? No — provided is the raw password.
  // We compute HMAC(secret, provided) and compare to HMAC(secret, ADMIN_PASSWORD).
  const secret = getSecret();
  if (!secret) return false;
  const providedToken = createHmac("sha256", secret).update(provided).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(providedToken, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function setAdminSessionCookie(response: NextResponse): NextResponse {
  const token = computeLegacyToken();
  if (!token) {
    console.error("Cannot set admin session cookie: ADMIN_SECRET or ADMIN_PASSWORD not set");
    return response;
  }
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}

export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  // Legacy token: no colon prefix → compare directly
  if (!token.includes(":")) {
    const expected = computeLegacyToken();
    if (!expected) return false;
    try {
      return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
    } catch {
      return false;
    }
  }
  // Account token
  return getSessionRole(request) !== null;
}

export async function isAdminAuthenticatedServer(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  if (!token.includes(":")) {
    const expected = computeLegacyToken();
    if (!expected) return false;
    try {
      return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
    } catch {
      return false;
    }
  }
  return (await getSessionRoleServer()) !== null;
}

// ── New RBAC functions ─────────────────────────────────────────────────────────

export function verifyAccountCredentials(
  id: string,
  password: string
): AdminRole | null {
  // Legacy super admin check
  if (id === "" || id === "legacy") {
    if (verifyAdminPassword(password)) return "super";
    return null;
  }
  // Account-based check
  const accounts = getAccounts();
  const account = accounts.find((a) => a.id === id);
  if (!account) return null;
  const expectedToken = computeAccountToken(account.id, account.password);
  if (!expectedToken) return null;
  const providedToken = computeAccountToken(id, password);
  if (!providedToken) return null;
  try {
    if (!timingSafeEqual(Buffer.from(providedToken, "hex"), Buffer.from(expectedToken, "hex"))) {
      return null;
    }
  } catch {
    return null;
  }
  return account.role;
}

export function setAccountSessionCookie(
  response: NextResponse,
  accountId: string,
  role: AdminRole
): NextResponse {
  let cookieValue: string;
  if (accountId === "" || accountId === "legacy") {
    // Produce OLD cookie format for legacy super admin
    const token = computeLegacyToken();
    if (!token) {
      console.error("Cannot set legacy session cookie: env vars missing");
      return response;
    }
    cookieValue = token;
  } else {
    const accounts = getAccounts();
    const account = accounts.find((a) => a.id === accountId);
    if (!account) {
      console.error(`Cannot set session cookie: account "${accountId}" not found`);
      return response;
    }
    const token = computeAccountToken(account.id, account.password);
    if (!token) {
      console.error("Cannot set account session cookie: ADMIN_SECRET not set");
      return response;
    }
    cookieValue = `${accountId}:${token}`;
  }
  response.cookies.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}

export function getSessionRole(request: NextRequest): AdminRole | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  // Legacy format: no colon → must be old HMAC hex (64 chars)
  if (!token.includes(":")) {
    const expected = computeLegacyToken();
    if (!expected) return null;
    try {
      const match = timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
      return match ? "super" : null;
    } catch {
      return null;
    }
  }

  // New format: {accountId}:{hmac}
  const colonIdx = token.indexOf(":");
  const accountId = token.substring(0, colonIdx);
  const providedHmac = token.substring(colonIdx + 1);

  const accounts = getAccounts();
  const account = accounts.find((a) => a.id === accountId);
  if (!account) return null;

  const expectedToken = computeAccountToken(account.id, account.password);
  if (!expectedToken) return null;

  try {
    const match = timingSafeEqual(
      Buffer.from(providedHmac, "hex"),
      Buffer.from(expectedToken, "hex")
    );
    return match ? account.role : null;
  } catch {
    return null;
  }
}

export async function getSessionRoleServer(): Promise<AdminRole | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  if (!token.includes(":")) {
    const expected = computeLegacyToken();
    if (!expected) return null;
    try {
      const match = timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
      return match ? "super" : null;
    } catch {
      return null;
    }
  }

  const colonIdx = token.indexOf(":");
  const accountId = token.substring(0, colonIdx);
  const providedHmac = token.substring(colonIdx + 1);

  const accounts = getAccounts();
  const account = accounts.find((a) => a.id === accountId);
  if (!account) return null;

  const expectedToken = computeAccountToken(account.id, account.password);
  if (!expectedToken) return null;

  try {
    const match = timingSafeEqual(
      Buffer.from(providedHmac, "hex"),
      Buffer.from(expectedToken, "hex")
    );
    return match ? account.role : null;
  } catch {
    return null;
  }
}

// ── DB-backed account session cookies ─────────────────────────────────────────
// Used for invite-based accounts (e.g., Hayley) that are stored in Supabase
// rather than ADMIN_ACCOUNTS_JSON. The cookie embeds the role and is signed
// with ADMIN_SECRET so proxy.ts can verify it without a DB round-trip.
//
// Cookie format: "db:{accountId}:{role}:{hmac}"
// where hmac = HMAC-SHA256(secret, "db:{accountId}:{role}")

export function setDbAccountSessionCookie(
  response: NextResponse,
  accountId: string,
  role: AdminRole
): NextResponse {
  const secret = getSecret();
  if (!secret) {
    console.error("Cannot set DB account session cookie: ADMIN_SECRET not set");
    return response;
  }
  const payload = `db:${accountId}:${role}`;
  const hmac = createHmac("sha256", secret).update(payload).digest("hex");
  const cookieValue = `${payload}:${hmac}`;
  response.cookies.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}
