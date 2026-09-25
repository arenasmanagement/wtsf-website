"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { GOT_TALENT_ACT_TYPES, calcAgeYears, getDivisionForAge, getDivisionById } from "@/lib/got-talent-config";

// ── Types ──────────────────────────────────────────────────────────────────
interface AdditionalPerformer {
  name: string;
  age_years: string; // string in form, parsed to int on submit
}

interface FormData {
  // Step 1 — Act + Performers
  act_name: string;
  act_type: string;
  act_description: string; // required when act_type === "Other"
  is_group: boolean;
  primary_performer_name: string;
  primary_performer_dob: string;
  additional_performers: AdditionalPerformer[];
  // Step 2 — Contact + Music
  contact_name: string;
  contact_email: string;
  confirm_contact_email: string;
  contact_phone: string;
  requires_music: boolean | null;
  instrument_ack: boolean;
  // Honeypot
  website: string;
}

const INITIAL: FormData = {
  act_name: "",
  act_type: "",
  act_description: "",
  is_group: false,
  primary_performer_name: "",
  primary_performer_dob: "",
  additional_performers: [],
  contact_name: "",
  contact_email: "",
  confirm_contact_email: "",
  contact_phone: "",
  requires_music: null,
  instrument_ack: false,
  website: "",
};

const LABEL = (text: string, required = true) => (
  <label style={{ display: "block", color: "#3A3028", fontSize: "0.875rem", fontWeight: "700", marginBottom: "0.35rem" }}>
    {text} {required && <span style={{ color: "#8B2E2E" }}>*</span>}
  </label>
);

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "2px solid #D4C89A",
  borderRadius: "4px",
  fontSize: "1rem",
  fontFamily: "Georgia, serif",
  backgroundColor: "#fff",
  color: "#1A1A1A",
  boxSizing: "border-box",
};

const ERR = (msg: string) => (
  <p style={{ color: "#8B2E2E", fontSize: "0.8rem", margin: "0.3rem 0 0" }}>{msg}</p>
);

// ── Component ──────────────────────────────────────────────────────────────
// Shared card wrapper
const Card = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        backgroundColor: "#fff",
        border: "2px solid #D4A827",
        borderRadius: "8px",
        padding: "2rem",
        marginBottom: "1.5rem",
      }}
    >
      {children}
    </div>
  );
// Progress indicator
const Progress = ({ step }: { step: 1 | 2 | 3 }) => (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", alignItems: "center" }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              backgroundColor: step >= s ? "#2C4A2E" : "#E8DFC8",
              color: step >= s ? "#F5EDD4" : "#A89070",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.85rem",
              fontWeight: "700",
            }}
          >
            {s}
          </div>
          {s < 3 && (
            <div style={{ flex: 1, height: "2px", width: "3rem", backgroundColor: step > s ? "#2C4A2E" : "#E8DFC8" }} />
          )}
        </div>
      ))}
      <span style={{ marginLeft: "0.5rem", color: "#5C4A32", fontSize: "0.85rem" }}>
        {step === 1 ? "Act & Performers" : step === 2 ? "Contact & Music" : "Review"}
      </span>
    </div>
  );
