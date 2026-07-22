// Export: Entrant Data-Entry Report  (CSV or XLSX)
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { FAIR_YEAR } from "@/lib/exhibit-config";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv"; // "csv" | "xlsx"
  const year = parseInt(searchParams.get("year") ?? String(FAIR_YEAR));

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("exhibit_registrations")
    .select(`
      submission_ref,
      submitted_at,
      entry_count,
      official_program_id,
      data_entry_status,
      notes,
      exhibit_entrants (
        first_name, last_name, entrant_type,
        youth_age, youth_grade, guardian_name, guardian_phone,
        address, city, state, zip, phone, email
      )
    `)
    .eq("fair_year", year)
    .neq("status", "cancelled")
    .order("submitted_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

  // Flatten rows
  const rows = (data ?? []).map((r) => {
    const e = r.exhibit_entrants as unknown as {
      first_name: string; last_name: string; entrant_type: string;
      youth_age?: number | null; youth_grade?: string | null;
      guardian_name?: string | null; guardian_phone?: string | null;
      address: string; city: string; state: string; zip: string;
      phone: string; email: string;
    } | null;

    return {
      "Submission Reference": r.submission_ref,
      "Last Name":    e?.last_name    ?? "",
      "First Name":   e?.first_name   ?? "",
      "Adult/Youth":  e?.entrant_type === "youth" ? "Youth" : "Adult",
      "Youth Age":    e?.youth_age    ?? "",
      "Youth Grade":  e?.youth_grade  ?? "",
      "Parent/Guardian":       e?.guardian_name  ?? "",
      "Guardian Phone":        e?.guardian_phone ?? "",
      "Address":      e?.address ?? "",
      "City":         e?.city    ?? "",
      "State":        e?.state   ?? "",
      "ZIP":          e?.zip     ?? "",
      "Phone":        e?.phone   ?? "",
      "Email":        e?.email   ?? "",
      "# of Entries": r.entry_count,
      "Submitted":    r.submitted_at
        ? new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(r.submitted_at))
        : "",
      "Official Program ID":  r.official_program_id  ?? "",
      "Data Entry Status":    r.data_entry_status,
      "Staff Notes":          r.notes ?? "",
    };
  });

  const filename = `WTSF-${year}-Entrants-${new Date().toISOString().slice(0, 10)}`;

  if (format === "xlsx") {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    // Column widths
    ws["!cols"] = [
      {wch:22},{wch:18},{wch:16},{wch:10},{wch:8},{wch:10},
      {wch:22},{wch:15},{wch:26},{wch:16},{wch:6},{wch:8},
      {wch:14},{wch:26},{wch:10},{wch:18},{wch:20},{wch:16},{wch:20},
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Entrants");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  // CSV
  if (rows.length === 0) {
    return new NextResponse("No data", {
      headers: { "Content-Type": "text/plain" },
    });
  }
  const ws  = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
