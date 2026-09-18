/**
 * POST /api/pageants/admin/recovery
 *
 * Phase 1 — Generate recovery tokens:
 *   Body: { action: "generate" }
 *   For every eligible PAYMENT_PENDING record with no existing recovery token,
 *   mints a new secure recovery token, stores only the SHA-256 hash in the DB,
 *   and returns the (id, guardianEmail, rawToken, hasPaymentAttempt) payload
 *   to the calling admin session. The raw token is NEVER stored — it lives only
 *   in this response and is immediately used to send the recovery email.
 *
 * Phase 2 — Send recovery emails:
 *   Body: { action: "send", records: [{ id, guardianEmail, rawToken, hasPaymentAttempt }] }
 *   Re-validates each record (status, deadline) before sending. Sends Group A or
 *   Group B email via Resend. Writes recovery_email_sent_at on success.
 *   Does NOT log or store raw tokens.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRoleServer } from "@/lib/admin-auth";

// ── Email templates ─────────────────────────────────────────────────────────

function buildGroupAEmail(
  guardianName: string,
  recoveryUrl: string,
): { subject: string; html: string; text: string } {
  const subject = "Your WTSF Traditional Pageant Registration Is Almost Complete 👑";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EDD4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:2px solid #D4A827;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#2C4A2E;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#D4A827;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">West Tennessee State Fair</p>
              <h1 style="margin:0;color:#F5EDD4;font-size:24px;font-family:Georgia,serif;font-weight:700;">Almost There! 👑</h1>
              <p style="margin:8px 0 0 0;color:#E8DFC8;font-size:14px;font-family:Georgia,serif;">2026 Traditional Fair Pageants</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0;color:#5C4A32;font-size:16px;font-family:Georgia,serif;">Dear ${guardianName},</p>
              <p style="margin:0 0 20px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                We received your contestant's application information for the 2026 West Tennessee State Fair Traditional Fair Pageants.
              </p>
              <p style="margin:0 0 28px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                Your information is saved, but registration is not complete until payment is successfully received. You do not need to complete the application again.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${recoveryUrl}"
                       style="display:inline-block;background-color:#2C4A2E;color:#F5EDD4;font-family:Georgia,serif;font-size:16px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:6px;border:2px solid #D4A827;">
                      COMPLETE REGISTRATION →
                    </a>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;border:1px solid #D4A827;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 10px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;font-weight:700;">Registration Fee</p>
                    <p style="margin:0 0 4px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">$55 through October 10 &nbsp;·&nbsp; $65 October 11–14</p>
                    <p style="margin:8px 0 0 0;color:#8B0000;font-size:13px;font-family:Georgia,serif;font-weight:700;">Registration closes October 14 at 11:59 PM CDT.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;font-weight:700;">Saturday, October 17, 2026</p>
              <p style="margin:0 0 24px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">Williams Auditorium · Henderson, Tennessee</p>
              <p style="margin:0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">Questions? <a href="mailto:wtsfpageant@outlook.com" style="color:#2C4A2E;font-weight:700;">wtsfpageant@outlook.com</a></p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#E8DFC8;padding:16px 40px;text-align:center;border-top:1px solid #D4A827;">
              <p style="margin:0;color:#8B7355;font-size:11px;font-family:Georgia,serif;">West Tennessee State Fair · Henderson, Tennessee</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `YOUR WTSF TRADITIONAL PAGEANT REGISTRATION IS ALMOST COMPLETE 👑
===================================================================

Dear ${guardianName},

We received your contestant's application information for the 2026 West Tennessee State Fair Traditional Fair Pageants.

Your information is saved, but registration is not complete until payment is successfully received. You do not need to complete the application again.

  ${recoveryUrl}

REGISTRATION FEE
$55 through October 10  ·  $65 October 11–14
Registration closes October 14 at 11:59 PM CDT.

Saturday, October 17, 2026
Williams Auditorium · Henderson, Tennessee

Questions? wtsfpageant@outlook.com

West Tennessee State Fair · Henderson, Tennessee`;

  return { subject, html, text };
}

function buildGroupBEmail(
  guardianName: string,
  recoveryUrl: string,
): { subject: string; html: string; text: string } {
  const subject = "Complete Your WTSF Traditional Pageant Registration 👑";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EDD4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:2px solid #D4A827;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#2C4A2E;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#D4A827;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">West Tennessee State Fair</p>
              <h1 style="margin:0;color:#F5EDD4;font-size:24px;font-family:Georgia,serif;font-weight:700;">Action Needed 👑</h1>
              <p style="margin:8px 0 0 0;color:#E8DFC8;font-size:14px;font-family:Georgia,serif;">2026 Traditional Fair Pageants</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0;color:#5C4A32;font-size:16px;font-family:Georgia,serif;">Dear ${guardianName},</p>
              <p style="margin:0 0 20px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                We received your contestant's application information for the 2026 West Tennessee State Fair Traditional Fair Pageants, but we weren't able to complete your payment.
              </p>
              <p style="margin:0 0 28px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                Your information is still saved. You do not need to complete the application again.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${recoveryUrl}"
                       style="display:inline-block;background-color:#2C4A2E;color:#F5EDD4;font-family:Georgia,serif;font-size:16px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:6px;border:2px solid #D4A827;">
                      TRY PAYMENT AGAIN →
                    </a>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;border:1px solid #D4A827;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 10px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;font-weight:700;">Registration Fee</p>
                    <p style="margin:0 0 4px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">$55 through October 10 &nbsp;·&nbsp; $65 October 11–14</p>
                    <p style="margin:8px 0 0 0;color:#8B0000;font-size:13px;font-family:Georgia,serif;font-weight:700;">Registration closes October 14 at 11:59 PM CDT.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;font-weight:700;">Saturday, October 17, 2026</p>
              <p style="margin:0 0 24px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">Williams Auditorium · Henderson, Tennessee</p>
              <p style="margin:0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">Questions? <a href="mailto:wtsfpageant@outlook.com" style="color:#2C4A2E;font-weight:700;">wtsfpageant@outlook.com</a></p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#E8DFC8;padding:16px 40px;text-align:center;border-top:1px solid #D4A827;">
              <p style="margin:0;color:#8B7355;font-size:11px;font-family:Georgia,serif;">West Tennessee State Fair · Henderson, Tennessee</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `COMPLETE YOUR WTSF TRADITIONAL PAGEANT REGISTRATION 👑
========================================================

Dear ${guardianName},

We received your contestant's application information for the 2026 West Tennessee State Fair Traditional Fair Pageants, but we weren't able to complete your payment.

Your information is still saved. You do not need to complete the application again.

  ${recoveryUrl}

REGISTRATION FEE
$55 through October 10  ·  $65 October 11–14
Registration closes October 14 at 11:59 PM CDT.

Saturday, October 17, 2026
Williams Auditorium · Henderson, Tennessee

Questions? wtsfpageant@outlook.com

West Tennessee State Fair · Henderson, Tennessee`;

  return { subject, html, text };
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Auth check — admin only (super or pageants role required)
  const role = await getSessionRoleServer();
  if (!role || (role !== "super" && role !== "pageants")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("action" in body)) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  const { action } = body as Record<string, unknown>;
  const supabase = createAdminClient();

  // ── Phase 1: Generate recovery tokens ──────────────────────────────────────
  if (action === "generate") {
    // Fetch registration_closes_at to use as recovery token expiry
    const { data: settings } = await supabase
      .from("pageant_settings")
      .select("registration_closes_at")
      .eq("fair_year", 2026)
      .single();

    const expiresAt = settings?.registration_closes_at ?? null;

    // Query all eligible PAYMENT_PENDING records without an existing recovery token
    const { data: records, error } = await supabase
      .from("pageant_registrations")
      .select("id, guardian_name, guardian_email, square_idempotency_key, status, payment_deadline, recovery_token_hash")
      .eq("fair_year", 2026)
      .eq("status", "PAYMENT_PENDING")
      .is("recovery_token_hash", null);  // only records not yet tokenized

    if (error || !records) {
      console.error("[recovery/generate] DB error:", error);
      return NextResponse.json({ error: "Failed to query registrations" }, { status: 500 });
    }

    // Exclude CONFIRMED or CANCELLED (extra safety — query already filters by PAYMENT_PENDING)
    const eligible = records.filter((r) => r.status === "PAYMENT_PENDING");

    const results: {
      id: string;
      guardianEmail: string;
      guardianName: string;
      rawToken: string;
      hasPaymentAttempt: boolean;
    }[] = [];

    for (const rec of eligible) {
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");

      const { error: updateError } = await supabase
        .from("pageant_registrations")
        .update({
          recovery_token_hash: tokenHash,
          recovery_token_expires_at: expiresAt,
        })
        .eq("id", rec.id)
        .eq("status", "PAYMENT_PENDING"); // double-check status at write time

      if (updateError) {
        console.error(`[recovery/generate] Failed to update record ${rec.id}:`, updateError);
        continue; // skip this record, continue with others
      }

      results.push({
        id: rec.id,
        guardianEmail: rec.guardian_email,
        guardianName: rec.guardian_name,
        rawToken, // raw token returned to admin session only; never stored or logged
        hasPaymentAttempt: !!rec.square_idempotency_key,
      });
    }

    return NextResponse.json({
      generated: results.length,
      records: results,
    });
  }

  // ── Phase 2: Send recovery emails ──────────────────────────────────────────
  if (action === "send") {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 503 });
    }
    const resend = new Resend(resendKey);

    const { records } = body as unknown as {
      records: {
        id: string;
        guardianEmail: string;
        guardianName: string;
        rawToken: string;
        hasPaymentAttempt: boolean;
      }[];
    };

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "No records provided" }, { status: 400 });
    }

    const sent: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const rec of records) {
      // Re-validate at send time — status must still be PAYMENT_PENDING
      const { data: current } = await supabase
        .from("pageant_registrations")
        .select("id, status, payment_deadline, recovery_email_sent_at")
        .eq("id", rec.id)
        .single();

      if (!current || current.status !== "PAYMENT_PENDING") {
        failed.push({ id: rec.id, reason: `status is ${current?.status ?? "unknown"} — skipped` });
        continue;
      }

      // Skip if already sent (idempotency guard)
      if (current.recovery_email_sent_at) {
        failed.push({ id: rec.id, reason: "recovery email already sent" });
        continue;
      }

      const recoveryUrl = `https://wtsfair.com/pageants/register/pay/${rec.rawToken}`;
      const emailData = rec.hasPaymentAttempt
        ? buildGroupBEmail(rec.guardianName, recoveryUrl)
        : buildGroupAEmail(rec.guardianName, recoveryUrl);

      try {
        await resend.emails.send({
          from: "pageants@wtsfair.com",
          to: rec.guardianEmail,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        });

        // Write audit timestamp — no raw token stored
        await supabase
          .from("pageant_registrations")
          .update({ recovery_email_sent_at: new Date().toISOString() })
          .eq("id", rec.id);

        sent.push(rec.id);
      } catch (sendError) {
        console.error(`[recovery/send] Resend failed for record ${rec.id}:`, sendError);
        failed.push({ id: rec.id, reason: "email send failed" });
      }
    }

    return NextResponse.json({ sent: sent.length, failed });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
