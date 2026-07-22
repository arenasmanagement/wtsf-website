import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { buildSponsorNotificationEmail } from "@/lib/emails/sponsor-notification";
import { buildSponsorConfirmationEmail } from "@/lib/emails/sponsor-confirmation";
import { SPONSOR_PACKAGES, CUSTOM_SPONSORSHIP_OPTION } from "@/lib/sponsor-config";
import { FAIR_CONFIG } from "@/lib/fair-config";

// ── Rate limiting (in-memory, resets on cold start) ─────────────────
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

// ── Validation ───────────────────────────────────────────────────────
const validPackageIds = [
  ...SPONSOR_PACKAGES.map((p) => p.id),
  CUSTOM_SPONSORSHIP_OPTION.id,
];

const SponsorSchema = z.object({
  businessName:         z.string().min(1, "Business name is required").max(200),
  contactPerson:        z.string().min(1, "Contact person is required").max(200),
  email:                z.string().email("Invalid email address").max(200),
  confirmEmail:         z.string().email("Invalid email").max(200),
  phone:                z.string().regex(/^[\d\s\-\(\)\+\.]{7,20}$/, "Invalid phone number"),
  address:              z.string().min(1, "Address is required").max(300),
  city:                 z.string().min(1, "City is required").max(100),
  state:                z.string().length(2, "State must be 2 characters").toUpperCase(),
  zip:                  z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  website:              z.string().max(300).optional().or(z.literal("")),
  socialMedia:          z.string().max(300).optional().or(z.literal("")),
  packageId:            z.string().min(1, "Please select a sponsorship package")
                          .refine((v) => validPackageIds.includes(v), "Invalid package selected"),
  businessDescription:  z.string().max(2000).optional().or(z.literal("")),
  logoAvailable:        z.string().max(100).optional().or(z.literal("")),
  additionalInterests:  z.string().max(1000).optional().or(z.literal("")),
  preferredContact:     z.string().max(100).optional().or(z.literal("")),
  notes:                z.string().max(2000).optional().or(z.literal("")),
  applicantName:        z.string().min(2, "Please type your full name").max(200),
  agreed:               z.literal(true, { message: "You must agree to the terms" }),
  // Honeypot — must be empty
  website_confirm:      z.string().max(0).optional(),
});

// ── Handler ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in an hour." },
        { status: 429 }
      );
    }

    // Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Honeypot check
    const raw = body as Record<string, unknown>;
    if (raw.website_confirm && String(raw.website_confirm).length > 0) {
      // Silent reject — bots filling honeypot
      return NextResponse.json({ success: true });
    }

    // Validate
    const result = SponsorSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        errors[key] = issue.message;
      }
      return NextResponse.json({ errors }, { status: 422 });
    }

    const data = result.data;

    // Email confirmation check
    if (data.email.toLowerCase() !== data.confirmEmail.toLowerCase()) {
      return NextResponse.json(
        { errors: { confirmEmail: "Email addresses do not match." } },
        { status: 422 }
      );
    }

    // Resolve package
    const pkg =
      SPONSOR_PACKAGES.find((p) => p.id === data.packageId) ??
      (data.packageId === CUSTOM_SPONSORSHIP_OPTION.id ? CUSTOM_SPONSORSHIP_OPTION : null);
    if (!pkg) {
      return NextResponse.json({ errors: { packageId: "Invalid package selected." } }, { status: 422 });
    }

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "long",
      timeStyle: "short",
    });

    // ── Send emails ──────────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? `noreply@${FAIR_CONFIG.name.toLowerCase().replace(/\s+/g, "")}.com`;
    const recipientEmail = process.env.PARTNERSHIP_FORM_RECIPIENT_EMAIL;

    if (!resendKey) {
      console.error("[sponsor-api] RESEND_API_KEY not set");
      return NextResponse.json({ error: "Email service not configured. Please contact the fair directly." }, { status: 503 });
    }
    if (!recipientEmail) {
      console.error("[sponsor-api] PARTNERSHIP_FORM_RECIPIENT_EMAIL not set");
      return NextResponse.json({ error: "Recipient email not configured. Please contact the fair directly." }, { status: 503 });
    }

    const resend = new Resend(resendKey);

    const notificationEmail = buildSponsorNotificationEmail({
      submittedAt,
      business: {
        name:          data.businessName,
        contactPerson: data.contactPerson,
        email:         data.email,
        phone:         data.phone,
        address:       data.address,
        city:          data.city,
        state:         data.state,
        zip:           data.zip,
        website:       data.website || undefined,
        socialMedia:   data.socialMedia || undefined,
      },
      package: { name: pkg.name, price: "priceMin" in pkg ? `$${pkg.priceMin.toLocaleString()}+` : (pkg as typeof CUSTOM_SPONSORSHIP_OPTION).price },
      businessDescription:  data.businessDescription || undefined,
      logoAvailable:        data.logoAvailable || undefined,
      additionalInterests:  data.additionalInterests || undefined,
      preferredContact:     data.preferredContact || undefined,
      notes:                data.notes || undefined,
      applicantName:        data.applicantName,
    });

    const confirmationEmail = buildSponsorConfirmationEmail({
      submittedAt,
      applicantName: data.applicantName,
      businessName:  data.businessName,
      email:         data.email,
      packageName:   pkg.name,
      packagePrice:  "priceMin" in pkg && pkg.priceMin > 0 ? `$${pkg.priceMin.toLocaleString()}+` : "Contact us",
      notes:         data.notes || undefined,
    });

    const [notifyResult, confirmResult] = await Promise.allSettled([
      resend.emails.send({
        from:    fromEmail,
        to:      recipientEmail,
        subject: notificationEmail.subject,
        html:    notificationEmail.html,
        text:    notificationEmail.text,
        replyTo: data.email,
      }),
      resend.emails.send({
        from:    fromEmail,
        to:      data.email,
        subject: confirmationEmail.subject,
        html:    confirmationEmail.html,
        text:    confirmationEmail.text,
      }),
    ]);

    // If the notification to the fair failed, that's a hard error
    if (notifyResult.status === "rejected") {
      console.error("[sponsor-api] Fair notification failed:", notifyResult.reason);
      return NextResponse.json(
        { error: "Failed to send your application. Please try again or contact us directly." },
        { status: 502 }
      );
    }

    // Confirmation email failure is logged but not blocking
    if (confirmResult.status === "rejected") {
      console.warn("[sponsor-api] Applicant confirmation failed:", confirmResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[sponsor-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
