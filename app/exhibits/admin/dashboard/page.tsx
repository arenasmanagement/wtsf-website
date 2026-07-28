"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FAIR_YEAR } from "@/lib/exhibit-config";

interface EntrantData {
  first_name: string; last_name: string; email: string;
  entrant_type: string; phone: string;
}

interface Submission {
  id: string;
  submission_ref: string;
  submitted_at: string;
  entry_count: number;
  status: string;
  data_entry_status: string;
  official_program_id: string | null;
  confirmation_email_sent: boolean;
  exhibit_entrants: EntrantData | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:       { bg: "#FEF3C7", text: "#92400E" },
  "In Progress": { bg: "#DBEAFE", text: "#1E40AF" },
  Entered:       { bg: "#D1FAE5", text: "#065F46" },
  "Needs Review":{ bg: "#FEE2E2", text: "#991B1B" },
};

interface GlobalStats {
  totalEntries: number;
  pendingCount: number;
  enteredCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal]       = useState(0);
  const [stats, setStats]       = useState<GlobalStats>({ totalEntries: 0, pendingCount: 0, enteredCount: 0 });
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [entryFilter, setEntryFilter] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      year:         String(FAIR_YEAR),
      search:       search,
      entry_status: entryFilter,
    });
    const res = await fetch(`/api/exhibits/admin/submissions?${params}`);
    if (res.status === 401) { router.push("/exhibits/admin"); return; }
    const json = await res.json();
    setSubmissions(json.data ?? []);
    setTotal(json.total ?? 0);
    // Global aggregate stats — accurate across all pages, not just the current 50
    if (json.stats) setStats(json.stats);
    setLoading(false);
  }, [search, entryFilter, router]);

  // fetchData is an async useCallback that calls setLoading/setSubmissions/setTotal/
  // setStats after the API responds. Calling it from useEffect when dependencies
  // change is the standard data-fetching pattern — cascading renders are expected.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleLogout() {
    await fetch("/api/exhibits/admin/auth", { method: "DELETE" });
    router.push("/exhibits/admin");
  }

  return (
    <div style={{ backgroundColor: "#F5EDD4" }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: "#2C4A2E" }} className="px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827" }}>
              Staff Dashboard · WTSF {FAIR_YEAR}
            </p>
            <h1
              className="text-xl font-bold italic"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
            >
              Exhibit Registrations
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Export buttons */}
            <a
              href={`/api/exhibits/admin/export/entrants?format=xlsx&year=${FAIR_YEAR}`}
              className="px-4 py-2 text-xs font-bold tracking-wider uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A" }}
            >
              Export Entrants
            </a>
            <a
              href={`/api/exhibits/admin/export/entries?format=xlsx&year=${FAIR_YEAR}`}
              className="px-4 py-2 text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-80"
              style={{ borderColor: "#D4A827", color: "#D4A827" }}
            >
              Export Entries
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-medium border transition-opacity hover:opacity-70"
              style={{ borderColor: "rgba(245,237,212,0.3)", color: "#A8BFA9" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats — all values are global aggregates from the server, not computed
            from the current page. They reflect the full dataset regardless of
            search filters or pagination. */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Registrations",   value: total                  },
            { label: "Total Exhibit Entries",  value: stats.totalEntries     },
            { label: "Pending Entry",          value: stats.pendingCount     },
            { label: "Entered into Program",   value: stats.enteredCount     },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5"
              style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}
            >
              <p className="text-xs font-bold tracking-wide uppercase mb-1" style={{ color: "#8B7355" }}>
                {stat.label}
              </p>
              <p className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#2C4A2E" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            placeholder="Search by name, email, or reference…"
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
            className="flex-1 border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white"
            style={{ borderColor: "#D4C9A8" }}
          />
          <select
            value={entryFilter}
            onChange={(ev) => setEntryFilter(ev.target.value)}
            className="border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white"
            style={{ borderColor: "#D4C9A8" }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Entered">Entered</option>
            <option value="Needs Review">Needs Review</option>
          </select>
          <div className="flex gap-2">
            <a
              href={`/api/exhibits/admin/export/entrants?format=csv&year=${FAIR_YEAR}`}
              className="px-4 py-2.5 text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-70"
              style={{ borderColor: "#D4C9A8", color: "#5C4A32" }}
            >
              CSV Entrants
            </a>
            <a
              href={`/api/exhibits/admin/export/entries?format=csv&year=${FAIR_YEAR}`}
              className="px-4 py-2.5 text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-70"
              style={{ borderColor: "#D4C9A8", color: "#5C4A32" }}
            >
              CSV Entries
            </a>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#2C4A2E" strokeWidth="4" />
              <path className="opacity-75" fill="#2C4A2E" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#8B7355" }}>
            <p className="text-lg font-medium">No submissions found.</p>
            {(search || entryFilter) && (
              <button
                onClick={() => { setSearch(""); setEntryFilter(""); }}
                className="mt-3 text-sm underline"
                style={{ color: "#2C4A2E" }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ border: "1px solid #E8DFC8", backgroundColor: "#fff" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#2C4A2E" }}>
                    {["Reference", "Name", "Type", "Entries", "Submitted", "Email Sent", "Entry Status", "Program ID", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase"
                        style={{ color: "#D4A827", whiteSpace: "nowrap" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => {
                    const e = s.exhibit_entrants;
                    const sc = STATUS_COLORS[s.data_entry_status] ?? STATUS_COLORS.Pending;
                    return (
                      <tr
                        key={s.id}
                        style={{ backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff", borderBottom: "1px solid #E8DFC8" }}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: "#2C4A2E", whiteSpace: "nowrap" }}>
                          {s.submission_ref}
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: "#1A1A1A", whiteSpace: "nowrap" }}>
                          {e ? `${e.last_name}, ${e.first_name}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs uppercase font-medium" style={{ color: "#5C4A32" }}>
                          {e?.entrant_type ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: "#2C4A2E" }}>
                          {s.entry_count}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#5C4A32", whiteSpace: "nowrap" }}>
                          {s.submitted_at
                            ? new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(s.submitted_at))
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.confirmation_email_sent
                            ? <span style={{ color: "#065F46" }}>✓</span>
                            : <span style={{ color: "#dc2626" }}>✗</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-1 text-xs font-bold rounded"
                            style={{ backgroundColor: sc.bg, color: sc.text }}
                          >
                            {s.data_entry_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "#2C4A2E" }}>
                          {s.official_program_id || <span style={{ color: "#D4C9A8" }}>—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/exhibits/admin/dashboard/${s.id}`}
                            className="text-xs font-bold tracking-wide uppercase underline hover:no-underline"
                            style={{ color: "#2C4A2E" }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
