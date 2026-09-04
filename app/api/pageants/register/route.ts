import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { PAGEANT_DIVISIONS, PAGEANT_REGISTRATION_ENABLED, AGE_REFERENCE_DATE } from "@/lib/pageant-config";

const phoneRegex = /^[\d\s\-\(\)\+\.]{7,20}$/;

const RegisterSchema = z.object({
  division_id: z.string().min(1),
  contestant_first_name: z.string().min(1).max(100),
  contestant_last_name: z.string().min(1).max(100),
  contestant_dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  contestant_school: z.string().max(100).optional(),
  contestant_grade: z.string().max(50).optional(),
  contestant_hair_color: z.string().max(50).optional(),
  contestant_eye_color: z.string().max(50).optional(),
  contestant_hobbies: z.string().max(500).optional(),
  contestant_ambitions: z.string().max(500).optional(),
  guardian_name: z.string().min(1).max(200),
  guardian_relationship: z.string().max(100).optional(),
  guardian_address: z.string().min(1).max(200),
  guardian_city: z.string().min(1).max(100),
  guardian_state: z.string().length(2),
  guardian_zip: z.string().regex(/^\d{5}(-\d{4})?$/),
  guardian_phone: z.string().regex(phoneRegex, "Invalid phone number"),
  guardian_email: z.string().email(),
  confirm_guardian_email: z.string().email(),
  rules_agreed: z.literal(true),
  media_release_agreed: z.literal(true),
  rules_version: z.enum(["2026-general", "2026-junior"]),
  website: z.string().max(0).optional(), // honeypot
}).refine((d) => d.guardian_email === d.confirm_guardian_email, {
  message: "Email addresses do not match",
  path: ["confirm_guardian_email"],
});

function calculateAgeMonths(dob: string): number {
  const dobDate = new Date(dob);
  const ref = AGE_REFERENCE_DATE ? new Date(AGE_REFERENCE_DATE) : new Date();
  return (
    (ref.getFullYear() - dobDate.getFullYear()) * 12 +
    (ref.getMonth() - dobDate.getMonth())
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(ip, "pageant-register", 3, 60 * 60 * 1000);
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
    return NextResponse.json({ success: true }); // silent reject
  }

  // 4. Master switch
  if (!PAGEANT_REGISTRATION_ENABLED) {
    return NextResponse.json(
      { error: "Registration is not currently open." },
      { status: 503 }
    );
  }

  // 5. Zod validation
  const parsed = RegisterSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // 6. Division check
  const division = PAGEANT_DIVISIONS.find((d) => d.id === data.division_id);
  if (!division) {
    return NextResponse.json({ error: "Invalid division" }, { status: 422 });
  }

  // 7a. Server-side DOB age validation
  const ageMonthsCheck = calculateAgeMonths(data.contestant_dob);
  if (ageMonthsCheck < division.ageMinMonths || ageMonthsCheck > division.ageMaxMonths) {
    return NextResponse.json(
      { error: `Contestant age does not meet the requirement for ${division.name} (${division.ageLabel} as of October 17, 2026).` },
      { status: 422 }
    );
  }

  // 7b. Division-based required field enforcement
  const showSchoolGrade = division.ageMinMonths >= 48;
  const showHobbies     = division.ageMinMonths >= 24;
  const showAmbitions   = division.ageMinMonths >= 48;
  if (!data.contestant_hair_color?.trim()) {
    return NextResponse.json({ error: "Hair color is required." }, { status: 422 });
  }
  if (!data.contestant_eye_color?.trim()) {
    return NextResponse.json({ error: "Eye color is required." }, { status: 422 });
  }
  if (showSchoolGrade && !data.contestant_school?.trim()) {
    return NextResponse.json({ error: "School is required for this division." }, { status: 422 });
  }
  if (showSchoolGrade && !data.contestant_grade?.trim()) {
    return NextResponse.json({ error: "Grade is required for this division." }, { status: 422 });
  }
  if (showHobbies && !data.contestant_hobbies?.trim()) {
    return NextResponse.json({ error: "Hobbies are required for this division." }, { status: 422 });
  }
  if (showAmbitions && !data.contestant_ambitions?.trim()) {
    return NextResponse.json({ error: "Ambitions/goals are required for this division." }, { status: 422 });
  }

  // 7. Check Supabase settings
  const supabase = createAdminClient();
  const { data: settings, error: settingsError } = await supabase
    .from("pageant_settings")
    .select("registration_open, registration_opens_at, registration_closes_at, payment_grace_days, entry_fee_cents")
    .eq("fair_year", 2026)
    .single();

  if (settingsError || !settings) {
    console.error("Failed to fetch pageant settings:", settingsError);
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
  if (settings.registration_opens_at && now < new Date(settings.registration_opens_at)) {
    return NextResponse.json({ error: "Registration has not opened yet." }, { status: 503 });
  }
  if (settings.registration_closes_at && now > new Date(settings.registration_closes_at)) {
    return NextResponse.json({ error: "Registration has closed." }, { status: 503 });
  }

  // 8. Payment deadline = registration_closes_at (payment IS registration completion; no grace period)
  // FAIL CLOSED: if registration_closes_at is not configured, refuse registration entirely.
  if (!settings.registration_closes_at) {
    console.error("FATAL: registration_closes_at not configured in pageant_settings for fair_year=2026");
    return NextResponse.json(
      { error: "Registration system configuration error. Please contact wtsfpageant@outlook.com." },
      { status: 503 }
    );
  }
  const paymentDeadline = new Date(settings.registration_closes_at);

  // 9. Generate resume token
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  // 10. Age in months (already validated above)
  const ageMonths = ageMonthsCheck;

  // 11. Insert registration
  const { data: registration, error: insertError } = await supabase
    .from("pageant_registrations")
    .insert({
      fair_year: 2026,
      division_id: data.division_id,
      division_name: division.name,
      status: "PAYMENT_PENDING",
      contestant_first_name: data.contestant_first_name,
      contestant_last_name: data.contestant_last_name,
      contestant_dob: data.contestant_dob,
      contestant_age_months: ageMonths,
      contestant_school: data.contestant_school ?? null,
      contestant_grade: data.contestant_grade ?? null,
      contestant_hair_color: data.contestant_hair_color ?? null,
      contestant_eye_color: data.contestant_eye_color ?? null,
      contestant_hobbies: data.contestant_hobbies ?? null,
      contestant_ambitions: data.contestant_ambitions ?? null,
      guardian_name: data.guardian_name,
      guardian_relationship: data.guardian_relationship ?? null,
      guardian_address: data.guardian_address,
      guardian_city: data.guardian_city,
      guardian_state: data.guardian_state,
      guardian_zip: data.guardian_zip,
      guardian_phone: data.guardian_phone,
      guardian_email: data.guardian_email,
      rules_agreed: data.rules_agreed,
      media_release_agreed: data.media_release_agreed,
      rules_version: data.rules_version,
      acknowledged_at: now.toISOString(),
      amount_cents: null, // Not stored at registration — always recalculated server-side at payment time
      payment_deadline: paymentDeadline.toISOString(),
      resume_token_hash: tokenHash,
      ip_address: ip,
      user_agent: request.headers.get("user-agent") ?? null,
    })
    .select("id, amount_cents, payment_deadline")
    .single();

  if (insertError || !registration) {
    console.error("Failed to insert pageant registration:", insertError);
    return NextResponse.json(
      { error: "Failed to create registration. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    registrationId: registration.id,
    resumeToken: rawToken,
    amountCents: registration.amount_cents,
    paymentDeadline: registration.payment_deadline,
  });
}
