/**
 * middleware.ts
 * ─────────────────────────────────────────────────────────────
 * Edge middleware for admin route protection.
 *
 * Protects /admin/* and /exhibits/admin/* from unauthenticated access.
 * Redirects to the login page without exposing page content (prevents
 * the React render flash that occurs when protection is done client-side
 * or inside a server component).
 *
 * Login page (/exhibits/admin/login) is explicitly excluded so users
 * can always reach it to authenticate.
 * ─────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const COOKIE_NAME    = "wtsf_admin_session";
const LOGIN_PATH     = "/exhibits/admin/login";

function computeToken(secret: string, password: string): string {
  return createHmac("sha256", secret).update(password).digest("hex");
}

function isAuthenticated(request: NextRequest): boolean {
  const secret   = process.env.ADMIN_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) return false;

  const sessionCookie = request.cookies.get(COOKIE_NAME);
  if (!sessionCookie?.value) return false;

  try {
    const expected = computeToken(secret, password);
    // Timing-safe comparison is not available in Edge runtime; use length check + comparison
    const provided = sessionCookie.value;
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page through unconditionally
  if (pathname === LOGIN_PATH || pathname.startsWith(LOGIN_PATH + "/")) {
    return NextResponse.next();
  }

  // Protect all admin routes
  if (!isAuthenticated(request)) {
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
  ],
};
