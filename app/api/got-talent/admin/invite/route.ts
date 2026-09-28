import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildGotTalentInviteEmail } from "@/lib/emails/got-talent-invite";
import { getSessionRole } from "@/lib/admin-auth";

const EXPIRES_HOURS = 72;

// POST /api/got-talent/admin/invite
// Requires super admin session OR matching X-Invite-Secret header (for programmatic use after deploy).
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Auth: session cookie (super) OR X-Invite-Secret header matching WTSF_INVITE_SECRET env var
  const inviteSecret = process.env.WTSF_INVITE_SECRET;
  const headerSecret = request.headers.get("X-Invite-Secret");
  const sessionRole = getSessionRole(request);

  const authorized =
    sessionRole === "super" ||
    (inviteSecret && headerSecret && headerSecret === inviteSecret);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { accountId } = (body ?? {}) as Record<string, unknown>;
  const targetId = typeof accountId === "string" && accountId.length > 0 ? accountId : "donna";

  const supabase = createAdminClient();

  // 1. Ensure the account exists
  const { data: account, error: accountErr } = await supabase
    .from("got_talent_admin_accounts")
    .select("id, email, activated_at")
    .eq("id", targetId)
    .maybeSingle();

  if (accountErr || !account) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  if (account.activated_at) {
    return NextResponse.json(
      { error: "This account has already been activated. Use password reset instead." },
      { status: 409 }
    );
  }

  // 2. Expire any existing unused invites for this account
  await supabase
    .from("got_talent_admin_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("account_id", targetId)
    .is("used_at", null);

  // 3. Generate a cryptographically random token
  const rawToken = randomBytes(48).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + EXPIRES_HOURS * 60 * 60 * 1000);

  const { error: insertErr } = await supabase.from("got_talent_admin_invites").insert({
    account_id: targetId,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (insertErr) {
    console.error("Failed to insert Got Talent invite:", insertErr);
    return NextResponse.json({ error: "Failed to create invite." }, { status: 500 });
  }

  // 4. Send the email (token is only in the email — never logged or returned)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wtsfair.com";
  const setupUrl = `${baseUrl}/got-talent/admin/setup-password?token=${rawToken}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("RESEND_API_KEY not set — invite email not sent");
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const resend = new Resend(resendKey);
  // Derive a display name: capitalize the account ID (e.g. "donna" → "Donna")
  const recipientName =
    (account.id as string).charAt(0).toUpperCase() + (account.id as string).slice(1);

  const emailContent = buildGotTalentInviteEmail({
    recipientEmail: account.email as string,
    recipientName,
    setupUrl,
    expiresHours: EXPIRES_HOURS,
  });

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "noreply@wtsfair.com";
  const { error: emailErr } = await resend.emails.send({
    from: `WTSF Got Talent <${fromAddress}>`,
    to: [account.email as string],
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  if (emailErr) {
    console.error("Failed to send Got Talent invite email:", emailErr);
    return NextResponse.json(
      { error: "Invite created but email delivery failed. Check logs." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Invite email sent to ${account.email as string}. Link expires in ${EXPIRES_HOURS} hours.`,
  });
}
