import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRoleServer } from "@/lib/admin-auth";
import { PRINTABLE_COLUMNS } from "@/lib/pageant-print";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const role = await getSessionRoleServer();
  if (!role || (role !== "super" && role !== "pageants")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") ?? "2026", 10);
  const division = searchParams.get("division") ?? null;
  const statusFilter = searchParams.get("status") ?? "CONFIRMED";
  const search = searchParams.get("search") ?? null;
  // full=1 returns every answer from the registration form (for printing complete forms).
  const full = searchParams.get("full") === "1";

  const supabase = createAdminClient();

  let query = supabase
    .from("pageant_registrations")
    .select(
      full
        ? PRINTABLE_COLUMNS
        : "id, division_id, division_name, status, contestant_first_name, contestant_last_name, contestant_dob, guardian_name, guardian_email, guardian_phone, amount_cents, paid_at, confirmed_at, created_at",
      { count: "exact" }
    )
    .eq("fair_year", year)
    .order("confirmed_at", { ascending: false });

  if (statusFilter !== "ALL") {
    query = query.eq("status", statusFilter);
  }

  if (division) {
    query = query.eq("division_id", division);
  }

  if (search) {
    query = query.or(
      `contestant_first_name.ilike.%${search}%,contestant_last_name.ilike.%${search}%,guardian_name.ilike.%${search}%,guardian_email.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch registrations:", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }

  // Build byDivision counts
  const byDivision: Record<string, number> = {};
  for (const reg of (data ?? []) as unknown as Array<{ division_id: string }>) {
    const key = reg.division_id;
    byDivision[key] = (byDivision[key] ?? 0) + 1;
  }

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    byDivision,
  });
}
