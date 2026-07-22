"use client";

import { useState, useCallback, useId } from "react";
import { DEPARTMENTS, getDivisionsForDepartment, ENTRY_DEADLINE_LABEL } from "@/lib/exhibit-config";

// ── Types ─────────────────────────────────────────────────────────────
interface ExhibitEntry {
  id: string;
  department: string;
  division: string;
  class_name: string;
  lot: string;
  entry_title: string;
  entry_description: string;
  quantity: number;
}

interface FormData {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  confirm_email: string;
  entrant_type: "adult" | "youth";
  youth_age: string;
  youth_grade: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  entries: ExhibitEntry[];
  rules_agreed: boolean;
  // honeypot
  website: string;
}

interface RegistrationFormProps {
  checkinInfo?: string;
  onSuccess: (ref: string) => void;
}

// ── Utility ──────────────────────────────────────────────────────────
function newEntry(): ExhibitEntry {
  return {
    id:          Math.random().toString(36).slice(2),
    department:  "",
    division:    "",
    class_name:  "",
    lot:         "",
    entry_title: "",
    entry_description: "",
    quantity:    1,
  };
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

// ── Shared input styles ───────────────────────────────────────────────
const INPUT_BASE =
  "w-full border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white transition-colors";
const INPUT_NORMAL =
  `${INPUT_BASE} border-[#D4C9A8] focus:ring-[#2C4A2E] focus:border-[#2C4A2E]`;
const INPUT_ERROR  =
  `${INPUT_BASE} border-red-400 focus:ring-red-400 bg-red-50`;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-600 mt-1">{msg}</p>;
}

function Label({ htmlFor, children, required }: {
  htmlFor: string; children: React.ReactNode; required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-bold tracking-wide uppercase mb-1.5"
      style={{ color: "#5C4A32", letterSpacing: "0.08em" }}
    >
      {children}
      {required && <span className="text-red-500 ml-1" aria-hidden>*</span>}
    </label>
  );
}

