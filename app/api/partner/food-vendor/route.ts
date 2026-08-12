/**
 * Food Vendor Inquiry API Route
 *
 * Handles the minimal contact form in the Food Vendors section.
 * Sends the same inquiry to ALL Food Vendor Coordinators with Reply-To
 * set to the inquirer's email so coordinators can reply directly.
 *
 * Completely separate from the Commercial Vendor application route.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { buildFoodVendorInquiryEmail } from "@/lib/emails/food-vendor-inquiry";
import { FOOD_VENDOR_COORDINATORS } from "@/lib/vendor-config";
import { checkRateLimit } from "@/lib/rate-limit";

// ── Validation ────────────────────────────────────────────────────────
const FoodVendorInquirySchema = z.object({
  name:         z.string().min(1, "Name is required").max(200),
  businessName: z.string().min(1, "Business or food vendor name is required").max(200),
  email:        z.string().email("Invalid email address").max(200),
  phone:        z.string().max(50).optional().or(z.literal("")),
  message:      z
    .string()
    .min(10, "Please describe what you sell (at least 10 characters)")
    .max(2000),
  // Honeypot — must be empty
  website_confirm: z.string().max(0).optional(),
});

// ── Handler ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 inquiries per hour per IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = await checkRateLimit(ip, "food_vendor_inquiry", 3, 60 * 60 * 1000);
    if (!rl.success) {
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

    // Honeypot check
    const raw = body as Record<string, unknown>;
    if (raw.website_confirm && String(raw.website_confirm).length > 0) {
      return NextResponse.json({ success: true });
    }

    // Validate
    const result = FoodVendorInquirySchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        errors[key] = issue.message;
      }
      return NextResponse.json({ errors }, { status: 422 });
    }

    const data = result.data;

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "long",
      timeStyle: "short",
    });

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "noreply@wtsfair.com";

    if (!resendKey) {
      console.error("[food-vendor-api] RESEND_API_KEY not set");
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please contact the fair directly.",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(resendKey);

    // Both coordinators receive the identical inquiry.
    // Reply-To is the inquirer's email — coordinators hit Reply to respond directly.
    const coordinatorEmails = FOOD_VENDOR_COORDINATORS.map((c) => c.email);

    const inquiry = buildFoodVendorInquiryEmail({
      name:         data.name,
      businessName: data.businessName,
      email:        data.email,
      phone:        data.phone ?? "",
      message:      data.message,
      submittedAt,
    });

    const notifyResult = await resend.emails.send({
      from:    fromEmail,
      to:      coordinatorEmails,
      subject: inquiry.subject,
      html:    inquiry.html,
      text:    inquiry.text,
      replyTo: data.email,
    });

    if ("error" in notifyResult && notifyResult.error) {
      console.error("[food-vendor-api] Resend error:", notifyResult.error);
      return NextResponse.json(
        {
          error:
            "Failed to send your inquiry. Please try again or contact us directly.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[food-vendor-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
