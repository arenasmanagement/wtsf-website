"use client";

import { useState, useEffect, useId } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Lot        { id: string; name: string; code: string | null }
interface ClassItem  { id: string; name: string; code: string | null; lots: Lot[] }
interface Dept       { id: string; name: string; code: string | null; classes: ClassItem[] }
interface Catalog    { departments: Dept[] }

interface EntryItem {
  key:             string   // local React key only
  department_id:   string
  department_name: string
  class_id:        string
  class_name:      string
  lot_id:          string
  lot_name:        string
}

interface PersonalForm {
  first_name:     string
  last_name:      string
  email:          string
  confirm_email:  string
  phone:          string
  address:        string
  city:           string
  state:          string
  zip:            string
  entrant_type:   "adult" | "youth"
  youth_age:      string
  guardian_name:  string
  guardian_phone: string
  guardian_email: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

// Inline style tokens
const C = {
  cream:     "#F5EDD4",
  green:     "#2C4A2E",
  gold:      "#D4A827",
  text:      "#3D3026",
  muted:     "#8B7355",
  border:    "#E8DFC8",
  inputBg:   "#FDFAF3",
  error:     "#C0392B",
  lightGreen:"#A8BFA9",
};

type S = React.CSSProperties;

const inputStyle: S = {
  width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`,
  backgroundColor: C.inputBg, color: C.text, fontSize: 14, outline: "none",
  boxSizing: "border-box",
};

const labelStyle: S = {
  display: "block", fontSize: 12, fontWeight: 700, color: C.muted,
  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5,
};

const errorStyle: S = { color: C.error, fontSize: 12, marginTop: 4 };

const btnPrimary: S = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "12px 24px", backgroundColor: C.green, color: C.gold,
  fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
  textTransform: "uppercase", border: "none", cursor: "pointer",
  transition: "opacity 0.15s",
};

const btnSecondary: S = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "10px 20px", backgroundColor: "transparent", color: C.muted,
  fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
  border: `1px solid ${C.border}`, cursor: "pointer",
};

const btnGold: S = {
  ...btnPrimary,
  backgroundColor: C.gold, color: "#1A1A1A",
};

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: C.error }}> *</span>}
      </label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Your Info" },
    { n: 2, label: "Add Exhibits" },
    { n: 3, label: "Review & Submit" },
  ];
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => {
        const active  = s.n === step;
        const done    = s.n < step;
        const pct     = done ? C.green : active ? C.green : C.border;
        return (
          <div key={s.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {i > 0 && <div style={{ flex: 1, height: 2, backgroundColor: done ? C.green : C.border }} />}
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                backgroundColor: active || done ? C.green : "transparent",
                border: `2px solid ${pct}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: active || done ? C.gold : C.muted,
              }}>
                {done ? "✓" : s.n}
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, backgroundColor: active && step > s.n ? C.green : C.border }} />}
            </div>
            <p style={{ fontSize: 11, color: active ? C.green : C.muted, marginTop: 4, fontWeight: active ? 700 : 400, textAlign: "center" }}>
              {s.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
interface Props {
  onSuccess: (confirmationNumber: string, email: string) => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const uid = useId();

  // ── Catalog ───────────────────────────────────────────────────────────────
  const [catalog,        setCatalog]        = useState<Catalog | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError,   setCatalogError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/exhibits/register")
      .then(r => r.json())
      .then(d => {
        if (!d.enabled) {
          setCatalogError("Registration is not currently open. Please refresh the page.");
        } else if (!d.catalog?.departments?.length) {
          setCatalogError("No exhibit categories are available yet. Please check back soon.");
        } else {
          setCatalog(d.catalog as Catalog);
        }
      })
      .catch(() => setCatalogError("Failed to load exhibit categories. Please refresh the page."))
      .finally(() => setCatalogLoading(false));
  }, []);

  // ── Wizard state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ── Personal info ─────────────────────────────────────────────────────────
  const [personal, setPersonal] = useState<PersonalForm>({
    first_name: "", last_name: "", email: "", confirm_email: "",
    phone: "", address: "", city: "", state: "TN", zip: "",
    entrant_type: "adult",
    youth_age: "", guardian_name: "", guardian_phone: "", guardian_email: "",
  });
  const [p1Errors, setP1Errors] = useState<Partial<Record<keyof PersonalForm, string>>>({});

  function setField<K extends keyof PersonalForm>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setPersonal(prev => ({ ...prev, [key]: e.target.value }));
      setP1Errors(prev => { const n = { ...prev }; delete n[key]; return n; });
    };
  }

  function validateStep1(): boolean {
    const errs: Partial<Record<keyof PersonalForm, string>> = {};
    if (!personal.first_name.trim())  errs.first_name    = "Required";
    if (!personal.last_name.trim())   errs.last_name     = "Required";
    if (!personal.email.trim())       errs.email         = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) errs.email = "Invalid email";
    if (!personal.confirm_email.trim()) errs.confirm_email = "Required";
    else if (personal.email.toLowerCase() !== personal.confirm_email.toLowerCase()) errs.confirm_email = "Emails don't match";
    if (!personal.phone.trim())       errs.phone         = "Required";
    else if (!/^[\d\s\-\(\)\+\.]{7,20}$/.test(personal.phone)) errs.phone = "Invalid phone number";
    if (!personal.address.trim())     errs.address       = "Required";
    if (!personal.city.trim())        errs.city          = "Required";
    if (!personal.zip.trim())         errs.zip           = "Required";
    else if (!/^\d{5}(-\d{4})?$/.test(personal.zip)) errs.zip = "Invalid ZIP code";
    if (personal.entrant_type === "youth") {
      if (!personal.guardian_name.trim()) errs.guardian_name = "Required for youth";
    }
    setP1Errors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Entries ───────────────────────────────────────────────────────────────
  const [entries,       setEntries]       = useState<EntryItem[]>([]);

  // Current entry being built
  const [curDeptId,    setCurDeptId]    = useState("");
  const [curClassId,   setCurClassId]   = useState("");
  const [curLotId,     setCurLotId]     = useState("");
  const [entryError,   setEntryError]   = useState<string | null>(null);

  const curDept  = catalog?.departments.find(d => d.id === curDeptId) ?? null;
  const curClass = curDept?.classes.find(c => c.id === curClassId)    ?? null;

  function handleAddEntry() {
    if (!curDeptId || !curClassId || !curLotId) {
      setEntryError("Please select a Department, Class, and Lot before adding.");
      return;
    }
    if (entries.length >= 50) {
      setEntryError("Maximum of 50 entries per registration.");
      return;
    }

    const dept  = catalog!.departments.find(d => d.id === curDeptId)!;
    const cls   = dept.classes.find(c => c.id === curClassId)!;
    const lot   = cls.lots.find(l => l.id === curLotId)!;

    setEntries(prev => [
      ...prev,
      {
        key:             `${Date.now()}-${Math.random()}`,
        department_id:   curDeptId,
        department_name: dept.name,
        class_id:        curClassId,
        class_name:      cls.name,
        lot_id:          curLotId,
        lot_name:        lot.name,
      },
    ]);
    setCurDeptId(""); setCurClassId(""); setCurLotId("");
    setEntryError(null);
  }

  function removeEntry(key: string) {
    setEntries(prev => prev.filter(e => e.key !== key));
  }

  // ── Submission ────────────────────────────────────────────────────────────
  const [rulesAgreed,  setRulesAgreed]  = useState(false);
  const [rulesError,   setRulesError]   = useState<string | null>(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState<string | null>(null);

  async function handleSubmit() {
    if (!rulesAgreed) { setRulesError("You must agree to the rules to continue."); return; }
    setRulesError(null);
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        first_name:     personal.first_name.trim(),
        last_name:      personal.last_name.trim(),
        email:          personal.email.trim(),
        confirm_email:  personal.confirm_email.trim(),
        phone:          personal.phone.trim(),
        address:        personal.address.trim(),
        city:           personal.city.trim(),
        state:          personal.state,
        zip:            personal.zip.trim(),
        entrant_type:   personal.entrant_type,
        youth_age:      personal.entrant_type === "youth" && personal.youth_age
                          ? parseInt(personal.youth_age, 10)
                          : null,
        guardian_name:  personal.guardian_name.trim() || null,
        guardian_phone: personal.guardian_phone.trim() || null,
        guardian_email: personal.guardian_email.trim() || null,
        entries:        entries.map(e => ({
                          department_id: e.department_id,
                          class_id:      e.class_id,
                          lot_id:        e.lot_id,
                        })),
        rules_agreed:   true as const,
        website:        "", // honeypot
      };

      const res  = await fetch("/api/exhibits/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
      } else {
        onSuccess(json.confirmationNumber, personal.email);
      }
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading / error states ─────────────────────────────────────────────────
  if (catalogLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <svg style={{ width: 28, height: 28, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <circle cx="12" cy="12" r="10" stroke={C.border} strokeWidth="4" />
          <path fill={C.green} d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>Loading exhibit categories…</p>
      </div>
    );
  }

  if (catalogError) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: C.error, fontSize: 14 }}>{catalogError}</p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // STEP 1 — Personal Information
  // ════════════════════════════════════════════════════
  if (step === 1) {
    return (
      <div>
        <StepIndicator step={1} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.green, margin: "0 0 20px", fontStyle: "italic" }}>
          Your Contact Information
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="First Name" required error={p1Errors.first_name}>
            <input style={inputStyle} value={personal.first_name} onChange={setField("first_name")} maxLength={100} autoFocus />
          </Field>
          <Field label="Last Name" required error={p1Errors.last_name}>
            <input style={inputStyle} value={personal.last_name} onChange={setField("last_name")} maxLength={100} />
          </Field>
        </div>

        <Field label="Email Address" required error={p1Errors.email}>
          <input style={inputStyle} type="email" value={personal.email} onChange={setField("email")} maxLength={200} autoComplete="email" />
        </Field>

        <Field label="Confirm Email" required error={p1Errors.confirm_email}>
          <input style={inputStyle} type="email" value={personal.confirm_email} onChange={setField("confirm_email")} maxLength={200} />
        </Field>

        <Field label="Phone Number" required error={p1Errors.phone}>
          <input style={inputStyle} type="tel" value={personal.phone} onChange={setField("phone")} placeholder="(000) 000-0000" maxLength={20} />
        </Field>

        <Field label="Street Address" required error={p1Errors.address}>
          <input style={inputStyle} value={personal.address} onChange={setField("address")} maxLength={200} autoComplete="street-address" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 12px" }}>
          <Field label="City" required error={p1Errors.city}>
            <input style={inputStyle} value={personal.city} onChange={setField("city")} maxLength={100} />
          </Field>
          <Field label="State" required>
            <select style={{ ...inputStyle, minWidth: 70 }} value={personal.state} onChange={setField("state")}>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="ZIP" required error={p1Errors.zip}>
            <input style={{ ...inputStyle, width: 100 }} value={personal.zip} onChange={setField("zip")} maxLength={10} placeholder="00000" />
          </Field>
        </div>

        {/* Entrant type */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Entrant Type <span style={{ color: C.error }}>*</span></label>
          <div style={{ display: "flex", gap: 24 }}>
            {(["adult", "youth"] as const).map(type => (
              <label key={type} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: C.text }}>
                <input
                  type="radio" name={`${uid}-entrant_type`}
                  value={type} checked={personal.entrant_type === type}
                  onChange={() => setPersonal(prev => ({ ...prev, entrant_type: type }))}
                />
                {type === "adult" ? "Adult" : "Youth (under 18)"}
              </label>
            ))}
          </div>
        </div>

        {/* Youth fields */}
        {personal.entrant_type === "youth" && (
          <div style={{ padding: "16px 20px", backgroundColor: C.inputBg, border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
              Youth Information
            </p>
            <Field label="Age" error={p1Errors.youth_age}>
              <input style={{ ...inputStyle, width: 80 }} type="number" min={1} max={17} value={personal.youth_age} onChange={setField("youth_age")} />
            </Field>
            <Field label="Parent / Guardian Name" required error={p1Errors.guardian_name}>
              <input style={inputStyle} value={personal.guardian_name} onChange={setField("guardian_name")} maxLength={200} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Guardian Phone" error={p1Errors.guardian_phone}>
                <input style={inputStyle} type="tel" value={personal.guardian_phone} onChange={setField("guardian_phone")} maxLength={30} />
              </Field>
              <Field label="Guardian Email" error={p1Errors.guardian_email}>
                <input style={inputStyle} type="email" value={personal.guardian_email} onChange={setField("guardian_email")} maxLength={200} />
              </Field>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button
            style={btnPrimary}
            onClick={() => { if (validateStep1()) setStep(2); }}
          >
            Next: Add Exhibits
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // STEP 2 — Add Exhibit Entries
  // ════════════════════════════════════════════════════
  if (step === 2) {
    return (
      <div>
        <StepIndicator step={2} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.green, margin: "0 0 6px", fontStyle: "italic" }}>
          Add Your Exhibits
        </h2>
        <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px" }}>
          Select each exhibit you plan to bring. You can add up to 50 entries.
        </p>

        {/* Added entries list */}
        {entries.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Added Entries ({entries.length})
            </p>
            {entries.map((e, i) => (
              <div key={e.key} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", marginBottom: 4,
                backgroundColor: C.inputBg, border: `1px solid ${C.border}`,
              }}>
                <span style={{ color: C.muted, fontSize: 12, fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.text, fontWeight: 600 }}>
                    {e.department_name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
                    {e.class_name} → {e.lot_name}
                  </p>
                </div>
                <button
                  onClick={() => removeEntry(e.key)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.error, fontSize: 18, padding: "0 4px", lineHeight: 1 }}
                  title="Remove this entry"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add entry form */}
        {entries.length < 50 && (
          <div style={{ padding: "20px", backgroundColor: "#FDFAF3", border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>
              {entries.length === 0 ? "Select Your First Exhibit" : "Add Another Exhibit"}
            </p>

            {/* Department */}
            <Field label="Department" required>
              <select
                style={inputStyle}
                value={curDeptId}
                onChange={e => { setCurDeptId(e.target.value); setCurClassId(""); setCurLotId(""); setEntryError(null); }}
              >
                <option value="">— Select a department —</option>
                {catalog!.departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </Field>

            {/* Class */}
            <Field label="Class" required>
              <select
                style={{ ...inputStyle, opacity: !curDeptId ? 0.5 : 1 }}
                value={curClassId}
                onChange={e => { setCurClassId(e.target.value); setCurLotId(""); setEntryError(null); }}
                disabled={!curDeptId}
              >
                <option value="">— Select a class —</option>
                {(curDept?.classes ?? []).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            {/* Lot */}
            <Field label="Lot" required>
              <select
                style={{ ...inputStyle, opacity: !curClassId ? 0.5 : 1 }}
                value={curLotId}
                onChange={e => { setCurLotId(e.target.value); setEntryError(null); }}
                disabled={!curClassId}
              >
                <option value="">— Select a lot —</option>
                {(curClass?.lots ?? []).map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </Field>

            {entryError && <p style={{ ...errorStyle, marginBottom: 12 }}>{entryError}</p>}

            <button
              style={{
                ...btnGold,
                opacity: (!curDeptId || !curClassId || !curLotId) ? 0.5 : 1,
              }}
              onClick={handleAddEntry}
            >
              + Add This Entry
            </button>
          </div>
        )}

        {entries.length === 0 && (
          <p style={{ fontSize: 13, color: C.error, marginBottom: 16 }}>
            You must add at least one exhibit entry to continue.
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button style={btnSecondary} onClick={() => setStep(1)}>
            ← Back
          </button>
          <button
            style={{ ...btnPrimary, opacity: entries.length === 0 ? 0.5 : 1 }}
            onClick={() => { if (entries.length > 0) setStep(3); }}
          >
            Review & Submit
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // STEP 3 — Review & Submit
  // ════════════════════════════════════════════════════
  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>
      {children}
    </p>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
      <span style={{ fontSize: 12, color: C.muted, minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.text }}>{value}</span>
    </div>
  );

  return (
    <div>
      <StepIndicator step={3} />
      <h2 style={{ fontSize: 18, fontWeight: 700, color: C.green, margin: "0 0 20px", fontStyle: "italic" }}>
        Review & Submit
      </h2>

      {/* Personal info review */}
      <div style={{ padding: "16px 20px", backgroundColor: C.inputBg, border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <SectionHeader>Contact Information</SectionHeader>
          <button style={{ background: "none", border: "none", color: C.green, fontSize: 12, cursor: "pointer", fontWeight: 600 }} onClick={() => setStep(1)}>
            Edit
          </button>
        </div>
        <Row label="Name"    value={`${personal.first_name} ${personal.last_name}`} />
        <Row label="Email"   value={personal.email} />
        <Row label="Phone"   value={personal.phone} />
        <Row label="Address" value={`${personal.address}, ${personal.city}, ${personal.state} ${personal.zip}`} />
        <Row label="Type"    value={personal.entrant_type === "youth" ? `Youth${personal.youth_age ? ` (age ${personal.youth_age})` : ""}` : "Adult"} />
        {personal.guardian_name && <Row label="Guardian" value={personal.guardian_name} />}
      </div>

      {/* Entries review */}
      <div style={{ padding: "16px 20px", backgroundColor: C.inputBg, border: `1px solid ${C.border}`, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <SectionHeader>Exhibit Entries ({entries.length})</SectionHeader>
          <button style={{ background: "none", border: "none", color: C.green, fontSize: 12, cursor: "pointer", fontWeight: 600 }} onClick={() => setStep(2)}>
            Edit
          </button>
        </div>
        {entries.map((e, i) => (
          <div key={e.key} style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: C.muted, marginRight: 8 }}>{i + 1}.</span>
            <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{e.department_name}</span>
            <span style={{ fontSize: 13, color: C.muted }}> · {e.class_name} · {e.lot_name}</span>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{ padding: "16px 20px", backgroundColor: "#FFFBF0", border: `1px solid ${C.border}`, marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
          By submitting this pre-registration, I confirm that all information provided is accurate,
          that I have read the fair&apos;s exhibit rules, and that I understand my entries will not be
          officially recorded until I check in my physical exhibits on registration day.
        </p>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={rulesAgreed}
            onChange={e => { setRulesAgreed(e.target.checked); if (e.target.checked) setRulesError(null); }}
            style={{ marginTop: 2, flexShrink: 0, accentColor: C.green }}
          />
          <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>
            I agree to the 2026 West Tennessee State Fair exhibit rules and entry requirements.
          </span>
        </label>
        {rulesError && <p style={{ ...errorStyle, marginTop: 8 }}>{rulesError}</p>}
      </div>

      {submitError && (
        <div style={{ padding: "12px 16px", backgroundColor: "#FFF0F0", border: `1px solid #F0C0C0`, marginBottom: 16 }}>
          <p style={{ color: C.error, fontSize: 13, margin: 0 }}>{submitError}</p>
        </div>
      )}

      {/* Hidden honeypot */}
      <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button style={btnSecondary} onClick={() => setStep(2)} disabled={submitting}>
          ← Back
        </button>
        <button
          style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit Pre-Registration"}
          {!submitting && (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
