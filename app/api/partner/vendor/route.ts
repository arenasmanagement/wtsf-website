import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { buildVendorNotificationEmail } from "@/lib/emails/vendor-notification";
import { buildVendorConfirmationEmail } from "@/lib/emails/vendor-confirmation";
import {
  getCategoryById,
  getBoothSizeById,
  calculateVendorCost,
  VENDOR_PAYMENT_DEADLINE,
  VENDOR_CATEGORIES,
} from "@/lib/vendor-config";
import { checkRateLimit } from "@/lib/rate-limit";

// ── Validation ────────────────────────────────────────────────────────
const validCategoryIds = VENDOR_CATEGORIES.map((c) => c.id);
const validElectrical  = ["none", "20amp", "30amp", "50amp"];

const VendorSchema = z.object({
  // Business
  businessName:      z.string().min(1, "Business name is required").max(200),
  ownerOrAgent:      z.string().min(1, "Owner or agent name is required").max(200),
  email:             z.string().email("Invalid email address").max(200),
  confirmEmail:      z.string().email("Invalid email").max(200),
  phone:             z.string().regex(/^[\d\s\-\(\)\+\.]{7,20}$/, "Invalid phone number"),
  address:           z.string().min(1, "Address is required").max(300),
  city:              z.string().min(1, "City is required").max(100),
  state:             z.string().length(2, "State must be 2 characters").toUpperCase(),
  zip:               z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  website:           z.string().max(300).optional().or(z.literal("")),
  socialMedia:       z.string().max(300).optional().or(z.literal("")),
  // Vendor info
  businessType:      z.string().min(1, "Business type is required").max(200),
  productDescription: z.string().min(10, "Please provide a product description (min 10 characters)").max(2000),
  itemsSold:         z.string().min(5, "Please list items to be sold").max(2000),
  isFood:            z.string().refine((v) => ["yes", "no"].includes(v), "Please indicate if you are a food vendor"),
  cookingOnSite:     z.string().refine((v) => ["yes", "no"].includes(v), "Please indicate if you cook on site"),
  insideOrOutside:   z.string().refine((v) => ["inside", "outside", "no_preference"].includes(v), "Please select a placement preference"),
  categoryId:        z.string().min(1, "Please select a booth category")
                       .refine((v) => validCategoryIds.includes(v), "Invalid booth category"),
  sizeId:            z.string().min(1, "Please select a booth size"),
  numberOfSpaces:    z.string().max(50).optional().or(z.literal("")),
  placementRequest:  z.string().max(500).optional().or(z.literal("")),
  // Insurance
  hasInsuranceBinder: z.boolean(),
  insuranceAckRequired: z.boolean().optional(),
  // Electrical
  electricalService: z.string().refine((v) => validElectrical.includes(v), "Please select electrical service"),
  // Cord
  hasCord:           z.boolean(),
  cordAckRequired:   z.boolean().optional(),
  // Cleanup
  cleanupDepositAck: z.boolean().optional(),
  // Additional
  trailerDimensions:     z.string().max(200).optional().or(z.literal("")),
  waterNeeded:           z.string().max(200).optional().or(z.literal("")),
  vehicleInfo:           z.string().max(500).optional().or(z.literal("")),
  specialAccommodations: z.string().max(1000).optional().or(z.literal("")),
  notes:                 z.string().max(2000).optional().or(z.literal("")),
  // Agreement
  applicantName:         z.string().min(2, "Please type your full name").max(200),
  agreed:                z.literal(true, { message: "You must agree to the terms" }),
  // Honeypot
  website_confirm:       z.string().max(0).optional(),
});

