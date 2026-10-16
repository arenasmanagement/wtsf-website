"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDivisionById } from "@/lib/pageant-config";

interface FullRegistration {
  id: string;
  fair_year: number;
  division_id: string;
  division_name: string;
  status: string;
  contestant_first_name: string;
  contestant_last_name: string;
  contestant_dob: string;
  contestant_age_months: number | null;
  contestant_school: string | null;
  contestant_grade: string | null;
  contestant_hair_color: string | null;
  contestant_eye_color: string | null;
  contestant_hobbies: string | null;
  contestant_ambitions: string | null;
  guardian_name: string;
  guardian_relationship: string | null;
  guardian_address: string;
  guardian_city: string;
  guardian_state: string;
  guardian_zip: string;
  guardian_phone: string;
  guardian_email: string;
  rules_agreed: boolean;
  media_release_agreed: boolean;
  acknowledged_at: string | null;
  amount_cents: number | null;
  square_payment_id: string | null;
  square_order_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  payment_deadline: string;
  confirmed_at: string | null;
  expired_at: string | null;
  cancelled_at: string | null;
  confirmation_email_sent: boolean;
  notification_email_sent: boolean;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
    timeZone: "America/Chicago", timeZoneName: "short",
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
    <span style={{ backgroundColor: c.bg, color: c.color, padding: "4px 12px", borderRadius: "4px", fontSize: "0.875rem", fontWeight: 700 }}>
      {status.replace("_", " ")}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8", borderRadius: "8px", marginBottom: "1.25rem", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#F5EDD4", padding: "0.625rem 1.25rem", borderBottom: "1px solid #E8DFC8" }}>
        <strong style={{ color: "#2C4A2E", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</strong>
      </div>
      <div style={{ padding: "1rem 1.25rem" }}>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "0.4rem 0", borderBottom: "1px solid #F5EDD4" }}>
      <span style={{ color: "#8B7355", fontSize: "0.8125rem", width: "160px", flexShrink: 0, paddingTop: "2px" }}>{label}</span>
      <span style={{ color: "#2C4A2E", fontSize: "0.9rem", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// ── Print helper for individual registration ──────────────────────────────────

function printRegistration(reg: FullRegistration): void {
  const division = getDivisionById(reg.division_id);
  const printedAt = new Date().toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: "America/Chicago", timeZoneName: "short",
  });

  function row(label: string, value: string | null | undefined): string {
    if (!value) return "";
    return `<tr>
      <td style="color:#666;font-size:9pt;width:160pt;padding:4pt 6pt;border-bottom:1px solid #eee;vertical-align:top;">${label}</td>
      <td style="font-size:9.5pt;padding:4pt 6pt;border-bottom:1px solid #eee;color:#111;">${value}</td>
    </tr>`;
  }

  function section(title: string, rows: string): string {
    if (!rows.trim()) return "";
    return `<div style="margin-bottom:14pt;">
      <div style="background:#2C4A2E;color:#fff;padding:4pt 8pt;font-size:9pt;font-weight:bold;
        text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0;">${title}</div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;border-top:none;">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  const html = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Georgia, serif; color: #000; background: #fff; font-size: 10pt; }
      @page { size: letter portrait; margin: 0.75in; }
      @media print { .no-print { display: none; } }
      .print-btn { display: block; margin: 10pt auto 16pt; padding: 7pt 18pt;
        background: #2C4A2E; color: #fff; border: none; font-size: 10pt;
        font-family: Georgia, serif; border-radius: 4px; cursor: pointer; }
    </style>
    <div style="text-align:center;margin-bottom:16pt;padding-bottom:10pt;border-bottom:2px solid #000;">
      <div style="font-size:13pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">
        2026 West Tennessee State Fair
      </div>
      <div style="font-size:11pt;font-weight:bold;margin-top:3pt;">
        Traditional Pageants — October 17, 2026
      </div>
      <div style="font-size:10pt;margin-top:4pt;">
        Individual Registration Record &nbsp;|&nbsp; Printed ${printedAt}
      </div>
    </div>
    <button class="print-btn no-print" onclick="window.print()">🖨 Print / Save as PDF</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12pt;">
      <div style="font-size:14pt;font-weight:bold;">${reg.contestant_first_name} ${reg.contestant_last_name}</div>
      <div style="background:${reg.status === "CONFIRMED" ? "#D4EDDA" : "#FFF3CD"};
        color:${reg.status === "CONFIRMED" ? "#155724" : "#856404"};
        padding:3pt 10pt;border-radius:4px;font-weight:bold;font-size:9.5pt;">
        ${reg.status.replace("_", " ")}
      </div>
    </div>
    ${section("Contestant", [
      row("Full Name", `${reg.contestant_first_name} ${reg.contestant_last_name}`),
      row("Date of Birth", reg.contestant_dob),
      reg.contestant_age_months !== null ? row("Age", `${reg.contestant_age_months} months`) : "",
      row("School", reg.contestant_school),
      row("Grade", reg.contestant_grade),
      row("Hair Color", reg.contestant_hair_color),
      row("Eye Color", reg.contestant_eye_color),
      row("Hobbies", reg.contestant_hobbies),
      row("Ambitions / Goals", reg.contestant_ambitions),
    ].join(""))}
    ${section("Parent / Guardian", [
      row("Name", reg.guardian_name),
      row("Relationship", reg.guardian_relationship),
      row("Address", `${reg.guardian_address}, ${reg.guardian_city}, ${reg.guardian_state} ${reg.guardian_zip}`),
      row("Phone", reg.guardian_phone),
      row("Email", reg.guardian_email),
    ].join(""))}
    ${section("Division & Schedule", [
      row("Division", reg.division_name),
      division ? row("Age Range", division.ageLabel) : "",
      division ? row("Arrival Time", division.arrivalTime) : "",
      division ? row("Competition Time", division.competitionTime) : "",
    ].join(""))}
    ${section("Registration & Payment", [
      row("Submitted", formatDateTime(reg.created_at)),
      row("Payment Deadline", formatDateTime(reg.payment_deadline)),
      reg.confirmed_at ? row("Confirmed", formatDateTime(reg.confirmed_at)) : "",
      reg.expired_at ? row("Expired", formatDateTime(reg.expired_at)) : "",
      reg.cancelled_at ? row("Cancelled", formatDateTime(reg.cancelled_at)) : "",
      row("Entry Fee", formatDollars(reg.amount_cents)),
      row("Paid At", formatDateTime(reg.paid_at)),
      row("Square Payment ID", reg.square_payment_id),
    ].join(""))}
    ${section("Acknowledgments", [
      row("Rules Agreed", reg.rules_agreed ? "Yes" : "No"),
      row("Media Release", reg.media_release_agreed ? "Granted" : "Not granted"),
      row("Acknowledged At", formatDateTime(reg.acknowledged_at)),
      row("Confirmation Email", reg.confirmation_email_sent ? "Sent" : "Not sent"),
    ].join(""))}
    <div style="margin-top:20pt;padding-top:8pt;border-top:1px solid #ccc;
      font-size:8pt;color:#666;text-align:center;">
      2026 WTSF Traditional Pageants · Williams Auditorium, Henderson TN ·
      Confidential — authorized staff only · Registration ID: ${reg.id}
    </div>
  `;

  const w = window.open("", "_blank", "width=850,height=700");
  if (!w) { alert("Please allow pop-ups to print."); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Registration — ${reg.contestant_first_name} ${reg.contestant_last_name}</title></head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function RegistrationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [reg, setReg] = useState<FullRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchReg = useCallback(async () => {
    try {
      const res = await fetch(`/api/pageants/admin/registrations/${id}`);
      if (res.status === 401) { router.push("/pageants/admin"); return; }
      if (!res.ok) { setError("Registration not found."); return; }
      const data = await res.json() as { data: FullRegistration };
      setReg(data.data);
    } catch {
      setError("Failed to load registration.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { void fetchReg(); }, [fetchReg]);

  async function handleCancel() {
    if (!cancelConfirm) { setCancelConfirm(true); return; }
    setConfirming(true);
    setActionError(null);
    const res = await fetch(`/api/pageants/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (res.ok) {
      await fetchReg();
      setCancelConfirm(false);
    } else {
      const d = await res.json() as { error?: string };
      setActionError(d.error ?? "Failed to cancel.");
    }
    setConfirming(false);
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#8B7355" }}>Loading…</p>
      </div>
    );
  }

  if (error || !reg) {
    return (
      <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", padding: "2rem", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#8B2E2E" }}>{error ?? "Not found"}</p>
        <a href="/pageants/admin/dashboard" style={{ color: "#2C4A2E" }}>← Back to Dashboard</a>
      </div>
    );
  }

  const division = getDivisionById(reg.division_id);

  return (
    <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#2C4A2E", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <a href="/pageants/admin/dashboard" style={{ color: "#D4A827", fontSize: "0.875rem", textDecoration: "none" }}>← Dashboard</a>
          <h1 style={{ color: "#F5EDD4", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: "4px 0 0" }}>
            {reg.contestant_first_name} {reg.contestant_last_name}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <StatusBadge status={reg.status} />
          <button
            onClick={() => printRegistration(reg)}
            style={{
              backgroundColor: "#D4A827",
              color: "#2C4A2E",
              border: "none",
              borderRadius: "4px",
              padding: "0.375rem 0.875rem",
              fontSize: "0.875rem",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
            }}
          >
            🖨 Print Registration
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem" }}>

        <Section title="Contestant">
          <Row label="Full Name" value={`${reg.contestant_first_name} ${reg.contestant_last_name}`} />
          <Row label="Date of Birth" value={reg.contestant_dob} />
          {reg.contestant_age_months !== null && <Row label="Age (months)" value={String(reg.contestant_age_months)} />}
          {reg.contestant_school && <Row label="School" value={reg.contestant_school} />}
          {reg.contestant_grade && <Row label="Grade" value={reg.contestant_grade} />}
          {reg.contestant_hair_color && <Row label="Hair Color" value={reg.contestant_hair_color} />}
          {reg.contestant_eye_color && <Row label="Eye Color" value={reg.contestant_eye_color} />}
          {reg.contestant_hobbies && <Row label="Hobbies" value={reg.contestant_hobbies} />}
          {reg.contestant_ambitions && <Row label="Ambitions" value={reg.contestant_ambitions} />}
        </Section>

        <Section title="Parent / Guardian">
          <Row label="Name" value={reg.guardian_name} />
          {reg.guardian_relationship && <Row label="Relationship" value={reg.guardian_relationship} />}
          <Row label="Address" value={`${reg.guardian_address}, ${reg.guardian_city}, ${reg.guardian_state} ${reg.guardian_zip}`} />
          <Row label="Phone" value={reg.guardian_phone} />
          <Row label="Email" value={<a href={`mailto:${reg.guardian_email}`} style={{ color: "#2C4A2E" }}>{reg.guardian_email}</a>} />
        </Section>

        <Section title="Registration">
          <Row label="Division" value={reg.division_name} />
          {division && <>
            <Row label="Arrival Time" value={division.arrivalTime} />
            <Row label="Competition Time" value={division.competitionTime} />
          </>}
          <Row label="Submitted" value={formatDateTime(reg.created_at)} />
          <Row label="Payment Deadline" value={formatDateTime(reg.payment_deadline)} />
          {reg.confirmed_at && <Row label="Confirmed" value={formatDateTime(reg.confirmed_at)} />}
          {reg.expired_at && <Row label="Expired" value={formatDateTime(reg.expired_at)} />}
          {reg.cancelled_at && <Row label="Cancelled" value={formatDateTime(reg.cancelled_at)} />}
        </Section>

        <Section title="Payment">
          <Row label="Amount" value={formatDollars(reg.amount_cents)} />
          <Row label="Paid At" value={formatDateTime(reg.paid_at)} />
          <Row label="Square Payment ID" value={reg.square_payment_id ?? "—"} />
          {reg.square_order_id && <Row label="Square Order ID" value={reg.square_order_id} />}
        </Section>

        <Section title="Acknowledgments">
          <Row label="Rules Agreed" value={reg.rules_agreed ? "Yes" : "No"} />
          <Row label="Media Release" value={reg.media_release_agreed ? "Granted" : "Not granted"} />
          <Row label="Acknowledged At" value={formatDateTime(reg.acknowledged_at)} />
          <Row label="Confirmation Email" value={reg.confirmation_email_sent ? "Sent" : "Not sent"} />
          <Row label="Notification Email" value={reg.notification_email_sent ? "Sent" : "Not sent"} />
        </Section>

        {/* Admin actions */}
        {reg.status !== "CANCELLED" && reg.status !== "EXPIRED" && (
          <div style={{ backgroundColor: "#fff", border: "1px solid #FECACA", borderRadius: "8px", padding: "1.25rem" }}>
            <h3 style={{ color: "#8B2E2E", fontSize: "0.875rem", margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Admin Actions
            </h3>
            {actionError && (
              <p style={{ color: "#8B2E2E", fontSize: "0.875rem", marginBottom: "0.75rem" }}>{actionError}</p>
            )}
            {cancelConfirm ? (
              <div>
                <p style={{ color: "#8B2E2E", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                  Are you sure you want to cancel this registration? This cannot be undone.
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => setCancelConfirm(false)} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", border: "1px solid #E8DFC8", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia, serif", color: "#5C4A32" }}>
                    No, Keep It
                  </button>
                  <button onClick={() => void handleCancel()} disabled={confirming} style={{ padding: "0.5rem 1rem", backgroundColor: "#8B2E2E", color: "#fff", border: "none", borderRadius: "4px", cursor: confirming ? "not-allowed" : "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>
                    {confirming ? "Cancelling…" : "Yes, Cancel Registration"}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => void handleCancel()} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", border: "1px solid #8B2E2E", color: "#8B2E2E", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.9rem" }}>
                Cancel Registration
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
