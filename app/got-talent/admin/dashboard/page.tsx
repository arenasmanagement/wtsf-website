"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPhone } from "@/lib/phone-format";

type Division = "all" | "kids" | "youth" | "adult";
type ActFormat = "all" | "solo" | "group";

const ACT_TYPES = [
  "Singing / Vocal",
  "Dance",
  "Instrumental / Music",
  "Comedy",
  "Magic",
  "Cheer / Performance",
  "Variety / Novelty",
  "Other",
] as const;

interface RegRow {
  id: string;
  act_name: string;
  act_type: string;
  division: string;
  is_group: boolean;
  performer_count: number;
  primary_performer_name: string;
  primary_performer_dob: string;
  requires_music: boolean;
  division_conflict: boolean;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  amount_cents: number | null;
  paid_at: string | null;
  confirmed_at: string | null;
  created_at: string;
}

interface ListResponse {
  data: RegRow[];
  total: number;
  totalConfirmed: number;
  byDivision: { kids: number; youth: number; adult: number };
  soloCount: number;
  groupCount: number;
  musicCount: number;
}

const DIVISION_LABELS: Record<string, string> = { kids: "Kids", youth: "Youth", adult: "Adult" };

function ageFromDob(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// ── Print roster helpers ──────────────────────────────────────────────────────

function ageAtFair(dob: string): number {
  // Age as of October 15, 2026 (fair opening day) — for competition accuracy
  const birth = new Date(dob);
  const fairDate = new Date("2026-10-15");
  let age = fairDate.getFullYear() - birth.getFullYear();
  const m = fairDate.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && fairDate.getDate() < birth.getDate())) age--;
  return age;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const DIVISION_ORDER: ReadonlyArray<"kids" | "youth" | "adult"> = ["kids", "youth", "adult"];
const DIVISION_FULL: Record<string, string> = {
  kids: "Kids Division &mdash; 12 &amp; Under",
  youth: "Youth Division &mdash; Ages 13&ndash;20",
  adult: "Adult Division &mdash; Ages 21+",
};

function buildRosterTable(rows: RegRow[], startNum: number, showDivCol: boolean): string {
  const divTh = showDivCol ? "<th>Division</th>" : "";
  const header = `<thead><tr>
    <th class="col-num">#</th>
    <th>Act / Performer</th>
    ${divTh}
    <th class="col-age">Age</th>
    <th>Format</th>
    <th>Talent Type</th>
    <th class="col-music">Music</th>
    <th class="col-checkin">&#10003; Check-In</th>
    <th class="col-notes">Notes</th>
  </tr></thead>`;

  const bodyRows = rows.map((r, i) => {
    const age = ageAtFair(r.primary_performer_dob);
    const format = r.is_group ? `Group (${r.performer_count})` : "Solo";
    const divTd = showDivCol ? `<td>${DIVISION_LABELS[r.division] ?? r.division}</td>` : "";
    const conflictBadge = r.division_conflict
      ? `<span class="conflict-badge"> &#9888; div. conflict</span>` : "";
    return `<tr>
      <td class="col-num">${startNum + i}</td>
      <td>
        <div class="act-name">${escHtml(r.act_name)}${conflictBadge}</div>
        <div class="performer-name">${escHtml(r.primary_performer_name)}</div>
      </td>
      ${divTd}
      <td class="col-age">${age}</td>
      <td>${format}</td>
      <td>${escHtml(r.act_type)}</td>
      <td class="col-music ${r.requires_music ? "music-yes" : "music-no"}">${r.requires_music ? "Yes" : "&mdash;"}</td>
      <td class="col-checkin"></td>
      <td class="col-notes"></td>
    </tr>`;
  }).join("");

  return `<table>${header}<tbody>${bodyRows}</tbody></table>`;
}

