"use client";

import { useState, useId } from "react";
import { SPONSOR_PACKAGES, CUSTOM_SPONSORSHIP_OPTION } from "@/lib/sponsor-config";

type Step = "form" | "review" | "success" | "error";

interface FormState {
  businessName: string;
  contactPerson: string;
  email: string;
  confirmEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  socialMedia: string;
  packageId: string;
  businessDescription: string;
  logoAvailable: string;
  additionalInterests: string;
  preferredContact: string;
  notes: string;
  applicantName: string;
  agreed: boolean;
  website_confirm: string; // honeypot
}

const INITIAL: FormState = {
  businessName: "", contactPerson: "", email: "", confirmEmail: "",
  phone: "", address: "", city: "", state: "", zip: "",
  website: "", socialMedia: "", packageId: "",
  businessDescription: "", logoAvailable: "", additionalInterests: "",
  preferredContact: "", notes: "", applicantName: "", agreed: false,
  website_confirm: "",
};

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
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
        style={{
          backgroundColor: "#FDFAF3",
          border: `1px solid ${error ? "#8B2E2E" : "#E8DFC8"}`,
          color: "#2C4A2E",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#D4A827"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#8B2E2E" : "#E8DFC8"; }}
      />
      <FieldError msg={error} />
    </>
  );
}

