import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildPageantInviteEmail } from "@/lib/emails/pageant-invite";

const EXPIRES_HOURS = 72;

// POST /api/pageants/admin/invite
// Requires super admin session (enforced by proxy.ts).
// Generates an invite token for the "hayley" account and sends the setup email.
export async function POST(_request: NextRequest): Promise<NextResponse> {
  const supabase = createAdminClient();

  // 1. Ensure the account exists
  const { data: account, error: accountErr } = await supabase
    .from("pageant_admin_accounts")
    .select("id, email, activated_at")
    .eq("id", "hayley")
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
    .from("pageant_admin_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("account_id", "hayley")
    .is("used_at", null);

  // 3. Generate a cryptographically random token
  const rawToken = randomBytes(48).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + EXPIRES_HOURS * 60 * 60 * 1000);

  const { error: insertErr } = await supabase.from("pageant_admin_invites").insert({
    account_id: "hayley",
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (insertErr) {
    console.error("Failed to insert invite:", insertErr);
    return NextResponse.json({ error: "Failed to create invite." }, { status: 500 });
  }

  // 4. Send the email (token is only in the email — never logged or returned)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wtsfair.com";
  const setupUrl = `${baseUrl}/pageants/admin/setup-password?token=${rawToken}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("RESEND_API_KEY not set — invite email not sent");
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendKey);
  const emailContent = buildPageantInviteEmail({
    recipientEmail: account.email,
    setupUrl,
    expiresHours: EXPIRES_HOURS,
  });

  const fromAddress = process.env.RESEND_FROM_PAGEANTS ?? "pageants@wtsfair.com";
  const { error: emailErr } = await resend.emails.send({
    from: fromAddress,
    to: [account.email],
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  if (emailErr) {
    console.error("Failed to send invite email:", emailErr);
    // Mark the invite as used so it can't be exploited even though email failed
    return NextResponse.json(
      { error: "Invite created but email delivery failed. Check logs." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Invite email sent to ${account.email}. Link expires in ${EXPIRES_HOURS} hours.`,
  });
}
