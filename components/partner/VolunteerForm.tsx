"use client";

import { useState, useId } from "react";

type Step = "form" | "review" | "success" | "error";

// ── Constants ─────────────────────────────────────────────────────────────
const DAY_OPTIONS = [
  { value: "sunday",    label: "Sunday" },
  { value: "monday",    label: "Monday" },
  { value: "tuesday",   label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday",  label: "Thursday" },
  { value: "friday",    label: "Friday" },
  { value: "saturday",  label: "Saturday" },
];

const AREA_OPTIONS = [
  { value: "gate-tickets", label: "Gate and ticket operations" },
  { value: "exhibit-hall", label: "Exhibit hall setup and management" },
  { value: "livestock",    label: "Livestock or show-day support" },
  { value: "pageant",      label: "Pageant-day coordination" },
  { value: "grounds",      label: "Grounds and cleanup" },
  { value: "general",      label: "General help wherever needed" },
  { value: "other",        label: "Other (please explain below)" },
];

interface FormState {
  // Personal
  fullName: string;
  ageGroup: string;
  email: string;
  confirmEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  // Interest
  preferredArea: string;
  otherExplanation: string;
  // Availability
  availableDays: string[];
  preferredStartTime: string;
  preferredEndTime: string;
  multipleShifts: string;
  unavailableTimes: string;
  // Experience
  volunteeredBefore: string;
  priorRoleYear: string;
  relevantExperience: string;
  physicalConsiderations: string;
  notes: string;
  // Agreement
  applicantName: string;
  agreed: boolean;
  // Honeypot
  website_confirm: string;
}

const INITIAL: FormState = {
  fullName: "", ageGroup: "",
  email: "", confirmEmail: "", phone: "",
  address: "", city: "", state: "", zip: "",
  preferredArea: "", otherExplanation: "",
  availableDays: [],
  preferredStartTime: "", preferredEndTime: "",
  multipleShifts: "", unavailableTimes: "",
  volunteeredBefore: "", priorRoleYear: "",
  relevantExperience: "", physicalConsiderations: "", notes: "",
  applicantName: "", agreed: false,
  website_confirm: "",
};

// ── Shared UI helpers ─────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs" style={{ color: "#8B2E2E" }} role="alert">{msg}</p>;
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-bold tracking-wide uppercase mb-1" style={{ color: "#5C4A32", letterSpacing: "0.08em" }}>
      {children}{required && <span className="ml-1" style={{ color: "#8B2E2E" }} aria-label="required">*</span>}
    </label>
  );
}