export default function GotTalentRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Track funnel entry
  useEffect(() => { trackEvent("got_talent_register_viewed"); }, []);

  // Derived division info (live preview as DOB typed)
  const primaryAge = form.primary_performer_dob
    ? calcAgeYears(form.primary_performer_dob)
    : null;
  const division = primaryAge !== null ? getDivisionForAge(primaryAge) : null;
  const divisionConfig = division ? getDivisionById(division) : null;

  // Division conflict check
  const divisionConflict =
    form.is_group &&
    division !== null &&
    form.additional_performers.some((p) => {
      const age = parseInt(p.age_years, 10);
      return !isNaN(age) && getDivisionForAge(age) !== division;
    });

  const set = useCallback(
    (field: keyof FormData, value: FormData[keyof FormData]) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    []
  );

  const setPerformer = (idx: number, field: keyof AdditionalPerformer, value: string) => {
    setForm((prev) => {
      const next = [...prev.additional_performers];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, additional_performers: next };
    });
  };

  const addPerformer = () =>
    setForm((prev) => ({
      ...prev,
      additional_performers: [...prev.additional_performers, { name: "", age_years: "" }],
    }));

  const removePerformer = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      additional_performers: prev.additional_performers.filter((_, i) => i !== idx),
    }));

  // ── Validation per step ──
  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.act_name.trim()) e.act_name = "Act or group name is required.";
    if (!form.act_type) e.act_type = "Please select a talent type.";
    if (form.act_type === "Other" && !form.act_description.trim())
      e.act_description = "Please describe your talent.";
    if (!form.instrument_ack)
      e.instrument_ack = "Please acknowledge the band and sound system policy.";
    if (!form.primary_performer_name.trim()) e.primary_performer_name = "Primary performer name is required.";
    if (!form.primary_performer_dob) {
      e.primary_performer_dob = "Date of birth is required.";
    } else {
      const age = calcAgeYears(form.primary_performer_dob);
      if (age < 0 || age > 120) e.primary_performer_dob = "Please enter a valid date of birth.";
      if (new Date(form.primary_performer_dob) > new Date()) {
        e.primary_performer_dob = "Date of birth cannot be in the future.";
      }
    }
    if (form.is_group) {
      form.additional_performers.forEach((p, i) => {
        if (!p.name.trim()) e[`performer_name_${i}`] = "Name is required.";
        const age = parseInt(p.age_years, 10);
        if (isNaN(age) || age < 0 || age > 120) e[`performer_age_${i}`] = "Valid age required.";
      });
      if (form.additional_performers.length === 0) {
        e.additional_performers = "Add at least one additional performer for a group.";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.contact_name.trim()) e.contact_name = "Contact name is required.";
    if (!form.contact_email.trim()) e.contact_email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email))
      e.contact_email = "Please enter a valid email address.";
    if (!form.confirm_contact_email.trim()) e.confirm_contact_email = "Please confirm your email.";
    else if (form.contact_email !== form.confirm_contact_email)
      e.confirm_contact_email = "Email addresses do not match.";
    if (!form.contact_phone.trim()) e.contact_phone = "Phone number is required.";
    else if (!/^[\d\s\-\(\)\+\.]{7,20}$/.test(form.contact_phone))
      e.contact_phone = "Please enter a valid phone number.";
    if (form.requires_music === null) e.requires_music = "Please select Yes or No.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) { trackEvent("got_talent_step1_completed"); setStep(2); }
    else if (step === 2 && validateStep2()) { trackEvent("got_talent_step2_completed"); setStep(3); }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerError(null);
    trackEvent("got_talent_form_submitted");

    const payload = {
      act_name: form.act_name.trim(),
      act_type: form.act_type,
      act_description: form.act_type === "Other" ? form.act_description.trim() : undefined,
      instrument_ack: form.instrument_ack,
      is_group: form.is_group,
      performer_count: form.is_group
        ? 1 + form.additional_performers.length
        : 1,
      primary_performer_name: form.primary_performer_name.trim(),
      primary_performer_dob: form.primary_performer_dob,
      additional_performers: form.is_group
        ? form.additional_performers.map((p) => ({
            name: p.name.trim(),
            age_years: parseInt(p.age_years, 10),
          }))
        : [],
      requires_music: form.requires_music ?? false,
      contact_name: form.contact_name.trim(),
      contact_email: form.contact_email.trim().toLowerCase(),
      confirm_contact_email: form.confirm_contact_email.trim().toLowerCase(),
      contact_phone: form.contact_phone.trim(),
      website: form.website, // honeypot
    };

    try {
      const res = await fetch("/api/got-talent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        resumeToken?: string;
        registrationId?: string;
      };

      if (!res.ok || !data.success) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to payment page with resume token
      router.push(`/got-talent/register/pay/${data.resumeToken ?? ""}`);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };



  return (
    <main id="main-content" style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", padding: "5rem 1.5rem 3rem" }}>

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", top: 0, height: 0, opacity: 0 }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ color: "#D4A827", fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 0.5rem" }}>
            West Tennessee State Fair · 2026
          </p>
          <h1 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "2.25rem", margin: "0 0 0.5rem" }}>
            Register Your Act
          </h1>
          <p style={{ color: "#5C4A32", fontSize: "0.95rem", margin: 0 }}>
            $25 per act · Registration closes October 20, 2026
          </p>
        </div>

        <Progress step={step} />

        {/* ── STEP 1: Act + Performers ── */}
        {step === 1 && (
          <div>
            <Card>
              <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.35rem", margin: "0 0 1.5rem" }}>
                Act Information
              </h2>

              <div style={{ marginBottom: "1.25rem" }}>
                {LABEL("Act / Group Name")}
                <input
                  type="text"
                  value={form.act_name}
                  onChange={(e) => set("act_name", e.target.value)}
                  placeholder="The name you want announced on stage"
                  style={INPUT_STYLE}
                  maxLength={200}
                />
                {errors.act_name && ERR(errors.act_name)}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                {LABEL("Talent Type")}
                <select
                  value={form.act_type}
                  onChange={(e) => {
                    set("act_type", e.target.value);
                    if (e.target.value !== "Other") set("act_description", "");
                  }}
                  style={{ ...INPUT_STYLE }}
                >
                  <option value="">Select…</option>
                  {GOT_TALENT_ACT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.act_type && ERR(errors.act_type)}
              </div>

              {form.act_type === "Other" && (
                <div style={{ marginBottom: "1.25rem" }}>
                  {LABEL("Tell us about your talent")}
                  <p style={{ color: "#7A6A52", fontSize: "0.8rem", margin: "0 0 0.4rem" }}>
                    Briefly describe what you&apos;ll be performing.
                  </p>
                  <textarea
                    value={form.act_description}
                    onChange={(e) => set("act_description", e.target.value.slice(0, 500))}
                    placeholder="e.g. I will perform a stand-up comedy routine with audience participation…"
                    rows={4}
                    maxLength={500}
                    style={{ ...INPUT_STYLE, resize: "vertical", minHeight: "100px" }}
                  />
                  <p style={{ color: "#A89070", fontSize: "0.75rem", margin: "0.25rem 0 0", textAlign: "right" }}>
                    {form.act_description.length}/500
                  </p>
                  {errors.act_description && ERR(errors.act_description)}
                </div>
              )}

              {/* Instrument / band policy notice */}
              <div
                style={{
                  backgroundColor: "#FFF8E7",
                  border: "1px solid #D4A827",
                  borderRadius: "4px",
                  padding: "0.9rem 1.1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p style={{ color: "#8B6914", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 0.4rem" }}>
                  Using an instrument?
                </p>
                <p style={{ color: "#5C4A32", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                  Instruments and personal audio equipment <strong>cannot be connected to the Fair&apos;s sound system</strong>.
                  If you&apos;re using a backing track, bring it downloaded on a USB/jump drive or your phone — that is handled separately by our sound team.
                </p>
              </div>

              {/* Band / sound system acknowledgment */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    cursor: "pointer",
                    color: "#3A3028",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.instrument_ack}
                    onChange={(e) => set("instrument_ack", e.target.checked)}
                    style={{ marginTop: "0.2rem", accentColor: "#2C4A2E", flexShrink: 0 }}
                  />
                  <span>
                    I understand that bands are not permitted and that instruments or personal audio equipment
                    cannot be connected to the Fair&apos;s sound system. <span style={{ color: "#8B2E2E" }}>*</span>
                  </span>
                </label>
                {errors.instrument_ack && ERR(errors.instrument_ack)}
              </div>

              <div style={{ marginBottom: "0.5rem" }}>
                {LABEL("Solo or Group?")}
                <div style={{ display: "flex", gap: "1rem" }}>
                  {[false, true].map((val) => (
                    <label key={String(val)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#3A3028" }}>
                      <input
                        type="radio"
                        checked={form.is_group === val}
                        onChange={() => {
                          set("is_group", val);
                          if (!val) set("additional_performers", []);
                        }}
                      />
                      {val ? "Group" : "Solo"}
                    </label>
                  ))}
                </div>
                <p style={{ color: "#A89070", fontSize: "0.8rem", margin: "0.4rem 0 0" }}>Bands are not permitted.</p>
              </div>
            </Card>

            <Card>
              <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.35rem", margin: "0 0 1.5rem" }}>
                {form.is_group ? "Primary Performer" : "Performer"}
              </h2>

              <div style={{ marginBottom: "1.25rem" }}>
                {LABEL("Full Name")}
                <input
                  type="text"
                  value={form.primary_performer_name}
                  onChange={(e) => set("primary_performer_name", e.target.value)}
                  style={INPUT_STYLE}
                  maxLength={200}
                />
                {errors.primary_performer_name && ERR(errors.primary_performer_name)}
              </div>

              <div>
                {LABEL("Date of Birth")}
                <p style={{ color: "#7A6A52", fontSize: "0.8rem", margin: "0 0 0.4rem" }}>
                  Used to assign your division (Kids, Youth, or Adult). Not shared publicly.
                </p>
                <input
                  type="date"
                  value={form.primary_performer_dob}
                  onChange={(e) => set("primary_performer_dob", e.target.value)}
                  style={{ ...INPUT_STYLE, maxWidth: "220px" }}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.primary_performer_dob && ERR(errors.primary_performer_dob)}

                {/* Live division preview */}
                {divisionConfig && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      backgroundColor: "#F0F7F0",
                      border: "1px solid #C5D9C5",
                      borderRadius: "4px",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <p style={{ color: "#2C4A2E", fontSize: "0.875rem", margin: 0 }}>
                      <strong>Division:</strong> {divisionConfig.label} ({divisionConfig.ageLabel}) ·{" "}
                      <strong>Performance:</strong> {divisionConfig.performanceDate} at {divisionConfig.performanceTime}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Additional performers (group only) */}
            {form.is_group && (
              <Card>
                <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.35rem", margin: "0 0 0.5rem" }}>
                  Additional Performers
                </h2>
                <p style={{ color: "#7A6A52", fontSize: "0.85rem", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
                  Add each additional group member. We collect their ages to confirm division placement.
                </p>

                {errors.additional_performers && ERR(errors.additional_performers)}

                {form.additional_performers.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 100px auto",
                      gap: "0.75rem",
                      alignItems: "start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      {i === 0 && LABEL("Full Name", false)}
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => setPerformer(i, "name", e.target.value)}
                        placeholder={`Performer ${i + 2} name`}
                        style={INPUT_STYLE}
                        maxLength={100}
                      />
                      {errors[`performer_name_${i}`] && ERR(errors[`performer_name_${i}`])}
                    </div>
                    <div>
                      {i === 0 && LABEL("Age", false)}
                      <input
                        type="number"
                        value={p.age_years}
                        onChange={(e) => setPerformer(i, "age_years", e.target.value)}
                        placeholder="Age"
                        min={0}
                        max={120}
                        style={{ ...INPUT_STYLE }}
                      />
                      {errors[`performer_age_${i}`] && ERR(errors[`performer_age_${i}`])}
                    </div>
                    <div style={{ paddingTop: i === 0 ? "1.6rem" : "0" }}>
                      <button
                        type="button"
                        onClick={() => removePerformer(i)}
                        style={{
                          background: "none",
                          border: "1px solid #D4C89A",
                          borderRadius: "4px",
                          padding: "0.5rem 0.75rem",
                          cursor: "pointer",
                          color: "#8B2E2E",
                          fontSize: "0.8rem",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPerformer}
                  style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    border: "2px solid #2C4A2E",
                    borderRadius: "4px",
                    backgroundColor: "transparent",
                    color: "#2C4A2E",
                    padding: "0.5rem 1.25rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  + Add Performer
                </button>

                {/* Division conflict warning */}
                {divisionConflict && (
                  <div
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "#FFF8E7",
                      border: "2px solid #D4A827",
                      borderRadius: "4px",
                      padding: "1rem 1.25rem",
                    }}
                  >
                    <p style={{ color: "#8B6914", fontWeight: "700", fontSize: "0.9rem", margin: "0 0 0.4rem" }}>
                      ⚠ Mixed Age Divisions Detected
                    </p>
                    <p style={{ color: "#5C4A32", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>
                      Your group includes performers from different age divisions (Kids, Youth, or Adult). You can still
                      register — your entry will be flagged for review by the event coordinator, who will confirm your
                      division before the competition.
                    </p>
                  </div>
                )}
              </Card>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  backgroundColor: "#2C4A2E",
                  color: "#F5EDD4",
                  border: "none",
                  padding: "0.85rem 2.25rem",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Continue to Contact →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Contact + Music ── */}
        {step === 2 && (
          <div>
            <Card>
              <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.35rem", margin: "0 0 1.5rem" }}>
                Contact Information
              </h2>

              <div style={{ marginBottom: "1.25rem" }}>
                {LABEL("Contact Name")}
                <p style={{ color: "#7A6A52", fontSize: "0.8rem", margin: "0 0 0.4rem" }}>
                  The person responsible for this registration (parent/guardian if the performer is a minor).
                </p>
                <input
                  type="text"
                  value={form.contact_name}
                  onChange={(e) => set("contact_name", e.target.value)}
                  style={INPUT_STYLE}
                  maxLength={200}
                />
                {errors.contact_name && ERR(errors.contact_name)}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                {LABEL("Email Address")}
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => set("contact_email", e.target.value)}
                  style={INPUT_STYLE}
                  autoComplete="email"
                />
                {errors.contact_email && ERR(errors.contact_email)}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                {LABEL("Confirm Email Address")}
                <input
                  type="email"
                  value={form.confirm_contact_email}
                  onChange={(e) => set("confirm_contact_email", e.target.value)}
                  style={INPUT_STYLE}
                  autoComplete="email"
                />
                {errors.confirm_contact_email && ERR(errors.confirm_contact_email)}
              </div>

              <div>
                {LABEL("Phone Number")}
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => set("contact_phone", e.target.value)}
                  style={INPUT_STYLE}
                  autoComplete="tel"
                />
                {errors.contact_phone && ERR(errors.contact_phone)}
              </div>
            </Card>

            <Card>
              <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.35rem", margin: "0 0 0.75rem" }}>
                Music / Audio
              </h2>
              <p style={{ color: "#5C4A32", fontSize: "0.95rem", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
                Does your act require music or audio?
              </p>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                {[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ].map(({ value, label }) => (
                  <label
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      color: "#3A3028",
                      padding: "0.6rem 1.25rem",
                      border: `2px solid ${form.requires_music === value ? "#2C4A2E" : "#D4C89A"}`,
                      borderRadius: "4px",
                      backgroundColor: form.requires_music === value ? "#F0F7F0" : "#fff",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    <input
                      type="radio"
                      name="requires_music"
                      checked={form.requires_music === value}
                      onChange={() => set("requires_music", value)}
                      style={{ accentColor: "#2C4A2E" }}
                    />
                    {label}
                  </label>
                ))}
              </div>
              {errors.requires_music && ERR(errors.requires_music)}

              {form.requires_music === true && (
                <div
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#FFF8E7",
                    border: "1px solid #D4A827",
                    borderRadius: "4px",
                    padding: "1rem 1.25rem",
                  }}
                >
                  <p style={{ color: "#8B6914", fontWeight: "700", fontSize: "0.85rem", margin: "0 0 0.4rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Music Reminder
                  </p>
                  <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
                    Please bring your performance track on a <strong>USB/jump drive</strong> or your <strong>phone</strong> with
                    the track downloaded and ready to play. Our sound team has cables available for different phone types.
                    Do not rely on streaming connectivity.
                  </p>
                </div>
              )}
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  backgroundColor: "transparent",
                  border: "2px solid #D4C89A",
                  color: "#5C4A32",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "4px",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  backgroundColor: "#2C4A2E",
                  color: "#F5EDD4",
                  border: "none",
                  padding: "0.85rem 2.25rem",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review ── */}
        {step === 3 && (
          <div>
            <Card>
              <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.35rem", margin: "0 0 1.25rem" }}>
                Review Your Registration
              </h2>

              {divisionConflict && (
                <div
                  style={{
                    backgroundColor: "#FFF8E7",
                    border: "2px solid #D4A827",
                    borderRadius: "4px",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <p style={{ color: "#8B6914", fontWeight: "700", margin: "0 0 0.35rem" }}>⚠ Division Review Required</p>
                  <p style={{ color: "#5C4A32", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                    Your group includes performers from different age divisions. Your registration will be flagged for
                    manual review by the event coordinator to confirm your correct division before performance day.
                  </p>
                </div>
              )}

              {/* Act */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                <tbody>
                  {[
                    ["Act Name", form.act_name],
                    ["Talent Type", form.act_type],
                    ...(form.act_type === "Other" && form.act_description ? [["Act Description", form.act_description]] : []),
                    ["Solo / Group", form.is_group ? `Group (${1 + form.additional_performers.length} performers)` : "Solo"],
                    ["Primary Performer", form.primary_performer_name],
                    ...(divisionConfig
                      ? [
                          ["Division", `${divisionConfig.label} (${divisionConfig.ageLabel})`],
                          ["Performance Date", `${divisionConfig.performanceDate} at ${divisionConfig.performanceTime}`],
                        ]
                      : []),
                    ["Music / Audio", form.requires_music ? "Yes — bring track on USB or phone" : "No"],
                    ...(form.is_group && form.additional_performers.length > 0
                      ? form.additional_performers.map((p, i) => [`Performer ${i + 2}`, `${p.name} (age ${p.age_years})`])
                      : []),
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: "1px solid #E8DFC8" }}>
                      <td style={{ padding: "0.6rem 0.5rem 0.6rem 0", color: "#7A6A52", fontSize: "0.875rem", width: "45%", verticalAlign: "top" }}>
                        <strong>{label}</strong>
                      </td>
                      <td style={{ padding: "0.6rem 0", color: "#2C4A2E", fontSize: "0.95rem" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop: "2px solid #D4A827", paddingTop: "1rem", marginTop: "0.5rem" }}>
                <p style={{ color: "#7A6A52", fontSize: "0.8rem", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>Contact</p>
                <p style={{ color: "#2C4A2E", margin: "0 0 0.25rem" }}>{form.contact_name}</p>
                <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: "0 0 0.25rem" }}>{form.contact_email}</p>
                <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: "0" }}>{form.contact_phone}</p>
              </div>

              <div
                style={{
                  backgroundColor: "#2C4A2E",
                  borderRadius: "4px",
                  padding: "1rem 1.25rem",
                  marginTop: "1.25rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#D4A827", fontSize: "0.8rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.25rem" }}>
                  Entry Fee
                </p>
                <p style={{ color: "#F5EDD4", fontSize: "1.75rem", fontWeight: "700", fontFamily: "Georgia, serif", margin: 0 }}>
                  $25.00
                </p>
                <p style={{ color: "#A89070", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>
                  Per act · Charged on the next screen
                </p>
              </div>
            </Card>

            {serverError && (
              <div
                style={{
                  backgroundColor: "#FDF0F0",
                  border: "2px solid #E57373",
                  borderRadius: "4px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ color: "#8B2E2E", margin: 0, fontSize: "0.95rem" }}>{serverError}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  backgroundColor: "transparent",
                  border: "2px solid #D4C89A",
                  color: "#5C4A32",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "4px",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}
              >
                ← Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#A89070" : "#D4A827",
                  color: "#1A1A1A",
                  border: "none",
                  padding: "0.9rem 2.25rem",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontFamily: "Georgia, serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "700",
                }}
              >
                {loading ? "Processing…" : "Proceed to Payment →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