// ── Handler ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = await checkRateLimit(ip, "vendor_form", 3, 60 * 60 * 1000);
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

    // Honeypot
    const raw = body as Record<string, unknown>;
    if (raw.website_confirm && String(raw.website_confirm).length > 0) {
      return NextResponse.json({ success: true });
    }

    const result = VendorSchema.safeParse(body);
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

    // Validate category + size
    const category = getCategoryById(data.categoryId);
    const size = category ? getBoothSizeById(data.categoryId, data.sizeId) : undefined;
    if (!category || !size) {
      return NextResponse.json(
        { errors: { sizeId: "Selected booth category or size is invalid." } },
        { status: 422 }
      );
    }

    // Validate acknowledgments
    if (!data.hasInsuranceBinder && data.insuranceAckRequired !== true) {
      return NextResponse.json(
        { errors: { insuranceAckRequired: "Please acknowledge the $100 insurance coverage charge." } },
        { status: 422 }
      );
    }
    if (!data.hasCord && data.electricalService !== "none" && data.cordAckRequired !== true) {
      return NextResponse.json(
        { errors: { cordAckRequired: "Please acknowledge the $50 cord charge." } },
        { status: 422 }
      );
    }
    if (category.requiresCleanupDeposit && data.cleanupDepositAck !== true) {
      return NextResponse.json(
        { errors: { cleanupDepositAck: "Please acknowledge the refundable $100 cleanup deposit." } },
        { status: 422 }
      );
    }

    // Calculate cost (server-side, authoritative)
    const cost = calculateVendorCost({
      categoryId:         data.categoryId,
      sizeId:             data.sizeId,
      hasInsuranceBinder: data.hasInsuranceBinder,
      electricalService:  data.electricalService,
      hasCord:            data.hasCord,
    });

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "long",
      timeStyle: "short",
    });

    // ── Send emails ──────────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@wtsfair.com";

    // Food vendors → upnjump@gmail.com; regular vendors → luke.weaver16@yahoo.com
    const isFoodVendor = data.isFood === "yes";
    const recipientEmail = isFoodVendor
      ? (process.env.FOOD_VENDOR_FORM_RECIPIENT_EMAIL ?? "upnjump@gmail.com")
      : (process.env.VENDOR_FORM_RECIPIENT_EMAIL      ?? "luke.weaver16@yahoo.com");

    if (!resendKey) {
      console.error("[vendor-api] RESEND_API_KEY not set");
      return NextResponse.json({ error: "Email service not configured. Please contact the fair directly." }, { status: 503 });
    }

    const resend = new Resend(resendKey);

    const electricalLabel: Record<string, string> = {
      none: "None", "20amp": "20 Amp", "30amp": "30 Amp", "50amp": "50 Amp",
    };
    const insideOutsideLabel: Record<string, string> = {
      inside: "Inside", outside: "Outside", no_preference: "No Preference",
    };

    const notifEmail = buildVendorNotificationEmail({
      submittedAt,
      business: {
        name:         data.businessName,
        ownerOrAgent: data.ownerOrAgent,
        email:        data.email,
        phone:        data.phone,
        address:      data.address,
        city:         data.city,
        state:        data.state,
        zip:          data.zip,
        website:      data.website || undefined,
        socialMedia:  data.socialMedia || undefined,
      },
      vendor: {
        businessType:      data.businessType,
        productDescription: data.productDescription,
        itemsSold:         data.itemsSold,
        isFood:            data.isFood === "yes" ? "Yes" : "No",
        cookingOnSite:     data.cookingOnSite === "yes" ? "Yes" : "No",
        insideOrOutside:   insideOutsideLabel[data.insideOrOutside] ?? data.insideOrOutside,
        categoryName:      category.name,
        boothSize:         size.label,
        boothPrice:        size.price,
        numberOfSpaces:    data.numberOfSpaces || undefined,
        placementRequest:  data.placementRequest || undefined,
      },
      fees: {
        hasInsuranceBinder: data.hasInsuranceBinder,
        electricalService:  electricalLabel[data.electricalService] ?? data.electricalService,
        hasCord:            data.hasCord,
      },
      cost,
      additional: {
        trailerDimensions:     data.trailerDimensions || undefined,
        waterNeeded:           data.waterNeeded || undefined,
        vehicleInfo:           data.vehicleInfo || undefined,
        specialAccommodations: data.specialAccommodations || undefined,
        notes:                 data.notes || undefined,
      },
      applicantName: data.applicantName,
    });

    const confEmail = buildVendorConfirmationEmail({
      submittedAt,
      applicantName: data.applicantName,
      businessName:  data.businessName,
      email:         data.email,
      categoryName:  category.name,
      boothSize:     size.label,
      cost,
      paymentDeadline: VENDOR_PAYMENT_DEADLINE.label,
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
      console.error("[vendor-api] Fair notification failed:", notifyResult.reason);
      return NextResponse.json(
        { error: "Failed to send your application. Please try again or contact us directly." },
        { status: 502 }
      );
    }
    if (confirmResult.status === "rejected") {
      console.warn("[vendor-api] Applicant confirmation failed:", confirmResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[vendor-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
