import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildPageantConfirmationEmail } from "@/lib/emails/pageant-confirmation";
import { buildPageantNotificationEmail } from "@/lib/emails/pageant-notification";
import { getDivisionById } from "@/lib/pageant-config";

// Square webhook payload types
interface SquareMoney {
  amount: number;
  currency: string;
}

interface SquarePayment {
  id: string;
  status: string;
  reference_id?: string;
  order_id?: string;
  amount_money?: SquareMoney;
}

interface SquareWebhookBody {
  event_id: string;
  type: string;
  data?: {
    object?: {
      payment?: SquarePayment;
    };
  };
}

function verifySquareSignature(
  body: string,
  signatureHeader: string,
  webhookUrl: string,
  sigKey: string
): boolean {
  const toSign = webhookUrl + body;
  const expected = createHmac("sha256", sigKey).update(toSign).digest("base64");
  // Timing-safe compare
  if (expected.length !== signatureHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return diff === 0;
}

async function sendPaymentEmails(registrationId: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_PAGEANT_FROM_EMAIL ?? "pageants@wtsfair.com";
  if (!resendKey) return;

  const supabase = createAdminClient();
  const { data: reg } = await supabase
    .from("pageant_registrations")
    .select("*")
    .eq("id", registrationId)
    .single();

  if (!reg) return;

  const resend = new Resend(resendKey);
  const division = getDivisionById(reg.division_id);
  const now = new Date();

  if (!reg.confirmation_email_sent) {
    const confirmEmail = buildPageantConfirmationEmail({
      guardianName: reg.guardian_name,
      guardianEmail: reg.guardian_email,
      contestantFirstName: reg.contestant_first_name,
      contestantLastName: reg.contestant_last_name,
      divisionName: reg.division_name,
      arrivalTime: division?.arrivalTime ?? "See confirmation",
      competitionTime: division?.competitionTime ?? "See confirmation",
      amountPaidCents: reg.amount_cents ?? 0,
      registrationId: reg.id,
      confirmedAt: reg.confirmed_at ? new Date(reg.confirmed_at) : now,
    });
    try {
      await resend.emails.send({
        from: `WTSF Pageants <${fromEmail}>`,
        to: reg.guardian_email,
        subject: confirmEmail.subject,
        html: confirmEmail.html,
        text: confirmEmail.text,
      });
      await supabase
        .from("pageant_registrations")
        .update({ confirmation_email_sent: true })
        .eq("id", registrationId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await supabase
        .from("pageant_registrations")
        .update({ confirmation_email_error: msg })
        .eq("id", registrationId);
    }
  }

  if (!reg.notification_email_sent) {
    const notifEmail = buildPageantNotificationEmail({
      registrationId: reg.id,
      divisionId: reg.division_id,
      divisionName: reg.division_name,
      contestantFirstName: reg.contestant_first_name,
      contestantLastName: reg.contestant_last_name,
      contestantDob: reg.contestant_dob,
      guardianName: reg.guardian_name,
      guardianRelationship: reg.guardian_relationship ?? undefined,
      guardianEmail: reg.guardian_email,
      guardianPhone: reg.guardian_phone,
      guardianAddress: reg.guardian_address,
      guardianCity: reg.guardian_city,
      guardianState: reg.guardian_state,
      guardianZip: reg.guardian_zip,
      amountPaidCents: reg.amount_cents ?? 0,
      squarePaymentId: reg.square_payment_id ?? "",
      createdAt: new Date(reg.created_at),
      confirmedAt: reg.confirmed_at ? new Date(reg.confirmed_at) : now,
      rulesAgreed: reg.rules_agreed,
      mediaReleaseAgreed: reg.media_release_agreed,
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
    } catch (err) {
      console.error("Failed to send notification email from webhook:", err);
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!sigKey) {
    console.error("SQUARE_WEBHOOK_SIGNATURE_KEY not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Read raw body as text for signature verification
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-square-hmacsha256-signature") ?? "";

  // Build webhook URL for signature verification
  const host = request.headers.get("host") ?? "www.wtsfair.com";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const webhookUrl = `${protocol}://${host}/api/pageants/square/webhook`;

  if (!verifySquareSignature(rawBody, signatureHeader, webhookUrl, sigKey)) {
    console.warn("Square webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: SquareWebhookBody;
  try {
    event = JSON.parse(rawBody) as SquareWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Idempotency: check if event already processed
  const { data: existingEvent } = await supabase
    .from("pageant_square_events")
    .select("id")
    .eq("square_event_id", event.event_id)
    .single();

  if (existingEvent) {
    // Already processed — return 200 immediately
    return NextResponse.json({ received: true, duplicate: true });
  }

  const payment = event.data?.object?.payment;
  let registrationId: string | null = null;

  // Handle event types
  if (event.type === "payment.completed" && payment) {
    const referenceId = payment.reference_id;
    if (referenceId) {
      const { data: reg } = await supabase
        .from("pageant_registrations")
        .select("id, status, amount_cents")
        .eq("id", referenceId)
        .single();

      if (reg) {
        registrationId = reg.id;
        if (reg.status === "PAYMENT_PENDING") {
          const now = new Date();
          await supabase
            .from("pageant_registrations")
            .update({
              status: "CONFIRMED",
              square_payment_id: payment.id,
              square_order_id: payment.order_id ?? null,
              amount_cents: payment.amount_money?.amount ?? reg.amount_cents,
              paid_at: now.toISOString(),
              confirmed_at: now.toISOString(),
            })
            .eq("id", reg.id);

          // Send emails (only if not already sent)
          await sendPaymentEmails(reg.id);
        }
      }
    }
  } else if (event.type === "payment.failed" && payment) {
    // Log only — do not change registration status
    console.log(`Square payment.failed event for payment ${payment.id}`);
    if (payment.reference_id) {
      registrationId = payment.reference_id;
    }
  }

  // Log event for idempotency
  await supabase.from("pageant_square_events").insert({
    square_event_id: event.event_id,
    event_type: event.type,
    payment_id: payment?.id ?? null,
    registration_id: registrationId,
    payload: event as unknown as Record<string, unknown>,
  });

  return NextResponse.json({ received: true });
}
