import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createFemAdminClient } from "@/lib/supabase/fem";
import { checkRateLimit } from "@/lib/rate-limit";
import { FAIR_NOTIFICATION_EMAILS } from "@/lib/exhibit-config";

// ── Entry code generation ────────────────────────────────────────────────────
// Unambiguous charset: no 0/O, no 1/I
const ENTRY_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomEntryCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ENTRY_CODE_CHARS[Math.floor(Math.random() * ENTRY_CODE_CHARS.length)];
  }
  return code;
}

async function uniqueEntryCode(
  fem: ReturnType<typeof createFemAdminClient>,
  fairId: string
): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = randomEntryCode();
    const { count } = await fem
      .from("entries")
      .select("id", { count: "exact", head: true })
      .eq("entry_code", code)
      .eq("fair_id", fairId);
    if ((count ?? 1) === 0) return code;
  }
  throw new Error("Unable to generate a unique entry code after 20 attempts");
}

// ── Validation schemas ───────────────────────────────────────────────────────
const EntrySchema = z.object({
  department_id: z.string().uuid("Invalid department"),
  class_id:      z.string().uuid("Invalid class"),
  lot_id:        z.string().uuid("Invalid lot"),
});

const RegistrationSchema = z.object({
  first_name:     z.string().min(1, "First name is required").max(100).trim(),
  last_name:      z.string().min(1, "Last name is required").max(100).trim(),
  email:          z.string().email("Invalid email").max(200),
  confirm_email:  z.string().email(),
  phone:          z.string().regex(/^[\d\s\-\(\)\+\.]{7,20}$/, "Invalid phone number"),
  address:        z.string().min(1, "Address is required").max(200).trim(),
  city:           z.string().min(1, "City is required").max(100).trim(),
  state:          z.string().length(2, "State must be 2 characters").toUpperCase(),
  zip:            z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  entrant_type:   z.enum(["adult", "youth"]),
  youth_age:      z.number().int().min(1).max(17).optional().nullable(),
  guardian_name:  z.string().max(200).optional().nullable(),
  guardian_phone: z.string().max(30).optional().nullable(),
  guardian_email: z.string().email().max(200).optional().nullable(),
  entries:        z.array(EntrySchema).min(1, "At least one exhibit entry is required").max(50),
  rules_agreed:   z.literal(true, { message: "You must agree to the rules to register." }),
  website:        z.string().max(0).optional(), // honeypot
});

type RegInput = z.infer<typeof RegistrationSchema>;
type EntryLine = { department: string; className: string; lot: string };

// ── GET — open/closed status + catalog ──────────────────────────────────────
export async function GET() {
  try {
    const fem = createFemAdminClient();

    const { data: fair, error: fairError } = await fem
      .from("fairs")
      .select("id, organization_id, settings")
      .eq("is_current", true)
      .single();

    if (fairError || !fair) {
      return NextResponse.json({ enabled: false, comingSoon: true });
    }

    const preregSettings =
      ((fair.settings as Record<string, unknown> | null)?.preregistration as Record<string, unknown>) ?? {};
    const enabled = preregSettings.enabled === true;

    if (!enabled) {
      return NextResponse.json({
        enabled: false,
        comingSoon: true,
        message: (preregSettings.message as string) || null,
      });
    }

    // Deadline-based gate: use the actual settings keys
    const now = new Date();
    const defaultDeadlineUtc    = preregSettings.default_deadline_utc
      ? new Date(preregSettings.default_deadline_utc as string)
      : null;
    const perishableDeadlineUtc = preregSettings.perishable_deadline_utc
      ? new Date(preregSettings.perishable_deadline_utc as string)
      : null;

    const nonPerishableClosed = defaultDeadlineUtc    ? now > defaultDeadlineUtc    : false;
    const perishableClosed    = perishableDeadlineUtc ? now > perishableDeadlineUtc : false;

    // Only show "closed" once BOTH deadlines have passed
    if (nonPerishableClosed && perishableClosed) {
      return NextResponse.json({
        enabled: false,
        closed: true,
        message: (preregSettings.message as string) || null,
      });
    }

    // Fetch full catalog
    const [deptRes, classRes, lotRes] = await Promise.all([
      fem.from("departments").select("id, name, code, sort_order").eq("fair_id", fair.id).order("sort_order"),
      fem.from("classes").select("id, name, code, department_id, sort_order").eq("fair_id", fair.id).order("sort_order"),
      fem.from("lots").select("id, name, code, class_id, sort_order").eq("fair_id", fair.id).order("sort_order"),
    ]);

    // Build nested structure: dept → class → lot
    const lotsByClass: Record<string, { id: string; name: string; code: string | null }[]> = {};
    for (const lot of lotRes.data ?? []) {
      if (!lotsByClass[lot.class_id]) lotsByClass[lot.class_id] = [];
      lotsByClass[lot.class_id]!.push({ id: lot.id, name: lot.name, code: lot.code });
    }

    const classesByDept: Record<string, { id: string; name: string; code: string | null; lots: typeof lotsByClass[string] }[]> = {};
    for (const cls of classRes.data ?? []) {
      if (!classesByDept[cls.department_id]) classesByDept[cls.department_id] = [];
      classesByDept[cls.department_id]!.push({
        id: cls.id, name: cls.name, code: cls.code,
        lots: lotsByClass[cls.id] ?? [],
      });
    }

    const departments = (deptRes.data ?? []).map(dept => ({
      id: dept.id, name: dept.name, code: dept.code,
      classes: classesByDept[dept.id] ?? [],
    }));

    return NextResponse.json({
      enabled: true,
      message: (preregSettings.message as string) || null,
      // Expose deadline info so the form can show per-type status to the user
      deadlines: {
        default_deadline_utc:        preregSettings.default_deadline_utc        ?? null,
        perishable_deadline_utc:     preregSettings.perishable_deadline_utc     ?? null,
        perishable_department_codes: (preregSettings.perishable_department_codes as string[]) ?? [],
      },
      catalog: { departments },
    });
  } catch (err) {
    console.error("GET /api/exhibits/register:", err);
    return NextResponse.json({ enabled: false, comingSoon: true });
  }
}

