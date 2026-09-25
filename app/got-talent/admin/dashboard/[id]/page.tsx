"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getDivisionById } from "@/lib/got-talent-config";

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
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <tr style={{ borderBottom: "1px solid #E8DFC8" }}>
      <td style={{ padding: "0.6rem 0", color: "#7A6A52", fontSize: "0.85rem", width: "40%", verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "0.6rem 0", color: "#2C4A2E", fontSize: "0.9rem" }}>{value ?? "—"}</td>
    </tr>
  );
}

export default function GotTalentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [reg, setReg] = useState<RegDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) {
    return (
      <main style={{ padding: "4rem 2rem", fontFamily: "Georgia, serif", textAlign: "center" }}>
        <p style={{ color: "#8B2E2E" }}>{error}</p>
        <Link href="/got-talent/admin/dashboard" style={{ color: "#2C4A2E" }}>← Back to Dashboard</Link>
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

  return (
    <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Top bar */}
      <div style={{ backgroundColor: "#2C4A2E", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/got-talent/admin/dashboard" style={{ color: "#D4A827", fontSize: "0.8rem", textDecoration: "none" }}>← Dashboard</Link>
          <span style={{ color: "#F5EDD4", marginLeft: "1rem", fontWeight: "700" }}>Registration Detail</span>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1.5rem" }}>
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
                backgroundColor: isConfirmed ? "#D4F0D4" : "#FFF3CD",
                color: isConfirmed ? "#1A5C1A" : "#7A5C00",
              }}
            >
              {isConfirmed ? "Confirmed" : reg.status === "PAYMENT_PENDING" ? "Payment Pending" : reg.status}
            </span>
          </div>
          <p style={{ color: "#7A6A52", fontSize: "0.85rem", margin: "0.5rem 0 0" }}>
            Registration ID: <code style={{ fontSize: "0.8rem" }}>{reg.id}</code>
          </p>
        </div>

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
                <Field label="Phone" value={reg.contact_phone} />
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
      </div>
    </main>
  );
}
