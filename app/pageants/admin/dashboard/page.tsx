"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PAGEANT_DIVISIONS } from "@/lib/pageant-config";
import { escapeHtml as esc } from "@/lib/emails/escape";
import {
  buildFormsDocument,
  openPrintDocument,
  sortForPrint,
  type PrintableRegistration,
} from "@/lib/pageant-print";

interface Registration {
  id: string;
  division_id: string;
  division_name: string;
  status: string;
  contestant_first_name: string;
  contestant_last_name: string;
  contestant_dob: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  amount_cents: number | null;
  paid_at: string | null;
  confirmed_at: string | null;
  created_at: string;
}

interface ByDivision {
  [divisionId: string]: number;
}

type StatusFilter = "CONFIRMED" | "PAYMENT_PENDING" | "ALL";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

function formatDollars(cents: number | null): string {
  if (cents === null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    CONFIRMED: { bg: "#D4EDDA", color: "#155724" },
    PAYMENT_PENDING: { bg: "#FFF3CD", color: "#856404" },
    EXPIRED: { bg: "#F8D7DA", color: "#721C24" },
    CANCELLED: { bg: "#E2E3E5", color: "#383D41" },
  };
  const c = colors[status] ?? { bg: "#E2E3E5", color: "#383D41" };
  return (
    <span style={{
      backgroundColor: c.bg,
      color: c.color,
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "0.75rem",
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      {status.replace("_", " ")}
    </span>
  );
}

// ── Print helpers ──────────────────────────────────────────────────────────────

const PRINT_HEADER = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; color: #000; background: #fff; font-size: 11pt; }
    .doc-header { text-align: center; margin-bottom: 20pt; padding-bottom: 10pt; border-bottom: 2px solid #000; }
    .doc-header h1 { font-size: 14pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
    .doc-header h2 { font-size: 12pt; font-weight: bold; margin-top: 4pt; }
    .doc-header p { font-size: 10pt; margin-top: 4pt; color: #444; }
    .section-title { font-size: 11pt; font-weight: bold; text-transform: uppercase;
      letter-spacing: 0.5px; margin: 18pt 0 6pt; padding: 4pt 6pt;
      background: #f0f0f0; border-left: 4px solid #2C4A2E; }
    table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
    th { background: #2C4A2E; color: #fff; padding: 5pt 6pt; text-align: left;
      font-weight: bold; font-size: 9pt; }
    td { padding: 5pt 6pt; border-bottom: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) td { background: #f9f9f9; }
    .totals { margin-top: 16pt; font-size: 10pt; }
    .totals table { max-width: 320pt; }
    .totals th { font-size: 9pt; }
    .footer { margin-top: 24pt; padding-top: 8pt; border-top: 1px solid #ccc;
      font-size: 8.5pt; color: #666; text-align: center; }
    @page { size: letter portrait; margin: 0.75in; }
    @media print {
      .no-print { display: none; }
      tr { page-break-inside: avoid; }
      thead { display: table-header-group; }
      tfoot { display: table-footer-group; }
    }
    .print-btn { display: block; margin: 12pt auto 20pt; padding: 8pt 20pt;
      background: #2C4A2E; color: #fff; border: none; font-size: 11pt;
      font-family: Georgia, serif; border-radius: 4px; cursor: pointer; }
    .print-btn:hover { background: #1a3a1e; }
  </style>
`;

function printedAt(): string {
  return new Date().toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: "America/Chicago", timeZoneName: "short",
  });
}

async function fetchAllConfirmed(): Promise<Registration[]> {
  const res = await fetch("/api/pageants/admin/registrations?year=2026&status=CONFIRMED");
  if (!res.ok) throw new Error("Failed to fetch registrations");
  const data = await res.json() as { data: Registration[] };
  return sortForPrint(data.data ?? [], DIVISION_ORDER);
}

const DIVISION_ORDER = PAGEANT_DIVISIONS.map((d) => d.id);

async function fetchAllConfirmedFull(): Promise<PrintableRegistration[]> {
  const res = await fetch("/api/pageants/admin/registrations?year=2026&status=CONFIRMED&full=1");
  if (!res.ok) throw new Error("Failed to fetch registrations");
  const data = await res.json() as { data: PrintableRegistration[] };
  return sortForPrint(data.data ?? [], DIVISION_ORDER);
}

// Complete registration forms (every question + answer), one contestant per page.
async function printAllForms(): Promise<void> {
  const regs = await fetchAllConfirmedFull();
  if (regs.length === 0) { alert("No confirmed registrations to print."); return; }
  openPrintDocument(buildFormsDocument(regs, "All Complete Registration Forms"));
}

// Real PDF downloads, built in this browser from the authenticated admin API.
// Nothing is uploaded or stored; the file goes straight to the admin's Downloads.
async function downloadCompleteFormsPdf(): Promise<void> {
  const regs = await fetchAllConfirmedFull();
  if (regs.length === 0) { alert("No confirmed registrations to download."); return; }
  const { buildCompleteRegistrationsPdf, downloadPdf } = await import("@/lib/pageant-pdf");
  downloadPdf(await buildCompleteRegistrationsPdf(regs), "WTSF-2026-Pageant-Complete-Registrations.pdf");
}

async function downloadCheckInPdf(): Promise<void> {
  const regs = await fetchAllConfirmedFull();
  if (regs.length === 0) { alert("No confirmed registrations to download."); return; }
  const { buildCheckInPdf, downloadPdf } = await import("@/lib/pageant-pdf");
  downloadPdf(await buildCheckInPdf(regs), "WTSF-2026-Pageant-Check-In-Sheets.pdf");
}

async function downloadIntroSheetsPdf(): Promise<void> {
  const regs = await fetchAllConfirmedFull();
  if (regs.length === 0) { alert("No confirmed registrations to download."); return; }
  const { buildIntroSheetsPdf, downloadPdf } = await import("@/lib/pageant-pdf");
  downloadPdf(await buildIntroSheetsPdf(regs), "WTSF-2026-Pageant-Emcee-Introduction-Sheets.pdf");
}

async function printDivisionForms(divisionId: string, divisionName: string): Promise<void> {
  const regs = (await fetchAllConfirmedFull()).filter((r) => r.division_id === divisionId);
  if (regs.length === 0) { alert(`No confirmed contestants in ${divisionName}.`); return; }
  openPrintDocument(buildFormsDocument(regs, `${divisionName} — Complete Registration Forms`));
}

function openPrintWindow(html: string): void {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) { alert("Please allow pop-ups to print."); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Print</title>${PRINT_HEADER}</head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

function docHeader(subtitle: string, count: number, divisionLabel?: string): string {
  return `
    <div class="doc-header">
      <h1>2026 West Tennessee State Fair</h1>
      <h2>Traditional Pageants — October 17, 2026</h2>
      ${divisionLabel ? `<p><strong>${divisionLabel}</strong></p>` : ""}
      <p>${subtitle} &nbsp;|&nbsp; ${count} contestant${count !== 1 ? "s" : ""} &nbsp;|&nbsp; Printed ${printedAt()}</p>
    </div>
    <button class="print-btn no-print" onclick="window.print()">🖨 Print / Save as PDF</button>
  `;
}

function registrationRows(regs: Registration[]): string {
  return regs.map((r) => `
    <tr>
      <td><strong>${esc(r.contestant_first_name)} ${esc(r.contestant_last_name)}</strong></td>
      <td>${esc(r.contestant_dob)}</td>
      <td>${esc(r.division_name)}</td>
      <td>${esc(r.guardian_name)}</td>
      <td>${esc(r.guardian_phone)}</td>
      <td>${esc(r.status.replace(/_/g, " "))}</td>
      <td>${formatDate(r.confirmed_at)}</td>
    </tr>
  `).join("");
}

function groupByDivision(regs: Registration[]): Map<string, Registration[]> {
  const map = new Map<string, Registration[]>();
  for (const div of PAGEANT_DIVISIONS) {
    const group = regs.filter((r) => r.division_id === div.id);
    if (group.length > 0) map.set(div.id, group);
  }
  return map;
}

// Feature 1: Print All Registrations (grouped by division)
async function printAll(): Promise<void> {
  const regs = await fetchAllConfirmed();
  if (regs.length === 0) { alert("No confirmed registrations to print."); return; }

  const groups = groupByDivision(regs);
  let body = docHeader("All Divisions — Confirmed Registrations", regs.length);

  // Division totals summary
  body += `<div class="section-title">Division Summary</div>
    <div class="totals"><table>
      <thead><tr><th>Division</th><th>Confirmed</th></tr></thead>
      <tbody>`;
  for (const div of PAGEANT_DIVISIONS) {
    const count = groups.get(div.id)?.length ?? 0;
    if (count > 0) body += `<tr><td>${div.name} (${div.ageLabel})</td><td>${count}</td></tr>`;
  }
  body += `<tr><td><strong>Total</strong></td><td><strong>${regs.length}</strong></td></tr>
    </tbody></table></div>`;

  // Per-division contestant tables
  for (const div of PAGEANT_DIVISIONS) {
    const group = groups.get(div.id);
    if (!group) continue;
    body += `<div class="section-title">${div.name} — ${div.ageLabel} (${group.length} contestant${group.length !== 1 ? "s" : ""})</div>
      <table>
        <thead><tr>
          <th>Contestant</th><th>DOB</th><th>Division</th><th>Guardian</th><th>Phone</th><th>Status</th><th>Confirmed</th>
        </tr></thead>
        <tbody>${registrationRows(group)}</tbody>
      </table>`;
  }

  body += `<div class="footer">2026 WTSF Traditional Pageants · Williams Auditorium, Henderson TN · Confidential — authorized staff only</div>`;
  openPrintWindow(body);
}

// Feature 2: Print Single Division
async function printDivision(divisionId: string, divisionName: string): Promise<void> {
  const regs = await fetchAllConfirmed();
  const group = regs.filter((r) => r.division_id === divisionId);
  if (group.length === 0) { alert(`No confirmed contestants in ${divisionName}.`); return; }

  const div = PAGEANT_DIVISIONS.find((d) => d.id === divisionId);
  const label = div ? `${div.name} · ${div.ageLabel} · Arrival ${div.arrivalTime} · Competition ${div.competitionTime}` : divisionName;

  let body = docHeader("Confirmed Registrations", group.length, label);
  body += `<table>
    <thead><tr>
      <th>Contestant</th><th>DOB</th><th>Division</th><th>Guardian</th><th>Phone</th><th>Status</th><th>Confirmed</th>
    </tr></thead>
    <tbody>${registrationRows(group)}</tbody>
  </table>`;
  body += `<div class="footer">2026 WTSF Traditional Pageants · Williams Auditorium, Henderson TN · Confidential — authorized staff only</div>`;
  openPrintWindow(body);
}

// Feature 4: Print Check-In Sheets (all divisions, grouped)
async function printCheckInSheets(): Promise<void> {
  const regs = await fetchAllConfirmed();
  if (regs.length === 0) { alert("No confirmed registrations to print."); return; }

  const groups = groupByDivision(regs);
  let firstPage = true;
  let body = `
    <style>
      .checkin-table th { background: #2C4A2E; color: #fff; font-size: 8.5pt; padding: 4pt 5pt; }
      .checkin-table td { padding: 6pt 5pt; border-bottom: 1px solid #ccc; font-size: 9pt; }
      .checkin-table .check-cell { width: 24pt; text-align: center; }
      .checkin-table .num-cell { width: 40pt; }
      .checkin-table .notes-cell { width: 150pt; }
      .checkin-page { page-break-before: always; break-before: page; }
      .checkin-page.first { page-break-before: auto; break-before: auto; }
      .checkin-table .box { display:inline-block; width:14pt; height:14pt; border:1.2px solid #000; }
    </style>
  `;
  body += `<div class="doc-header">
    <h1>2026 West Tennessee State Fair</h1>
    <h2>Traditional Pageants — October 17, 2026 · Check-In Sheets</h2>
    <p>${regs.length} total confirmed contestants &nbsp;|&nbsp; Printed ${printedAt()}</p>
  </div>
  <button class="print-btn no-print" onclick="window.print()">🖨 Print / Save as PDF</button>`;

  for (const div of PAGEANT_DIVISIONS) {
    const group = groups.get(div.id);
    if (!group) continue;
    const divInfo = PAGEANT_DIVISIONS.find((d) => d.id === div.id)!;
    body += `<div class="checkin-page${firstPage ? " first" : ""}">
      <div class="section-title div-header">${divInfo.name} — ${divInfo.ageLabel}
        &nbsp;&nbsp;Arrival: ${divInfo.arrivalTime} &nbsp;|&nbsp; Competition: ${divInfo.competitionTime}
        &nbsp;&nbsp;(${group.length} contestant${group.length !== 1 ? "s" : ""})
      </div>
      <table class="checkin-table">
        <thead><tr>
          <th class="check-cell">✓</th>
          <th>Contestant Name</th>
          <th>Division</th>
          <th>Parent / Guardian</th>
          <th class="num-cell">Contestant #</th>
          <th class="notes-cell">Notes</th>
        </tr></thead>
        <tbody>`;
    for (const [i, r] of group.entries()) {
      const shade = i % 2 === 1 ? "background:#f9f9f9;" : "";
      body += `<tr style="${shade}">
        <td class="check-cell"><span class="box"></span></td>
        <td><strong>${esc(r.contestant_first_name)} ${esc(r.contestant_last_name)}</strong></td>
        <td>${esc(r.division_name)}</td>
        <td>${esc(r.guardian_name)}</td>
        <td class="num-cell" style="border-bottom:1px solid #000;">&nbsp;</td>
        <td class="notes-cell" style="border-bottom:1px solid #000; height:26pt;">&nbsp;</td>
      </tr>`;
    }
    body += `</tbody></table>
      <div style="margin-top:14pt;font-size:9.5pt;">Staff initials: ____________ &nbsp;&nbsp; Time completed: ____________</div>
      </div>`;
    firstPage = false;
  }

  body += `<div class="footer">2026 WTSF Traditional Pageants · Williams Auditorium, Henderson TN · Confidential — authorized staff only</div>`;
  openPrintWindow(body);
}

// ── Main Component ──────────────────────────────────────────────────────────────

export default function PageantAdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [byDivision, setByDivision] = useState<ByDivision>({});
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("CONFIRMED");
  const [divisionFilter, setDivisionFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printing, setPrinting] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ year: "2026", status: statusFilter });
      if (divisionFilter) params.set("division", divisionFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/pageants/admin/registrations?${params.toString()}`);
      if (res.status === 401) {
        router.push("/pageants/admin");
        return;
      }
      const data = await res.json() as { data: Registration[]; total: number; byDivision: ByDivision };
      setRegistrations(data.data ?? []);
      setTotal(data.total ?? 0);
      setByDivision(data.byDivision ?? {});
    } catch {
      setError("Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, divisionFilter, search, router]);

  useEffect(() => {
    void fetchRegistrations();
  }, [fetchRegistrations]);

  async function handleLogout() {
    await fetch("/api/pageants/admin/auth", { method: "DELETE" });
    router.push("/pageants/admin");
  }

  // Fetch total confirmed by division (always, for the division cards)
  const [confirmedByDivision, setConfirmedByDivision] = useState<ByDivision>({});
  useEffect(() => {
    fetch("/api/pageants/admin/registrations?year=2026&status=CONFIRMED")
      .then((r) => r.json())
      .then((d: { byDivision: ByDivision }) => setConfirmedByDivision(d.byDivision ?? {}))
      .catch(() => {});
  }, []);

  async function runPrint(key: string, fn: () => Promise<void>) {
    setPrinting(key);
    try {
      await fn();
    } catch {
      alert("Failed to load registrations for printing. Please try again.");
    } finally {
      setPrinting(null);
    }
  }

  const thStyle: React.CSSProperties = {
    padding: "0.625rem 0.75rem",
    textAlign: "left",
    color: "#8B7355",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: "#F5EDD4",
    borderBottom: "1px solid #E8DFC8",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.75rem",
    color: "#2C4A2E",
    fontSize: "0.875rem",
    borderBottom: "1px solid #F5EDD4",
    verticalAlign: "middle",
  };

  const printBtnStyle: React.CSSProperties = {
    padding: "0.375rem 0.75rem",
    backgroundColor: "transparent",
    color: "#2C4A2E",
    border: "1px solid #2C4A2E",
    borderRadius: "4px",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    fontWeight: 600,
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#2C4A2E", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ color: "#F5EDD4", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: 0 }}>
            2026 Traditional Pageants
          </h1>
          <p style={{ color: "#D4A827", fontSize: "0.8125rem", margin: 0 }}>Registration Dashboard</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <a href="/pageants/admin/settings" style={{ color: "#E8DFC8", fontSize: "0.875rem", textDecoration: "none", padding: "0.375rem 0.75rem", border: "1px solid #5C7A5E", borderRadius: "4px" }}>
            Settings
          </a>
          <button onClick={handleLogout} style={{ backgroundColor: "transparent", color: "#E8DFC8", border: "1px solid #5C7A5E", borderRadius: "4px", padding: "0.375rem 0.75rem", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>

        {/* ── PDF Downloads ── */}
        <div style={{ backgroundColor: "#2C4A2E", border: "2px solid #D4A827", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => void runPrint("pdf-forms", downloadCompleteFormsPdf)}
            disabled={printing === "pdf-forms"}
            style={{ backgroundColor: "#D4A827", color: "#1A1A1A", border: "none", borderRadius: "6px", padding: "0.875rem 1.25rem", fontSize: "1rem", fontWeight: 800, fontFamily: "Georgia, serif", cursor: printing === "pdf-forms" ? "wait" : "pointer", letterSpacing: "0.3px" }}
          >
            {printing === "pdf-forms"
              ? "Building PDF…"
              : `⬇ DOWNLOAD ALL ${Object.values(confirmedByDivision).reduce((a, b) => a + b, 0) || ""} COMPLETE REGISTRATIONS (PDF)`.replace("ALL  ", "ALL ")}
          </button>
          <button
            onClick={() => void runPrint("pdf-checkin", downloadCheckInPdf)}
            disabled={printing === "pdf-checkin"}
            style={{ backgroundColor: "#F5EDD4", color: "#2C4A2E", border: "none", borderRadius: "6px", padding: "0.875rem 1.25rem", fontSize: "0.95rem", fontWeight: 700, fontFamily: "Georgia, serif", cursor: printing === "pdf-checkin" ? "wait" : "pointer" }}
          >
            {printing === "pdf-checkin" ? "Building PDF…" : "⬇ DOWNLOAD CHECK-IN SHEETS (PDF)"}
          </button>
          <button
            onClick={() => void runPrint("pdf-intro", downloadIntroSheetsPdf)}
            disabled={printing === "pdf-intro"}
            style={{ backgroundColor: "#F5EDD4", color: "#2C4A2E", border: "none", borderRadius: "6px", padding: "0.875rem 1.25rem", fontSize: "0.95rem", fontWeight: 700, fontFamily: "Georgia, serif", cursor: printing === "pdf-intro" ? "wait" : "pointer" }}
          >
            {printing === "pdf-intro" ? "Building PDF…" : "⬇ DOWNLOAD EMCEE INTRODUCTION SHEETS (PDF)"}
          </button>
          <span style={{ color: "#E8DFC8", fontSize: "0.8rem", flexBasis: "100%" }}>
            Confirmed contestants only, ordered by division then last name. Each contestant starts on a new page. Files save to your Downloads folder.
          </span>
        </div>

        {/* ── Print Actions Bar ── */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8", borderRadius: "8px", padding: "0.875rem 1rem", marginBottom: "1.25rem", display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: "#8B7355", fontSize: "0.8125rem", fontWeight: 700, marginRight: "0.25rem" }}>🖨 Print / Export:</span>
          <button
            style={{ ...printBtnStyle, backgroundColor: "#2C4A2E", color: "#F5EDD4", borderColor: "#2C4A2E" }}
            disabled={printing === "all"}
            onClick={() => void runPrint("all", printAll)}
          >
            {printing === "all" ? "Loading…" : "Print All Registrations"}
          </button>
          <button
            style={{ ...printBtnStyle, backgroundColor: "#D4A827", color: "#2C4A2E", borderColor: "#D4A827" }}
            disabled={printing === "allforms"}
            onClick={() => void runPrint("allforms", printAllForms)}
            title="Every contestant's full registration form, one per page"
          >
            {printing === "allforms" ? "Loading…" : "Print All Complete Forms"}
          </button>
          <button
            style={printBtnStyle}
            disabled={printing === "checkin"}
            onClick={() => void runPrint("checkin", printCheckInSheets)}
          >
            {printing === "checkin" ? "Loading…" : "Print Check-In Sheets"}
          </button>
        </div>

        {/* Division summary bar */}
        <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", marginBottom: "1.5rem", paddingBottom: "0.25rem" }}>
          {PAGEANT_DIVISIONS.map((d) => (
            <div
              key={d.id}
              style={{
                backgroundColor: "#fff",
                border: `2px solid ${divisionFilter === d.id ? d.accentColor : "#E8DFC8"}`,
                borderRadius: "6px",
                padding: "0.625rem 1rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "border-color 0.15s",
              }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setDivisionFilter(divisionFilter === d.id ? "" : d.id)}
              >
                <p style={{ margin: 0, color: d.accentColor, fontSize: "0.8125rem", fontWeight: 700 }}>{d.name}</p>
                <p style={{ margin: 0, color: "#8B7355", fontSize: "0.75rem" }}>
                  {confirmedByDivision[d.id] ?? 0} Confirmed
                </p>
              </div>
              {(confirmedByDivision[d.id] ?? 0) > 0 && (
                <button
                  onClick={() => void runPrint(`div-${d.id}`, () => printDivision(d.id, d.name))}
                  disabled={printing === `div-${d.id}`}
                  style={{
                    marginTop: "0.375rem",
                    width: "100%",
                    padding: "2px 0",
                    backgroundColor: "transparent",
                    border: `1px solid ${d.accentColor}`,
                    borderRadius: "3px",
                    color: d.accentColor,
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {printing === `div-${d.id}` ? "…" : "🖨 List"}
                </button>
              )}
              {(confirmedByDivision[d.id] ?? 0) > 0 && (
                <button
                  onClick={() => void runPrint(`divf-${d.id}`, () => printDivisionForms(d.id, d.name))}
                  disabled={printing === `divf-${d.id}`}
                  style={{
                    marginTop: "0.25rem",
                    width: "100%",
                    padding: "2px 0",
                    backgroundColor: d.accentColor,
                    border: `1px solid ${d.accentColor}`,
                    borderRadius: "3px",
                    color: "#fff",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {printing === `divf-${d.id}` ? "…" : "🖨 Forms"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          {(["CONFIRMED", "PAYMENT_PENDING", "ALL"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: statusFilter === s ? "#2C4A2E" : "#E8DFC8",
                backgroundColor: statusFilter === s ? "#2C4A2E" : "#fff",
                color: statusFilter === s ? "#F5EDD4" : "#5C4A32",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                fontWeight: statusFilter === s ? 600 : 400,
              }}
            >
              {s === "PAYMENT_PENDING" ? "Pending Payment" : s === "CONFIRMED" ? "Confirmed" : "All"}
            </button>
          ))}
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "0.5rem 0.75rem", border: "1px solid #E8DFC8", borderRadius: "4px", fontSize: "0.875rem", fontFamily: "Georgia, serif", minWidth: "220px", backgroundColor: "#fff" }}
          />
          <button onClick={() => void fetchRegistrations()} style={{ padding: "0.5rem 1rem", backgroundColor: "#D4A827", color: "#2C4A2E", border: "none", borderRadius: "4px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>
            Search
          </button>
        </div>

        <p style={{ color: "#8B7355", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
          {total} record{total !== 1 ? "s" : ""}
        </p>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem", color: "#991B1B" }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8", borderRadius: "8px", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Contestant</th>
                <th style={thStyle}>Division</th>
                <th style={thStyle}>DOB</th>
                <th style={thStyle}>Guardian</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Confirmed</th>
                <th style={thStyle}>Fee</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "#8B7355", padding: "2rem" }}>
                    Loading…
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "#8B7355", padding: "2rem" }}>
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/pageants/admin/dashboard/${reg.id}`)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAF7")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {reg.contestant_first_name} {reg.contestant_last_name}
                    </td>
                    <td style={tdStyle}>{reg.division_name}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{reg.contestant_dob}</td>
                    <td style={tdStyle}>{reg.guardian_name}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{reg.guardian_phone}</td>
                    <td style={tdStyle}><StatusBadge status={reg.status} /></td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatDate(reg.confirmed_at)}</td>
                    <td style={tdStyle}>{formatDollars(reg.amount_cents)}</td>
                    <td style={{ ...tdStyle, color: "#2C4A2E", fontWeight: 600, fontSize: "0.8125rem" }}>
                      View →
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
