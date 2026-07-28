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

  // Build query — search is pushed into the database so results aren't
  // limited to the current page. ilike() on the joined table requires a
  // Supabase RPC or a subquery approach; we filter on submission_ref directly
  // and use a separate entrant sub-select for name/email search.
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

  // Database-level search: filter on submission_ref first (fast, index-backed).
  // For name/email, we search via the related exhibit_entrants table using
  // Supabase's PostgREST filter syntax on the embedded relation.
  if (search) {
    const safe = search.replace(/[%_]/g, "\\$&"); // escape LIKE special chars
    query = query.or(
      `submission_ref.ilike.%${safe}%,exhibit_entrants.first_name.ilike.%${safe}%,exhibit_entrants.last_name.ilike.%${safe}%,exhibit_entrants.email.ilike.%${safe}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Admin submissions query error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }

  // ── Global aggregate stats — independent of pagination ──────────────
  // Fetch entry_count and data_entry_status for ALL registrations in the year
  // (not just the current page) so the dashboard stat cards are always accurate.
  const { data: aggData } = await supabase
    .from("exhibit_registrations")
    .select("entry_count, data_entry_status")
    .eq("fair_year", year);

  const totalEntries  = aggData?.reduce((sum, r) => sum + (r.entry_count ?? 0), 0) ?? 0;
  const pendingCount  = aggData?.filter((r) => r.data_entry_status === "Pending").length  ?? 0;
  const enteredCount  = aggData?.filter((r) => r.data_entry_status === "Entered").length  ?? 0;

  return NextResponse.json({
    data:  data ?? [],
    total: count ?? 0,
    stats: { totalEntries, pendingCount, enteredCount },
  });
}
