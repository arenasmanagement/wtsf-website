"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface PageantSettings {
  id: string;
  fair_year: number;
  registration_open: boolean;
  registration_opens_at: string | null;
  registration_closes_at: string | null;
  payment_grace_days: number;
  entry_fee_cents: number | null;
  late_fee_cents: number | null;
  late_fee_begins_at: string | null;
  rules_content: string | null;
  media_release_content: string | null;
  pageant_team_email: string;
  notes: string | null;
  updated_at: string;
}

function toLocalDateTimeInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function centsToDisplay(cents: number | null): string {
  if (cents === null) return "";
  return (cents / 100).toFixed(2);
}

function displayToCents(val: string): number | null {
  const n = parseFloat(val);
  if (isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

export default function PageantAdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<PageantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationOpensAt, setRegistrationOpensAt] = useState("");
  const [registrationClosesAt, setRegistrationClosesAt] = useState("");
  const [paymentGraceDays, setPaymentGraceDays] = useState("7");
  const [entryFee, setEntryFee] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [lateFeeAt, setLateFeeAt] = useState("");
  const [rulesContent, setRulesContent] = useState("");
  const [mediaReleaseContent, setMediaReleaseContent] = useState("");
  const [teamEmail, setTeamEmail] = useState("wtsfpageant@outlook.com");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/pageants/admin/settings")
      .then(async (res) => {
        if (res.status === 401) { router.push("/pageants/admin"); return; }
        const data = await res.json() as { data: PageantSettings };
        const s = data.data;
        setSettings(s);
        setRegistrationOpen(s.registration_open);
        setRegistrationOpensAt(toLocalDateTimeInput(s.registration_opens_at));
        setRegistrationClosesAt(toLocalDateTimeInput(s.registration_closes_at));
        setPaymentGraceDays(String(s.payment_grace_days));
        setEntryFee(centsToDisplay(s.entry_fee_cents));
        setLateFee(centsToDisplay(s.late_fee_cents));
        setLateFeeAt(toLocalDateTimeInput(s.late_fee_begins_at));
        setRulesContent(s.rules_content ?? "");
        setMediaReleaseContent(s.media_release_content ?? "");
        setTeamEmail(s.pageant_team_email);
        setNotes(s.notes ?? "");
      })
      .catch(() => setError("Failed to load settings."))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload: Record<string, unknown> = {
      registration_open: registrationOpen,
      payment_grace_days: parseInt(paymentGraceDays, 10) || 7,
      pageant_team_email: teamEmail,
    };

    payload.entry_fee_cents = displayToCents(entryFee);
    payload.late_fee_cents = displayToCents(lateFee);
    payload.registration_opens_at = registrationOpensAt ? new Date(registrationOpensAt).toISOString() : null;
    payload.registration_closes_at = registrationClosesAt ? new Date(registrationClosesAt).toISOString() : null;
    payload.late_fee_begins_at = lateFeeAt ? new Date(lateFeeAt).toISOString() : null;
    payload.rules_content = rulesContent || null;
    payload.media_release_content = mediaReleaseContent || null;
    payload.notes = notes || null;

    const res = await fetch("/api/pageants/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      const d = await res.json() as { error?: string };
      setError(d.error ?? "Failed to save settings.");
    }
    setSaving(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.625rem 0.75rem",
    border: "1px solid #E8DFC8", borderRadius: "4px",
    fontSize: "0.9375rem", fontFamily: "Georgia, serif",
    color: "#2C4A2E", backgroundColor: "#FAFAF7", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", color: "#5C4A32", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.375rem",
  };

  const fieldStyle: React.CSSProperties = { marginBottom: "1.125rem" };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#fff", border: "1px solid #E8DFC8", borderRadius: "8px",
    padding: "1.5rem", marginBottom: "1.25rem",
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#8B7355" }}>Loading settings…</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#2C4A2E", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <a href="/pageants/admin/dashboard" style={{ color: "#D4A827", fontSize: "0.875rem", textDecoration: "none" }}>← Dashboard</a>
          <h1 style={{ color: "#F5EDD4", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: "4px 0 0" }}>
            Registration Settings
          </h1>
        </div>
        <p style={{ color: "#8B9E8B", fontSize: "0.8125rem", margin: 0 }}>
          {settings ? `Last updated: ${new Date(settings.updated_at).toLocaleDateString("en-US", { timeZone: "America/Chicago" })}` : ""}
        </p>
      </header>

      <form onSubmit={(e) => void handleSave(e)} style={{ maxWidth: "760px", margin: "0 auto", padding: "1.5rem" }}>

        {/* Registration open/closed */}
        <div style={{ ...sectionStyle, border: registrationOpen ? "2px solid #8B2E2E" : "1px solid #E8DFC8" }}>
          <h2 style={{ color: "#2C4A2E", fontSize: "1.0625rem", margin: "0 0 0.5rem", fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Registration Status
          </h2>
          {registrationOpen && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem" }}>
              <strong style={{ color: "#991B1B", fontSize: "0.9rem" }}>
                WARNING: Registration is currently OPEN. Confirm all settings before allowing public submissions.
              </strong>
            </div>
          )}
          <label style={{ display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "#2C4A2E" }}
            />
            <div>
              <span style={{ color: "#2C4A2E", fontWeight: 700, fontSize: "0.9375rem" }}>Registration Open</span>
              <p style={{ color: "#8B7355", fontSize: "0.8125rem", margin: "2px 0 0" }}>
                When checked, public registration will be accepted (if the master code switch is also enabled).
              </p>
            </div>
          </label>
        </div>

        {/* Registration window */}
        <div style={sectionStyle}>
          <h2 style={{ color: "#2C4A2E", fontSize: "1.0625rem", margin: "0 0 1rem", fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Registration Window
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Opens At (optional)</label>
              <input type="datetime-local" style={inputStyle} value={registrationOpensAt} onChange={(e) => setRegistrationOpensAt(e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Closes At (optional)</label>
              <input type="datetime-local" style={inputStyle} value={registrationClosesAt} onChange={(e) => setRegistrationClosesAt(e.target.value)} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Payment Grace Period (days)</label>
            <input type="number" min="1" max="30" style={{ ...inputStyle, maxWidth: "120px" }} value={paymentGraceDays} onChange={(e) => setPaymentGraceDays(e.target.value)} />
            <p style={{ color: "#8B7355", fontSize: "0.8125rem", margin: "4px 0 0" }}>
              How many days after form submission the registrant has to complete payment.
            </p>
          </div>
        </div>

        {/* Fees */}
        <div style={sectionStyle}>
          <h2 style={{ color: "#2C4A2E", fontSize: "1.0625rem", margin: "0 0 0.5rem", fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Fees
          </h2>
          <div style={{ backgroundColor: "#FEF9E7", border: "1px solid #D4A827", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem" }}>
            <strong style={{ color: "#856404", fontSize: "0.8125rem" }}>
              UNCONFIRMED — Verify entry fee with Hayley before opening registration.
            </strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Entry Fee ($)</label>
              <input type="number" step="0.01" min="0" placeholder="e.g. 55.00" style={inputStyle} value={entryFee} onChange={(e) => setEntryFee(e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Late Fee ($) (optional)</label>
              <input type="number" step="0.01" min="0" placeholder="e.g. 10.00" style={inputStyle} value={lateFee} onChange={(e) => setLateFee(e.target.value)} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Late Fee Begins At (optional)</label>
            <input type="datetime-local" style={{ ...inputStyle, maxWidth: "320px" }} value={lateFeeAt} onChange={(e) => setLateFeeAt(e.target.value)} />
          </div>
        </div>

        {/* Rules & media release */}
        <div style={sectionStyle}>
          <h2 style={{ color: "#2C4A2E", fontSize: "1.0625rem", margin: "0 0 1rem", fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Rules & Media Release
          </h2>
          <div style={fieldStyle}>
            <label style={labelStyle}>Rules Content (shown to registrants)</label>
            <textarea
              rows={8}
              placeholder="Final rules will be added here. Leave blank until rules are finalized."
              style={{ ...inputStyle, resize: "vertical" }}
              value={rulesContent}
              onChange={(e) => setRulesContent(e.target.value)}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Media Release Text (optional)</label>
            <textarea
              rows={5}
              placeholder="Media release wording to display on the registration form."
              style={{ ...inputStyle, resize: "vertical" }}
              value={mediaReleaseContent}
              onChange={(e) => setMediaReleaseContent(e.target.value)}
            />
          </div>
        </div>

        {/* Contact */}
        <div style={sectionStyle}>
          <h2 style={{ color: "#2C4A2E", fontSize: "1.0625rem", margin: "0 0 1rem", fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Contact & Notes
          </h2>
          <div style={fieldStyle}>
            <label style={labelStyle}>Pageant Team Email</label>
            <input type="email" style={{ ...inputStyle, maxWidth: "360px" }} value={teamEmail} onChange={(e) => setTeamEmail(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Internal Notes (not shown publicly)</label>
            <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any internal notes for the pageant committee…" />
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem", color: "#991B1B", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: "#D4EDDA", border: "1px solid #C3E6CB", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem", color: "#155724", fontSize: "0.9rem" }}>
            Settings saved successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            backgroundColor: saving ? "#8B7355" : "#2C4A2E",
            color: "#F5EDD4",
            border: "none",
            borderRadius: "4px",
            padding: "0.875rem 2rem",
            fontSize: "1rem",
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            marginBottom: "2rem",
          }}
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
