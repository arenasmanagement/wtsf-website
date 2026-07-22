// Export: Exhibit Entry Data-Entry Report  (CSV or XLSX)
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
  const format = searchParams.get("format") ?? "csv";
  const year   = parseInt(searchParams.get("year") ?? String(FAIR_YEAR));

  const supabase = createAdminClient();

  // Join entries → registrations → entrants
  const { data, error } = await supabase
    .from("exhibit_entries")
    .select(`
      department,
      division,
      class_name,
      lot,
      entry_title,
      entry_description,
      quantity,
      sort_order,
      exhibit_registrations!inner (
        submission_ref,
        official_program_id,
        data_entry_status,
        notes,
        fair_year,
        status,
        submitted_at,
        exhibit_entrants (
          first_name, last_name, entrant_type
        )
      )
    `)
    .eq("exhibit_registrations.fair_year", year)
    .neq("exhibit_registrations.status", "cancelled")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Export entries error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

  const rows = (data ?? []).map((row) => {
    const reg = row.exhibit_registrations as unknown as {
      submission_ref: string;
      official_program_id?: string | null;
      data_entry_status: string;
      notes?: string | null;
      submitted_at?: string | null;
      exhibit_entrants: {
        first_name: string; last_name: string; entrant_type: string;
      } | null;
    } | null;

    const e = reg?.exhibit_entrants;

    return {
      "Submission Reference": reg?.submission_ref ?? "",
      "Last Name":    e?.last_name  ?? "",
      "First Name":   e?.first_name ?? "",
      "Adult/Youth":  e?.entrant_type === "youth" ? "Youth" : "Adult",
      "Department":   row.department,
      "Division":     row.division,
      "Class":        row.class_name,
      "Lot":          row.lot,
      "Entry Title/Description": row.entry_title || row.entry_description || "",
      "Quantity":     row.quantity,
      "Official Program ID":  reg?.official_program_id ?? "",
      "Data Entry Status":    reg?.data_entry_status ?? "Pending",
      "Staff Notes":          reg?.notes ?? "",
    };
  });

  // Sort by submission ref then sort_order (already ordered by sort_order)
  rows.sort((a, b) =>
    a["Submission Reference"].localeCompare(b["Submission Reference"]) ||
    0
  );

  const filename = `WTSF-${year}-Entries-${new Date().toISOString().slice(0, 10)}`;

  if (format === "xlsx") {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      {wch:22},{wch:16},{wch:14},{wch:10},{wch:18},{wch:22},{wch:14},
      {wch:10},{wch:32},{wch:8},{wch:20},{wch:16},{wch:20},
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Exhibit Entries");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  if (rows.length === 0) return new NextResponse("No data", { headers: { "Content-Type": "text/plain" } });
  const ws  = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
