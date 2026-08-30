import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildPageantConfirmationEmail } from "@/lib/emails/pageant-confirmation";
import { buildPageantNotificationEmail } from "@/lib/emails/pageant-notification";
import { getDivisionById } from "@/lib/pageant-config";

const SQUARE_SANDBOX_BASE = "https://connect.squareupsandbox.com/v2";
const SQUARE_PRODUCTION_BASE = "https://connect.squareup.com/v2";

function getSquareBase(): string {
  const sandbox =
    process.env.NODE_ENV !== "production" ||
    process.env.SQUARE_SANDBOX_MODE === "true";
  return sandbox ? SQUARE_SANDBOX_BASE : SQUARE_PRODUCTION_BASE;
}

interface SquarePaymentResponse {
  payment?: {
    id: string;
    status: string;
    order_id?: string;
  };
  errors?: Array<{ code: string; detail: string; category: string }>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Payment system not yet configured. Please contact wtsfpageant@outlook.com to complete registration." },
      { status: 503 }
    );
  }

  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!locationId) {
    return NextResponse.json(
      { success: false, error: "Payment system not yet configured. Please contact wtsfpageant@outlook.com to complete registration." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const { registrationId, sourceId } = body as Record<string, unknown>;

  if (typeof registrationId !== "string" || !registrationId) {
    return NextResponse.json({ success: false, error: "registrationId is required" }, { status: 400 });
  }
  if (typeof sourceId !== "string" || !sourceId) {
    return NextResponse.json({ success: false, error: "sourceId is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Look up registration
  const { data: reg, error: regError } = await supabase
    .from("pageant_registrations")
    .select("*")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) {
    return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
  }

  if (reg.status !== "PAYMENT_PENDING") {
    if (reg.status === "CONFIRMED") {
      return NextResponse.json({ success: true, status: "CONFIRMED", alreadyPaid: true });
    }
    return NextResponse.json(
      { success: false, error: `Registration is ${reg.status.toLowerCase()} and cannot be paid.` },
      { status: 409 }
    );
  }

  // Check deadline
  if (new Date() > new Date(reg.payment_deadline)) {
    await supabase
      .from("pageant_registrations")
      .update({ status: "EXPIRED", expired_at: new Date().toISOString() })
      .eq("id", registrationId);
    return NextResponse.json(
      { success: false, error: "Payment deadline has passed. Please start a new registration." },
      { status: 410 }
    );
  }

  // Idempotency: stable key per registration
  const idempotencyKey = `WTSF-PAY-${registrationId}`;

  // If we've already stored the key, check existing payment status to avoid double-charge
  if (reg.square_idempotency_key === idempotencyKey && reg.square_payment_id) {
    // Already charged — return current state
    return NextResponse.json({
      success: reg.status === "CONFIRMED",
      status: reg.status,
      alreadyCharged: true,
    });
  }

  // Store idempotency key BEFORE calling Square to prevent duplicate charges on retry
  await supabase
    .from("pageant_registrations")
    .update({ square_idempotency_key: idempotencyKey })
    .eq("id", registrationId);

  // Determine amount
  let amountCents: number = reg.amount_cents;
  if (!amountCents) {
    // Try to pull from settings
    const { data: settings } = await supabase
      .from("pageant_settings")
      .select("entry_fee_cents")
      .eq("fair_year", 2026)
      .single();
    amountCents = settings?.entry_fee_cents ?? 0;
  }

  if (!amountCents || amountCents <= 0) {
    return NextResponse.json(
      { success: false, error: "Entry fee has not been set. Please contact wtsfpageant@outlook.com." },
      { status: 503 }
    );
  }

  // Call Square Payments API
  const squarePayload = {
    source_id: sourceId,
    idempotency_key: idempotencyKey,
    amount_money: { amount: amountCents, currency: "USD" },
    location_id: locationId,
    reference_id: registrationId,
    note: `WTSF 2026 Traditional Pageant - ${reg.division_name}`,
  };

  let squareResult: SquarePaymentResponse;
  try {
    const squareRes = await fetch(`${getSquareBase()}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Square-Version": "2024-02-22",
      },
      body: JSON.stringify(squarePayload),
    });
    squareResult = (await squareRes.json()) as SquarePaymentResponse;
  } catch (err) {
    console.error("Square API call failed:", err);
    return NextResponse.json(
      { success: false, error: "Payment service unavailable. Please try again." },
      { status: 502 }
    );
  }

  if (squareResult.errors && squareResult.errors.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Payment failed",
        squareError: squareResult.errors.map((e) => e.detail).join("; "),
      },
      { status: 402 }
    );
  }

  const payment = squareResult.payment;
  if (!payment || payment.status !== "COMPLETED") {
    return NextResponse.json(
      { success: false, error: "Payment was not completed.", squareStatus: payment?.status },
      { status: 402 }
    );
  }

  const now = new Date();

  // Update registration to CONFIRMED
  const { error: updateError } = await supabase
    .from("pageant_registrations")
    .update({
      status: "CONFIRMED",
      square_payment_id: payment.id,
      square_order_id: payment.order_id ?? null,
      amount_cents: amountCents,
      paid_at: now.toISOString(),
      confirmed_at: now.toISOString(),
    })
    .eq("id", registrationId);

  if (updateError) {
    console.error("Failed to update registration after payment:", updateError);
    // Payment succeeded but DB update failed — log and continue (Square webhook will retry)
  }

  // Fetch full record for emails
  const { data: fullReg } = await supabase
    .from("pageant_registrations")
    .select("*")
    .eq("id", registrationId)
    .single();

  // Send emails
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_PAGEANT_FROM_EMAIL ?? "pageants@wtsfair.com";

  if (resendKey && fullReg) {
    const resend = new Resend(resendKey);
    const division = getDivisionById(fullReg.division_id);

    // Confirmation to guardian
    const confirmEmail = buildPageantConfirmationEmail({
      guardianName: fullReg.guardian_name,
      guardianEmail: fullReg.guardian_email,
      contestantFirstName: fullReg.contestant_first_name,
      contestantLastName: fullReg.contestant_last_name,
      divisionName: fullReg.division_name,
      arrivalTime: division?.arrivalTime ?? "See confirmation",
      competitionTime: division?.competitionTime ?? "See confirmation",
      amountPaidCents: amountCents,
      registrationId: fullReg.id,
      confirmedAt: now,
    });

    try {
      await resend.emails.send({
        from: `WTSF Pageants <${fromEmail}>`,
        to: fullReg.guardian_email,
        subject: confirmEmail.subject,
        html: confirmEmail.html,
        text: confirmEmail.text,
      });
      await supabase
        .from("pageant_registrations")
        .update({ confirmation_email_sent: true })
        .eq("id", registrationId);
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
      const errMsg = emailErr instanceof Error ? emailErr.message : String(emailErr);
      await supabase
        .from("pageant_registrations")
        .update({ confirmation_email_error: errMsg })
        .eq("id", registrationId);
    }

    // Notification to pageant team
    const notifEmail = buildPageantNotificationEmail({
      registrationId: fullReg.id,
      divisionId: fullReg.division_id,
      divisionName: fullReg.division_name,
      contestantFirstName: fullReg.contestant_first_name,
      contestantLastName: fullReg.contestant_last_name,
      contestantDob: fullReg.contestant_dob,
      guardianName: fullReg.guardian_name,
      guardianRelationship: fullReg.guardian_relationship ?? undefined,
      guardianEmail: fullReg.guardian_email,
      guardianPhone: fullReg.guardian_phone,
      guardianAddress: fullReg.guardian_address,
      guardianCity: fullReg.guardian_city,
      guardianState: fullReg.guardian_state,
      guardianZip: fullReg.guardian_zip,
      amountPaidCents: amountCents,
      squarePaymentId: payment.id,
      createdAt: new Date(fullReg.created_at),
      confirmedAt: now,
      rulesAgreed: fullReg.rules_agreed,
      mediaReleaseAgreed: fullReg.media_release_agreed,
    });

    try {
      await resend.emails.send({
        from: `WTSF Pageants <${fromEmail}>`,
        to: "wtsfpageant@outlook.com",
        subject: notifEmail.subject,
        html: notifEmail.html,
        text: notifEmail.text,
      });
      await supabase
        .from("pageant_registrations")
        .update({ notification_email_sent: true })
        .eq("id", registrationId);
    } catch (emailErr) {
      console.error("Failed to send notification email:", emailErr);
    }
  }

  return NextResponse.json({ success: true, status: "CONFIRMED" });
}