function Input({ id, type = "text", value, onChange, error, placeholder, required, autoComplete }: {
  id: string; type?: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required} autoComplete={autoComplete}
        aria-invalid={!!error}
        className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
        style={{ backgroundColor: "#FDFAF3", border: `1px solid ${error ? "#8B2E2E" : "#E8DFC8"}`, color: "#2C4A2E" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#D4A827"; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = error ? "#8B2E2E" : "#E8DFC8"; }}
      />
      <FieldError msg={error} />
    </>
  );
}

function Textarea({ id, value, onChange, error, placeholder, rows = 3 }: {
  id: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; rows?: number;
}) {
  return (
    <>
      <textarea
        id={id} value={value} rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} aria-invalid={!!error}
        className="w-full px-3 py-2.5 text-sm outline-none resize-y transition-colors"
        style={{ backgroundColor: "#FDFAF3", border: `1px solid ${error ? "#8B2E2E" : "#E8DFC8"}`, color: "#2C4A2E", minHeight: "80px" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#D4A827"; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = error ? "#8B2E2E" : "#E8DFC8"; }}
      />
      <FieldError msg={error} />
    </>
  );
}

function RadioGroup({ name, options, value, onChange, error }: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio" name={name} value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="flex-shrink-0"
              style={{ accentColor: "#2C4A2E" }}
            />
            <span className="text-sm" style={{ color: "#2C4A2E" }}>{opt.label}</span>
          </label>
        ))}
      </div>
      <FieldError msg={error} />
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function VolunteerForm() {
  const uid = useId();
  const fid = (n: string) => `${uid}-vol-${n}`;

  const [step, setStep]           = useState<Step>("form");
  const [form, setForm]           = useState<FormState>(INITIAL);
  const [errors, setErrors]       = useState<Partial<Record<keyof FormState | "availableDays", string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormState) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleDay = (day: string) =>
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));

  const selectedAreaLabel = AREA_OPTIONS.find((a) => a.value === form.preferredArea)?.label ?? "";

  // ── Validation ────────────────────────────────────────────────────
  function validate(): boolean {
    const e: Partial<Record<keyof FormState | "availableDays", string>> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = "Full name is required.";
    if (!form.ageGroup)
      e.ageGroup = "Please confirm your age eligibility.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required.";
    if (form.email.toLowerCase() !== form.confirmEmail.toLowerCase())
      e.confirmEmail = "Email addresses do not match.";
    if (!form.phone.trim() || !/^[\d\s\-\(\)\+\.]{7,20}$/.test(form.phone))
      e.phone = "Valid phone number is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.city.trim())    e.city    = "City is required.";
    if (!form.state.trim() || form.state.length !== 2)
      e.state = "2-letter state code required.";
    if (!form.zip.trim() || !/^\d{5}(-\d{4})?$/.test(form.zip))
      e.zip = "Valid ZIP required.";

    if (!form.preferredArea)
      e.preferredArea = "Please select a preferred volunteer area.";
    if (form.preferredArea === "other" && !form.otherExplanation.trim())
      e.otherExplanation = "Please describe your volunteer interest.";

    if (form.availableDays.length === 0)
      e.availableDays = "Please select at least one available day.";
    if (!form.multipleShifts)
      e.multipleShifts = "Please indicate shift availability.";

    if (!form.volunteeredBefore)
      e.volunteeredBefore = "Please indicate whether you have volunteered before.";

    if (!form.applicantName.trim() || form.applicantName.trim().length < 2)
      e.applicantName = "Please type your full name.";
    if (!form.agreed)
      e.agreed = "You must agree to the terms.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      setStep("review");
    } else {
      setTimeout(() => {
        const first = document.querySelector("[aria-invalid='true']") as HTMLElement | null;
        first?.focus();
      }, 50);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/partner/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          state: form.state.toUpperCase(),
          agreed: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStep("success");
      } else if (json.errors) {
        setErrors(json.errors);
        setStep("form");
      } else {
        setServerError(json.error ?? "An unexpected error occurred.");
        setStep("error");
      }
    } catch {
      setServerError("A network error occurred. Please check your connection and try again.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Success ────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="p-8 text-center" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#2C4A2E" }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>
          Form Received
        </p>
        <h3 className="text-2xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
          Thank You, {form.applicantName}
        </h3>
        <p className="text-sm leading-relaxed max-w-md mx-auto mb-3" style={{ color: "#5C4A32" }}>
          Your volunteer interest form has been received. A confirmation has been sent to <strong>{form.email}</strong>.
        </p>
        <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#8B7355" }}>
          Submission does not guarantee a volunteer assignment. The fair team will review your interest and may reach out with additional information.
        </p>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className="p-8 text-center" style={{ backgroundColor: "#FDFAF3", border: "1px solid #8B2E2E" }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B2E2E" }}>
          Submission Failed
        </p>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#5C4A32" }}>
          {serverError || "An error occurred. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => { setStep("review"); setServerError(""); }}
            className="px-6 py-3 text-xs font-bold tracking-widest uppercase"
            style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4", letterSpacing: "0.1em" }}
          >
            Try Again
          </button>
          <a
            href="mailto:wtsfair@gmail.com?subject=Volunteer%20Interest%20%E2%80%94%20WTSF"
            className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-center"
            style={{ backgroundColor: "#F5EDD4", color: "#2C4A2E", border: "1px solid #E8DFC8", letterSpacing: "0.1em" }}
          >
            Email Us Instead
          </a>
        </div>
      </div>
    );
  }

  // ─── Review ─────────────────────────────────────────────────────
  if (step === "review") {
    const ageLabel = form.ageGroup === "adult" ? "18 or older" : "Under 18 (parental authorization may be required)";
    return (
      <div>
        <div className="mb-6 p-5" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>
            Review Your Information
          </p>
          <p className="text-sm" style={{ color: "#5C4A32" }}>
            Please confirm your details before submitting.
          </p>
        </div>

        <div className="space-y-5 mb-8">
          {/* Personal */}
          <div style={{ border: "1px solid #E8DFC8" }}>
            <div className="px-4 py-2.5" style={{ backgroundColor: "#2C4A2E" }}>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>
                Personal Information
              </p>
            </div>
            <dl className="divide-y" style={{ borderColor: "#E8DFC8" }}>
              {[
                ["Full Name",     form.fullName],
                ["Age",          ageLabel],
                ["Email",        form.email],
                ["Phone",        form.phone],
                ["Address",      `${form.address}, ${form.city}, ${form.state.toUpperCase()} ${form.zip}`],
              ].map(([label, value], i) => (
                <div key={label} className="flex gap-4 px-4 py-3" style={{ backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff" }}>
                  <dt className="text-xs font-bold w-32 flex-shrink-0" style={{ color: "#8B7355" }}>{label}</dt>
                  <dd className="text-sm" style={{ color: "#2C4A2E" }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Interest + Availability */}
          <div style={{ border: "1px solid #E8DFC8" }}>
            <div className="px-4 py-2.5" style={{ backgroundColor: "#2C4A2E" }}>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>
                Volunteer Details
              </p>
            </div>
            <dl className="divide-y" style={{ borderColor: "#E8DFC8" }}>
              {[
                ["Preferred Area",   selectedAreaLabel + (form.otherExplanation ? ` — ${form.otherExplanation}` : "")],
                ["Available Days",   form.availableDays.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")],
                ["Preferred Hours",  [form.preferredStartTime, form.preferredEndTime].filter(Boolean).join(" – ") || "Not specified"],
                ["Multiple Shifts",  form.multipleShifts === "yes" ? "Yes" : "No"],
                ...(form.unavailableTimes ? [["Cannot Work", form.unavailableTimes]] : []),
                ["Volunteered Before", form.volunteeredBefore === "yes" ? "Yes" : "No"],
                ...(form.priorRoleYear ? [["Prior Role / Year", form.priorRoleYear]] : []),
              ].map(([label, value], i) => (
                <div key={label} className="flex gap-4 px-4 py-3" style={{ backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff" }}>
                  <dt className="text-xs font-bold w-36 flex-shrink-0" style={{ color: "#8B7355" }}>{label}</dt>
                  <dd className="text-sm" style={{ color: "#2C4A2E" }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Agreement notice */}
        <div className="mb-6 p-4 text-sm leading-relaxed" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#5C4A32" }}>
          By submitting, <strong>{form.applicantName}</strong> confirms that the information above is accurate and
          acknowledges that submission does not guarantee a volunteer assignment. Roles and schedules depend on
          fair needs. The fair may request additional information. Applicants under 18 may require parental approval.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-6 py-4 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4", letterSpacing: "0.1em" }}
          >
            {submitting ? "Submitting…" : "Submit Volunteer Interest Form"}
          </button>
          <button
            onClick={() => setStep("form")}
            disabled={submitting}
            className="px-6 py-4 text-xs font-bold tracking-widest uppercase"
            style={{ backgroundColor: "#F5EDD4", color: "#5C4A32", border: "1px solid #E8DFC8", letterSpacing: "0.1em" }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  // ─── Form ───────────────────────────────────────────────────────
  return (
    <form onSubmit={handleReview} noValidate>
      {/* Honeypot — hidden from users, must stay empty */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor={fid("website_confirm")}>Leave this blank</label>
        <input
          id={fid("website_confirm")}
          type="text"
          value={form.website_confirm}
          onChange={(e) => set("website_confirm")(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-10">

        {/* ── Section: Personal Information ─────────────────── */}
        <fieldset>
          <legend className="w-full">
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid #E8DFC8" }}>
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2C4A2E" }}>
                <span className="text-xs font-bold" style={{ color: "#D4A827" }}>1</span>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase" style={{ color: "#2C4A2E", letterSpacing: "0.1em" }}>
                Personal Information
              </span>
            </div>
          </legend>

          <div className="space-y-4">
            <div>
              <Label htmlFor={fid("fullName")} required>Full Name</Label>
              <Input id={fid("fullName")} value={form.fullName} onChange={set("fullName")}
                error={errors.fullName} placeholder="First and last name" autoComplete="name" required />
            </div>

            {/* Age group */}
            <div>
              <Label htmlFor={fid("ageGroup")} required>Age Eligibility</Label>
              <RadioGroup
                name="ageGroup"
                options={[
                  { value: "adult", label: "I am 18 or older" },
                  { value: "minor", label: "I am under 18 — I understand that parent or guardian authorization may be required" },
                ]}
                value={form.ageGroup}
                onChange={set("ageGroup")}
                error={errors.ageGroup}
              />
              <p className="mt-1.5 text-xs" style={{ color: "#8B7355" }}>
                Minor volunteer authorization policy is subject to confirmation by the fair board.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={fid("email")} required>Email Address</Label>
                <Input id={fid("email")} type="email" value={form.email} onChange={set("email")}
                  error={errors.email} placeholder="you@example.com" autoComplete="email" required />
              </div>
              <div>
                <Label htmlFor={fid("confirmEmail")} required>Confirm Email</Label>
                <Input id={fid("confirmEmail")} type="email" value={form.confirmEmail} onChange={set("confirmEmail")}
                  error={errors.confirmEmail} placeholder="Re-enter email" required />
              </div>
            </div>

            <div>
              <Label htmlFor={fid("phone")} required>Phone Number</Label>
              <Input id={fid("phone")} type="tel" value={form.phone} onChange={set("phone")}
                error={errors.phone} placeholder="(731) 555-0100" autoComplete="tel" required />
            </div>

            <div>
              <Label htmlFor={fid("address")} required>Mailing Address</Label>
              <Input id={fid("address")} value={form.address} onChange={set("address")}
                error={errors.address} placeholder="Street address" autoComplete="street-address" required />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2">
                <Label htmlFor={fid("city")} required>City</Label>
                <Input id={fid("city")} value={form.city} onChange={set("city")}
                  error={errors.city} placeholder="Henderson" autoComplete="address-level2" required />
              </div>
              <div>
                <Label htmlFor={fid("state")} required>State</Label>
                <Input id={fid("state")} value={form.state} onChange={(v) => set("state")(v.toUpperCase())}
                  error={errors.state} placeholder="TN" autoComplete="address-level1" required />
              </div>
              <div>
                <Label htmlFor={fid("zip")} required>ZIP</Label>
                <Input id={fid("zip")} value={form.zip} onChange={set("zip")}
                  error={errors.zip} placeholder="38340" autoComplete="postal-code" required />
              </div>
            </div>
          </div>
        </fieldset>

        {/* ── Section: Volunteer Interest ───────────────────── */}
        <fieldset>
          <legend className="w-full">
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid #E8DFC8" }}>
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2C4A2E" }}>
                <span className="text-xs font-bold" style={{ color: "#D4A827" }}>2</span>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase" style={{ color: "#2C4A2E", letterSpacing: "0.1em" }}>
                Volunteer Interest
              </span>
            </div>
          </legend>

          <div className="space-y-4">
            <div>
              <Label htmlFor={fid("preferredArea")} required>Preferred Volunteer Area</Label>
              <p className="text-xs mb-3" style={{ color: "#8B7355" }}>
                Select the area where you&apos;d most like to help. Assignments are based on fair needs and availability.
              </p>
              <RadioGroup
                name="preferredArea"
                options={AREA_OPTIONS}
                value={form.preferredArea}
                onChange={set("preferredArea")}
                error={errors.preferredArea}
              />
            </div>

            {form.preferredArea === "other" && (
              <div>
                <Label htmlFor={fid("otherExplanation")} required>Please Describe</Label>
                <Textarea
                  id={fid("otherExplanation")}
                  value={form.otherExplanation}
                  onChange={set("otherExplanation")}
                  error={errors.otherExplanation}
                  placeholder="Describe how you'd like to help…"
                  rows={3}
                />
              </div>
            )}
          </div>
        </fieldset>

        {/* ── Section: Availability ─────────────────────────── */}
        <fieldset>
          <legend className="w-full">
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid #E8DFC8" }}>
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2C4A2E" }}>
                <span className="text-xs font-bold" style={{ color: "#D4A827" }}>3</span>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase" style={{ color: "#2C4A2E", letterSpacing: "0.1em" }}>
                Availability
              </span>
            </div>
          </legend>

          <div className="space-y-5">
            {/* Available days */}
            <div>
              <p className="text-xs font-bold tracking-wide uppercase mb-3" style={{ color: "#5C4A32", letterSpacing: "0.08em" }}>
                Available Days <span className="ml-1" style={{ color: "#8B2E2E" }} aria-label="required">*</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DAY_OPTIONS.map((day) => (
                  <label
                    key={day.value}
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
                    style={{
                      border: `1px solid ${form.availableDays.includes(day.value) ? "#2C4A2E" : "#E8DFC8"}`,
                      backgroundColor: form.availableDays.includes(day.value) ? "#F5EDD4" : "#FDFAF3",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.availableDays.includes(day.value)}
                      onChange={() => toggleDay(day.value)}
                      style={{ accentColor: "#2C4A2E" }}
                    />
                    <span className="text-sm" style={{ color: "#2C4A2E" }}>{day.label}</span>
                  </label>
                ))}
              </div>
              <FieldError msg={errors.availableDays} />
            </div>

            {/* Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={fid("preferredStartTime")}>Preferred Start Time</Label>
                <Input id={fid("preferredStartTime")} value={form.preferredStartTime}
                  onChange={set("preferredStartTime")} placeholder="e.g. 8:00 AM" />
              </div>
              <div>
                <Label htmlFor={fid("preferredEndTime")}>Preferred End Time</Label>
                <Input id={fid("preferredEndTime")} value={form.preferredEndTime}
                  onChange={set("preferredEndTime")} placeholder="e.g. 4:00 PM" />
              </div>
            </div>

            {/* Multiple shifts */}
            <div>
              <Label htmlFor={fid("multipleShifts")} required>Available for More Than One Shift?</Label>
              <RadioGroup
                name="multipleShifts"
                options={[
                  { value: "yes", label: "Yes, I can work multiple shifts or days" },
                  { value: "no",  label: "No, I am only available for a single shift" },
                ]}
                value={form.multipleShifts}
                onChange={set("multipleShifts")}
                error={errors.multipleShifts}
              />
            </div>

            {/* Times they cannot work */}
            <div>
              <Label htmlFor={fid("unavailableTimes")}>Days or Times You Cannot Work (optional)</Label>
              <Input id={fid("unavailableTimes")} value={form.unavailableTimes}
                onChange={set("unavailableTimes")} placeholder="e.g. Monday evenings, Friday all day" />
            </div>
          </div>
        </fieldset>

        {/* ── Section: Experience ───────────────────────────── */}
        <fieldset>
          <legend className="w-full">
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid #E8DFC8" }}>
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2C4A2E" }}>
                <span className="text-xs font-bold" style={{ color: "#D4A827" }}>4</span>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase" style={{ color: "#2C4A2E", letterSpacing: "0.1em" }}>
                Experience
              </span>
            </div>
          </legend>

          <div className="space-y-4">
            <div>
              <Label htmlFor={fid("volunteeredBefore")} required>Have You Volunteered With the Fair Before?</Label>
              <RadioGroup
                name="volunteeredBefore"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no",  label: "No" },
                ]}
                value={form.volunteeredBefore}
                onChange={set("volunteeredBefore")}
                error={errors.volunteeredBefore}
              />
            </div>

            {form.volunteeredBefore === "yes" && (
              <div>
                <Label htmlFor={fid("priorRoleYear")}>Role or Year (if you remember)</Label>
                <Input id={fid("priorRoleYear")} value={form.priorRoleYear}
                  onChange={set("priorRoleYear")} placeholder="e.g. Gate crew, 2023" />
              </div>
            )}

            <div>
              <Label htmlFor={fid("relevantExperience")}>Relevant Experience (optional)</Label>
              <Textarea id={fid("relevantExperience")} value={form.relevantExperience}
                onChange={set("relevantExperience")} rows={3}
                placeholder="Any skills, certifications, or experience relevant to your preferred volunteer area…" />
            </div>

            <div>
              <Label htmlFor={fid("physicalConsiderations")}>Physical or Accessibility Considerations (optional)</Label>
              <Textarea id={fid("physicalConsiderations")} value={form.physicalConsiderations}
                onChange={set("physicalConsiderations")} rows={2}
                placeholder="Anything the fair should be aware of when considering your assignment…" />
            </div>

            <div>
              <Label htmlFor={fid("notes")}>Additional Notes (optional)</Label>
              <Textarea id={fid("notes")} value={form.notes}
                onChange={set("notes")} rows={3}
                placeholder="Questions, comments, or anything else you&apos;d like the fair team to know…" />
            </div>
          </div>
        </fieldset>

        {/* ── Section: Agreement ────────────────────────────── */}
        <fieldset>
          <legend className="w-full">
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid #E8DFC8" }}>
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2C4A2E" }}>
                <span className="text-xs font-bold" style={{ color: "#D4A827" }}>5</span>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase" style={{ color: "#2C4A2E", letterSpacing: "0.1em" }}>
                Acknowledgment
              </span>
            </div>
          </legend>

          <div className="space-y-5">
            {/* Privacy notice */}
            <div className="p-4 text-xs leading-relaxed" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#5C4A32" }}>
              Your information is used solely to process your volunteer interest and contact you regarding fair volunteering.
              It is not shared with third parties or used for commercial purposes.
            </div>

            {/* Agreement terms */}
            <div className="p-5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B7355", letterSpacing: "0.12em" }}>
                By submitting this form, you acknowledge that:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "This form is an expression of interest and does not guarantee a volunteer assignment.",
                  "Volunteer roles and schedules depend on fair needs and availability.",
                  "The West Tennessee State Fair may contact you for additional information.",
                  "The information you have provided is accurate to the best of your knowledge.",
                  "Additional requirements may apply depending on the volunteer assignment.",
                  "Applicants under 18 may require parent or guardian approval, subject to fair policy.",
                ].map((term, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: "#D4A827" }} aria-hidden="true" />
                    <span className="text-xs leading-relaxed" style={{ color: "#5C4A32" }}>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Typed name */}
            <div>
              <Label htmlFor={fid("applicantName")} required>Type Your Full Name to Sign</Label>
              <Input id={fid("applicantName")} value={form.applicantName} onChange={set("applicantName")}
                error={errors.applicantName} placeholder="Type your full name"
                autoComplete="name" required />
            </div>

            {/* Agree checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => set("agreed")(e.target.checked)}
                  className="flex-shrink-0 mt-0.5"
                  style={{ accentColor: "#2C4A2E" }}
                  aria-invalid={!!errors.agreed}
                />
                <span className="text-sm leading-relaxed" style={{ color: "#2C4A2E" }}>
                  I have read and agree to the acknowledgments above, and I understand that submission does not
                  guarantee a volunteer placement.
                  <span className="ml-1" style={{ color: "#8B2E2E" }} aria-label="required">*</span>
                </span>
              </label>
              <FieldError msg={errors.agreed} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full px-6 py-4 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4", letterSpacing: "0.1em" }}
            >
              Review My Submission
              <svg className="inline-block ml-2 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            {/* Required fields note */}
            <p className="text-xs text-center" style={{ color: "#8B7355" }}>
              Fields marked <span style={{ color: "#8B2E2E" }}>*</span> are required.
            </p>
          </div>
        </fieldset>
      </div>
    </form>
  );
}
