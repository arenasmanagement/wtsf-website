import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildEntrantConfirmationEmail } from "@/lib/emails/entrant-confirmation";
import { buildFairNotificationEmail } from "@/lib/emails/fair-notification";
import { FAIR_YEAR, FAIR_NOTIFICATION_EMAILS } from "@/lib/exhibit-config";

// ── Rate limiting (in-memory, resets on cold start) ─────────────────
const submissionsByIp = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;          // max submissions per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submissionsByIp.get(ip);
  if (!record || now > record.resetAt) {
    submissionsByIp.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// ── Validation schemas ───────────────────────────────────────────────
const EntrySchema = z.object({
  department: z.string().min(1, "Department is required"),
  division:   z.string().min(1, "Division is required"),
  class_name: z.string().min(1, "Class is required"),
  lot:        z.string().min(1, "Lot is required"),
  entry_title:       z.string().max(200).optional(),
  entry_description: z.string().max(500).optional(),
  quantity:   z.number().int().min(1).max(99).default(1),
});

const RegistrationSchema = z.object({
  // Entrant info
  first_name:     z.string().min(1, "First name is required").max(100),
  last_name:      z.string().min(1, "Last name is required").max(100),
  address:        z.string().min(1, "Address is required").max(200),
  city:           z.string().min(1, "City is required").max(100),
  state:          z.string().length(2, "State must be 2 characters").toUpperCase(),
  zip:            z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phone:          z.string().regex(/^[\d\s\-\(\)\+\.]{7,20}$/, "Invalid phone number"),
  email:          z.string().email("Invalid email address").max(200),
  confirm_email:  z.string().email(),
  entrant_type:   z.enum(["adult", "youth"]),
  // Youth-specific (required when entrant_type === "youth")
  youth_age:      z.number().int().min(1).max(17).optional().nullable(),
  youth_birthdate: z.string().optional().nullable(),
  youth_grade:    z.string().max(50).optional().nullable(),
  guardian_name:  z.string().max(200).optional().nullable(),
  guardian_phone: z.string().max(30).optional().nullable(),
  guardian_email: z.string().email().max(200).optional().nullable(),
  // Entries
  entries: z.array(EntrySchema).min(1, "At least one exhibit entry is required").max(50),
  // Rules
  rules_agreed: z.literal(true, { message: "You must agree to the rules" }),
  // Honeypot (should be empty — spam bots fill it)
  website: z.string().max(0).optional(),
});

type RegistrationInput = z.infer<typeof RegistrationSchema>;

// ── GET — check if registration is open ─────────────────────────────
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("exhibit_registration_settings")
      .select("registration_open, open_date, close_date, entry_deadline_label, checkin_info")
      .eq("fair_year", FAIR_YEAR)
      .single();

    if (error || !data) {
      return NextResponse.json({ open: false, reason: "Settings unavailable" });
    }

    const now = new Date();
    const openDate  = data.open_date  ? new Date(data.open_date)  : null;
    const closeDate = data.close_date ? new Date(data.close_date) : null;

    const open =
      data.registration_open &&
      (!openDate  || now >= openDate) &&
      (!closeDate || now <= closeDate);

    return NextResponse.json({
      open,
      entry_deadline_label: data.entry_deadline_label,
      checkin_info:         data.checkin_info,
      close_date:           data.close_date,
    });
  } catch {
    return NextResponse.json({ open: false, reason: "Server error" });
  }
}

