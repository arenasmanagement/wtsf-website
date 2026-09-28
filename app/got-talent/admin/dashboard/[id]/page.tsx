"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getDivisionById } from "@/lib/got-talent-config";
import { formatPhone, phoneHref } from "@/lib/phone-format";

interface RegDetail {
  id: string;
  act_name: string;
  act_type: string;
  is_group: boolean;
  performer_count: number;
  primary_performer_name: string;
  primary_performer_dob: string;
  additional_performers: Array<{ name: string; age_years: number }>;
  division: string;
  division_conflict: boolean;
  act_description: string | null;
  instrument_ack: boolean;
  requires_music: boolean;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  entry_fee_cents: number;
  square_payment_id: string | null;
  amount_cents: number | null;
  paid_at: string | null;
  confirmed_at: string | null;
  confirmation_email_sent_at: string | null;
  notification_email_sent_at: string | null;
  created_at: string;
  updated_at: string;
  // Removal audit fields (populated only when status === 'REMOVED')
  removed_at: string | null;
  removed_by: string | null;
  removal_reason: string | null;
  removal_notes: string | null;
}

const REMOVAL_REASONS = [
  { value: "", label: "Select a reason…" },
  { value: "contestant_withdrew", label: "Contestant withdrew" },
  { value: "duplicate_registration", label: "Duplicate registration" },
  { value: "disqualified_ineligible", label: "Disqualified / ineligible" },
  { value: "administrative_correction", label: "Administrative correction" },
  { value: "test_registration", label: "Test registration" },
  { value: "other", label: "Other" },
];

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <tr style={{ borderBottom: "1px solid #E8DFC8" }}>
      <td style={{ padding: "0.6rem 0", color: "#7A6A52", fontSize: "0.85rem", width: "40%", verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "0.6rem 0", color: "#2C4A2E", fontSize: "0.9rem" }}>{value ?? "—"}</td>
    </tr>
  );
}

function PhoneField({ label, raw }: { label: string; raw: string | null | undefined }) {
  const display = raw ? formatPhone(raw) : "—";
  const href = raw ? phoneHref(raw) : null;
  return (
    <tr style={{ borderBottom: "1px solid #E8DFC8" }}>
      <td style={{ padding: "0.6rem 0", color: "#7A6A52", fontSize: "0.85rem", width: "40%", verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "0.6rem 0", color: "#2C4A2E", fontSize: "0.9rem" }}>
        {href ? (
          <a href={`tel:${href}`} style={{ color: "#2C4A2E", textDecoration: "none" }}>{display}</a>
        ) : display}
      </td>
    </tr>
  );
}

type RemoveState = "idle" | "confirming" | "submitting";

