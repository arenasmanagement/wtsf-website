// Export: Exhibit Entry Data-Entry Report  (CSV or XLSX)
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { FAIR_YEAR } from "@/lib/exhibit-config";
import ExcelJS from "exceljs";

/** Convert an array of plain objects to a CSV string. */
function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "").replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${s}"` : s;
  };
  return [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

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

  // Sort by submission ref
  rows.sort((a, b) =>
    a["Submission Reference"].localeCompare(b["Submission Reference"])
  );

  const filename = `WTSF-${year}-Entries-${new Date().toISOString().slice(0, 10)}`;

  if (format === "xlsx") {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Exhibit Entries");

    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);
      const colWidths = [22,16,14,10,18,22,14,10,32,8,20,16,20];

      ws.columns = headers.map((header, i) => ({
        header,
        key: header,
        width: colWidths[i] ?? 16,
      }));

      // Style header row
      ws.getRow(1).font = { bold: true };

      rows.forEach((row) => ws.addRow(row));
    }

    const buf = await wb.xlsx.writeBuffer();
    return new NextResponse(buf as ArrayBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  if (rows.length === 0) {
    return new NextResponse("No data", { headers: { "Content-Type": "text/plain" } });
  }

  const csv = toCSV(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