// ── POST — submit preregistration ────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Rate limit: 5 submissions per IP per hour
  const rl = await checkRateLimit(ip, "exhibits_prereg", 5, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many submissions from this address. Please try again later." },
      { status: 429 }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — bots that fill the hidden "website" field get a fake success
  if (
    typeof raw === "object" && raw !== null &&
    "website" in raw && (raw as Record<string, unknown>).website
  ) {
    return NextResponse.json({ success: true, confirmationNumber: "PR-BOT000" });
  }

  const parsed = RegistrationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data: RegInput = parsed.data;

  if (data.email.toLowerCase() !== data.confirm_email.toLowerCase()) {
    return NextResponse.json({ error: "Email addresses do not match" }, { status: 422 });
  }

  if (data.entrant_type === "youth" && !data.guardian_name?.trim()) {
    return NextResponse.json(
      { error: "Parent or guardian name is required for youth registrations" },
      { status: 422 }
    );
  }

  const fem = createFemAdminClient();

  // Get current fair
  const { data: fair, error: fairError } = await fem
    .from("fairs")
    .select("id, organization_id, settings")
    .eq("is_current", true)
    .single();

  if (fairError || !fair) {
    return NextResponse.json({ error: "Registration system unavailable" }, { status: 503 });
  }

  // Server-side gate: preregistration must be enabled + within date window
  const preregSettings =
    ((fair.settings as Record<string, unknown> | null)?.preregistration as Record<string, unknown>) ?? {};

  if (!preregSettings.enabled) {
    return NextResponse.json(
      { error: "Online pre-registration is not currently open." },
      { status: 403 }
    );
  }

  // Deadline enforcement using the actual settings keys
  const now = new Date();
  const defaultDeadlineUtc    = preregSettings.default_deadline_utc
    ? new Date(preregSettings.default_deadline_utc as string)
    : null;
  const perishableDeadlineUtc = preregSettings.perishable_deadline_utc
    ? new Date(preregSettings.perishable_deadline_utc as string)
    : null;
  const perishableCodes = new Set<string>(
    (preregSettings.perishable_department_codes as string[] | null) ?? []
  );

  // Reject immediately if ALL deadlines have passed
  const nonPerishableClosed = defaultDeadlineUtc    ? now > defaultDeadlineUtc    : false;
  const perishableClosed    = perishableDeadlineUtc ? now > perishableDeadlineUtc : false;
  if (nonPerishableClosed && perishableClosed) {
    return NextResponse.json({ error: "Online pre-registration has closed." }, { status: 403 });
  }

  // Validate all dept/class/lot UUIDs belong to this fair (prevents forged IDs)
  const deptIds  = [...new Set(data.entries.map(e => e.department_id))];
  const classIds = [...new Set(data.entries.map(e => e.class_id))];
  const lotIds   = [...new Set(data.entries.map(e => e.lot_id))];

  const [deptCheck, classCheck, lotCheck] = await Promise.all([
    // Fetch `code` so we can determine perishable vs. non-perishable per entry
    fem.from("departments").select("id, code").eq("fair_id", fair.id).in("id", deptIds),
    fem.from("classes").select("id").eq("fair_id", fair.id).in("id", classIds),
    fem.from("lots").select("id").in("id", lotIds),
  ]);

  const validDepts   = new Set((deptCheck.data  ?? []).map((r: { id: string; code: string | null }) => r.id));
  const validClasses = new Set((classCheck.data ?? []).map((r: { id: string }) => r.id));
  const validLots    = new Set((lotCheck.data   ?? []).map((r: { id: string }) => r.id));

  // dept_id → department code map for deadline enforcement
  const deptCodeMap = new Map<string, string>(
    (deptCheck.data ?? []).map((r: { id: string; code: string | null }) => [r.id, r.code ?? ""])
  );

  for (const entry of data.entries) {
    if (
      !validDepts.has(entry.department_id) ||
      !validClasses.has(entry.class_id) ||
      !validLots.has(entry.lot_id)
    ) {
      return NextResponse.json(
        { error: "One or more selected exhibit categories are invalid." },
        { status: 422 }
      );
    }

    // Per-entry deadline check: perishable departments get the later deadline
    const deptCode     = deptCodeMap.get(entry.department_id) ?? "";
    const isPerishable = perishableCodes.has(deptCode);
    const deadline     = isPerishable ? perishableDeadlineUtc : defaultDeadlineUtc;
    if (deadline && now > deadline) {
      return NextResponse.json(
        {
          error: `The online entry deadline for ${isPerishable ? "perishable" : "non-perishable"} exhibits has passed.`,
        },
        { status: 403 }
      );
    }
  }

  // FIX: Generate all entry codes BEFORE inserting the preregistration record.
  // If any code generation fails, we return 500 with nothing committed and no
  // email sent — prevents the "2-entry confirmation but only 1 entry persisted" bug.
  const entryCodes: string[] = [];
  for (let i = 0; i < data.entries.length; i++) {
    try {
      entryCodes.push(await uniqueEntryCode(fem, fair.id));
    } catch (err) {
      console.error(`Entry code generation failed for entry ${i + 1}:`, err);
      return NextResponse.json(
        { error: "Unable to generate unique entry codes. Please try again." },
        { status: 500 }
      );
    }
  }

  // Find or create exhibitor by email (deduplication)
  const emailLower = data.email.toLowerCase().trim();

  const { data: existingExhibitor } = await fem
    .from("exhibitors")
    .select("id")
    .eq("organization_id", fair.organization_id)
    .eq("email", emailLower)
    .maybeSingle();

  let exhibitorId: string;

  if (existingExhibitor) {
    exhibitorId = existingExhibitor.id;
    // Keep contact info current
    await fem.from("exhibitors").update({
      first_name: data.first_name,
      last_name:  data.last_name,
      phone:      data.phone || null,
    }).eq("id", exhibitorId);
  } else {
    const { data: newExhibitor, error: exhibitorError } = await fem
      .from("exhibitors")
      .insert({
        organization_id: fair.organization_id,
        first_name:      data.first_name,
        last_name:       data.last_name,
        email:           emailLower,
        phone:           data.phone || null,
        address:         data.address || null,
        city:            data.city || null,
        state:           data.state || null,
        zip:             data.zip || null,
        is_youth:        data.entrant_type === "youth",
        notes:           data.entrant_type === "youth" && data.guardian_name
          ? `Guardian: ${data.guardian_name}${data.guardian_phone ? ` · ${data.guardian_phone}` : ""}`
          : null,
      })
      .select("id")
      .single();

    if (exhibitorError || !newExhibitor) {
      console.error("Failed to create exhibitor:", exhibitorError);
      return NextResponse.json({ error: "Failed to save exhibitor record" }, { status: 500 });
    }
    exhibitorId = newExhibitor.id;
  }

  // Generate unique confirmation number via DB function
  const { data: confirmNum, error: confirmError } = await fem
    .rpc("generate_confirmation_number", { p_fair_id: fair.id });

  if (confirmError || !confirmNum) {
    console.error("Failed to generate confirmation number:", confirmError);
    return NextResponse.json({ error: "Failed to generate confirmation number" }, { status: 500 });
  }

  const confirmationNumber: string = confirmNum as string;

  // Build entry rows using pre-generated codes
  const entryRows: Record<string, unknown>[] = data.entries.map((entry, i) => ({
    entry_code:          entryCodes[i],
    exhibitor_id:        exhibitorId,
    organization_id:     fair.organization_id,
    fair_id:             fair.id,
    department_id:       entry.department_id,
    class_id:            entry.class_id,
    lot_id:              entry.lot_id,
    registration_source: "online",
    is_preregistered:    true,
    is_checked_in:       false,
    label_status:        "not_printed",
    judging_status:      "pending",
    pickup_status:       "pending",
  }));

  // Create preregistration record
  const { data: prereg, error: preregError } = await fem
    .from("preregistrations")
    .insert({
      organization_id:      fair.organization_id,
      fair_id:              fair.id,
      confirmation_number:  confirmationNumber,
      submitter_first_name: data.first_name,
      submitter_last_name:  data.last_name,
      submitter_email:      emailLower,
      submitter_phone:      data.phone || null,
      submitter_address:    data.address || null,
      submitter_city:       data.city || null,
      submitter_state:      data.state || null,
      submitter_zip:        data.zip || null,
      is_youth:             data.entrant_type === "youth",
      youth_age:            data.youth_age ?? null,
      guardian_name:        data.guardian_name ?? null,
      guardian_phone:       data.guardian_phone ?? null,
      guardian_email:       data.guardian_email ?? null,
      exhibitor_id:         exhibitorId,
      total_entries:        data.entries.length,
      ip_address:           ip,
      user_agent:           request.headers.get("user-agent") ?? null,
      status:               "pending",
    })
    .select("id")
    .single();

  if (preregError || !prereg) {
    console.error("Failed to create preregistration:", preregError);
    return NextResponse.json({ error: "Failed to save pre-registration" }, { status: 500 });
  }

  // Insert all entries with the preregistration_id now available
  const entryRowsWithPrereg = entryRows.map(row => ({
    ...row,
    preregistration_id: prereg.id,
  }));

  const { error: entriesError } = await fem.from("entries").insert(entryRowsWithPrereg);
  if (entriesError) {
    console.error("Failed to insert entries:", entriesError);
    // Preregistration record exists but entries failed — flag for staff review.
    await fem
      .from("preregistrations")
      .update({ notes: `WARNING: Entry insert failed after code generation — review manually. Error: ${entriesError.message}` })
      .eq("id", prereg.id);
    return NextResponse.json({
      success: true,
      confirmationNumber,
      emailSent: false,
      warning: "Your registration was saved but entry details could not be recorded. Please contact the fair office.",
    });
  }

  // Send confirmation email to entrant + notification to fair staff
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wtsfair.com";
  const submittedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date()) + " CT";

  let emailSent = false;

  if (process.env.RESEND_API_KEY) {
    const resend  = new Resend(process.env.RESEND_API_KEY);
    const fromAddr = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

    // Fetch display names for email
    const entryDetails = await resolveEntryNames(fem, data.entries);

    // Confirmation to entrant
    try {
      await resend.emails.send({
        from:    `West Tennessee State Fair <${fromAddr}>`,
        to:      data.email,
        subject: `Pre-Registration Confirmed — ${confirmationNumber} | WTSF 2026 Exhibits`,
        html:    buildConfirmationHtml({ firstName: data.first_name, lastName: data.last_name, confirmationNumber, submittedAt, entries: entryDetails, siteUrl }),
        text:    buildConfirmationText({ firstName: data.first_name, lastName: data.last_name, confirmationNumber, submittedAt, entries: entryDetails, siteUrl }),
      });
      emailSent = true;
    } catch (err) {
      console.error("Entrant confirmation email failed:", err);
    }

    // Notification to fair staff
    try {
      await resend.emails.send({
        from:    `WTSF Registration System <${fromAddr}>`,
        to:      FAIR_NOTIFICATION_EMAILS,
        subject: `New Pre-Registration ${confirmationNumber} — ${data.first_name} ${data.last_name} (${data.entries.length} ${data.entries.length === 1 ? "entry" : "entries"})`,
        html:    buildNotificationHtml({ confirmationNumber, submittedAt, entrant: data, entries: entryDetails }),
        text:    `New pre-registration: ${confirmationNumber}\nName: ${data.first_name} ${data.last_name}\nEmail: ${data.email}\nEntries: ${data.entries.length}\nSubmitted: ${submittedAt}`,
        replyTo: data.email,
      });
    } catch (err) {
      console.error("Staff notification email failed:", err);
    }
  }

  return NextResponse.json({
    success: true,
    confirmationNumber,
    emailSent,
  });
}

