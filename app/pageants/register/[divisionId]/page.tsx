"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { PAGEANT_DIVISIONS, PAGEANT_DATE, PAGEANT_VENUE, PAGEANT_LOCATION, getDivisionById } from "@/lib/pageant-config";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

interface FormData {
  division_id: string;
  contestant_first_name: string;
  contestant_last_name: string;
  contestant_dob: string;
  contestant_school: string;
  contestant_grade: string;
  contestant_hair_color: string;
  contestant_eye_color: string;
  contestant_hobbies: string;
  contestant_ambitions: string;
  guardian_name: string;
  guardian_relationship: string;
  guardian_address: string;
  guardian_city: string;
  guardian_state: string;
  guardian_zip: string;
  guardian_phone: string;
  guardian_email: string;
  confirm_guardian_email: string;
  rules_agreed: boolean;
  media_release_agreed: boolean;
  website: string;
}

const EMPTY_FORM: FormData = {
  division_id: "",
  contestant_first_name: "",
  contestant_last_name: "",
  contestant_dob: "",
  contestant_school: "",
  contestant_grade: "",
  contestant_hair_color: "",
  contestant_eye_color: "",
  contestant_hobbies: "",
  contestant_ambitions: "",
  guardian_name: "",
  guardian_relationship: "",
  guardian_address: "",
  guardian_city: "",
  guardian_state: "TN",
  guardian_zip: "",
  guardian_phone: "",
  guardian_email: "",
  confirm_guardian_email: "",
  rules_agreed: false,
  media_release_agreed: false,
  website: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.75rem",
  border: "1px solid #E8DFC8",
  borderRadius: "4px",
  fontSize: "1rem",
  color: "#2C4A2E",
  backgroundColor: "#FAFAF7",
  boxSizing: "border-box",
  fontFamily: "Georgia, serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#5C4A32",
  fontWeight: 600,
  fontSize: "0.875rem",
  marginBottom: "0.375rem",
  fontFamily: "Georgia, serif",
};

const fieldWrap: React.CSSProperties = {
  marginBottom: "1.125rem",
};

function Field({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "#8B2E2E", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: "#8B2E2E", fontSize: "0.8125rem", margin: "4px 0 0" }}>{error}</p>
      )}
    </div>
  );
}