function buildPrintHtml(
  rows: RegRow[],
  division: Division,
  actFormat: ActFormat,
  actType: string,
  search: string
): string {
  const printedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  // Subtitle and performance dates
  const subtitleMap: Record<Division, string> = {
    all: "All Divisions",
    kids: "Kids Division &mdash; 12 &amp; Under",
    youth: "Youth Division &mdash; Ages 13&ndash;20",
    adult: "Adult Division &mdash; Ages 21+",
  };
  const subtitle = subtitleMap[division];

  const adultDate = "Adult Competition &mdash; October 23, 2026 &nbsp;&bull;&nbsp; 5:30 PM";
  const kidsYouthDate = "Kids &amp; Youth Competition &mdash; October 24, 2026 &nbsp;&bull;&nbsp; 5:30 PM";
  const perfDatesHtml =
    division === "adult" ? `<div class="perf-date">${adultDate}</div>`
    : (division === "kids" || division === "youth") ? `<div class="perf-date">${kidsYouthDate}</div>`
    : `<div class="perf-date">${adultDate}</div><div class="perf-date">${kidsYouthDate}</div>`;

  // Active filter description
  const filterParts: string[] = [];
  if (division !== "all") filterParts.push(`${DIVISION_LABELS[division]} Division`);
  if (actFormat !== "all") filterParts.push(actFormat === "solo" ? "Solo Acts" : "Group Acts");
  if (actType !== "all") filterParts.push(escHtml(actType));
  if (search) filterParts.push(`Search: &ldquo;${escHtml(search)}&rdquo;`);
  const filterTag = filterParts.length > 0
    ? `<div class="filter-tag">Filters: ${filterParts.join(" &middot; ")}</div>` : "";

  // Build table content
  let tableHtml = "";
  if (division !== "all") {
    // Single division — no section headers
    tableHtml = buildRosterTable(rows, 1, false);
  } else {
    // Group by division
    let counter = 1;
    for (const div of DIVISION_ORDER) {
      const group = rows.filter((r) => r.division === div);
      if (group.length === 0) continue;
      tableHtml += `<div class="division-section">
        <div class="division-header">${DIVISION_FULL[div]}</div>
        ${buildRosterTable(group, counter, false)}
      </div>`;
      counter += group.length;
    }
    // Rows with unrecognized division (shouldn't happen, but safe)
    const other = rows.filter((r) => !(DIVISION_ORDER as ReadonlyArray<string>).includes(r.division));
    if (other.length > 0) {
      tableHtml += `<div class="division-section">
        <div class="division-header">Other</div>
        ${buildRosterTable(other, counter, true)}
      </div>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>WTSF Got Talent &mdash; Contestant Roster</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10.5pt;
  color: #1a1a1a;
  padding: 0.65in 0.65in 0.75in;
}
/* Header */
.header {
  margin-bottom: 14pt;
  padding-bottom: 10pt;
  border-bottom: 2.5pt solid #2C4A2E;
}
.org-label { font-size: 7.5pt; letter-spacing: 2px; text-transform: uppercase; color: #8B7355; font-weight: bold; }
.org-name  { font-size: 17pt; font-weight: bold; color: #2C4A2E; margin: 2pt 0 1pt; }
.roster-title { font-size: 12pt; font-weight: bold; color: #2C4A2E; margin-bottom: 5pt; }
.perf-date { font-size: 8.5pt; color: #5C4A32; margin-bottom: 2pt; }
.filter-tag {
  display: inline-block;
  margin-top: 5pt;
  font-size: 7.5pt;
  color: #5C4A32;
  background: #F5EDD4;
  border: 1px solid #D4C89A;
  padding: 2pt 6pt;
  border-radius: 3pt;
}
.meta-row {
  font-size: 8pt;
  color: #7A6A52;
  margin-top: 6pt;
  display: flex;
  justify-content: space-between;
}
/* Division grouping */
.division-section { margin-bottom: 14pt; }
.division-header {
  font-size: 9.5pt;
  font-weight: bold;
  color: #2C4A2E;
  background: #E8F0E8;
  border: 1.5pt solid #A8C4A8;
  border-bottom: none;
  padding: 4pt 8pt;
}
/* Table */
table { width: 100%; border-collapse: collapse; margin-bottom: 6pt; font-size: 9.5pt; }
thead { display: table-header-group; }
thead th {
  background: #2C4A2E;
  color: #fff;
  font-size: 8pt;
  font-weight: bold;
  padding: 5pt 6pt;
  text-align: left;
  border: 1pt solid #1a3a1a;
  white-space: nowrap;
}
tbody tr { page-break-inside: avoid; }
tbody tr:nth-child(even) { background: #FAFAF8; }
tbody td { padding: 7pt 6pt; border: 1pt solid #C8C8C8; vertical-align: top; }
.act-name { font-weight: bold; color: #2C4A2E; font-size: 9.5pt; }
.performer-name { font-size: 8pt; color: #5C4A32; margin-top: 1pt; }
.conflict-badge { color: #8B2E2E; font-size: 7.5pt; font-weight: normal; margin-left: 3pt; }
.col-num   { width: 20pt; text-align: center; color: #7A6A52; font-size: 8.5pt; }
.col-age   { width: 28pt; text-align: center; }
.col-music { width: 36pt; }
.col-checkin { width: 46pt; }
.col-notes { width: 90pt; }
.music-yes { text-align: center; font-weight: bold; color: #2C4A2E; }
.music-no  { text-align: center; color: #999; }
/* Footer */
.print-footer {
  margin-top: 14pt;
  padding-top: 7pt;
  border-top: 1pt solid #CCC;
  font-size: 7.5pt;
  color: #7A6A52;
  display: flex;
  justify-content: space-between;
}
/* Print */
@media print {
  @page { size: letter portrait; margin: 0.7in 0.55in 0.75in 0.55in; }
  body { padding: 0; }
  thead { display: table-header-group; }
  tbody tr { page-break-inside: avoid; }
  .division-section { page-break-inside: auto; }
  .division-header { page-break-after: avoid; }
  .print-footer { page-break-inside: avoid; }
}
</style>
</head>
<body>
<div class="header">
  <div class="org-label">West Tennessee State Fair</div>
  <div class="org-name">WTSF Got Talent 2026</div>
  <div class="roster-title">${subtitle} &mdash; Contestant Roster</div>
  ${perfDatesHtml}
  ${filterTag}
  <div class="meta-row">
    <span>${rows.length} confirmed contestant${rows.length !== 1 ? "s" : ""}</span>
    <span>Printed: ${printedAt} (CT)</span>
  </div>
</div>

${tableHtml}

<div class="print-footer">
  <span>WTSF Got Talent 2026 &mdash; Authorized staff use only. Do not distribute.</span>
  <span>${rows.length} contestant${rows.length !== 1 ? "s" : ""} total</span>
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function GotTalentDashboard() {
  const router = useRouter();
  const [division, setDivision] = useState<Division>("all");
  const [actFormat, setActFormat] = useState<ActFormat>("all");
  const [actType, setActType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const [tick, setTick] = useState(0);
  const load = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = new URLSearchParams();
    if (division !== "all") params.set("division", division);
    if (actFormat !== "all") params.set("act_format", actFormat);
    if (actType !== "all") params.set("act_type", actType);
    if (search) params.set("search", search);
    fetch(`/api/got-talent/admin/registrations?${params.toString()}`)
      .then(async (r) => {
        if (!active) return;
        if (r.status === 401 || r.status === 403) { setAuthError(true); return; }
        const d = await r.json() as ListResponse;
        setData(d);
      })
      .catch(() => { if (active) setAuthError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [division, actFormat, actType, search, tick]);

  async function handleSignOut() {
    await fetch("/api/got-talent/admin/auth", { method: "DELETE" });
    router.push("/got-talent/admin");
  }

  function handlePrintRoster() {
    const rows = data?.data ?? [];
    if (rows.length === 0) return;
    const win = window.open("", "_blank", "width=900,height=720");
    if (!win) {
      alert("Please allow pop-ups in your browser to open the print view.");
      return;
    }
    win.document.write(buildPrintHtml(rows, division, actFormat, actType, search));
    win.document.close();
    win.focus();
    // Brief delay ensures the document is fully painted before print dialog opens
    setTimeout(() => { win.print(); }, 400);
  }

  if (authError) {
    return (
      <main style={{ padding: "4rem 2rem", textAlign: "center", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#8B2E2E" }}>Session expired or unauthorized.</p>
        <a href="/got-talent/admin" style={{ color: "#2C4A2E", fontWeight: "700" }}>Sign in again →</a>
      </main>
    );
  }

  const rows = data?.data ?? [];
  const counts = data?.byDivision;
  const total = data?.totalConfirmed ?? 0;

  return (
    <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Top bar */}
      <div style={{ backgroundColor: "#2C4A2E", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ color: "#D4A827", fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase" }}>WTSF Got Talent 2026 · </span>
          <span style={{ color: "#F5EDD4", fontWeight: "700" }}>Admin Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a
            href="/api/got-talent/admin/export"
            style={{ background: "none", border: "1px solid #F5EDD4", color: "#F5EDD4", padding: "0.35rem 0.75rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", textDecoration: "none" }}
          >
            Export CSV
          </a>
          <button
            onClick={handleSignOut}
            style={{ background: "none", border: "1px solid #D4A827", color: "#D4A827", padding: "0.35rem 0.75rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ padding: "1.5rem" }}>
        {/* Stats — confirmed counts only */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Total Confirmed", value: total, color: "#2C4A2E", bold: true },
            { label: "Kids", value: counts?.kids ?? "—", color: "#2C4A2E" },
            { label: "Youth", value: counts?.youth ?? "—", color: "#2C4A2E" },
            { label: "Adult", value: counts?.adult ?? "—", color: "#2C4A2E" },
            { label: "Solo Acts", value: data?.soloCount ?? "—", color: "#5C4A32" },
            { label: "Group Acts", value: data?.groupCount ?? "—", color: "#5C4A32" },
            { label: "Music Required", value: data?.musicCount ?? "—", color: "#5C4A32" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "#fff",
                border: s.bold ? "2px solid #D4A827" : "1px solid #D4C89A",
                borderRadius: "6px",
                padding: "0.65rem 1rem",
                minWidth: s.bold ? "130px" : "100px",
              }}
            >
              <p style={{ color: "#7A6A52", fontSize: "0.65rem", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 0.15rem" }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: s.bold ? "1.75rem" : "1.4rem", fontWeight: "700", margin: 0 }}>{String(s.value)}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Division pills */}
          {(["all", "kids", "youth", "adult"] as Division[]).map((d) => (
            <button
              key={d}
              onClick={() => setDivision(d)}
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                border: "2px solid #D4A827",
                backgroundColor: division === d ? "#D4A827" : "transparent",
                color: division === d ? "#1A1A1A" : "#5C4A32",
                fontWeight: "700",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              {d === "all" ? "All" : DIVISION_LABELS[d]}
            </button>
          ))}

          {/* Act format */}
          <select
            value={actFormat}
            onChange={(e) => setActFormat(e.target.value as ActFormat)}
            style={{ padding: "0.35rem 0.65rem", borderRadius: "4px", border: "2px solid #D4C89A", backgroundColor: "#fff", fontFamily: "Georgia, serif", fontSize: "0.82rem" }}
          >
            <option value="all">All Acts</option>
            <option value="solo">Solo</option>
            <option value="group">Group</option>
          </select>

          {/* Talent type */}
          <select
            value={actType}
            onChange={(e) => setActType(e.target.value)}
            style={{ padding: "0.35rem 0.65rem", borderRadius: "4px", border: "2px solid #D4C89A", backgroundColor: "#fff", fontFamily: "Georgia, serif", fontSize: "0.82rem" }}
          >
            <option value="all">All Talent Types</option>
            {ACT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Search */}
          <input
            type="search"
            placeholder="Search name, act, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            style={{ padding: "0.35rem 0.65rem", borderRadius: "4px", border: "2px solid #D4C89A", fontFamily: "Georgia, serif", fontSize: "0.82rem", minWidth: "210px" }}
          />
          <button
            onClick={load}
            style={{ padding: "0.35rem 0.9rem", backgroundColor: "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.82rem" }}
          >
            Search
          </button>
        </div>

        {/* Print Roster + Showing count row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          {!loading && (
            <p style={{ color: "#7A6A52", fontSize: "0.78rem", margin: 0 }}>
              Showing {rows.length} confirmed contestant{rows.length !== 1 ? "s" : ""}
              {division !== "all" || actFormat !== "all" || actType !== "all" || search ? " (filtered)" : ""}
            </p>
          )}
          {loading && <span />}
          <button
            onClick={handlePrintRoster}
            disabled={loading || rows.length === 0}
            style={{
              padding: "0.375rem 0.9rem",
              backgroundColor: "transparent",
              color: "#2C4A2E",
              border: "2px solid #2C4A2E",
              borderRadius: "4px",
              cursor: loading || rows.length === 0 ? "not-allowed" : "pointer",
              fontSize: "0.82rem",
              fontFamily: "Georgia, serif",
              fontWeight: "700",
              opacity: loading || rows.length === 0 ? 0.45 : 1,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span aria-hidden="true">⬡</span> Print Roster
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ color: "#7A6A52" }}>Loading…</p>
        ) : rows.length === 0 ? (
          <p style={{ color: "#7A6A52" }}>No confirmed contestants match the current filters.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "6px", overflow: "hidden", border: "1px solid #D4C89A" }}>
              <thead>
                <tr style={{ backgroundColor: "#2C4A2E" }}>
                  {["Act / Performer", "Division", "Age", "Format", "Talent Type", "Music", "Contact", "Phone", "Confirmed", ""].map((h) => (
                    <th key={h} style={{ padding: "0.6rem 0.75rem", color: "#F5EDD4", fontSize: "0.75rem", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const age = ageFromDob(r.primary_performer_dob);
                  return (
                    <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#FAFAF8", borderBottom: "1px solid #E8DFC8" }}>
                      <td style={{ padding: "0.6rem 0.75rem" }}>
                        <div style={{ fontWeight: "700", color: "#2C4A2E", fontSize: "0.9rem" }}>
                          {r.act_name}
                          {r.division_conflict && (
                            <span title="Division conflict — needs review" style={{ marginLeft: "0.4rem", color: "#8B2E2E" }}>⚠</span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#7A6A52" }}>{r.primary_performer_name}</div>
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}>{DIVISION_LABELS[r.division] ?? r.division}</td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}>{age}</td>
                      <td style={{ padding: "0.6rem 0.75rem" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "0.15rem 0.55rem",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          backgroundColor: r.is_group ? "#E8F0FF" : "#E8F5E8",
                          color: r.is_group ? "#1A3A8B" : "#1A5C1A",
                        }}>
                          {r.is_group ? `Group (${r.performer_count})` : "Solo"}
                        </span>
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}>{r.act_type}</td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem", textAlign: "center" }}>{r.requires_music ? "✓" : "—"}</td>
                      <td style={{ padding: "0.6rem 0.75rem" }}>
                        <div style={{ fontSize: "0.85rem" }}>{r.contact_name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#7A6A52" }}>{r.contact_email}</div>
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.82rem", whiteSpace: "nowrap" }}>{formatPhone(r.contact_phone)}</td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.78rem", color: "#7A6A52", whiteSpace: "nowrap" }}>
                        {r.confirmed_at
                          ? new Date(r.confirmed_at).toLocaleDateString("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric" })
                          : new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem" }}>
                        <Link href={`/got-talent/admin/dashboard/${r.id}`} style={{ color: "#2C4A2E", fontSize: "0.82rem", fontWeight: "700", textDecoration: "none" }}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