// ── Email helpers ─────────────────────────────────────────────────────────────

async function resolveEntryNames(
  fem: ReturnType<typeof createFemAdminClient>,
  entries: { department_id: string; class_id: string; lot_id: string }[]
): Promise<EntryLine[]> {
  const deptIds  = [...new Set(entries.map(e => e.department_id))];
  const classIds = [...new Set(entries.map(e => e.class_id))];
  const lotIds   = [...new Set(entries.map(e => e.lot_id))];

  const [depts, classes, lots] = await Promise.all([
    fem.from("departments").select("id, name").in("id", deptIds),
    fem.from("classes").select("id, name").in("id", classIds),
    fem.from("lots").select("id, name").in("id", lotIds),
  ]);

  const dMap = Object.fromEntries((depts.data  ?? []).map((r: { id: string; name: string }) => [r.id, r.name]));
  const cMap = Object.fromEntries((classes.data ?? []).map((r: { id: string; name: string }) => [r.id, r.name]));
  const lMap = Object.fromEntries((lots.data   ?? []).map((r: { id: string; name: string }) => [r.id, r.name]));

  return entries.map(e => ({
    department: dMap[e.department_id] ?? "Unknown",
    className:  cMap[e.class_id]      ?? "Unknown",
    lot:        lMap[e.lot_id]        ?? "Unknown",
  }));
}