export default function DivisionRegisterPage() {
  const params = useParams<{ divisionId: string }>();
  const router = useRouter();
  const divisionId = params.divisionId;

  const division = getDivisionById(divisionId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM, division_id: divisionId });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!division) {
      router.replace("/pageants/register");
    }
  }, [division, router]);

  if (!division) return null;

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep(s: number): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 2) {
      if (!form.contestant_first_name.trim()) errs.contestant_first_name = "Required";
      if (!form.contestant_last_name.trim()) errs.contestant_last_name = "Required";
      if (!form.contestant_dob) errs.contestant_dob = "Required";
    }
    if (s === 3) {
      if (!form.guardian_name.trim()) errs.guardian_name = "Required";
      if (!form.guardian_address.trim()) errs.guardian_address = "Required";
      if (!form.guardian_city.trim()) errs.guardian_city = "Required";
      if (!form.guardian_zip.trim() || !/^\d{5}(-\d{4})?$/.test(form.guardian_zip)) errs.guardian_zip = "Enter a valid ZIP code";
      if (!form.guardian_phone.trim()) errs.guardian_phone = "Required";
      if (!form.guardian_email.trim() || !/\S+@\S+\.\S+/.test(form.guardian_email)) errs.guardian_email = "Valid email required";
      if (form.guardian_email !== form.confirm_guardian_email) errs.confirm_guardian_email = "Emails do not match";
    }
    if (s === 4) {
      if (!form.rules_agreed) errs.rules_agreed = "You must agree to the rules to continue";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => s - 1);
    setErrors({});
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep(4)) return;
    setSubmitError(null);
    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        division_id: form.division_id,
        contestant_first_name: form.contestant_first_name,
        contestant_last_name: form.contestant_last_name,
        contestant_dob: form.contestant_dob,
        guardian_name: form.guardian_name,
        guardian_address: form.guardian_address,
        guardian_city: form.guardian_city,
        guardian_state: form.guardian_state,
        guardian_zip: form.guardian_zip,
        guardian_phone: form.guardian_phone,
        guardian_email: form.guardian_email,
        confirm_guardian_email: form.confirm_guardian_email,
        rules_agreed: form.rules_agreed,
        media_release_agreed: form.media_release_agreed,
        website: form.website,
      };
      if (form.contestant_school) payload.contestant_school = form.contestant_school;
      if (form.contestant_grade) payload.contestant_grade = form.contestant_grade;
      if (form.contestant_hair_color) payload.contestant_hair_color = form.contestant_hair_color;
      if (form.contestant_eye_color) payload.contestant_eye_color = form.contestant_eye_color;
      if (form.contestant_hobbies) payload.contestant_hobbies = form.contestant_hobbies;
      if (form.contestant_ambitions) payload.contestant_ambitions = form.contestant_ambitions;
      if (form.guardian_relationship) payload.guardian_relationship = form.guardian_relationship;

      const res = await fetch("/api/pageants/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { success?: boolean; resumeToken?: string; error?: string };

      if (res.ok && data.success && data.resumeToken) {
        router.push(`/pageants/register/pay/${data.resumeToken}`);
      } else {
        setSubmitError(data.error ?? "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitles = [
    "Division",
    "Contestant Info",
    "Parent / Guardian",
    "Rules & Agreement",
    "Review & Submit",
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "1px solid #E8DFC8",
    borderRadius: "8px",
    padding: "2rem",
    marginBottom: "1.25rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  return (
    <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", padding: "2rem 1rem", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E", fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
            2026 Traditional Pageant
          </h1>
          <p style={{ color: "#8B7355", margin: 0 }}>{PAGEANT_DATE} · {PAGEANT_VENUE} · {PAGEANT_LOCATION}</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {stepTitles.map((t, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: done ? "#D4A827" : active ? "#2C4A2E" : "#E8DFC8",
                  color: done || active ? "#fff" : "#8B7355",
                  fontSize: "0.8125rem", fontWeight: 700,
                }}>
                  {done ? "✓" : n}
                </div>
                <span style={{ fontSize: "0.8125rem", color: active ? "#2C4A2E" : "#8B7355", fontWeight: active ? 700 : 400 }}>
                  {t}
                </span>
                {n < 5 && <span style={{ color: "#E8DFC8", marginLeft: "0.5rem" }}>›</span>}
              </div>
            );
          })}
        </div>

        {/* Step 1: Division confirmation */}
        {step === 1 && (
          <div style={cardStyle}>
            <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: "0 0 1rem" }}>
              Confirm Division
            </h2>
            <div style={{ backgroundColor: "#F5EDD4", border: "1px solid #D4A827", borderRadius: "6px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ borderLeft: `4px solid ${division.accentColor}`, paddingLeft: "1rem" }}>
                <h3 style={{ color: division.accentColor, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.375rem", margin: "0 0 0.25rem" }}>
                  {division.name}
                </h3>
                <p style={{ color: "#8B7355", fontSize: "0.9rem", margin: "0 0 1rem", fontStyle: "italic" }}>Ages {division.ageLabel}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <div><span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Date</span><br /><strong style={{ color: "#2C4A2E" }}>October 17, 2026</strong></div>
                  <div><span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Venue</span><br /><strong style={{ color: "#2C4A2E" }}>Williams Auditorium</strong></div>
                  <div><span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Arrival Time</span><br /><strong style={{ color: "#2C4A2E" }}>{division.arrivalTime}</strong></div>
                  <div><span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Competition</span><br /><strong style={{ color: "#2C4A2E" }}>{division.competitionTime}</strong></div>
                </div>
              </div>
            </div>
            <p style={{ color: "#5C4A32", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
              You have selected the <strong>{division.name}</strong> division (ages {division.ageLabel}). Please confirm this is the correct division before continuing.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a href="/pageants/register" style={{ flex: 1, textAlign: "center", padding: "0.75rem", border: "1px solid #D4A827", borderRadius: "4px", color: "#5C4A32", textDecoration: "none", fontSize: "0.9375rem" }}>
                Change Division
              </a>
              <button onClick={next} style={{ flex: 2, backgroundColor: "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", padding: "0.75rem", fontSize: "1rem", fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: 600 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contestant info */}
        {step === 2 && (
          <div style={cardStyle}>
            <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: "0 0 1.5rem" }}>
              Contestant Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <Field label="First Name" required error={errors.contestant_first_name}>
                <input style={inputStyle} value={form.contestant_first_name} onChange={(e) => set("contestant_first_name", e.target.value)} maxLength={100} />
              </Field>
              <Field label="Last Name" required error={errors.contestant_last_name}>
                <input style={inputStyle} value={form.contestant_last_name} onChange={(e) => set("contestant_last_name", e.target.value)} maxLength={100} />
              </Field>
            </div>
            <Field label="Date of Birth" required error={errors.contestant_dob}>
              <input type="date" style={inputStyle} value={form.contestant_dob} onChange={(e) => set("contestant_dob", e.target.value)} />
            </Field>
            <Field label="School (optional)">
              <input style={inputStyle} value={form.contestant_school} onChange={(e) => set("contestant_school", e.target.value)} maxLength={100} />
            </Field>
            <Field label="Grade (optional)">
              <input style={inputStyle} value={form.contestant_grade} onChange={(e) => set("contestant_grade", e.target.value)} maxLength={50} placeholder="e.g. 3rd Grade, Pre-K" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <Field label="Hair Color (optional)">
                <input style={inputStyle} value={form.contestant_hair_color} onChange={(e) => set("contestant_hair_color", e.target.value)} maxLength={50} />
              </Field>
              <Field label="Eye Color (optional)">
                <input style={inputStyle} value={form.contestant_eye_color} onChange={(e) => set("contestant_eye_color", e.target.value)} maxLength={50} />
              </Field>
            </div>
            <Field label="Hobbies (optional)">
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} value={form.contestant_hobbies} onChange={(e) => set("contestant_hobbies", e.target.value)} maxLength={500} />
            </Field>
            <Field label="Ambitions / Goals (optional)">
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} value={form.contestant_ambitions} onChange={(e) => set("contestant_ambitions", e.target.value)} maxLength={500} />
            </Field>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button onClick={back} style={{ flex: 1, backgroundColor: "transparent", color: "#5C4A32", border: "1px solid #D4A827", borderRadius: "4px", padding: "0.75rem", fontSize: "0.9375rem", fontFamily: "Georgia, serif", cursor: "pointer" }}>
                ← Back
              </button>
              <button onClick={next} style={{ flex: 2, backgroundColor: "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", padding: "0.75rem", fontSize: "1rem", fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: 600 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Guardian info */}
        {step === 3 && (
          <div style={cardStyle}>
            <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: "0 0 1.5rem" }}>
              Parent / Guardian Information
            </h2>
            <Field label="Full Name" required error={errors.guardian_name}>
              <input style={inputStyle} value={form.guardian_name} onChange={(e) => set("guardian_name", e.target.value)} maxLength={200} />
            </Field>
            <Field label="Relationship to Contestant (optional)">
              <input style={inputStyle} value={form.guardian_relationship} onChange={(e) => set("guardian_relationship", e.target.value)} maxLength={100} placeholder="e.g. Mother, Father, Grandparent" />
            </Field>
            <Field label="Street Address" required error={errors.guardian_address}>
              <input style={inputStyle} value={form.guardian_address} onChange={(e) => set("guardian_address", e.target.value)} maxLength={200} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0 0.75rem" }}>
              <Field label="City" required error={errors.guardian_city}>
                <input style={inputStyle} value={form.guardian_city} onChange={(e) => set("guardian_city", e.target.value)} maxLength={100} />
              </Field>
              <Field label="State" required>
                <select style={inputStyle} value={form.guardian_state} onChange={(e) => set("guardian_state", e.target.value)}>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="ZIP" required error={errors.guardian_zip}>
                <input style={inputStyle} value={form.guardian_zip} onChange={(e) => set("guardian_zip", e.target.value)} maxLength={10} />
              </Field>
            </div>
            <Field label="Phone" required error={errors.guardian_phone}>
              <input type="tel" style={inputStyle} value={form.guardian_phone} onChange={(e) => set("guardian_phone", e.target.value)} maxLength={20} />
            </Field>
            <Field label="Email Address" required error={errors.guardian_email}>
              <input type="email" style={inputStyle} value={form.guardian_email} onChange={(e) => set("guardian_email", e.target.value)} />
            </Field>
            <Field label="Confirm Email Address" required error={errors.confirm_guardian_email}>
              <input type="email" style={inputStyle} value={form.confirm_guardian_email} onChange={(e) => set("confirm_guardian_email", e.target.value)} />
            </Field>
            {/* Honeypot — hidden from real users */}
            <div style={{ display: "none" }} aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button onClick={back} style={{ flex: 1, backgroundColor: "transparent", color: "#5C4A32", border: "1px solid #D4A827", borderRadius: "4px", padding: "0.75rem", fontSize: "0.9375rem", fontFamily: "Georgia, serif", cursor: "pointer" }}>
                ← Back
              </button>
              <button onClick={next} style={{ flex: 2, backgroundColor: "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", padding: "0.75rem", fontSize: "1rem", fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: 600 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Rules & acknowledgment */}
        {step === 4 && (
          <div style={cardStyle}>
            <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: "0 0 1rem" }}>
              Rules & Agreement
            </h2>
            <div style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", borderRadius: "6px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#5C4A32", fontSize: "0.9375rem", margin: 0 }}>
                The official rules for the 2026 West Tennessee State Fair Traditional Pageants will be published here once finalized. By checking the box below, you agree to abide by all rules and regulations as established and communicated by the WTSF Pageant Committee.
              </p>
              <p style={{ color: "#8B7355", fontSize: "0.875rem", margin: "0.75rem 0 0" }}>
                Questions about the rules? Contact us at{" "}
                <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E" }}>wtsfpageant@outlook.com</a>
              </p>
            </div>
            <Field label="" error={errors.rules_agreed}>
              <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.rules_agreed}
                  onChange={(e) => set("rules_agreed", e.target.checked)}
                  style={{ marginTop: "3px", width: "18px", height: "18px", accentColor: "#2C4A2E", flexShrink: 0 }}
                />
                <span style={{ color: "#2C4A2E", fontSize: "0.9375rem", fontWeight: 600 }}>
                  I agree to the 2026 Traditional Fair Pageant rules and regulations. <span style={{ color: "#8B2E2E" }}>*</span>
                </span>
              </label>
            </Field>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.media_release_agreed}
                  onChange={(e) => set("media_release_agreed", e.target.checked)}
                  style={{ marginTop: "3px", width: "18px", height: "18px", accentColor: "#2C4A2E", flexShrink: 0 }}
                />
                <span style={{ color: "#5C4A32", fontSize: "0.9375rem" }}>
                  I grant the West Tennessee State Fair permission to photograph and/or record my child during the pageant for promotional and archival purposes.
                </span>
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button onClick={back} style={{ flex: 1, backgroundColor: "transparent", color: "#5C4A32", border: "1px solid #D4A827", borderRadius: "4px", padding: "0.75rem", fontSize: "0.9375rem", fontFamily: "Georgia, serif", cursor: "pointer" }}>
                ← Back
              </button>
              <button onClick={next} style={{ flex: 2, backgroundColor: "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", padding: "0.75rem", fontSize: "1rem", fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: 600 }}>
                Review Registration →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review & submit */}
        {step === 5 && (
          <form onSubmit={handleSubmit}>
            <div style={cardStyle}>
              <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", margin: "0 0 1.5rem" }}>
                Review Your Registration
              </h2>

              <ReviewSection title="Division">
                <ReviewRow label="Division" value={`${division.name} (Ages ${division.ageLabel})`} />
                <ReviewRow label="Date" value="October 17, 2026" />
                <ReviewRow label="Arrival Time" value={division.arrivalTime} />
                <ReviewRow label="Competition Time" value={division.competitionTime} />
              </ReviewSection>

              <ReviewSection title="Contestant">
                <ReviewRow label="Name" value={`${form.contestant_first_name} ${form.contestant_last_name}`} />
                <ReviewRow label="Date of Birth" value={form.contestant_dob} />
                {form.contestant_school && <ReviewRow label="School" value={form.contestant_school} />}
                {form.contestant_hair_color && <ReviewRow label="Hair Color" value={form.contestant_hair_color} />}
                {form.contestant_eye_color && <ReviewRow label="Eye Color" value={form.contestant_eye_color} />}
              </ReviewSection>

              <ReviewSection title="Parent / Guardian">
                <ReviewRow label="Name" value={form.guardian_name} />
                {form.guardian_relationship && <ReviewRow label="Relationship" value={form.guardian_relationship} />}
                <ReviewRow label="Address" value={`${form.guardian_address}, ${form.guardian_city}, ${form.guardian_state} ${form.guardian_zip}`} />
                <ReviewRow label="Phone" value={form.guardian_phone} />
                <ReviewRow label="Email" value={form.guardian_email} />
              </ReviewSection>

              <ReviewSection title="Agreements">
                <ReviewRow label="Rules Agreed" value={form.rules_agreed ? "Yes" : "No"} />
                <ReviewRow label="Media Release" value={form.media_release_agreed ? "Granted" : "Not granted"} />
              </ReviewSection>

              {submitError && (
                <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#991B1B", fontSize: "0.9rem" }}>
                  {submitError}
                </div>
              )}

              <p style={{ color: "#8B7355", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                After submitting, you will be directed to complete your payment. Your registration is not confirmed until payment is received.
              </p>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={back} style={{ flex: 1, backgroundColor: "transparent", color: "#5C4A32", border: "1px solid #D4A827", borderRadius: "4px", padding: "0.75rem", fontSize: "0.9375rem", fontFamily: "Georgia, serif", cursor: "pointer" }}>
                  ← Edit
                </button>
                <button type="submit" disabled={submitting} style={{ flex: 2, backgroundColor: submitting ? "#8B7355" : "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", padding: "0.75rem", fontSize: "1rem", fontFamily: "Georgia, serif", cursor: submitting ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {submitting ? "Submitting…" : "Submit & Proceed to Payment →"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem", border: "1px solid #E8DFC8", borderRadius: "6px", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#E8DFC8", padding: "0.5rem 1rem" }}>
        <strong style={{ color: "#2C4A2E", fontSize: "0.875rem" }}>{title}</strong>
      </div>
      <div style={{ padding: "0.75rem 1rem" }}>{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid #F5EDD4", gap: "1rem" }}>
      <span style={{ color: "#8B7355", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ color: "#2C4A2E", fontSize: "0.875rem", textAlign: "right" }}>{value}</span>
    </div>
  );
}
