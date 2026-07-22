"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EntryRow {
  id: string; department: string; division: string;
  class_name: string; lot: string; entry_title?: string; entry_description?: string;
  quantity: number; sort_order: number;
}

interface Entrant {
  first_name: string; last_name: string; address: string;
  city: string; state: string; zip: string; phone: string; email: string;
  entrant_type: string; youth_age?: number; youth_grade?: string;
  guardian_name?: string; guardian_phone?: string; guardian_email?: string;
  created_at: string;
}

interface Registration {
  id: string;
  submission_ref: string;
  fair_year: number;
  status: string;
  submitted_at: string;
  entry_count: number;
  rules_agreed: boolean;
  notes: string | null;
  official_program_id: string | null;
  data_entry_status: string;
  confirmation_email_sent: boolean;
  notification_email_sent: boolean;
  ip_address: string | null;
  exhibit_entrants: Entrant;
  exhibit_entries: EntryRow[];
}

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [reg, setReg]     = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  // Editable staff fields
  const [programId, setProgramId]     = useState("");
  const [entryStatus, setEntryStatus] = useState("Pending");
  const [notes, setNotes]             = useState("");

  useEffect(() => {
    fetch(`/api/exhibits/admin/submissions/${id}`)
      .then((r) => { if (r.status === 401) { router.push("/exhibits/admin"); return null; } return r.json(); })
      .then((json) => {
        if (!json) return;
        setReg(json.data);
        setProgramId(json.data.official_program_id ?? "");
        setEntryStatus(json.data.data_entry_status ?? "Pending");
        setNotes(json.data.notes ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/exhibits/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        official_program_id: programId || null,
        data_entry_status: entryStatus,
        notes: notes || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center" style={{ backgroundColor: "#F5EDD4" }}>
        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#2C4A2E" strokeWidth="4" />
          <path className="opacity-75" fill="#2C4A2E" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (!reg) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#F5EDD4" }}>
        <p style={{ color: "#5C4A32" }}>Submission not found.</p>
        <Link href="/exhibits/admin/dashboard" className="underline" style={{ color: "#2C4A2E" }}>← Back to Dashboard</Link>
      </div>
    );
  }

  const e = reg.exhibit_entrants;

  return (
    <div style={{ backgroundColor: "#F5EDD4" }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: "#2C4A2E" }} className="px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/exhibits/admin/dashboard"
            className="text-xs font-medium mb-2 block hover:opacity-80 transition-opacity"
            style={{ color: "#A8BFA9" }}
          >
            ← Back to Dashboard
          </Link>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827" }}>
            Submission Detail
          </p>
          <h1
            className="text-xl font-bold italic font-mono"
            style={{ fontFamily: "monospace", color: "#F5EDD4", fontStyle: "normal" }}
          >
            {reg.submission_ref}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: entrant + entries */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Entrant info */}
          <div className="p-6" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#D4A827" }}>
              Entrant Information
            </p>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Name", `${e.last_name}, ${e.first_name}`],
                  ["Type", e.entrant_type === "youth" ? `Youth${e.youth_age ? ` (Age ${e.youth_age})` : ""}${e.youth_grade ? `, ${e.youth_grade}` : ""}` : "Adult"],
                  ...(e.guardian_name ? [["Guardian", `${e.guardian_name}${e.guardian_phone ? ` · ${e.guardian_phone}` : ""}`]] : []),
                  ["Email", e.email],
                  ["Phone", e.phone],
                  ["Address", `${e.address}, ${e.city}, ${e.state} ${e.zip}`],
                  ["Registered", new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(reg.submitted_at))],
                  ["IP Address", reg.ip_address ?? "—"],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: "1px solid #F0E8D0" }}>
                    <td className="py-2 pr-4 text-xs font-bold uppercase" style={{ color: "#8B7355", width: "30%" }}>{label}</td>
                    <td className="py-2" style={{ color: "#2C4A2E" }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exhibit entries */}
          <div className="p-6" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#D4A827" }}>
              Exhibit Entries ({reg.exhibit_entries.length})
            </p>
            <div className="space-y-3">
              {[...reg.exhibit_entries].sort((a,b) => a.sort_order - b.sort_order).map((entry, i) => (
                <div
                  key={entry.id}
                  className="p-4"
                  style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2">
                        <div>
                          <span className="font-bold uppercase" style={{ color: "#8B7355" }}>Dept</span><br/>
                          <span style={{ color: "#2C4A2E" }}>{entry.department}</span>
                        </div>
                        <div>
                          <span className="font-bold uppercase" style={{ color: "#8B7355" }}>Division</span><br/>
                          <span style={{ color: "#2C4A2E" }}>{entry.division}</span>
                        </div>
                        <div>
                          <span className="font-bold uppercase" style={{ color: "#8B7355" }}>Class</span><br/>
                          <span style={{ color: "#2C4A2E" }}>{entry.class_name}</span>
                        </div>
                        <div>
                          <span className="font-bold uppercase" style={{ color: "#8B7355" }}>Lot</span><br/>
                          <span style={{ color: "#2C4A2E" }}>{entry.lot}</span>
                        </div>
                      </div>
                      {(entry.entry_title || entry.entry_description) && (
                        <p className="text-sm" style={{ color: "#5C4A32" }}>
                          {entry.entry_title || entry.entry_description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: staff actions */}
        <div className="flex flex-col gap-6">

          {/* Status & program ID */}
          <div className="p-6" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#D4A827" }}>
              Staff Actions
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: "#5C4A32" }}>
                Data Entry Status
              </label>
              <select
                value={entryStatus}
                onChange={(ev) => setEntryStatus(ev.target.value)}
                className="w-full border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white"
                style={{ borderColor: "#D4C9A8" }}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Entered</option>
                <option>Needs Review</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: "#5C4A32" }}>
                Official Program ID
                <span className="ml-1 font-normal normal-case" style={{ color: "#8B7355" }}>
                  (assigned by fair program)
                </span>
              </label>
              <input
                type="text"
                value={programId}
                onChange={(ev) => setProgramId(ev.target.value)}
                placeholder="Enter after adding to program"
                className="w-full border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white font-mono"
                style={{ borderColor: "#D4C9A8" }}
              />
              <p className="text-xs mt-1" style={{ color: "#8B7355" }}>
                Not assigned by the website. Enter this after manually adding the entrant to the fair&apos;s exhibit management program.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: "#5C4A32" }}>
                Staff Notes
              </label>
              <textarea
                value={notes}
                onChange={(ev) => setNotes(ev.target.value)}
                rows={3}
                placeholder="Internal notes…"
                className="w-full border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white resize-none"
                style={{ borderColor: "#D4C9A8" }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: saved ? "#065F46" : "#2C4A2E", color: saved ? "#D1FAE5" : "#D4A827" }}
            >
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>

          {/* Email status */}
          <div className="p-5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827" }}>
              Email Status
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span style={{ color: "#5C4A32" }}>Confirmation to entrant</span>
                <span style={{ color: reg.confirmation_email_sent ? "#065F46" : "#dc2626", fontWeight: "bold" }}>
                  {reg.confirmation_email_sent ? "✓ Sent" : "✗ Not sent"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "#5C4A32" }}>Staff notification</span>
                <span style={{ color: reg.notification_email_sent ? "#065F46" : "#dc2626", fontWeight: "bold" }}>
                  {reg.notification_email_sent ? "✓ Sent" : "✗ Not sent"}
                </span>
              </div>
            </div>
          </div>

          {/* Export this submission */}
          <div className="p-5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827" }}>Quick Export</p>
            <a
              href={`/api/exhibits/admin/export/entrants?format=csv&year=${reg.fair_year}`}
              className="block w-full py-2 text-center text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-70 mb-2"
              style={{ borderColor: "#D4C9A8", color: "#2C4A2E" }}
            >
              All Entrants (CSV)
            </a>
            <a
              href={`/api/exhibits/admin/export/entries?format=csv&year=${reg.fair_year}`}
              className="block w-full py-2 text-center text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-70"
              style={{ borderColor: "#D4C9A8", color: "#2C4A2E" }}
            >
              All Entries (CSV)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
