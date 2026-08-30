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
        <StatusBadge status={reg.status} />
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
