import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  GOT_TALENT_REGISTRATION_ENABLED,
  GOT_TALENT_DIVISIONS,
  getDivisionForAge,
  calcAgeYears,
  type GotTalentDivisionId,
} from "@/lib/got-talent-config";

const phoneRegex = /^[\d\s\-\(\)\+\.]{7,20}$/;

const AdditionalPerformerSchema = z.object({
  name: z.string().min(1).max(100),
  age_years: z.number().int().min(0).max(120),
});

const RegisterSchema = z.object({
  // Act
  act_name: z.string().min(1).max(200),
  act_type: z.string().min(1).max(100),
  act_description: z.string().max(500).optional(),
  instrument_ack: z.literal(true, { message: "Please acknowledge the band and sound system policy." }),
  is_group: z.boolean(),
  performer_count: z.number().int().min(1).max(50),
  // Primary performer
  primary_performer_name: z.string().min(1).max(200),
  primary_performer_dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  // Additional performers (group only)
  additional_performers: z.array(AdditionalPerformerSchema).max(49).default([]),
  // Music
  requires_music: z.boolean(),
  // Contact
  contact_name: z.string().min(1).max(200),
  contact_email: z.string().email(),
  confirm_contact_email: z.string().email(),
  contact_phone: z.string().regex(phoneRegex, "Invalid phone number"),
  // Honeypot
  website: z.string().max(0).optional(),
}).refine((d) => d.act_type !== "Other" || (d.act_description && d.act_description.trim().length > 0), {
  message: "Please describe your talent when selecting Other.",
  path: ["act_description"],
}).refine((d) => d.contact_email === d.confirm_contact_email, {
  message: "Email addresses do not match",
  path: ["confirm_contact_email"],
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit — 3 registrations per IP per hour
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(ip, "got-talent-register", 3, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  // 2. Parse body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Honeypot check
  if (
    typeof rawBody === "object" &&
    rawBody !== null &&
    (rawBody as Record<string, unknown>).website
  ) {
    return NextResponse.json({ success: true });
  }

  // 4. Master switch
  if (!GOT_TALENT_REGISTRATION_ENABLED) {
    return NextResponse.json(
      { error: "Registration is not currently open." },
      { status: 503 }
    );
  }

  // 5. Validate
  const parsed = RegisterSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // 6. Check Supabase settings
  const supabase = createAdminClient();
  const { data: settings, error: settingsError } = await supabase
    .from("got_talent_settings")
    .select("registration_open, entry_fee_cents, registration_closes_at")
    .eq("id", 1)
    .single();

  if (settingsError || !settings) {
    console.error("Failed to fetch got_talent_settings:", settingsError);
    return NextResponse.json(
      { error: "Registration system temporarily unavailable." },
      { status: 503 }
    );
  }

  if (!settings.registration_open) {
    return NextResponse.json(
      { error: "Registration is not currently open." },
      { status: 503 }
    );
  }

  const now = new Date();
  if (settings.registration_closes_at && now > new Date(settings.registration_closes_at as string)) {
    return NextResponse.json({ error: "Registration has closed." }, { status: 503 });
  }

  // 7. Auto-assign division from primary performer DOB
  const primaryAge = calcAgeYears(data.primary_performer_dob, now);
  const division: GotTalentDivisionId = getDivisionForAge(primaryAge);
  const divisionConfig = GOT_TALENT_DIVISIONS.find((d: { id: string }) => d.id === division)!;

  // 8. Check for division conflict in group
  let divisionConflict = false;
  if (data.is_group && data.additional_performers.length > 0) {
    for (const p of data.additional_performers) {
      const pDiv = getDivisionForAge(p.age_years);
      if (pDiv !== division) {
        divisionConflict = true;
        break;
      }
    }
  }

  // 9. Validate performer_count consistency
  const expectedCount = data.is_group
    ? 1 + (data.additional_performers?.length ?? 0)
    : 1;
  if (data.performer_count !== expectedCount) {
    return NextResponse.json(
      { error: "Performer count does not match the number of performers listed." },
      { status: 422 }
    );
  }

  // 10. Payment deadline — use settings value if set, else fail closed
  if (!settings.registration_closes_at) {
    console.error("got_talent_settings.registration_closes_at is not set — cannot accept registrations");
    return NextResponse.json(
      { error: "Registration system temporarily unavailable." },
      { status: 503 }
    );
  }
  const paymentDeadline = new Date(settings.registration_closes_at as string);

  // 11. Generate resume token
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  // 12. Insert registration
  const { data: registration, error: insertError } = await supabase
    .from("got_talent_registrations")
    .insert({
      act_name: data.act_name,
      act_type: data.act_type,
      act_description: data.act_type === "Other" ? (data.act_description ?? null) : null,
      instrument_ack: data.instrument_ack,
      is_group: data.is_group,
      performer_count: data.performer_count,
      primary_performer_name: data.primary_performer_name,
      primary_performer_dob: data.primary_performer_dob,
      additional_performers: data.additional_performers,
      division,
      division_conflict: divisionConflict,
      requires_music: data.requires_music,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      status: "PAYMENT_PENDING",
      entry_fee_cents: settings.entry_fee_cents,
      payment_deadline: paymentDeadline.toISOString(),
      resume_token_hash: tokenHash,
    })
    .select("id, entry_fee_cents, payment_deadline")
    .single();

  if (insertError || !registration) {
    console.error("Failed to insert got_talent registration:", insertError);
    return NextResponse.json(
      { error: "Failed to create registration. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    registrationId: registration.id,
    resumeToken: rawToken,
    amountCents: registration.entry_fee_cents,
    paymentDeadline: registration.payment_deadline,
    division,
    divisionLabel: divisionConfig.label,
    performanceDate: divisionConfig.performanceDate,
    performanceTime: divisionConfig.performanceTime,
    divisionConflict,
  });
}
