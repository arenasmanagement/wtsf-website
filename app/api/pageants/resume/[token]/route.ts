import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

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
      "id, division_id, division_name, contestant_first_name, contestant_last_name, guardian_email, amount_cents, payment_deadline, status"
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
      return NextResponse.json({ expired: true, error: "Payment deadline has passed" }, { status: 410 });
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
      { expired: true, error: "Payment deadline has passed" },
      { status: 410 }
    );
  }

  return NextResponse.json({
    registrationId: reg.id,
    divisionId: reg.division_id,
    divisionName: reg.division_name,
    contestantFirstName: reg.contestant_first_name,
    contestantLastName: reg.contestant_last_name,
    guardianEmail: reg.guardian_email,
    amountCents: reg.amount_cents,
    paymentDeadline: reg.payment_deadline,
    status: reg.status,
  });
}
