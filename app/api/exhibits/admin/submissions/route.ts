import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { FAIR_YEAR } from "@/lib/exhibit-config";

// GET /api/exhibits/admin/submissions  — list registrations with filters
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search     = searchParams.get("search")  ?? "";
  const status     = searchParams.get("status")  ?? "";
  const entryStatus = searchParams.get("entry_status") ?? "";
  const year       = parseInt(searchParams.get("year") ?? String(FAIR_YEAR));
  const pageSize   = 50;
  const page       = parseInt(searchParams.get("page") ?? "0");

  const supabase = createAdminClient();

  // Build query
  let query = supabase
    .from("exhibit_registrations")
    .select(`
      id,
      submission_ref,
      fair_year,
      status,
      submitted_at,
      entry_count,
      notes,
      official_program_id,
      data_entry_status,
      confirmation_email_sent,
      exhibit_entrants (
        id, first_name, last_name, email, phone, entrant_type,
        youth_age, youth_grade, guardian_name,
        address, city, state, zip
      )
    `, { count: "exact" })
    .eq("fair_year", year)
    .order("submitted_at", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (status) query = query.eq("status", status);
  if (entryStatus) query = query.eq("data_entry_status", entryStatus);

  const { data, error, count } = await query;

  if (error) {
    console.error("Admin submissions query error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }

  // Filter by search (server-side name/ref search)
  let results = data ?? [];
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((r) => {
      const e = r.exhibit_entrants as unknown as { first_name: string; last_name: string; email: string } | null;
      return (
        r.submission_ref.toLowerCase().includes(q) ||
        e?.last_name?.toLowerCase().includes(q) ||
        e?.first_name?.toLowerCase().includes(q) ||
        e?.email?.toLowerCase().includes(q)
      );
    });
  }

  return NextResponse.json({ data: results, total: count ?? 0 });
}
