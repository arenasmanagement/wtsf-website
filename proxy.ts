import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wtsf_admin_session";

interface AccountEntry {
  id: string;
  password: string;
  role: "super" | "pageants" | "exhibits";
}

function getAccounts(): AccountEntry[] {
  const raw = process.env.ADMIN_ACCOUNTS_JSON;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is AccountEntry =>
        typeof a.id === "string" &&
        typeof a.password === "string" &&
        (a.role === "super" || a.role === "pageants" || a.role === "exhibits")
    );
  } catch {
    return [];
  }
}

async function hmacSha256Hex(secret: string, input: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(input));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

type RouteRole = "super" | "pageants" | "exhibits" | "super_or_pageants" | "super_or_exhibits" | "any";

async function getSessionRole(
  token: string
): Promise<"super" | "pageants" | "exhibits" | null> {
  const secret = process.env.ADMIN_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!secret) return null;

  // Legacy format: no colon → old HMAC(secret, password)
  if (!token.includes(":")) {
    if (!adminPassword) return null;
    const expected = await hmacSha256Hex(secret, adminPassword);
    return timingSafeEqualHex(token, expected) ? "super" : null;
  }

  // New format: {accountId}:{hmac}
  const colonIdx = token.indexOf(":");
  const accountId = token.substring(0, colonIdx);
  const providedHmac = token.substring(colonIdx + 1);

  const accounts = getAccounts();
  const account = accounts.find((a) => a.id === accountId);
  if (!account) return null;

  const expectedHmac = await hmacSha256Hex(secret, `${account.id}:${account.password}`);
  if (!timingSafeEqualHex(providedHmac, expectedHmac)) return null;

  return account.role;
}

function roleAllows(
  role: "super" | "pageants" | "exhibits" | null,
  required: RouteRole
): boolean {
  if (!role) return false;
  if (role === "super") return true;
  if (required === "super_or_pageants") return role === "pageants";
  if (required === "super_or_exhibits") return role === "exhibits";
  if (required === "pageants") return role === "pageants";
  if (required === "exhibits") return role === "exhibits";
  return false;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // ── Determine required role for this path ────────────────────────────────

  let requiredRole: RouteRole | null = null;
  let loginRedirect = "/exhibits/admin";

  // Pageant routes — always allow login and auth endpoint
  if (pathname === "/pageants/admin" || pathname === "/pageants/admin/") {
    return NextResponse.next();
  }
  if (pathname === "/api/pageants/admin/auth") {
    return NextResponse.next();
  }
  if (pathname.startsWith("/pageants/admin/") || pathname.startsWith("/api/pageants/admin/")) {
    requiredRole = "super_or_pageants";
    loginRedirect = "/pageants/admin";
  }

  // Exhibits routes — always allow login and auth endpoint
  if (pathname === "/exhibits/admin" || pathname === "/exhibits/admin/") {
    return NextResponse.next();
  }
  if (pathname === "/api/exhibits/admin/auth") {
    return NextResponse.next();
  }
  if (requiredRole === null) {
    if (pathname.startsWith("/exhibits/admin/") || pathname.startsWith("/api/exhibits/admin/")) {
      requiredRole = "super_or_exhibits";
      loginRedirect = "/exhibits/admin";
    }
  }

  // Updates routes
  if (requiredRole === null) {
    if (pathname.startsWith("/updates/admin/") || pathname.startsWith("/api/updates/admin/")) {
      requiredRole = "super";
      loginRedirect = "/exhibits/admin";
    }
  }

  // Generic admin routes
  if (requiredRole === null) {
    if (pathname.startsWith("/admin/")) {
      requiredRole = "super";
      loginRedirect = "/exhibits/admin";
    }
  }

  // Not a protected route
  if (requiredRole === null) {
    return NextResponse.next();
  }

  // ── Authenticate ─────────────────────────────────────────────────────────

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL(loginRedirect, request.url));
  }

  const role = await getSessionRole(token);
  if (!roleAllows(role, requiredRole)) {
    return NextResponse.redirect(new URL(loginRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/exhibits/admin/:path*",
    "/api/exhibits/admin/:path*",
    "/updates/admin/:path*",
    "/api/updates/admin/:path*",
    "/pageants/admin",
    "/pageants/admin/:path*",
    "/api/pageants/admin/:path*",
  ],
};
