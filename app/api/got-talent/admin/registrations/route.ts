import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const role = getSessionRole(request);
  if (!role || (role !== "super" && role !== "talent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get("status"); // "CONFIRMED" | "PAYMENT_PENDING" | "all"
  const divisionFilter = searchParams.get("division"); // "kids" | "youth" | "adult"
  const search = searchParams.get("search")?.trim() ?? "";

  const supabase = createAdminClient();

  let query = supabase
    .from("got_talent_registrations")
    .select(
      "id, act_name, act_type, is_group, performer_count, primary_performer_name, primary_performer_dob, division, division_conflict, requires_music, contact_name, contact_email, contact_phone, status, entry_fee_cents, amount_cents, paid_at, confirmed_at, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  if (divisionFilter) {
    query = query.eq("division", divisionFilter);
  }

  if (search) {
    query = query.or(
      `act_name.ilike.%${search}%,contact_name.ilike.%${search}%,contact_email.ilike.%${search}%,primary_performer_name.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch Got Talent registrations:", error);
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 });
  }

  // Count by division (confirmed only)
  const { data: divisionCounts } = await supabase
    .from("got_talent_registrations")
    .select("division")
    .eq("status", "CONFIRMED");

  const byDivision: Record<string, number> = { kids: 0, youth: 0, adult: 0 };
  for (const row of divisionCounts ?? []) {
    const div = row.division as string;
    if (div in byDivision) byDivision[div]++;
  }

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    byDivision,
  });
}