export default function GotTalentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [reg, setReg] = useState<RegDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Removal dialog state
  const [removeState, setRemoveState] = useState<RemoveState>("idle");
  const [removeReason, setRemoveReason] = useState("");
  const [removeNotes, setRemoveNotes] = useState("");
  const [removeError, setRemoveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/got-talent/admin/registrations/${id}`)
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) { router.push("/got-talent/admin"); return; }
        const json = await r.json() as { data?: RegDetail; error?: string };
        if (json.error) { setError(json.error); return; }
        if (!json.data) { setError("Registration not found."); return; }
        setReg(json.data);
      })
      .catch(() => setError("Failed to load registration."));
  }, [id, router]);

  async function handleRemoveSubmit() {
    if (!removeReason) { setRemoveError("Please select a reason."); return; }
    if (removeReason === "other" && !removeNotes.trim()) {
      setRemoveError("Please provide notes when selecting Other."); return;
    }
    setRemoveError(null);
    setRemoveState("submitting");
    try {
      const res = await fetch(`/api/got-talent/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          reason: removeReason,
          notes: removeNotes.trim() || undefined,
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setRemoveError(data.error ?? "Removal failed. Please try again.");
        setRemoveState("confirming");
        return;
      }
      // Success — redirect to dashboard
      router.push("/got-talent/admin");
    } catch {
      setRemoveError("Network error. Please try again.");
      setRemoveState("confirming");
    }
  }

  if (error) {
    return (
      <main style={{ padding: "4rem 2rem", fontFamily: "Georgia, serif", textAlign: "center" }}>
        <p style={{ color: "#8B2E2E" }}>{error}</p>
        <Link href="/got-talent/admin" style={{ color: "#2C4A2E" }}>← Back to Dashboard</Link>
      </main>
    );
  }
  if (!reg) {
    return (
      <main style={{ padding: "4rem 2rem", fontFamily: "Georgia, serif", textAlign: "center" }}>
        <p style={{ color: "#7A6A52" }}>Loading…</p>
      </main>
    );
  }

  const divInfo = getDivisionById(reg.division);
  const isConfirmed = reg.status === "CONFIRMED";
  const isRemoved = reg.status === "REMOVED";

  const statusBadge = isConfirmed
    ? { bg: "#D4F0D4", color: "#1A5C1A", label: "Confirmed" }
    : isRemoved
    ? { bg: "#F5E0E0", color: "#8B2E2E", label: "Removed" }
    : reg.status === "PAYMENT_PENDING"
    ? { bg: "#FFF3CD", color: "#7A5C00", label: "Payment Pending" }
    : { bg: "#E8E8E8", color: "#555", label: reg.status };

  return (
    <>
      {/* Remove confirmation modal overlay */}
      {removeState === "confirming" || removeState === "submitting" ? (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "2px solid #8B2E2E",
            maxWidth: "480px",
            width: "100%",
            padding: "1.75rem",
            fontFamily: "Georgia, serif",
          }}>
            <h2 style={{ color: "#8B2E2E", fontSize: "1.125rem", margin: "0 0 0.25rem" }}>Remove Registration</h2>
            <p style={{ color: "#5C4A32", fontSize: "0.85rem", margin: "0 0 1.25rem" }}>
              This action is permanent within the current admin tools. The record will be preserved for audit purposes.
            </p>

            {/* Summary */}
            <div style={{ backgroundColor: "#FDF0F0", border: "1px solid #E8B4B4", borderRadius: "4px", padding: "0.875rem 1rem", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.25rem 0.75rem", color: "#2C4A2E" }}>
                <span style={{ color: "#7A6A52" }}>Act:</span><span style={{ fontWeight: 600 }}>{reg.act_name}</span>
                <span style={{ color: "#7A6A52" }}>Division:</span><span>{divInfo?.label ?? reg.division}</span>
                <span style={{ color: "#7A6A52" }}>Reg ID:</span><span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{reg.id}</span>
                <span style={{ color: "#7A6A52" }}>Payment:</span>
                <span>{reg.amount_cents ? `$${(reg.amount_cents / 100).toFixed(2)} paid` : isConfirmed ? "Confirmed — no amount recorded" : "Not paid"}</span>
              </div>
            </div>

            {/* Square refund warning */}
            <div style={{ backgroundColor: "#FFFBEA", border: "1px solid #D4A827", borderRadius: "4px", padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.82rem", color: "#5C4A00" }}>
              <strong>⚠️ Square refund is NOT automatic.</strong> If this contestant paid, you must process any refund manually in the Square Dashboard.
            </div>

            {/* Reason */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: "#2C4A2E", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                Reason for removal
              </label>
              <select
                value={removeReason}
                onChange={(e) => { setRemoveReason(e.target.value); setRemoveError(null); }}
                disabled={removeState === "submitting"}
                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #D4C89A", borderRadius: "4px", fontSize: "0.9rem", fontFamily: "Georgia, serif", backgroundColor: "#fff" }}
              >
                {REMOVAL_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Notes — shown for all reasons but required for Other */}
            {removeReason === "other" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "#2C4A2E", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  Notes <span style={{ color: "#8B2E2E" }}>*</span>
                </label>
                <textarea
                  value={removeNotes}
                  onChange={(e) => { setRemoveNotes(e.target.value); setRemoveError(null); }}
                  disabled={removeState === "submitting"}
                  rows={3}
                  placeholder="Describe the reason for removal…"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #D4C89A", borderRadius: "4px", fontSize: "0.9rem", fontFamily: "Georgia, serif", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            )}

            {removeError && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.625rem 0.875rem", marginBottom: "1rem", color: "#991B1B", fontSize: "0.875rem" }}>
                {removeError}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => { setRemoveState("idle"); setRemoveReason(""); setRemoveNotes(""); setRemoveError(null); }}
                disabled={removeState === "submitting"}
                style={{ padding: "0.625rem 1.25rem", backgroundColor: "#F5EDD4", color: "#2C4A2E", border: "1px solid #D4C89A", borderRadius: "4px", fontSize: "0.9rem", cursor: "pointer", fontFamily: "Georgia, serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => void handleRemoveSubmit()}
                disabled={removeState === "submitting" || !removeReason}
                style={{ padding: "0.625rem 1.25rem", backgroundColor: removeState === "submitting" ? "#C4A0A0" : "#8B2E2E", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.9rem", cursor: removeState === "submitting" ? "not-allowed" : "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}
              >
                {removeState === "submitting" ? "Removing…" : "Confirm Removal"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
        {/* Top bar */}
        <div style={{ backgroundColor: "#2C4A2E", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link href="/got-talent/admin" style={{ color: "#D4A827", fontSize: "0.8rem", textDecoration: "none" }}>← Dashboard</Link>
            <span style={{ color: "#F5EDD4", marginLeft: "1rem", fontWeight: "700" }}>Registration Detail</span>
          </div>
        </div>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1.5rem" }}>

          {/* Prominent back navigation */}
          <div style={{ marginBottom: "1.25rem" }}>
            <Link
              href="/got-talent/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                color: "#2C4A2E",
                fontSize: "0.9rem",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                backgroundColor: "#fff",
                border: "1px solid #D4C89A",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              ← Back to Got Talent Dashboard
            </Link>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <h1 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.75rem", margin: 0 }}>
                {reg.act_name}
              </h1>
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  backgroundColor: statusBadge.bg,
                  color: statusBadge.color,
                }}
              >
                {statusBadge.label}
              </span>
            </div>
            <p style={{ color: "#7A6A52", fontSize: "0.85rem", margin: "0.5rem 0 0" }}>
              Registration ID: <code style={{ fontSize: "0.8rem" }}>{reg.id}</code>
            </p>
          </div>

          {/* Removed banner */}
          {isRemoved && (
            <div style={{ backgroundColor: "#FDF0F0", border: "2px solid #E57373", borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#8B2E2E", fontWeight: "700", margin: "0 0 0.25rem" }}>⛔ Registration Removed</p>
              <p style={{ color: "#5C4A32", fontSize: "0.875rem", margin: 0 }}>
                Removed by <strong>{reg.removed_by ?? "unknown"}</strong>
                {reg.removed_at ? ` on ${new Date(reg.removed_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}` : ""}.{" "}
                Reason: <strong>{reg.removal_reason?.replace(/_/g, " ") ?? "—"}</strong>
                {reg.removal_notes ? ` — ${reg.removal_notes}` : ""}.
              </p>
            </div>
          )}

          {/* Division conflict warning */}
          {reg.division_conflict && (
            <div style={{ backgroundColor: "#FDF0F0", border: "2px solid #E57373", borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#8B2E2E", fontWeight: "700", margin: "0 0 0.25rem" }}>⚠️ Division Conflict — Coordinator Review Needed</p>
              <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: 0 }}>
                This group includes performers from multiple age divisions. A fair coordinator must manually determine placement before performance day.
              </p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {/* Act details */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #D4C89A", borderRadius: "6px", padding: "1.25rem" }}>
              <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem" }}>Act Details</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Field label="Act Name" value={reg.act_name} />
                  <Field label="Talent Type" value={reg.act_type} />
                  {reg.act_type === "Other" && reg.act_description && (
                    <Field label="Act Description" value={reg.act_description} />
                  )}
                  <Field label="Solo/Group" value={reg.is_group ? `Group — ${reg.performer_count} performers` : "Solo"} />
                  <Field label="Division" value={`${divInfo?.label ?? reg.division} (${divInfo?.ageLabel ?? ""})`} />
                  <Field label="Performance" value={divInfo ? `${divInfo.performanceDate} · ${divInfo.performanceTime}` : undefined} />
                  <Field label="Music Required" value={reg.requires_music ? "Yes — USB/phone" : "No"} />
                  <Field label="Instrument Policy Ack" value={reg.instrument_ack ? "Yes — acknowledged" : "No"} />
                </tbody>
              </table>
            </div>

            {/* Primary performer */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #D4C89A", borderRadius: "6px", padding: "1.25rem" }}>
              <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem" }}>Primary Performer</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Field label="Name" value={reg.primary_performer_name} />
                  <Field label="Date of Birth" value={reg.primary_performer_dob} />
                  <Field label="Contact Name" value={reg.contact_name} />
                  <Field label="Email" value={reg.contact_email} />
                  <PhoneField label="Phone" raw={reg.contact_phone} />
                </tbody>
              </table>
            </div>

            {/* Additional performers */}
            {reg.is_group && reg.additional_performers.length > 0 && (
              <div style={{ backgroundColor: "#fff", border: "1px solid #D4C89A", borderRadius: "6px", padding: "1.25rem", gridColumn: "1 / -1" }}>
                <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem" }}>Additional Performers</p>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "0.4rem 0", color: "#7A6A52", fontSize: "0.8rem" }}>Name</th>
                      <th style={{ textAlign: "left", padding: "0.4rem 0", color: "#7A6A52", fontSize: "0.8rem" }}>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reg.additional_performers.map((p, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #E8DFC8" }}>
                        <td style={{ padding: "0.4rem 0", fontSize: "0.9rem" }}>{p.name}</td>
                        <td style={{ padding: "0.4rem 0", fontSize: "0.9rem" }}>{p.age_years}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payment */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #D4C89A", borderRadius: "6px", padding: "1.25rem" }}>
              <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem" }}>Payment</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Field label="Fee" value={`$${(reg.entry_fee_cents / 100).toFixed(2)}`} />
                  <Field label="Amount Paid" value={reg.amount_cents ? `$${(reg.amount_cents / 100).toFixed(2)}` : "Not paid"} />
                  <Field label="Paid At" value={reg.paid_at ? new Date(reg.paid_at).toLocaleString() : null} />
                  <Field label="Square Payment ID" value={reg.square_payment_id} />
                  <Field label="Confirmed At" value={reg.confirmed_at ? new Date(reg.confirmed_at).toLocaleString() : null} />
                </tbody>
              </table>
            </div>

            {/* Audit */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #D4C89A", borderRadius: "6px", padding: "1.25rem" }}>
              <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem" }}>Audit</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Field label="Registered" value={new Date(reg.created_at).toLocaleString()} />
                  <Field label="Confirmation Email" value={reg.confirmation_email_sent_at ? new Date(reg.confirmation_email_sent_at).toLocaleString() : "Not sent"} />
                  <Field label="Notification Email" value={reg.notification_email_sent_at ? new Date(reg.notification_email_sent_at).toLocaleString() : "Not sent"} />
                  <Field label="Last Updated" value={new Date(reg.updated_at).toLocaleString()} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Remove Registration — only shown if not already removed */}
          {!isRemoved && (
            <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "2px solid #E8DFC8" }}>
              <p style={{ color: "#7A6A52", fontSize: "0.8rem", margin: "0 0 0.75rem" }}>
                Removing a registration soft-deletes it from the confirmed roster. The record and all payment data are preserved. No Square refund is triggered automatically.
              </p>
              <button
                onClick={() => setRemoveState("confirming")}
                style={{
                  padding: "0.625rem 1.25rem",
                  backgroundColor: "transparent",
                  color: "#8B2E2E",
                  border: "2px solid #8B2E2E",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  fontWeight: 600,
                }}
              >
                Remove Registration…
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
