"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Division = "all" | "kids" | "youth" | "adult";
type StatusFilter = "all" | "CONFIRMED" | "PAYMENT_PENDING";

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
  created_at: string;
}

interface ListResponse {
  data: RegRow[];
  total: number;
  byDivision: { kids: number; youth: number; adult: number };
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

export default function GotTalentDashboard() {
  const router = useRouter();
  const [division, setDivision] = useState<Division>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
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
    if (statusFilter !== "all") params.set("status", statusFilter);
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
  }, [division, statusFilter, search, tick]); // tick = manual refresh trigger

  async function handleSignOut() {
    await fetch("/api/got-talent/admin/auth", { method: "DELETE" });
    router.push("/got-talent/admin");
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
        {/* Stats */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Kids (confirmed)", value: counts?.kids ?? "—", color: "#2C4A2E" },
            { label: "Youth (confirmed)", value: counts?.youth ?? "—", color: "#2C4A2E" },
            { label: "Adult (confirmed)", value: counts?.adult ?? "—", color: "#2C4A2E" },
            { label: "Showing", value: data?.total ?? "—", color: "#5C4A32" },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: "#fff", border: "1px solid #D4C89A", borderRadius: "6px", padding: "0.75rem 1.25rem", minWidth: "140px" }}>
              <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 0.2rem" }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>{String(s.value)}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Division tabs */}
          {(["all", "kids", "youth", "adult"] as Division[]).map((d) => (
            <button
              key={d}
              onClick={() => setDivision(d)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                border: "2px solid #D4A827",
                backgroundColor: division === d ? "#D4A827" : "transparent",
                color: division === d ? "#1A1A1A" : "#5C4A32",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              {d === "all" ? "All" : DIVISION_LABELS[d]}
            </button>
          ))}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            style={{ padding: "0.4rem 0.75rem", borderRadius: "4px", border: "2px solid #D4C89A", backgroundColor: "#fff", fontFamily: "Georgia, serif", fontSize: "0.85rem" }}
          >
            <option value="all">All statuses</option>
            <option value="CONFIRMED">Confirmed only</option>
            <option value="PAYMENT_PENDING">Pending only</option>
          </select>

          <input
            type="search"
            placeholder="Search act, name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            style={{ padding: "0.4rem 0.75rem", borderRadius: "4px", border: "2px solid #D4C89A", fontFamily: "Georgia, serif", fontSize: "0.85rem", minWidth: "220px" }}
          />
          <button
            onClick={load}
            style={{ padding: "0.4rem 1rem", backgroundColor: "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Search
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ color: "#7A6A52" }}>Loading…</p>
        ) : rows.length === 0 ? (
          <p style={{ color: "#7A6A52" }}>No registrations found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "6px", overflow: "hidden", border: "1px solid #D4C89A" }}>
              <thead>
                <tr style={{ backgroundColor: "#2C4A2E" }}>
                  {["Act / Performer", "Division", "Age", "Solo/Group", "Talent", "Music", "Contact", "Phone", "Status", "Registered", ""].map((h) => (
                    <th key={h} style={{ padding: "0.6rem 0.75rem", color: "#F5EDD4", fontSize: "0.75rem", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const age = ageFromDob(r.primary_performer_dob);
                  const isConfirmed = r.status === "CONFIRMED";
                  return (
                    <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#FAFAF8", borderBottom: "1px solid #E8DFC8" }}>
                      <td style={{ padding: "0.6rem 0.75rem" }}>
                        <div style={{ fontWeight: "700", color: "#2C4A2E", fontSize: "0.9rem" }}>
                          {r.act_name}
                          {r.division_conflict && <span title="Division conflict — needs review" style={{ marginLeft: "0.4rem", color: "#8B2E2E" }}>⚠</span>}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#7A6A52" }}>{r.primary_performer_name}</div>
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}>{DIVISION_LABELS[r.division] ?? r.division}</td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}>{age}</td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}>
                        {r.is_group ? `Group (${r.performer_count})` : "Solo"}
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}>{r.act_type}</td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem", textAlign: "center" }}>{r.requires_music ? "✓" : "—"}</td>
                      <td style={{ padding: "0.6rem 0.75rem" }}>
                        <div style={{ fontSize: "0.85rem" }}>{r.contact_name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#7A6A52" }}>{r.contact_email}</div>
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.82rem", whiteSpace: "nowrap" }}>{r.contact_phone}</td>
                      <td style={{ padding: "0.6rem 0.75rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            fontSize: "0.72rem",
                            fontWeight: "700",
                            backgroundColor: isConfirmed ? "#D4F0D4" : "#FFF3CD",
                            color: isConfirmed ? "#1A5C1A" : "#7A5C00",
                          }}
                        >
                          {isConfirmed ? "Confirmed" : r.status === "PAYMENT_PENDING" ? "Pending" : r.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.78rem", color: "#7A6A52", whiteSpace: "nowrap" }}>
                        {new Date(r.created_at).toLocaleDateString()}
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
