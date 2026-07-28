/**
 * middleware.ts
 * ─────────────────────────────────────────────────────────────
 * Edge middleware for admin route protection.
 *
 * Uses the Web Crypto API (crypto.subtle) so it runs cleanly in
 * Vercel's Edge Runtime without importing the Node.js crypto module.
 * The HMAC-SHA256 hex output is identical to the one produced by
 * lib/admin-auth.ts (Node.js createHmac), so existing session cookies
 * remain valid after this update.
 *
 * Protects /admin/* and /exhibits/admin/* from unauthenticated access.
 * Redirects to the login page without exposing page content.
 * Login page (/exhibits/admin) is explicitly allowed through.
 * ─────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wtsf_admin_session";
const LOGIN_PATH  = "/exhibits/admin";

/** HMAC-SHA256 using the global Web Crypto API (Edge-compatible). */
async function computeToken(secret: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const secret   = process.env.ADMIN_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) return false;

  const sessionCookie = request.cookies.get(COOKIE_NAME);
  if (!sessionCookie?.value) return false;

  try {
    const expected = await computeToken(secret, password);
    const provided  = sessionCookie.value;
    // Constant-time comparison (timing-safe)
    if (provided.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow only the exact login page through unconditionally
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  // Allow the auth endpoint itself (login/logout POST/DELETE)
  if (pathname === "/api/exhibits/admin/auth") {
    return NextResponse.next();
  }

  if (!(await isAuthenticated(request))) {
    // API routes get JSON 401, not a redirect
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/exhibits/admin/:path*",
    "/api/exhibits/admin/:path*",
  ],
};
