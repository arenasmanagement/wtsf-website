import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const role = getSessionRole(request);
  if (!role || (role !== "super" && role !== "talent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const divisionFilter = searchParams.get("division"); // "kids" | "youth" | "adult"
  const actFormat = searchParams.get("act_format");     // "solo" | "group"
  const actType = searchParams.get("act_type");         // exact act_type string
  const search = searchParams.get("search")?.trim() ?? "";

  // Super admin only: optionally view non-CONFIRMED records for reconciliation
  const statusOverride = searchParams.get("status");    // only honored by super
  const isSuperAdmin = role === "super";

  const supabase = createAdminClient();

  let query = supabase
    .from("got_talent_registrations")
    .select(
      "id, act_name, act_type, is_group, performer_count, primary_performer_name, primary_performer_dob, division, division_conflict, requires_music, contact_name, contact_email, contact_phone, status, entry_fee_cents, amount_cents, paid_at, confirmed_at, created_at",
      { count: "exact" }
    )
    .order("division", { ascending: true })
    .order("confirmed_at", { ascending: true });

  // Normal view: CONFIRMED only. Super admin can pass status=all or status=PAYMENT_PENDING for reconciliation.
  if (isSuperAdmin && statusOverride && statusOverride !== "CONFIRMED") {
    if (statusOverride !== "all") {
      query = query.eq("status", statusOverride);
    }
    // "all" → no filter
  } else {
    // Default: Donna's normal view — confirmed/paid only
    query = query.eq("status", "CONFIRMED");
  }

  if (divisionFilter) {
    query = query.eq("division", divisionFilter);
  }

  if (actFormat === "solo") {
    query = query.eq("is_group", false);
  } else if (actFormat === "group") {
    query = query.eq("is_group", true);
  }

  if (actType) {
    query = query.eq("act_type", actType);
  }

  if (search) {
    query = query.or(
      `act_name.ilike.%${search}%,contact_name.ilike.%${search}%,contact_email.ilike.%${search}%,contact_phone.ilike.%${search}%,primary_performer_name.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch Got Talent registrations:", error);
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 });
  }

  // Summary stats — always CONFIRMED only, unfiltered
  const { data: confirmed } = await supabase
    .from("got_talent_registrations")
    .select("division, is_group, requires_music")
    .eq("status", "CONFIRMED");

  const byDivision: Record<string, number> = { kids: 0, youth: 0, adult: 0 };
  let soloCount = 0;
  let groupCount = 0;
  let musicCount = 0;

  for (const row of confirmed ?? []) {
    const div = row.division as string;
    if (div in byDivision) byDivision[div]++;
    if (row.is_group) groupCount++; else soloCount++;
    if (row.requires_music) musicCount++;
  }

  const totalConfirmed = (confirmed ?? []).length;

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    totalConfirmed,
    byDivision,
    soloCount,
    groupCount,
    musicCount,
  });
}
