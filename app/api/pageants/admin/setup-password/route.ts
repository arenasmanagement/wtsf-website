import { NextRequest, NextResponse } from "next/server";
import { createHash, scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { createAdminClient } from "@/lib/supabase/admin";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

// POST /api/pageants/admin/setup-password
// Public route — authenticated via one-time invite token.
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { token, password } = body as Record<string, unknown>;

  if (typeof token !== "string" || token.length < 32) {
    return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 12) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters." },
      { status: 422 }
    );
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient();

  // 1. Look up the invite
  const { data: invite, error: inviteErr } = await supabase
    .from("pageant_admin_invites")
    .select("id, account_id, expires_at, used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (inviteErr || !invite) {
    return NextResponse.json(
      { error: "This setup link is invalid or has expired." },
      { status: 400 }
    );
  }
  if (invite.used_at) {
    return NextResponse.json(
      { error: "This setup link has already been used." },
      { status: 400 }
    );
  }
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "This setup link has expired. Please request a new one." },
      { status: 400 }
    );
  }

  // 2. Hash the new password
  const passwordHash = await hashPassword(password);

  // 3. Activate the account
  const { error: updateErr } = await supabase
    .from("pageant_admin_accounts")
    .update({
      password_hash: passwordHash,
      activated_at: new Date().toISOString(),
    })
    .eq("id", invite.account_id);

  if (updateErr) {
    console.error("Failed to activate account:", updateErr);
    return NextResponse.json({ error: "Failed to activate account." }, { status: 500 });
  }

  // 4. Mark invite as used
  await supabase
    .from("pageant_admin_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invite.id);

  return NextResponse.json({ success: true });
}

// GET /api/pageants/admin/setup-password?token=xxx
// Validates a token without consuming it — used by the setup page on load.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (token.length < 32) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient();

  const { data: invite } = await supabase
    .from("pageant_admin_invites")
    .select("expires_at, used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!invite || invite.used_at || new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  return NextResponse.json({ valid: true });
}