function buildConfirmationHtml(p: {
  firstName: string; lastName: string; confirmationNumber: string;
  submittedAt: string; entries: EntryLine[]; siteUrl: string;
}): string {
  const rows = p.entries.map((e, i) => `
    <tr style="border-bottom:1px solid #E8DFC8">
      <td style="padding:8px 12px;color:#8B7355;font-size:13px">${i + 1}</td>
      <td style="padding:8px 12px;font-size:13px;color:#3D3026">${e.department}</td>
      <td style="padding:8px 12px;font-size:13px;color:#3D3026">${e.className}</td>
      <td style="padding:8px 12px;font-size:13px;color:#3D3026">${e.lot}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5EDD4;font-family:Georgia,serif">
<div style="max-width:600px;margin:32px auto;background:#ffffff;border:1px solid #E8DFC8">
  <div style="background:#2C4A2E;padding:32px 40px">
    <p style="color:#D4A827;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px">West Tennessee State Fair 2026</p>
    <h1 style="color:#F5EDD4;font-size:24px;margin:0;font-style:italic">Pre-Registration Confirmed</h1>
  </div>
  <div style="padding:32px 40px">
    <p style="color:#3D3026;margin:0 0 12px">Dear ${p.firstName} ${p.lastName},</p>
    <p style="color:#3D3026;margin:0 0 24px">Your exhibit pre-registration has been received for the 2026 West Tennessee State Fair.</p>
    <div style="background:#FDFAF3;border:2px solid #D4A827;padding:24px;text-align:center;margin-bottom:24px">
      <p style="margin:0 0 6px;color:#8B7355;font-size:11px;letter-spacing:0.15em;text-transform:uppercase">Your Confirmation Number</p>
      <p style="margin:0;font-size:32px;font-weight:700;font-family:monospace;color:#D4A827;letter-spacing:0.12em">${p.confirmationNumber}</p>
      <p style="margin:10px 0 0;color:#8B7355;font-size:12px">Bring this number on registration day &mdash; you'll need it to check in</p>
    </div>
    <h3 style="color:#2C4A2E;font-size:15px;border-bottom:2px solid #E8DFC8;padding-bottom:8px;margin:0 0 4px">Your Exhibit Entries (${p.entries.length})</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead>
        <tr style="background:#F5EDD4">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8B7355;font-weight:600">#</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8B7355;font-weight:600">Department</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8B7355;font-weight:600">Class</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8B7355;font-weight:600">Lot</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="background:#FFFBF0;border-left:4px solid #D4A827;padding:16px">
      <p style="margin:0 0 8px;font-weight:700;color:#3D3026;font-size:14px">What happens next?</p>
      <p style="margin:0;color:#5C4A32;font-size:14px;line-height:1.6">
        Bring your physical exhibits to the fair on the assigned turn-in day. Show this confirmation number to fair staff.
        They will check in each exhibit that actually arrives. <strong>Labels are not printed until your exhibit is physically checked in.</strong>
      </p>
    </div>
    <p style="color:#A8A090;font-size:11px;margin-top:24px">Submitted: ${p.submittedAt}</p>
  </div>
  <div style="background:#F5EDD4;padding:16px 40px;border-top:1px solid #E8DFC8;text-align:center">
    <p style="color:#8B7355;font-size:12px;margin:0">West Tennessee State Fair &middot; <a href="${p.siteUrl}" style="color:#2C4A2E">wtsfair.com</a></p>
  </div>
</div>
</body></html>`;
}

function buildConfirmationText(p: {
  firstName: string; lastName: string; confirmationNumber: string;
  submittedAt: string; entries: EntryLine[]; siteUrl: string;
}): string {
  const lines = p.entries
    .map((e, i) => `  ${i + 1}. ${e.department} -> ${e.className} -> ${e.lot}`)
    .join("\n");
  return [
    "WEST TENNESSEE STATE FAIR 2026",
    "Pre-Registration Confirmed",
    "",
    `Dear ${p.firstName} ${p.lastName},`,
    "",
    "Your exhibit pre-registration has been received.",
    "",
    `CONFIRMATION NUMBER: ${p.confirmationNumber}`,
    "",
    "Bring this number on registration day -- you'll need it to check in.",
    "",
    `YOUR EXHIBIT ENTRIES (${p.entries.length}):`,
    lines,
    "",
    "WHAT HAPPENS NEXT:",
    "Bring your physical exhibits to the fair on the assigned turn-in day.",
    "Show your confirmation number to fair staff. They will check in each",
    "exhibit that physically arrives. Labels are not printed until your",
    "exhibit is physically checked in.",
    "",
    `Submitted: ${p.submittedAt}`,
    `West Tennessee State Fair | ${p.siteUrl}`,
  ].join("\n");
}

function buildNotificationHtml(p: {
  confirmationNumber: string;
  submittedAt: string;
  entrant: RegInput;
  entries: EntryLine[];
}): string {
  const rows = p.entries
    .map((e, i) => `
      <tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">${i + 1}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">${e.department}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">${e.className}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">${e.lot}</td>
      </tr>`)
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f0f0f0;padding:24px;margin:0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #ddd">
  <div style="background:#2C4A2E;padding:20px 24px">
    <h2 style="color:#fff;margin:0;font-size:18px">New Pre-Registration: ${p.confirmationNumber}</h2>
    <p style="color:#A8BFA9;margin:4px 0 0;font-size:13px">${p.submittedAt}</p>
  </div>
  <div style="padding:24px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px">
      <tr><td style="padding:5px 0;color:#888;width:130px">Name</td><td><strong>${p.entrant.first_name} ${p.entrant.last_name}</strong></td></tr>
      <tr><td style="padding:5px 0;color:#888">Email</td><td>${p.entrant.email}</td></tr>
      <tr><td style="padding:5px 0;color:#888">Phone</td><td>${p.entrant.phone}</td></tr>
      <tr><td style="padding:5px 0;color:#888">Address</td><td>${p.entrant.address}, ${p.entrant.city}, ${p.entrant.state} ${p.entrant.zip}</td></tr>
      <tr><td style="padding:5px 0;color:#888">Type</td><td>${p.entrant.entrant_type === "youth" ? `Youth${p.entrant.youth_age ? ` (age ${p.entrant.youth_age})` : ""}` : "Adult"}</td></tr>
      ${p.entrant.guardian_name ? `<tr><td style="padding:5px 0;color:#888">Guardian</td><td>${p.entrant.guardian_name}${p.entrant.guardian_phone ? ` &middot; ${p.entrant.guardian_phone}` : ""}</td></tr>` : ""}
    </table>
    <h3 style="color:#2C4A2E;font-size:14px;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px">Entries (${p.entries.length})</h3>
    <table style="width:100%;border-collapse:collapse">
      <thead style="background:#f5f5f5">
        <tr>
          <th style="padding:6px 10px;text-align:left;font-size:12px">#</th>
          <th style="padding:6px 10px;text-align:left;font-size:12px">Department</th>
          <th style="padding:6px 10px;text-align:left;font-size:12px">Class</th>
          <th style="padding:6px 10px;text-align:left;font-size:12px">Lot</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</div>
</body></html>`;
}
