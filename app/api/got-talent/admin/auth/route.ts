import { NextRequest, NextResponse } from "next/server";
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import {
  verifyAccountCredentials,
  setAccountSessionCookie,
  setDbAccountSessionCookie,
  clearAdminSessionCookie,
  type AdminRole,
} from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const scryptAsync = promisify(scrypt);

async function verifyDbPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [salt, key] = hash.split(":");
    if (!salt || !key) return false;
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(Buffer.from(key, "hex"), derived);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body as Record<string, unknown>;

  if (typeof username !== "string" || username.length === 0) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const identifier = username.trim();

  // 1. Try env-based accounts (super admin via ADMIN_ACCOUNTS_JSON or ADMIN_PASSWORD)
  const envRole = verifyAccountCredentials(identifier, password);
  if (envRole && (envRole === "talent" || envRole === "super")) {
    const response = NextResponse.json({ success: true, role: envRole });
    return setAccountSessionCookie(response, identifier, envRole);
  }

  // 2. Try DB-backed accounts — email-first lookup (case-insensitive), fallback to id
  const supabase = createAdminClient();
  let { data: account } = await supabase
    .from("got_talent_admin_accounts")
    .select("id, password_hash, role, activated_at")
    .ilike("email", identifier)
    .maybeSingle();

  if (!account) {
    // Fallback: match by id (username) for accounts without email login
    ({ data: account } = await supabase
      .from("got_talent_admin_accounts")
      .select("id, password_hash, role, activated_at")
      .eq("id", identifier)
      .maybeSingle());
  }

  if (account?.activated_at && account.password_hash) {
    const valid = await verifyDbPassword(password as string, account.password_hash as string);
    if (valid) {
      const dbRole = account.role as AdminRole;
      if (dbRole !== "talent" && dbRole !== "super") {
        return NextResponse.json({ error: "Access denied for this area" }, { status: 403 });
      }
      const response = NextResponse.json({ success: true, role: dbRole });
      return setDbAccountSessionCookie(response, account.id as string, dbRole);
    }
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE(_request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  return clearAdminSessionCookie(response);
}