// ── POST — submit registration ───────────────────────────────────────
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions from this address. Please try again later." },
      { status: 429 }
    );
  }

  // Parse body
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot check
  if (typeof raw === "object" && raw !== null && "website" in raw && (raw as Record<string,unknown>).website) {
    // Bot — silently succeed
    return NextResponse.json({ success: true, submissionRef: "WTSF-ONLINE-BOT" });
  }

  // Validate
  const parsed = RegistrationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data: RegistrationInput = parsed.data;

  // Email match
  if (data.email.toLowerCase() !== data.confirm_email.toLowerCase()) {
    return NextResponse.json(
      { error: "Email addresses do not match" },
      { status: 422 }
    );
  }

  // Youth validation
  if (data.entrant_type === "youth" && !data.guardian_name) {
    return NextResponse.json(
      { error: "Parent or guardian name is required for youth registrations" },
      { status: 422 }
    );
  }

  // Check registration is open
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("exhibit_registration_settings")
    .select("registration_open, open_date, close_date, checkin_info")
    .eq("fair_year", FAIR_YEAR)
    .single();

  const now = new Date();
  const openDate  = settings?.open_date  ? new Date(settings.open_date)  : null;
  const closeDate = settings?.close_date ? new Date(settings.close_date) : null;
  const isOpen =
    settings?.registration_open &&
    (!openDate  || now >= openDate) &&
    (!closeDate || now <= closeDate);

  if (!isOpen) {
    return NextResponse.json(
      { error: "Online exhibit registration is currently closed." },
      { status: 403 }
    );
  }

  // Generate submission reference
  const { data: refData, error: refError } = await supabase
    .rpc("get_next_submission_ref", { p_year: FAIR_YEAR });

  if (refError || !refData) {
    console.error("Failed to generate submission ref:", refError);
    return NextResponse.json({ error: "Failed to create submission reference" }, { status: 500 });
  }

  const submissionRef: string = refData;

  // Insert entrant
  const { data: entrant, error: entrantError } = await supabase
    .from("exhibit_entrants")
    .insert({
      first_name:       data.first_name,
      last_name:        data.last_name,
      address:          data.address,
      city:             data.city,
      state:            data.state,
      zip:              data.zip,
      phone:            data.phone,
      email:            data.email.toLowerCase(),
      entrant_type:     data.entrant_type,
      youth_age:        data.youth_age    ?? null,
      youth_birthdate:  data.youth_birthdate ?? null,
      youth_grade:      data.youth_grade  ?? null,
      guardian_name:    data.guardian_name  ?? null,
      guardian_phone:   data.guardian_phone ?? null,
      guardian_email:   data.guardian_email ?? null,
    })
    .select("id")
    .single();

  if (entrantError || !entrant) {
    console.error("Failed to insert entrant:", entrantError);
    return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
  }

  // Insert registration
  const { data: registration, error: regError } = await supabase
    .from("exhibit_registrations")
    .insert({
      submission_ref: submissionRef,
      entrant_id:     entrant.id,
      fair_year:      FAIR_YEAR,
      status:         "submitted",
      rules_agreed:   true,
      entry_count:    data.entries.length,
      ip_address:     ip,
      user_agent:     request.headers.get("user-agent") ?? null,
    })
    .select("id")
    .single();

  if (regError || !registration) {
    console.error("Failed to insert registration:", regError);
    return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
  }

  // Insert exhibit entries
  const entryRows = data.entries.map((e, i) => ({
    registration_id:   registration.id,
    entrant_id:        entrant.id,
    department:        e.department,
    division:          e.division,
    class_name:        e.class_name,
    lot:               e.lot,
    entry_title:       e.entry_title       ?? null,
    entry_description: e.entry_description ?? null,
    quantity:          e.quantity,
    entrant_category:  data.entrant_type,
    sort_order:        i,
  }));

  const { error: entriesError } = await supabase
    .from("exhibit_entries")
    .insert(entryRows);

  if (entriesError) {
    console.error("Failed to insert entries:", entriesError);
    // Registration is saved — don't fail the whole request, flag it
    await supabase
      .from("exhibit_registrations")
      .update({ notes: "WARNING: Entry rows failed to insert — review manually" })
      .eq("id", registration.id);
  }

  // Send emails
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wtsfair.com";
  const adminUrl = `${siteUrl}/exhibits/admin/dashboard`;

  let confirmationSent = false;
  let notificationSent = false;
  let confirmationError: string | null = null;
  let notificationError: string | null = null;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const submittedAt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Chicago",
    }).format(new Date()) + " CT";

    // Entrant confirmation
    try {
      const email = buildEntrantConfirmationEmail({
        firstName:    data.first_name,
        lastName:     data.last_name,
        submissionRef,
        submittedAt,
        entries:      data.entries,
        checkinInfo:  settings?.checkin_info ?? undefined,
        siteUrl,
      });
      await resend.emails.send({
        from:    `West Tennessee State Fair <${fromEmail}>`,
        to:      data.email,
        subject: email.subject,
        html:    email.html,
        text:    email.text,
      });
      confirmationSent = true;
    } catch (err) {
      confirmationError = String(err);
      console.error("Confirmation email failed:", err);
    }

    // Fair notification
    const notificationEmails = settings
      ? (FAIR_NOTIFICATION_EMAILS)
      : FAIR_NOTIFICATION_EMAILS;

    try {
      const notif = buildFairNotificationEmail({
        submissionRef,
        submittedAt,
        entrant: {
          firstName:    data.first_name,
          lastName:     data.last_name,
          email:        data.email,
          phone:        data.phone,
          address:      data.address,
          city:         data.city,
          state:        data.state,
          zip:          data.zip,
          entrantType:  data.entrant_type,
          youthAge:     data.youth_age     ?? null,
          youthGrade:   data.youth_grade   ?? null,
          guardianName: data.guardian_name ?? null,
        },
        entries: data.entries,
        adminUrl,
      });
      await resend.emails.send({
        from:    `WTSF Registration System <${fromEmail}>`,
        to:      notificationEmails,
        subject: notif.subject,
        html:    notif.html,
        text:    notif.text,
      });
      notificationSent = true;
    } catch (err) {
      notificationError = String(err);
      console.error("Notification email failed:", err);
    }
  } else {
    console.warn("RESEND_API_KEY not set — skipping emails");
  }

  // Update email delivery status
  await supabase
    .from("exhibit_registrations")
    .update({
      confirmation_email_sent:  confirmationSent,
      confirmation_email_error: confirmationError,
      notification_email_sent:  notificationSent,
      notification_email_error: notificationError,
    })
    .eq("id", registration.id);

  return NextResponse.json({
    success: true,
    submissionRef,
    emailSent: confirmationSent,
  });
}
