import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildGotTalentConfirmationEmail } from "@/lib/emails/got-talent-confirmation";
import { buildGotTalentNotificationEmail } from "@/lib/emails/got-talent-notification";
import { getDivisionById } from "@/lib/got-talent-config";

const SQUARE_SANDBOX_BASE = "https://connect.squareupsandbox.com/v2";
const SQUARE_PRODUCTION_BASE = "https://connect.squareup.com/v2";

function getSquareBase(): string {
  const sandbox =
    process.env.NODE_ENV !== "production" ||
    process.env.SQUARE_SANDBOX_MODE === "true" ||
    process.env.NEXT_PUBLIC_SQUARE_SANDBOX_MODE === "true";
  return sandbox ? SQUARE_SANDBOX_BASE : SQUARE_PRODUCTION_BASE;
}

interface SquarePaymentResponse {
  payment?: { id: string; status: string; order_id?: string };
  errors?: Array<{ code: string; detail: string; category: string }>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Payment system not yet configured." },
      { status: 503 }
    );
  }

  // Got Talent uses the WTSF location — NOT the Pageants location
  const locationId =
    process.env.GOT_TALENT_SQUARE_LOCATION_ID ??
    process.env.NEXT_PUBLIC_GOT_TALENT_SQUARE_LOCATION_ID;
  if (!locationId) {
    return NextResponse.json(
      { success: false, error: "Payment system not yet configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { registrationId, sourceId } = body as Record<string, unknown>;

  if (typeof registrationId !== "string" || !registrationId) {
    return NextResponse.json({ success: false, error: "registrationId is required" }, { status: 400 });
  }
  if (typeof sourceId !== "string" || !sourceId) {
    return NextResponse.json({ success: false, error: "sourceId is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Load registration
  const { data: reg, error: regError } = await supabase
    .from("got_talent_registrations")
    .select("*")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) {
    return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
  }

  if (reg.status === "CONFIRMED") {
    return NextResponse.json({ success: true, status: "CONFIRMED", alreadyPaid: true });
  }

  if (reg.status !== "PAYMENT_PENDING") {
    return NextResponse.json(
      { success: false, error: `Registration is ${String(reg.status).toLowerCase()} and cannot be paid.` },
      { status: 409 }
    );
  }

  // Check deadline
  if (reg.payment_deadline && new Date() > new Date(reg.payment_deadline as string)) {
    await supabase
      .from("got_talent_registrations")
      .update({ status: "EXPIRED" })
      .eq("id", registrationId);
    return NextResponse.json(
      { success: false, error: "Payment deadline has passed. Please register again." },
      { status: 410 }
    );
  }

  // Fetch current entry fee from settings (server-side price, not from reg record)
  const { data: settings } = await supabase
    .from("got_talent_settings")
    .select("entry_fee_cents, registration_closes_at")
    .eq("id", 1)
    .single();

  if (!settings?.entry_fee_cents) {
    return NextResponse.json(
      { success: false, error: "Entry fee has not been configured. Contact wtsfair.com for help." },
      { status: 503 }
    );
  }

  if (settings.registration_closes_at && new Date() > new Date(settings.registration_closes_at as string)) {
    return NextResponse.json(
      { success: false, error: "Registration has closed. Payment cannot be processed." },
      { status: 410 }
    );
  }

  const amountCents = settings.entry_fee_cents as number;
  const idempotencyKey = `WTSF-GT-${(registrationId as string).slice(0, 8)}-${randomBytes(4).toString("hex")}`;

  // Call Square
  const squarePayload = {
    source_id: sourceId,
    idempotency_key: idempotencyKey,
    amount_money: { amount: amountCents, currency: "USD" },
    location_id: locationId,
    reference_id: registrationId,
    note: `WTSF Got Talent 2026 — ${String(reg.act_name)} (${String(reg.division)})`,
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

  // Confirm registration
  await supabase
    .from("got_talent_registrations")
    .update({
      status: "CONFIRMED",
      square_payment_id: payment.id,
      square_order_id: payment.order_id ?? null,
      amount_cents: amountCents,
      paid_at: now.toISOString(),
      confirmed_at: now.toISOString(),
    })
    .eq("id", registrationId);

  // Send emails
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.GOT_TALENT_ADMIN_EMAIL;
  const fromEmail = "wtsf@wtsfair.com";

  if (resendKey) {
    const resend = new Resend(resendKey);
    const divisionConfig = getDivisionById(reg.division as string);

    // Confirmation to contact
    const confirmEmail = buildGotTalentConfirmationEmail({
      contactName: reg.contact_name as string,
      contactEmail: reg.contact_email as string,
      actName: reg.act_name as string,
      actType: reg.act_type as string,
      divisionLabel: divisionConfig?.label ?? String(reg.division),
      performanceDate: divisionConfig?.performanceDate ?? "",
      performanceTime: divisionConfig?.performanceTime ?? "",
      requiresMusic: reg.requires_music as boolean,
      amountPaidCents: amountCents,
      registrationId: registrationId,
      confirmedAt: now,
    });

    try {
      await resend.emails.send({
        from: `WTSF Got Talent <${fromEmail}>`,
        to: reg.contact_email as string,
        subject: confirmEmail.subject,
        html: confirmEmail.html,
        text: confirmEmail.text,
      });
      await supabase
        .from("got_talent_registrations")
        .update({ confirmation_email_sent_at: now.toISOString() })
        .eq("id", registrationId);
    } catch (emailErr) {
      console.error("Failed to send Got Talent confirmation email:", emailErr);
    }

    // Notification to Donna
    if (adminEmail) {
      const notifEmail = buildGotTalentNotificationEmail({
        actName: reg.act_name as string,
        actType: reg.act_type as string,
        isGroup: reg.is_group as boolean,
        performerCount: reg.performer_count as number,
        primaryPerformerName: reg.primary_performer_name as string,
        division: reg.division as string,
        divisionLabel: divisionConfig?.label ?? String(reg.division),
        requiresMusic: reg.requires_music as boolean,
        divisionConflict: reg.division_conflict as boolean,
        contactName: reg.contact_name as string,
        contactEmail: reg.contact_email as string,
        contactPhone: reg.contact_phone as string,
        amountPaidCents: amountCents,
        registrationId,
        confirmedAt: now,
      });

      try {
        await resend.emails.send({
          from: `WTSF Got Talent <${fromEmail}>`,
          to: adminEmail,
          subject: notifEmail.subject,
          html: notifEmail.html,
          text: notifEmail.text,
        });
        await supabase
          .from("got_talent_registrations")
          .update({ notification_email_sent_at: now.toISOString() })
          .eq("id", registrationId);
      } catch (emailErr) {
        console.error("Failed to send Got Talent notification email:", emailErr);
      }
    } else {
      console.warn("[got-talent-payment] GOT_TALENT_ADMIN_EMAIL not set — notification not sent");
    }
  }

  return NextResponse.json({ success: true, status: "CONFIRMED" });
}
