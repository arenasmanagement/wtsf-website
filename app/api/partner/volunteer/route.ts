import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { buildVolunteerNotificationEmail } from "@/lib/emails/volunteer-notification";
import { buildVolunteerConfirmationEmail } from "@/lib/emails/volunteer-confirmation";

// ── Rate limiting ─────────────────────────────────────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (!rec || now > rec.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (rec.count >= RATE_LIMIT) return false;
  rec.count++;
  return true;
}

// ── Constants ─────────────────────────────────────────────────────────────
const VALID_DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const VALID_AREAS = ["gate-tickets", "exhibit-hall", "livestock", "pageant", "grounds", "general", "other"];

const AREA_LABELS: Record<string, string> = {
  "gate-tickets":  "Gate and ticket operations",
  "exhibit-hall":  "Exhibit hall setup and management",
  "livestock":     "Livestock or show-day support",
  "pageant":       "Pageant-day coordination",
  "grounds":       "Grounds and cleanup",
  "general":       "General help wherever needed",
  "other":         "Other",
};

// ── Validation ────────────────────────────────────────────────────────────
const VolunteerSchema = z.object({
  // Personal
  fullName:        z.string().min(2, "Full name is required").max(200),
  ageGroup:        z.string().refine((v) => ["adult", "minor"].includes(v), "Please confirm your age"),
  email:           z.string().email("Invalid email address").max(200),
  confirmEmail:    z.string().email("Invalid email").max(200),
  phone:           z.string().regex(/^[\d\s\-\(\)\+\.]{7,20}$/, "Invalid phone number"),
  address:         z.string().min(1, "Address is required").max(300),
  city:            z.string().min(1, "City is required").max(100),
  state:           z.string().length(2, "State must be 2 characters").toUpperCase(),
  zip:             z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  // Interest
  preferredArea:   z.string().refine((v) => VALID_AREAS.includes(v), "Please select a preferred volunteer area"),
  otherExplanation: z.string().max(500).optional().or(z.literal("")),
  // Availability
  availableDays:   z.array(z.string()).min(1, "Please select at least one available day"),
  preferredStartTime: z.string().max(50).optional().or(z.literal("")),
  preferredEndTime:   z.string().max(50).optional().or(z.literal("")),
  multipleShifts:  z.string().refine((v) => ["yes", "no"].includes(v), "Please indicate shift availability"),
  unavailableTimes: z.string().max(500).optional().or(z.literal("")),
  // Experience
  volunteeredBefore: z.string().refine((v) => ["yes", "no"].includes(v), "Please indicate prior volunteering"),
  priorRoleYear:   z.string().max(200).optional().or(z.literal("")),
  relevantExperience: z.string().max(1000).optional().or(z.literal("")),
  physicalConsiderations: z.string().max(1000).optional().or(z.literal("")),
  notes:           z.string().max(2000).optional().or(z.literal("")),
  // Agreement
  applicantName:   z.string().min(2, "Please type your full name").max(200),
  agreed:          z.literal(true, { message: "You must agree to the terms" }),
  // Honeypot — must be empty
  website_confirm: z.string().max(0).optional(),
});

// ── Handler ───────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in an hour." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Honeypot
    const raw = body as Record<string, unknown>;
    if (raw.website_confirm && String(raw.website_confirm).length > 0) {
      return NextResponse.json({ success: true });
    }

    const result = VolunteerSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        errors[key] = issue.message;
      }
      return NextResponse.json({ errors }, { status: 422 });
    }

    const data = result.data;

    // Email match
    if (data.email.toLowerCase() !== data.confirmEmail.toLowerCase()) {
      return NextResponse.json(
        { errors: { confirmEmail: "Email addresses do not match." } },
        { status: 422 }
      );
    }

    // Validate that availableDays values are all recognized
    const invalidDays = data.availableDays.filter((d) => !VALID_DAYS.includes(d));
    if (invalidDays.length > 0) {
      return NextResponse.json(
        { errors: { availableDays: "Invalid day selection." } },
        { status: 422 }
      );
    }

    const preferredAreaLabel = AREA_LABELS[data.preferredArea] ?? data.preferredArea;

    // Capitalize day names for display
    const displayDays = data.availableDays.map(
      (d) => d.charAt(0).toUpperCase() + d.slice(1)
    );

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "long",
      timeStyle: "short",
    });

    // ── Send emails ──────────────────────────────────────────────────
    const resendKey      = process.env.RESEND_API_KEY;
    const fromEmail      = process.env.RESEND_FROM_EMAIL ?? "noreply@wtsfair.com";
    const recipientEmail = process.env.VOLUNTEER_FORM_RECIPIENT_EMAIL
                        ?? process.env.PARTNERSHIP_FORM_RECIPIENT_EMAIL;

    if (!resendKey) {
      console.error("[volunteer-api] RESEND_API_KEY not set");
      return NextResponse.json(
        { error: "Email service not configured. Please contact the fair directly." },
        { status: 503 }
      );
    }
    if (!recipientEmail) {
      console.error("[volunteer-api] VOLUNTEER_FORM_RECIPIENT_EMAIL not set");
      return NextResponse.json(
        { error: "Recipient email not configured. Please contact the fair directly." },
        { status: 503 }
      );
    }

    const resend = new Resend(resendKey);

    const notifEmail = buildVolunteerNotificationEmail({
      submittedAt,
      personal: {
        fullName: data.fullName,
        ageGroup: data.ageGroup,
        email:    data.email,
        phone:    data.phone,
        address:  data.address,
        city:     data.city,
        state:    data.state,
        zip:      data.zip,
      },
      interest: {
        preferredAreaLabel,
        otherExplanation: data.otherExplanation || undefined,
      },
      availability: {
        availableDays:      displayDays,
        preferredStartTime: data.preferredStartTime || undefined,
        preferredEndTime:   data.preferredEndTime || undefined,
        multipleShifts:     data.multipleShifts,
        unavailableTimes:   data.unavailableTimes || undefined,
      },
      experience: {
        volunteeredBefore:    data.volunteeredBefore,
        priorRoleYear:        data.priorRoleYear || undefined,
        relevantExperience:   data.relevantExperience || undefined,
        physicalConsiderations: data.physicalConsiderations || undefined,
        notes:                data.notes || undefined,
      },
      applicantName: data.applicantName,
    });

    const confEmail = buildVolunteerConfirmationEmail({
      submittedAt,
      applicantName:     data.applicantName,
      fullName:          data.fullName,
      email:             data.email,
      preferredAreaLabel,
      availableDays:     displayDays,
    });

    const [notifyResult, confirmResult] = await Promise.allSettled([
      resend.emails.send({
        from:    fromEmail,
        to:      recipientEmail,
        subject: notifEmail.subject,
        html:    notifEmail.html,
        text:    notifEmail.text,
        replyTo: data.email,
      }),
      resend.emails.send({
        from:    fromEmail,
        to:      data.email,
        subject: confEmail.subject,
        html:    confEmail.html,
        text:    confEmail.text,
      }),
    ]);

    if (notifyResult.status === "rejected") {
      console.error("[volunteer-api] Fair notification failed:", notifyResult.reason);
      return NextResponse.json(
        { error: "Failed to send your form. Please try again or contact us directly." },
        { status: 502 }
      );
    }
    if (confirmResult.status === "rejected") {
      console.warn("[volunteer-api] Applicant confirmation failed:", confirmResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[volunteer-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
