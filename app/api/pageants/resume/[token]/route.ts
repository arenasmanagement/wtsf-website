import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateCurrentAmountCents } from "@/lib/pageant-pricing";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  const { token } = await params;

  if (!token || typeof token !== "string" || token.length === 0) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const supabase = createAdminClient();
  const { data: reg, error } = await supabase
    .from("pageant_registrations")
    .select(
      "id, division_id, division_name, contestant_first_name, contestant_last_name, guardian_email, payment_deadline, status"
    )
    .eq("resume_token_hash", tokenHash)
    .single();

  if (error || !reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (reg.status !== "PAYMENT_PENDING") {
    if (reg.status === "CONFIRMED") {
      return NextResponse.json({ error: "Registration already confirmed" }, { status: 409 });
    }
    if (reg.status === "EXPIRED") {
      return NextResponse.json({ expired: true, error: "Registration window has closed" }, { status: 410 });
    }
    return NextResponse.json({ error: "Registration is no longer active" }, { status: 410 });
  }

  // Check if past deadline
  const now = new Date();
  const deadline = new Date(reg.payment_deadline);
  if (now > deadline) {
    // Mark as expired
    await supabase
      .from("pageant_registrations")
      .update({ status: "EXPIRED", expired_at: now.toISOString() })
      .eq("id", reg.id);

    return NextResponse.json(
      { expired: true, error: "Registration window has closed" },
      { status: 410 }
    );
  }

  // ── PRICING: Calculate current amount due at this moment ──────────────────
  // The fee is determined by when payment is COMPLETED (America/Chicago).
  // Fetch settings and recalculate so the UI always shows the current price.
  // Never return reg.amount_cents — it was stored at registration time and
  // may not reflect the late fee if the window has since opened.
  const { data: settings } = await supabase
    .from("pageant_settings")
    .select("entry_fee_cents, late_fee_cents, late_fee_begins_at, registration_closes_at")
    .eq("fair_year", 2026)
    .single();

  const currentAmountCents = settings?.entry_fee_cents
    ? calculateCurrentAmountCents(
        now,
        settings.entry_fee_cents,
        settings.late_fee_cents ?? null,
        settings.late_fee_begins_at ?? null,
      )
    : null;
  // ─────────────────────────────────────────────────────────────────────────

  return NextResponse.json({
    registrationId: reg.id,
    divisionId: reg.division_id,
    divisionName: reg.division_name,
    contestantFirstName: reg.contestant_first_name,
    contestantLastName: reg.contestant_last_name,
    guardianEmail: reg.guardian_email,
    amountCents: currentAmountCents,        // current calculated amount, not stored value
    isLateFee: settings?.late_fee_begins_at
      ? now >= new Date(settings.late_fee_begins_at)
      : false,
    paymentDeadline: reg.payment_deadline,
    registrationClosesAt: settings?.registration_closes_at ?? null,
    status: reg.status,
  });
}
