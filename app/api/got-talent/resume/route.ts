import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDivisionById } from "@/lib/got-talent-config";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");

  if (!token || token.length < 32) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient();

  const { data: reg, error } = await supabase
    .from("got_talent_registrations")
    .select(
      "id, status, act_name, act_type, division, requires_music, contact_email, entry_fee_cents, payment_deadline, confirmed_at"
    )
    .eq("resume_token_hash", tokenHash)
    .maybeSingle();

  if (error) {
    console.error("Resume lookup error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  if (!reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  // Mask email for display
  const emailParts = (reg.contact_email as string).split("@");
  const maskedEmail =
    emailParts.length === 2
      ? `${emailParts[0].slice(0, 2)}***@${emailParts[1]}`
      : "***";

  const divisionConfig = getDivisionById(reg.division as string);

  return NextResponse.json({
    registrationId: reg.id,
    status: reg.status,
    actName: reg.act_name,
    actType: reg.act_type,
    division: reg.division,
    divisionLabel: divisionConfig?.label ?? reg.division,
    performanceDate: divisionConfig?.performanceDate ?? "",
    performanceTime: divisionConfig?.performanceTime ?? "",
    requiresMusic: reg.requires_music,
    maskedEmail,
    amountCents: reg.entry_fee_cents,
    paymentDeadline: reg.payment_deadline,
    confirmedAt: reg.confirmed_at,
  });
}