function Textarea({ id, value, onChange, error, placeholder, rows = 4, required }: {
  id: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; rows?: number; required?: boolean;
}) {
  return (
    <>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        className="w-full px-3 py-2.5 text-sm outline-none transition-colors resize-none"
        style={{
          backgroundColor: "#FDFAF3",
          border: `1px solid ${error ? "#8B2E2E" : "#E8DFC8"}`,
          color: "#2C4A2E",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#D4A827"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#8B2E2E" : "#E8DFC8"; }}
      />
      <FieldError msg={error} />
    </>
  );
}

const allPackages = [
  ...SPONSOR_PACKAGES,
  { ...CUSTOM_SPONSORSHIP_OPTION, priceMin: 0, ribbonColor: "#8B7355", benefits: [] },
];

export default function SponsorForm() {
  const uid = useId();
  const fid = (name: string) => `${uid}-sponsor-${name}`;

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormState) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const selectedPkg = allPackages.find((p) => p.id === form.packageId);

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.businessName.trim()) e.businessName = "Organization / Business name is required.";
    if (!form.contactPerson.trim()) e.contactPerson = "Contact person is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required.";
    if (form.email.toLowerCase() !== form.confirmEmail.toLowerCase()) e.confirmEmail = "Email addresses do not match.";
    if (!form.phone.trim() || !/^[\d\s\-\(\)\+\.]{7,20}$/.test(form.phone)) e.phone = "Valid phone number is required.";
    if (!form.address.trim()) e.address = "Mailing address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim() || form.state.length !== 2) e.state = "2-letter state code required.";
    if (!form.zip.trim() || !/^\d{5}(-\d{4})?$/.test(form.zip)) e.zip = "Valid ZIP code required.";
    if (!form.packageId) e.packageId = "Please select a sponsorship package.";
    if (!form.applicantName.trim() || form.applicantName.trim().length < 2) e.applicantName = "Please type your full name.";
    if (!form.agreed) e.agreed = "You must agree to the terms before submitting.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setStep("review");
    else {
      // Scroll to first error
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
      const res = await fetch("/api/partner/sponsor", {
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
        setServerError(json.error ?? "An unexpected error occurred. Please try again.");
        setStep("error");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success ──────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="p-8 text-center" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#2C4A2E" }} aria-hidden="true">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
          Application Received
        </h3>
        <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#5C4A32" }}>
          Thank you, <strong>{form.applicantName}</strong>. Your sponsorship application for <strong>{selectedPkg?.name}</strong> has been submitted. A confirmation has been sent to <strong>{form.email}</strong>.
        </p>
        <p className="mt-3 text-xs leading-relaxed max-w-md mx-auto" style={{ color: "#8B7355" }}>
          Submission does not guarantee acceptance. The West Tennessee State Fair will review your application and be in touch with next steps.
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className="p-8" style={{ backgroundColor: "#FDFAF3", border: "1px solid #8B2E2E" }}>
        <p className="text-sm font-bold mb-2" style={{ color: "#8B2E2E" }}>Submission Failed</p>
        <p className="text-sm mb-4" style={{ color: "#5C4A32" }}>{serverError}</p>
        <p className="text-sm mb-4" style={{ color: "#5C4A32" }}>You can also reach us directly at <a href="mailto:wtsfair@gmail.com" style={{ color: "#2C4A2E", fontWeight: "bold" }}>wtsfair@gmail.com</a>.</p>
        <button onClick={() => setStep("form")} className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase" style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4" }}>
          Try Again
        </button>
      </div>
    );
  }

  // ── Review step ──────────────────────────────────────────────────
  if (step === "review") {
    return (
      <div style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#2C4A2E" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>Review Your Application</p>
          <p className="text-sm" style={{ color: "#C5D9C6" }}>Confirm your information before submitting.</p>
        </div>

        {/* Package */}
        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#8B7355" }}>Selected Package</p>
          <p className="text-lg font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>{selectedPkg?.name}</p>
          {"price" in (selectedPkg ?? {}) && <p className="text-base font-bold" style={{ color: "#8B2E2E" }}>{"price" in selectedPkg! ? (selectedPkg as typeof allPackages[0]).price : ""}</p>}
        </div>

        {/* Contact info */}
        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B7355" }}>Contact Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm" style={{ color: "#5C4A32" }}>
            <div><span className="font-bold">Organization / Business:</span> {form.businessName}</div>
            <div><span className="font-bold">Contact:</span> {form.contactPerson}</div>
            <div><span className="font-bold">Email:</span> {form.email}</div>
            <div><span className="font-bold">Phone:</span> {form.phone}</div>
            <div className="sm:col-span-2"><span className="font-bold">Address:</span> {form.address}, {form.city}, {form.state.toUpperCase()} {form.zip}</div>
            {form.website && <div><span className="font-bold">Website:</span> {form.website}</div>}
          </div>
        </div>

        {/* Notes */}
        {(form.businessDescription || form.notes) && (
          <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B7355" }}>Notes</p>
            {form.businessDescription && <p className="text-sm mb-2" style={{ color: "#5C4A32" }}><span className="font-bold">Description: </span>{form.businessDescription}</p>}
            {form.notes && <p className="text-sm" style={{ color: "#5C4A32" }}><span className="font-bold">Special Notes: </span>{form.notes}</p>}
          </div>
        )}

        {/* Signed by */}
        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#8B7355" }}>Signed By</p>
          <p className="text-sm italic" style={{ color: "#2C4A2E" }}>{form.applicantName}</p>
          <p className="text-xs mt-2" style={{ color: "#8B7355" }}>
            Submission of this form does not guarantee acceptance or approval.
          </p>
        </div>

        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setStep("form")}
            className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{ border: "1px solid #E8DFC8", color: "#5C4A32" }}
          >
            ← Edit
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────────
  return (
    <form onSubmit={handleReview} noValidate>
      {/* Honeypot (hidden from real users) */}
      <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <label htmlFor={fid("website_confirm")}>Leave blank</label>
        <input id={fid("website_confirm")} name="website_confirm" type="text" tabIndex={-1} autoComplete="off"
          value={form.website_confirm} onChange={(e) => set("website_confirm")(e.target.value)} />
      </div>

      <div className="space-y-8">
        {/* ── Business Information ──────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Business Information</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label htmlFor={fid("businessName")} required>Organization / Business Name</Label>
              <Input id={fid("businessName")} value={form.businessName} onChange={set("businessName")} error={errors.businessName} required autoComplete="organization" />
            </div>
            <div>
              <Label htmlFor={fid("contactPerson")} required>Contact Person</Label>
              <Input id={fid("contactPerson")} value={form.contactPerson} onChange={set("contactPerson")} error={errors.contactPerson} required autoComplete="name" />
            </div>
            <div>
              <Label htmlFor={fid("phone")} required>Phone Number</Label>
              <Input id={fid("phone")} type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} required autoComplete="tel" />
            </div>
            <div>
              <Label htmlFor={fid("email")} required>Email Address</Label>
              <Input id={fid("email")} type="email" value={form.email} onChange={set("email")} error={errors.email} required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor={fid("confirmEmail")} required>Confirm Email</Label>
              <Input id={fid("confirmEmail")} type="email" value={form.confirmEmail} onChange={set("confirmEmail")} error={errors.confirmEmail} required autoComplete="email" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={fid("address")} required>Mailing Address</Label>
              <Input id={fid("address")} value={form.address} onChange={set("address")} error={errors.address} required autoComplete="street-address" />
            </div>
            <div>
              <Label htmlFor={fid("city")} required>City</Label>
              <Input id={fid("city")} value={form.city} onChange={set("city")} error={errors.city} required autoComplete="address-level2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={fid("state")} required>State</Label>
                <Input id={fid("state")} value={form.state} onChange={(v) => set("state")(v.toUpperCase().slice(0, 2))} error={errors.state} placeholder="TN" required autoComplete="address-level1" />
              </div>
              <div>
                <Label htmlFor={fid("zip")} required>ZIP</Label>
                <Input id={fid("zip")} value={form.zip} onChange={set("zip")} error={errors.zip} required autoComplete="postal-code" />
              </div>
            </div>
            <div>
              <Label htmlFor={fid("website")}>Website</Label>
              <Input id={fid("website")} type="url" value={form.website} onChange={set("website")} placeholder="https://" autoComplete="url" />
            </div>
            <div>
              <Label htmlFor={fid("socialMedia")}>Social Media Links</Label>
              <Input id={fid("socialMedia")} value={form.socialMedia} onChange={set("socialMedia")} placeholder="Facebook, Instagram, etc." />
            </div>
          </div>
        </section>

        {/* ── Package Selection ─────────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Sponsorship Package</p>
          </div>
          <div className="p-6">
            <Label htmlFor={fid("packageId")} required>Select Your Sponsorship Package</Label>
            {errors.packageId && <FieldError msg={errors.packageId} />}
            <div className="mt-2 space-y-2">
              {allPackages.map((pkg) => (
                <label
                  key={pkg.id}
                  className="flex items-start gap-3 p-4 cursor-pointer transition-colors"
                  style={{
                    border: `1px solid ${form.packageId === pkg.id ? pkg.ribbonColor : "#E8DFC8"}`,
                    backgroundColor: form.packageId === pkg.id ? "#F5EDD4" : "#FDFAF3",
                  }}
                >
                  <input
                    type="radio"
                    name={fid("packageId")}
                    value={pkg.id}
                    checked={form.packageId === pkg.id}
                    onChange={() => set("packageId")(pkg.id)}
                    className="mt-0.5 flex-shrink-0"
                    style={{ accentColor: pkg.ribbonColor }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold" style={{ color: "#2C4A2E" }}>{pkg.name}</span>
                    <span className="block text-sm font-bold mt-0.5" style={{ color: "priceMin" in pkg && pkg.priceMin > 0 ? "#8B2E2E" : "#8B7355" }}>
                      {"price" in pkg ? pkg.price : "Contact us"}
                    </span>
                    {"benefits" in pkg && pkg.benefits.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {(pkg.benefits as string[]).map((b, i) => (
                          <li key={i} className="text-xs leading-relaxed flex items-start gap-1.5" style={{ color: "#5C4A32" }}>
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: pkg.ribbonColor }} aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* ── Additional Details ───────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Additional Details</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor={fid("businessDescription")}>Business Description</Label>
              <Textarea id={fid("businessDescription")} value={form.businessDescription} onChange={set("businessDescription")} placeholder="Brief description of your business or organization…" rows={3} />
            </div>
            <div>
              <Label htmlFor={fid("logoAvailable")}>Logo Availability</Label>
              <Input id={fid("logoAvailable")} value={form.logoAvailable} onChange={set("logoAvailable")} placeholder="e.g. Yes — high-res PNG available; No — will provide later" />
            </div>
            <div>
              <Label htmlFor={fid("additionalInterests")}>Additional Sponsorship Interests</Label>
              <Textarea id={fid("additionalInterests")} value={form.additionalInterests} onChange={set("additionalInterests")} placeholder="Any specific events, areas, or additional opportunities you're interested in…" rows={2} />
            </div>
            <div>
              <Label htmlFor={fid("preferredContact")}>Preferred Method of Contact</Label>
              <select
                id={fid("preferredContact")}
                value={form.preferredContact}
                onChange={(e) => set("preferredContact")(e.target.value)}
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8", color: "#2C4A2E" }}
              >
                <option value="">Select…</option>
                <option>Email</option>
                <option>Phone</option>
                <option>Either</option>
              </select>
            </div>
            <div>
              <Label htmlFor={fid("notes")}>Special Notes or Questions</Label>
              <Textarea id={fid("notes")} value={form.notes} onChange={set("notes")} placeholder="Anything else you'd like us to know…" rows={3} />
            </div>
          </div>
        </section>

        {/* ── Agreement ───────────────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Agreement & Submission</p>
          </div>
          <div className="p-6 space-y-5">
            {/* Privacy notice */}
            <p className="text-xs leading-relaxed p-3" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#5C4A32" }}>
              <strong>Privacy Notice:</strong> The information you provide will be used solely to review your sponsorship application and to contact you about participating in the West Tennessee State Fair. It will not be shared with third parties or used for other purposes.
            </p>

            <div>
              <Label htmlFor={fid("applicantName")} required>Typed Full Name (Electronic Acknowledgment)</Label>
              <Input id={fid("applicantName")} value={form.applicantName} onChange={set("applicantName")} error={errors.applicantName}
                placeholder="Type your full legal name" required autoComplete="name" />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => set("agreed")(e.target.checked)}
                  className="mt-0.5 flex-shrink-0"
                  aria-invalid={!!errors.agreed}
                  style={{ accentColor: "#2C4A2E" }}
                />
                <span className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  I confirm that the information provided is accurate. I understand that submitting this form is an application — it does not guarantee acceptance. I understand that the West Tennessee State Fair will contact me to discuss next steps and that final approval and terms are subject to confirmation by the fair.
                </span>
              </label>
              <FieldError msg={errors.agreed} />
            </div>

            <div className="flex items-center gap-1 text-xs" style={{ color: "#8B7355" }}>
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Your information is transmitted securely and is only used to process your application.
            </div>

            {serverError && (
              <div className="p-3 text-sm" style={{ backgroundColor: "#FFF0F0", border: "1px solid #8B2E2E", color: "#8B2E2E" }} role="alert">
                {serverError}
              </div>
            )}

            <div className="pt-2">
              <p className="text-xs mb-3" style={{ color: "#8B7355" }}>
                Submission date will be recorded automatically.
              </p>
              <button
                type="submit"
                className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
              >
                Review Application →
              </button>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
