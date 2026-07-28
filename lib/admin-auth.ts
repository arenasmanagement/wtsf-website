// Simple cookie-based admin authentication.
// No external auth service required — uses ADMIN_PASSWORD + ADMIN_SECRET env vars.
// The session cookie stores a SHA-256 HMAC that the server verifies on each request.

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wtsf_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

/** Returns null (not throws) when the env var is absent. */
function getSecret(): string | null {
  return process.env.ADMIN_SECRET ?? null;
}

/** Returns null (not throws) when the env var is absent. */
function getPassword(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

/**
 * Produce the expected session token value (HMAC of password).
 * Returns null if either env var is missing — callers treat null as "not configured".
 */
function computeToken(): string | null {
  const secret   = getSecret();
  const password = getPassword();
  if (!secret || !password) return null;
  return createHmac("sha256", secret).update(password).digest("hex");
}

/** Verify that a provided password matches ADMIN_PASSWORD (timing-safe). */
export function verifyAdminPassword(provided: string): boolean {
  const expected = getPassword();
  if (!expected) return false; // env var not configured — always deny
  try {
    return timingSafeEqual(
      Buffer.from(createHash("sha256").update(provided).digest("hex")),
      Buffer.from(createHash("sha256").update(expected).digest("hex"))
    );
  } catch {
    return false;
  }
}

/** Set the admin session cookie on a NextResponse. */
export function setAdminSessionCookie(response: NextResponse): NextResponse {
  const token = computeToken();
  if (!token) return response; // env vars not set — skip cookie
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

/** Clear the admin session cookie. */
export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

/** Check whether the current request has a valid admin session cookie. */
export function isAdminAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  try {
    const expected = computeToken();
    if (!expected) return false; // env vars not configured
    return timingSafeEqual(
      Buffer.from(sessionCookie.value),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

/** Server-component helper — check admin cookie via next/headers. */
export async function isAdminAuthenticatedServer(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  try {
    const expected = computeToken();
    if (!expected) return false; // env vars not configured
    return timingSafeEqual(
      Buffer.from(sessionCookie.value),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}
