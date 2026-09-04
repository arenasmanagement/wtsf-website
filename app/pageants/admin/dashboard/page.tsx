"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PAGEANT_DIVISIONS } from "@/lib/pageant-config";

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

export default function PageantAdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [byDivision, setByDivision] = useState<ByDivision>({});
  const [total, setTotal] = useState(0);
  const [divisionFilter, setDivisionFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ year: "2026", status: "CONFIRMED" });
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
  }, [divisionFilter, search, router]);

  useEffect(() => {
    void fetchRegistrations();
  }, [fetchRegistrations]);

  async function handleLogout() {
    await fetch("/api/pageants/admin/auth", { method: "DELETE" });
    router.push("/pageants/admin");
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

  return (
    <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#2C4A2E", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ color: "#F5EDD4", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: 0 }}>
            2026 Traditional Pageants
          </h1>
          <p style={{ color: "#D4A827", fontSize: "0.8125rem", margin: 0 }}>Registration Dashboard — Confirmed Registrations</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={handleLogout} style={{ backgroundColor: "transparent", color: "#E8DFC8", border: "1px solid #5C7A5E", borderRadius: "4px", padding: "0.375rem 0.75rem", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
        {/* Division summary bar — confirmed counts */}
        <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", marginBottom: "1.5rem", paddingBottom: "0.25rem" }}>
          {PAGEANT_DIVISIONS.map((d) => (
            <div
              key={d.id}
              style={{
                backgroundColor: "#fff",
                border: `2px solid ${divisionFilter === d.id ? d.accentColor : "#E8DFC8"}`,
                borderRadius: "6px",
                padding: "0.625rem 1rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "border-color 0.15s",
              }}
              onClick={() => setDivisionFilter(divisionFilter === d.id ? "" : d.id)}
            >
              <p style={{ margin: 0, color: d.accentColor, fontSize: "0.8125rem", fontWeight: 700 }}>{d.name}</p>
              <p style={{ margin: 0, color: "#8B7355", fontSize: "0.75rem" }}>
                {byDivision[d.id] ?? 0} Confirmed
              </p>
            </div>
          ))}
        </div>

        {/* Search / filter bar */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void fetchRegistrations(); }}
            style={{ padding: "0.5rem 0.75rem", border: "1px solid #E8DFC8", borderRadius: "4px", fontSize: "0.875rem", fontFamily: "Georgia, serif", minWidth: "220px", backgroundColor: "#fff" }}
          />
          <button onClick={() => void fetchRegistrations()} style={{ padding: "0.5rem 1rem", backgroundColor: "#D4A827", color: "#2C4A2E", border: "none", borderRadius: "4px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>
            Search
          </button>
          {divisionFilter && (
            <button onClick={() => setDivisionFilter("")} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#8B7355", border: "1px solid #E8DFC8", borderRadius: "4px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Georgia, serif" }}>
              Clear Filter
            </button>
          )}
        </div>

        <p style={{ color: "#8B7355", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
          {total} confirmed registration{total !== 1 ? "s" : ""}
        </p>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem", color: "#991B1B" }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8", borderRadius: "8px", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Contestant</th>
                <th style={thStyle}>Division</th>
                <th style={thStyle}>DOB</th>
                <th style={thStyle}>Guardian</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Confirmed</th>
                <th style={thStyle}>Fee Paid</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "#8B7355", padding: "2rem" }}>
                    Loading…
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "#8B7355", padding: "2rem" }}>
                    No confirmed registrations found.
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