// ── Step indicators ───────────────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  const steps = ["Your Information", "Your Exhibits", "Review & Submit"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => {
        const num     = i + 1;
        const current = num === step;
        const done    = num < step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors"
                style={{
                  backgroundColor: done ? "#2C4A2E" : current ? "#D4A827" : "#E8DFC8",
                  color:           done ? "#D4A827"  : current ? "#1A1A1A" : "#8B7355",
                }}
                aria-current={current ? "step" : undefined}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : num}
              </div>
              <span
                className="text-xs font-medium mt-1 text-center hidden sm:block whitespace-nowrap"
                style={{ color: current ? "#2C4A2E" : "#8B7355" }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mt-[-14px] sm:mt-[-28px]"
                style={{ backgroundColor: done ? "#2C4A2E" : "#E8DFC8" }}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Entry card ────────────────────────────────────────────────────────
function EntryCard({
  entry,
  index,
  onChange,
  onRemove,
  canRemove,
  errors,
}: {
  entry: ExhibitEntry;
  index: number;
  onChange: (id: string, field: keyof ExhibitEntry, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  errors: Partial<Record<keyof ExhibitEntry, string>>;
}) {
  const divisions = getDivisionsForDepartment(entry.department);

  return (
    <div
      className="p-5 mb-4"
      style={{
        backgroundColor: "#FDFAF3",
        border: "1px solid #E8DFC8",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-wider uppercase"
          style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
        >
          Exhibit {index + 1}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
            aria-label={`Remove exhibit ${index + 1}`}
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Department */}
        <div>
          <Label htmlFor={`dept-${entry.id}`} required>Department</Label>
          <select
            id={`dept-${entry.id}`}
            value={entry.department}
            onChange={(ev) => {
              onChange(entry.id, "department", ev.target.value);
              onChange(entry.id, "division", "");
            }}
            className={errors.department ? INPUT_ERROR : INPUT_NORMAL}
          >
            <option value="">Select department…</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <FieldError msg={errors.department} />
        </div>

        {/* Division */}
        <div>
          <Label htmlFor={`div-${entry.id}`} required>Division</Label>
          <select
            id={`div-${entry.id}`}
            value={entry.division}
            onChange={(ev) => onChange(entry.id, "division", ev.target.value)}
            disabled={!entry.department}
            className={errors.division ? INPUT_ERROR : INPUT_NORMAL}
          >
            <option value="">Select division…</option>
            {divisions.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <FieldError msg={errors.division} />
        </div>

        {/* Class */}
        <div>
          <Label htmlFor={`class-${entry.id}`} required>Class</Label>
          <input
            id={`class-${entry.id}`}
            type="text"
            placeholder="e.g. Class 14  (as shown in entry book)"
            value={entry.class_name}
            onChange={(ev) => onChange(entry.id, "class_name", ev.target.value)}
            className={errors.class_name ? INPUT_ERROR : INPUT_NORMAL}
          />
          <p className="text-xs mt-1" style={{ color: "#8B7355" }}>
            Enter exactly as printed in the fair entry book.
          </p>
          <FieldError msg={errors.class_name} />
        </div>

        {/* Lot */}
        <div>
          <Label htmlFor={`lot-${entry.id}`} required>Lot</Label>
          <input
            id={`lot-${entry.id}`}
            type="text"
            placeholder="e.g. Lot 2  (as shown in entry book)"
            value={entry.lot}
            onChange={(ev) => onChange(entry.id, "lot", ev.target.value)}
            className={errors.lot ? INPUT_ERROR : INPUT_NORMAL}
          />
          <p className="text-xs mt-1" style={{ color: "#8B7355" }}>
            Enter exactly as printed in the fair entry book.
          </p>
          <FieldError msg={errors.lot} />
        </div>

        {/* Entry title */}
        <div className="sm:col-span-2">
          <Label htmlFor={`title-${entry.id}`}>Entry Title / Description</Label>
          <input
            id={`title-${entry.id}`}
            type="text"
            placeholder="e.g. Apple Pie, Landscape Oil Painting, Red Roses…"
            value={entry.entry_title}
            maxLength={200}
            onChange={(ev) => onChange(entry.id, "entry_title", ev.target.value)}
            className={INPUT_NORMAL}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────
export default function RegistrationForm({ checkinInfo, onSuccess }: RegistrationFormProps) {
  const formId = useId();
  const [step, setStep]   = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [entryErrors, setEntryErrors] = useState<Record<string, Partial<Record<keyof ExhibitEntry, string>>>>({});

  const [form, setForm] = useState<FormData>({
    first_name: "", last_name: "", address: "", city: "", state: "TN",
    zip: "", phone: "", email: "", confirm_email: "",
    entrant_type: "adult",
    youth_age: "", youth_grade: "", guardian_name: "",
    guardian_phone: "", guardian_email: "",
    entries: [newEntry()],
    rules_agreed: false,
    website: "", // honeypot
  });

  // Field updater
  const set = useCallback(
    (field: keyof FormData, value: FormData[keyof FormData]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    },
    []
  );

  // Entry updater
  const updateEntry = useCallback(
    (id: string, field: keyof ExhibitEntry, value: string | number) => {
      setForm((prev) => ({
        ...prev,
        entries: prev.entries.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }));
      setEntryErrors((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), [field]: "" },
      }));
    },
    []
  );

  const addEntry = () => {
    if (form.entries.length >= 50) return;
    setForm((prev) => ({ ...prev, entries: [...prev.entries, newEntry()] }));
  };

  const removeEntry = (id: string) => {
    setForm((prev) => ({
      ...prev,
      entries: prev.entries.filter((e) => e.id !== id),
    }));
  };

  // ── Validation ─────────────────────────────────────────────────────
  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!form.first_name.trim()) errs.first_name = "Required";
    if (!form.last_name.trim())  errs.last_name  = "Required";
    if (!form.address.trim())    errs.address     = "Required";
    if (!form.city.trim())       errs.city        = "Required";
    if (!form.state)             errs.state       = "Required";
    if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) errs.zip = "Enter a valid 5-digit ZIP code";
    if (form.phone.trim().length < 7) errs.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (form.email.toLowerCase() !== form.confirm_email.toLowerCase()) errs.confirm_email = "Email addresses don't match";
    if (form.entrant_type === "youth" && !form.guardian_name.trim()) {
      errs.guardian_name = "Parent or guardian name is required";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: Record<string, Partial<Record<keyof ExhibitEntry, string>>> = {};
    let valid = true;
    form.entries.forEach((e) => {
      const eErr: Partial<Record<keyof ExhibitEntry, string>> = {};
      if (!e.department)  { eErr.department = "Required"; valid = false; }
      if (!e.division)    { eErr.division   = "Required"; valid = false; }
      if (!e.class_name.trim()) { eErr.class_name = "Required"; valid = false; }
      if (!e.lot.trim())        { eErr.lot        = "Required"; valid = false; }
      if (Object.keys(eErr).length) errs[e.id] = eErr;
    });
    setEntryErrors(errs);
    return valid;
  }

  // ── Navigation ─────────────────────────────────────────────────────
  function handleNext() {
    if (step === 1 && !validateStep1()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (step === 2 && !validateStep2()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Submit ─────────────────────────────────────────────────────────
  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.rules_agreed) {
      setFieldErrors((p) => ({ ...p, rules_agreed: "You must agree to the exhibit rules" }));
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        ...form,
        youth_age: form.youth_age ? parseInt(form.youth_age) : null,
        entries: form.entries.map(({ id: _id, ...rest }) => rest),
      };

      const res = await fetch("/api/exhibits/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:   JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      onSuccess(json.submissionRef);
    } catch {
      setServerError("A network error occurred. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────
  const isYouth = form.entrant_type === "youth";

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Exhibit registration form">
      {/* Honeypot — bots fill this, humans don't see it */}
      <div aria-hidden="true" style={{ display: "none" }}>
        <label htmlFor={`${formId}-website`}>Leave this blank</label>
        <input
          id={`${formId}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(ev) => set("website", ev.target.value)}
        />
      </div>

      <StepIndicator step={step} total={3} />

      {/* ─────────────────────── STEP 1 ──────────────────────── */}
      {step === 1 && (
        <div>
          <h2
            className="text-2xl font-bold italic mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            Your Information
          </h2>

          {/* Adult / Youth */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-wide uppercase mb-3" style={{ color: "#5C4A32", letterSpacing: "0.08em" }}>
              Registering as <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-3">
              {(["adult", "youth"] as const).map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 px-5 py-3 cursor-pointer border-2 flex-1 justify-center transition-colors"
                  style={{
                    borderColor: form.entrant_type === type ? "#2C4A2E" : "#E8DFC8",
                    backgroundColor: form.entrant_type === type ? "#F5EDD4" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="entrant_type"
                    value={type}
                    checked={form.entrant_type === type}
                    onChange={() => set("entrant_type", type)}
                    className="accent-[#2C4A2E]"
                  />
                  <span
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: "#2C4A2E" }}
                  >
                    {type === "adult" ? "Adult" : "Youth (Under 18)"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`${formId}-fname`} required>First Name</Label>
              <input id={`${formId}-fname`} type="text" autoComplete="given-name"
                value={form.first_name} onChange={(ev) => set("first_name", ev.target.value)}
                className={fieldErrors.first_name ? INPUT_ERROR : INPUT_NORMAL} />
              <FieldError msg={fieldErrors.first_name} />
            </div>
            <div>
              <Label htmlFor={`${formId}-lname`} required>Last Name</Label>
              <input id={`${formId}-lname`} type="text" autoComplete="family-name"
                value={form.last_name} onChange={(ev) => set("last_name", ev.target.value)}
                className={fieldErrors.last_name ? INPUT_ERROR : INPUT_NORMAL} />
              <FieldError msg={fieldErrors.last_name} />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <Label htmlFor={`${formId}-addr`} required>Mailing Address</Label>
            <input id={`${formId}-addr`} type="text" autoComplete="street-address"
              value={form.address} onChange={(ev) => set("address", ev.target.value)}
              className={fieldErrors.address ? INPUT_ERROR : INPUT_NORMAL} />
            <FieldError msg={fieldErrors.address} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2 sm:col-span-2">
              <Label htmlFor={`${formId}-city`} required>City</Label>
              <input id={`${formId}-city`} type="text" autoComplete="address-level2"
                value={form.city} onChange={(ev) => set("city", ev.target.value)}
                className={fieldErrors.city ? INPUT_ERROR : INPUT_NORMAL} />
              <FieldError msg={fieldErrors.city} />
            </div>
            <div>
              <Label htmlFor={`${formId}-state`} required>State</Label>
              <select id={`${formId}-state`} autoComplete="address-level1"
                value={form.state} onChange={(ev) => set("state", ev.target.value)}
                className={fieldErrors.state ? INPUT_ERROR : INPUT_NORMAL}>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <FieldError msg={fieldErrors.state} />
            </div>
            <div>
              <Label htmlFor={`${formId}-zip`} required>ZIP</Label>
              <input id={`${formId}-zip`} type="text" autoComplete="postal-code"
                value={form.zip} onChange={(ev) => set("zip", ev.target.value)}
                className={fieldErrors.zip ? INPUT_ERROR : INPUT_NORMAL} inputMode="numeric" />
              <FieldError msg={fieldErrors.zip} />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`${formId}-phone`} required>Phone Number</Label>
              <input id={`${formId}-phone`} type="tel" autoComplete="tel"
                value={form.phone} onChange={(ev) => set("phone", ev.target.value)}
                className={fieldErrors.phone ? INPUT_ERROR : INPUT_NORMAL} />
              <FieldError msg={fieldErrors.phone} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor={`${formId}-email`} required>Email Address</Label>
              <input id={`${formId}-email`} type="email" autoComplete="email"
                value={form.email} onChange={(ev) => set("email", ev.target.value)}
                className={fieldErrors.email ? INPUT_ERROR : INPUT_NORMAL} />
              <FieldError msg={fieldErrors.email} />
            </div>
            <div>
              <Label htmlFor={`${formId}-cemail`} required>Confirm Email</Label>
              <input id={`${formId}-cemail`} type="email" autoComplete="email"
                value={form.confirm_email} onChange={(ev) => set("confirm_email", ev.target.value)}
                className={fieldErrors.confirm_email ? INPUT_ERROR : INPUT_NORMAL} />
              <FieldError msg={fieldErrors.confirm_email} />
            </div>
          </div>

          {/* Youth fields */}
          {isYouth && (
            <div
              className="p-5 mb-6"
              style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
            >
              <p
                className="text-xs font-bold tracking-wide uppercase mb-4"
                style={{ color: "#D4A827", letterSpacing: "0.1em" }}
              >
                Youth Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor={`${formId}-yage`}>Age</Label>
                  <input id={`${formId}-yage`} type="number" min={1} max={17}
                    value={form.youth_age} onChange={(ev) => set("youth_age", ev.target.value)}
                    className={INPUT_NORMAL} />
                </div>
                <div>
                  <Label htmlFor={`${formId}-ygrade`}>Grade (optional)</Label>
                  <input id={`${formId}-ygrade`} type="text" placeholder="e.g. 7th Grade"
                    value={form.youth_grade} onChange={(ev) => set("youth_grade", ev.target.value)}
                    className={INPUT_NORMAL} />
                </div>
              </div>
              <p
                className="text-xs font-bold tracking-wide uppercase mb-3"
                style={{ color: "#5C4A32", letterSpacing: "0.08em" }}
              >
                Parent / Guardian <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${formId}-gname`} required>Guardian Name</Label>
                  <input id={`${formId}-gname`} type="text"
                    value={form.guardian_name} onChange={(ev) => set("guardian_name", ev.target.value)}
                    className={fieldErrors.guardian_name ? INPUT_ERROR : INPUT_NORMAL} />
                  <FieldError msg={fieldErrors.guardian_name} />
                </div>
                <div>
                  <Label htmlFor={`${formId}-gphone`}>Guardian Phone</Label>
                  <input id={`${formId}-gphone`} type="tel"
                    value={form.guardian_phone} onChange={(ev) => set("guardian_phone", ev.target.value)}
                    className={INPUT_NORMAL} />
                </div>
                <div>
                  <Label htmlFor={`${formId}-gemail`}>Guardian Email</Label>
                  <input id={`${formId}-gemail`} type="email"
                    value={form.guardian_email} onChange={(ev) => set("guardian_email", ev.target.value)}
                    className={INPUT_NORMAL} />
                </div>
              </div>
            </div>
          )}

          {/* Privacy notice */}
          <div
            className="p-4 mb-6 text-xs leading-relaxed"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8", color: "#5C4A32" }}
          >
            <strong>Privacy Notice:</strong> The information you provide is used solely for West Tennessee State Fair exhibit registration, administration, check-in, judging, records, and related fair operations. It is not shared publicly or sold to third parties.
          </div>
        </div>
      )}

      {/* ─────────────────────── STEP 2 ──────────────────────── */}
      {step === 2 && (
        <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-2xl font-bold italic mb-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
              >
                Your Exhibits
              </h2>
              <p className="text-sm" style={{ color: "#5C4A32" }}>
                Add each exhibit separately. You can add as many as you need.
              </p>
            </div>
            <div
              className="flex-shrink-0 text-center px-4 py-2"
              style={{ backgroundColor: "#2C4A2E" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827" }}>Deadline</p>
              <p className="text-xs font-semibold" style={{ color: "#F5EDD4" }}>{ENTRY_DEADLINE_LABEL}</p>
            </div>
          </div>

          <div
            className="mb-5 p-4 text-sm"
            style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
          >
            <strong style={{ color: "#2C4A2E" }}>Finding your Class and Lot:</strong>{" "}
            <span style={{ color: "#5C4A32" }}>
              Download and review the{" "}
              <a href="/files/adult-rules.pdf" target="_blank" rel="noopener noreferrer"
                className="underline" style={{ color: "#2C4A2E" }}>
                entry book (Adult)
              </a>
              {" "}or{" "}
              <a href="/files/youth-rules.pdf" target="_blank" rel="noopener noreferrer"
                className="underline" style={{ color: "#2C4A2E" }}>
                Youth rules
              </a>
              {" "}to find the exact Class and Lot for each of your entries.
            </span>
          </div>

          {form.entries.map((entry, i) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              index={i}
              onChange={updateEntry}
              onRemove={removeEntry}
              canRemove={form.entries.length > 1}
              errors={entryErrors[entry.id] ?? {}}
            />
          ))}

          {form.entries.length < 50 && (
            <button
              type="button"
              onClick={addEntry}
              className="w-full py-3.5 text-sm font-bold tracking-wider uppercase border-2 border-dashed transition-colors hover:border-[#2C4A2E] hover:bg-[#F5EDD4]"
              style={{ borderColor: "#D4C9A8", color: "#5C4A32" }}
            >
              + Add Another Exhibit
            </button>
          )}
        </div>
      )}

      {/* ─────────────────────── STEP 3 ──────────────────────── */}
      {step === 3 && (
        <div>
          <h2
            className="text-2xl font-bold italic mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            Review &amp; Submit
          </h2>

          {/* Entrant summary */}
          <div className="mb-6 p-5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827" }}>Your Information</p>
              <button
                type="button"
                onClick={() => { setStep(1); window.scrollTo({ top: 0 }); }}
                className="text-xs font-semibold underline"
                style={{ color: "#2C4A2E" }}
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm" style={{ color: "#3D3026" }}>
              <div><span className="font-semibold">Name:</span> {form.first_name} {form.last_name}</div>
              <div><span className="font-semibold">Type:</span> {form.entrant_type === "adult" ? "Adult" : "Youth"}{form.youth_age ? `, Age ${form.youth_age}` : ""}</div>
              <div><span className="font-semibold">Address:</span> {form.address}, {form.city}, {form.state} {form.zip}</div>
              <div><span className="font-semibold">Phone:</span> {form.phone}</div>
              <div><span className="font-semibold">Email:</span> {form.email}</div>
              {form.guardian_name && <div><span className="font-semibold">Guardian:</span> {form.guardian_name}</div>}
            </div>
          </div>

          {/* Entries summary */}
          <div className="mb-6 p-5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827" }}>
                Exhibit Entries ({form.entries.length})
              </p>
              <button
                type="button"
                onClick={() => { setStep(2); window.scrollTo({ top: 0 }); }}
                className="text-xs font-semibold underline"
                style={{ color: "#2C4A2E" }}
              >
                Edit
              </button>
            </div>
            <div className="space-y-3">
              {form.entries.map((e, i) => (
                <div
                  key={e.id}
                  className="flex items-start gap-3 p-3"
                  style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
                  >
                    {i + 1}
                  </div>
                  <div className="text-sm" style={{ color: "#3D3026" }}>
                    <span className="font-semibold">{e.department}</span>
                    {" · "}{e.division}
                    {" · "}{e.class_name}
                    {" · "}{e.lot}
                    {e.entry_title && <span style={{ color: "#5C4A32" }}> — {e.entry_title}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in reminder */}
          {checkinInfo && (
            <div className="mb-6 p-4" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#D4A827" }}>Check-In Information</p>
              <p className="text-sm" style={{ color: "#3D3026" }}>{checkinInfo}</p>
            </div>
          )}

          {/* Rules agreement */}
          <div className="mb-6 p-5" style={{ border: fieldErrors.rules_agreed ? "2px solid #ef4444" : "2px solid #E8DFC8", backgroundColor: "#FDFAF3" }}>
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={form.rules_agreed}
                onChange={(ev) => {
                  set("rules_agreed", ev.target.checked);
                  setFieldErrors((p) => ({ ...p, rules_agreed: "" }));
                }}
                className="mt-0.5 w-5 h-5 flex-shrink-0 accent-[#2C4A2E]"
                aria-describedby={`${formId}-rules-desc`}
              />
              <div id={`${formId}-rules-desc`}>
                <p className="text-sm font-bold mb-1" style={{ color: "#2C4A2E" }}>
                  I agree to the West Tennessee State Fair exhibit rules.
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#5C4A32" }}>
                  I certify that all entries are my own original work (or my child&apos;s, for youth registrations), that the information I have provided is accurate, and that I have read and agree to the{" "}
                  <a href="/files/adult-rules.pdf" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2C4A2E" }}>
                    exhibit rules and regulations
                  </a>
                  .
                </p>
              </div>
            </label>
            <FieldError msg={fieldErrors.rules_agreed} />
          </div>

          {/* Reference notice */}
          <div
            className="mb-6 p-4 text-xs leading-relaxed"
            style={{ backgroundColor: "#fff8e1", border: "1px solid #f0d060", color: "#5C4A32" }}
          >
            <strong>About your submission reference:</strong> After submitting, you will receive a website submission reference (e.g., WTSF-ONLINE-2026-0042). This reference confirms your <em>online submission only</em> — it is <strong>not</strong> your official fair exhibitor ID. Your official exhibitor ID will be assigned separately after your registration is processed.
          </div>

          {serverError && (
            <div
              className="mb-6 p-4 text-sm font-medium"
              role="alert"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}
            >
              {serverError}
            </div>
          )}
        </div>
      )}

      {/* ── Navigation buttons ────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mt-6 pt-6" style={{ borderTop: "1px solid #E8DFC8" }}>
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="px-6 py-3 text-sm font-bold tracking-wider uppercase border-2 transition-colors hover:bg-[#F5EDD4] disabled:opacity-50"
            style={{ borderColor: "#D4C9A8", color: "#5C4A32" }}
          >
            ← Back
          </button>
        ) : <div />}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2C4A2E", color: "#D4A827", letterSpacing: "0.08em" }}
          >
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center gap-3"
            style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
          >
            {submitting && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {submitting ? "Submitting…" : "Submit Registration"}
          </button>
        )}
      </div>
    </form>
  );
}
