import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRole } from "@/lib/admin-auth";

// Escape a CSV field value — wraps in quotes and escapes internal quotes
function csvField(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function csvRow(fields: (string | number | boolean | null | undefined)[]): string {
  return fields.map(csvField).join(",");
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const role = getSessionRole(request);
  if (!role || (role !== "super" && role !== "talent")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("got_talent_registrations")
    .select(
      "id, act_name, act_type, act_description, instrument_ack, is_group, performer_count, primary_performer_name, primary_performer_dob, additional_performers, division, division_conflict, requires_music, contact_name, contact_email, contact_phone, status, entry_fee_cents, amount_cents, paid_at, confirmed_at, created_at"
    )
    .order("division", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Export query failed:", error);
    return new NextResponse("Failed to export", { status: 500 });
  }

  const headers = [
    "ID",
    "Status",
    "Division",
    "Division Conflict",
    "Act Name",
    "Talent Type",
    "Act Description",
    "Instrument Policy Ack",
    "Solo/Group",
    "Performer Count",
    "Primary Performer Name",
    "Primary Performer DOB",
    "Additional Performers",
    "Music Required",
    "Contact Name",
    "Contact Email",
    "Contact Phone",
    "Entry Fee",
    "Amount Paid",
    "Paid At",
    "Confirmed At",
    "Registered At",
  ];

  const rows: string[] = [csvRow(headers)];

  for (const r of data ?? []) {
    const additionalNames = Array.isArray(r.additional_performers)
      ? (r.additional_performers as Array<{ name: string; age_years: number }>)
          .map((p) => `${p.name} (age ${p.age_years})`)
          .join("; ")
      : "";

    rows.push(
      csvRow([
        r.id,
        r.status,
        r.division,
        r.division_conflict ? "Yes" : "No",
        r.act_name,
        r.act_type,
        r.act_description ?? "",
        r.instrument_ack ? "Yes" : "No",
        r.is_group ? "Group" : "Solo",
        r.performer_count,
        r.primary_performer_name,
        r.primary_performer_dob,
        additionalNames,
        r.requires_music ? "Yes" : "No",
        r.contact_name,
        r.contact_email,
        r.contact_phone,
        r.entry_fee_cents ? `$${(r.entry_fee_cents / 100).toFixed(2)}` : "",
        r.amount_cents ? `$${(r.amount_cents / 100).toFixed(2)}` : "",
        r.paid_at ? new Date(r.paid_at).toLocaleString("en-US", { timeZone: "America/Chicago" }) : "",
        r.confirmed_at ? new Date(r.confirmed_at).toLocaleString("en-US", { timeZone: "America/Chicago" }) : "",
        r.created_at ? new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" }) : "",
      ])
    );
  }

  const csv = rows.join("\r\n");
  const filename = `wtsf-got-talent-registrations-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
