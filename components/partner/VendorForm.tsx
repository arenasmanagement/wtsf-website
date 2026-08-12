"use client";

import { useState, useId } from "react";
import {
  COMMERCIAL_VENDOR_CATEGORIES,
  VENDOR_FEES,
  VENDOR_PAYMENT_DEADLINE,
  calculateVendorCost,
  type VendorCostBreakdown,
} from "@/lib/vendor-config";

type Step = "form" | "review" | "success" | "error";

interface FormState {
  // Business
  businessName: string;
  ownerOrAgent: string;
  email: string;
  confirmEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  socialMedia: string;
  // Vendor info
  businessType: string;
  productDescription: string;
  itemsSold: string;
  isFood: string;
  cookingOnSite: string;
  insideOrOutside: string;
  categoryId: string;
  sizeId: string;
  numberOfSpaces: string;
  placementRequest: string;
  // Fees
  hasInsuranceBinder: string; // "yes" | "no" | ""
  insuranceAckRequired: boolean;
  electricalService: string;
  hasCord: string; // "yes" | "no" | ""
  cordAckRequired: boolean;
  cleanupDepositAck: boolean;
  // Additional
  trailerDimensions: string;
  waterNeeded: string;
  vehicleInfo: string;
  specialAccommodations: string;
  notes: string;
  // Agreement
  applicantName: string;
  agreed: boolean;
  website_confirm: string; // honeypot
}

const INITIAL: FormState = {
  businessName: "", ownerOrAgent: "", email: "", confirmEmail: "",
  phone: "", address: "", city: "", state: "", zip: "",
  website: "", socialMedia: "",
  businessType: "", productDescription: "", itemsSold: "",
  isFood: "", cookingOnSite: "", insideOrOutside: "",
  categoryId: "", sizeId: "", numberOfSpaces: "", placementRequest: "",
  hasInsuranceBinder: "", insuranceAckRequired: false,
  electricalService: "",
  hasCord: "", cordAckRequired: false, cleanupDepositAck: false,
  trailerDimensions: "", waterNeeded: "", vehicleInfo: "",
  specialAccommodations: "", notes: "",
  applicantName: "", agreed: false, website_confirm: "",
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
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required} autoComplete={autoComplete}
        aria-invalid={!!error}
        className="w-full px-3 py-2.5 text-sm outline-none"
        style={{ backgroundColor: "#FDFAF3", border: `1px solid ${error ? "#8B2E2E" : "#E8DFC8"}`, color: "#2C4A2E" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#D4A827"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#8B2E2E" : "#E8DFC8"; }}
      />
      <FieldError msg={error} />
    </>
  );
}

function Textarea({ id, value, onChange, error, placeholder, rows = 3, required }: {
  id: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; rows?: number; required?: boolean;
}) {
  return (
    <>
      <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} rows={rows} required={required} aria-invalid={!!error}
        className="w-full px-3 py-2.5 text-sm outline-none resize-none"
        style={{ backgroundColor: "#FDFAF3", border: `1px solid ${error ? "#8B2E2E" : "#E8DFC8"}`, color: "#2C4A2E" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#D4A827"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#8B2E2E" : "#E8DFC8"; }}
      />
      <FieldError msg={error} />
    </>
  );
}

function SelectNative({ id, value, onChange, error, children, required }: {
  id: string; value: string; onChange: (v: string) => void;
  error?: string; children: React.ReactNode; required?: boolean;
}) {
  return (
    <>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        aria-invalid={!!error}
        className="w-full px-3 py-2.5 text-sm outline-none"
        style={{ backgroundColor: "#FDFAF3", border: `1px solid ${error ? "#8B2E2E" : "#E8DFC8"}`, color: value ? "#2C4A2E" : "#8B7355" }}
      >
        {children}
      </select>
      <FieldError msg={error} />
    </>
  );
}

function fmt(n: number) { return n === 0 ? "$0" : `$${n.toLocaleString()}`; }

function CostBreakdown({ cost }: { cost: VendorCostBreakdown }) {
  const rows = [
    { label: "Booth Fee", value: cost.boothFee, always: true },
    { label: "Insurance Coverage", value: cost.insuranceFee, note: "No insurance binder provided" },
    { label: "Electrical Hookup", value: cost.electricalFee },
    { label: "Electrical Cord", value: cost.cordFee, note: "No 50-ft cord provided" },
    { label: "Refundable Cleanup Deposit", value: cost.cleanupDeposit, note: "Returned after fair cleanup" },
  ];
  return (
    <div style={{ border: "1px solid #E8DFC8" }}>
      <div className="px-4 py-3" style={{ backgroundColor: "#2C4A2E" }}>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>Estimated Cost</p>
      </div>
      <div>
        {rows.map((r, i) =>
          (r.always || r.value > 0) ? (
            <div key={i} className="flex items-start justify-between px-4 py-2.5 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff" }}>
              <span className="text-sm" style={{ color: "#5C4A32" }}>
                {r.label}
                {r.note && r.value > 0 && <span className="block text-xs" style={{ color: "#8B7355" }}>{r.note}</span>}
              </span>
              <span className="text-sm font-bold flex-shrink-0 ml-4" style={{ color: r.value === 0 ? "#8B7355" : "#2C4A2E" }}>{fmt(r.value)}</span>
            </div>
          ) : null
        )}
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: "#2C4A2E" }}>
          <span className="text-sm font-bold" style={{ color: "#D4A827" }}>Estimated Total</span>
          <span className="text-lg font-bold" style={{ color: "#D4A827" }}>{fmt(cost.estimatedTotal)}</span>
        </div>
        {cost.refundableAmount > 0 && (
          <div className="px-4 py-2.5" style={{ backgroundColor: "#F5EDD4" }}>
            <p className="text-xs" style={{ color: "#5C4A32" }}>
              Includes <strong>{fmt(cost.refundableAmount)} refundable</strong> cleanup deposit — returned when the assigned area is completely clean after the fair.
            </p>
          </div>
        )}
        <div className="px-4 py-3" style={{ backgroundColor: "#FDFAF3", borderTop: "1px solid #E8DFC8" }}>
          <p className="text-xs leading-relaxed" style={{ color: "#8B7355" }}>
            This is an estimate only. Final fees and placement are subject to confirmation by the West Tennessee State Fair.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VendorForm() {
  const uid = useId();
  const fid = (n: string) => `${uid}-vendor-${n}`;

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormState) => (value: string | boolean) =>
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Cascade resets — handled here to avoid useEffect setState loops
      if (field === "categoryId") next.sizeId = "";
      if (field === "hasCord" && value === "yes") next.cordAckRequired = false;
      if (field === "hasInsuranceBinder" && value === "yes") next.insuranceAckRequired = false;
      return next;
    });

  // Derived values
  const selectedCategory = COMMERCIAL_VENDOR_CATEGORIES.find((c) => c.id === form.categoryId);
  const selectedSize = selectedCategory?.boothSizes.find((s) => s.id === form.sizeId);

  const cost: VendorCostBreakdown =
    form.categoryId && form.sizeId && form.hasInsuranceBinder && form.electricalService && form.hasCord
      ? calculateVendorCost({
          categoryId:         form.categoryId,
          sizeId:             form.sizeId,
          hasInsuranceBinder: form.hasInsuranceBinder === "yes",
          electricalService:  form.electricalService,
          hasCord:            form.hasCord === "yes",
        })
      : { boothFee: selectedSize?.price ?? 0, insuranceFee: 0, electricalFee: 0, cordFee: 0, cleanupDeposit: 0, estimatedTotal: selectedSize?.price ?? 0, refundableAmount: 0 };

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.businessName.trim()) e.businessName = "Organization / Business name is required.";
    if (!form.ownerOrAgent.trim()) e.ownerOrAgent = "Owner or agent name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required.";
    if (form.email.toLowerCase() !== form.confirmEmail.toLowerCase()) e.confirmEmail = "Email addresses do not match.";
    if (!form.phone.trim() || !/^[\d\s\-\(\)\+\.]{7,20}$/.test(form.phone)) e.phone = "Valid phone number is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim() || form.state.length !== 2) e.state = "2-letter state code required.";
    if (!form.zip.trim() || !/^\d{5}(-\d{4})?$/.test(form.zip)) e.zip = "Valid ZIP required.";
    if (!form.businessType.trim()) e.businessType = "Business type is required.";
    if (!form.productDescription.trim() || form.productDescription.trim().length < 10) e.productDescription = "Please provide a description (min 10 characters).";
    if (!form.itemsSold.trim() || form.itemsSold.trim().length < 5) e.itemsSold = "Please list items to be sold.";
    if (!form.isFood) e.isFood = "Please indicate if you are a food vendor.";
    if (!form.cookingOnSite) e.cookingOnSite = "Please indicate if cooking occurs on site.";
    if (!form.insideOrOutside) e.insideOrOutside = "Please select a placement preference.";
    if (!form.categoryId) e.categoryId = "Please select a booth category.";
    if (!form.sizeId) e.sizeId = "Please select a booth size.";
    if (!form.hasInsuranceBinder) e.hasInsuranceBinder = "Please indicate insurance binder availability.";
    if (form.hasInsuranceBinder === "no" && !form.insuranceAckRequired) e.insuranceAckRequired = "Please acknowledge the $100 insurance coverage charge.";
    if (!form.electricalService) e.electricalService = "Please select an electrical option.";
    if (!form.hasCord) e.hasCord = "Please indicate if you are providing a 50-ft cord.";
    if (form.hasCord === "no" && form.electricalService !== "none" && !form.cordAckRequired) e.cordAckRequired = "Please acknowledge the $50 cord charge.";
    if (selectedCategory?.requiresCleanupDeposit && !form.cleanupDepositAck) e.cleanupDepositAck = "Please acknowledge the refundable cleanup deposit.";
    if (!form.applicantName.trim() || form.applicantName.trim().length < 2) e.applicantName = "Please type your full name.";
    if (!form.agreed) e.agreed = "You must agree to the terms.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setStep("review");
    else {
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
      const res = await fetch("/api/partner/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          state: form.state.toUpperCase(),
          hasInsuranceBinder: form.hasInsuranceBinder === "yes",
          hasCord: form.hasCord === "yes",
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
          Thank you, <strong>{form.applicantName}</strong>. Your vendor application for <strong>{selectedCategory?.name} — {selectedSize?.label}</strong> has been submitted. A confirmation has been sent to <strong>{form.email}</strong>.
        </p>
        <p className="mt-3 text-xs leading-relaxed max-w-md mx-auto" style={{ color: "#8B7355" }}>
          Submission does not guarantee acceptance or placement. The West Tennessee State Fair Advertising and Marketing Committee will review your application and be in touch.
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
        <p className="text-sm mb-4" style={{ color: "#5C4A32" }}>You can also contact us directly at <a href="mailto:wtsfair@gmail.com" style={{ color: "#2C4A2E", fontWeight: "bold" }}>wtsfair@gmail.com</a>.</p>
        <button onClick={() => setStep("form")} className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase" style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4" }}>
          Try Again
        </button>
      </div>
    );
  }

  // ── Review ───────────────────────────────────────────────────────
  if (step === "review") {
    const insideOutsideLabel: Record<string, string> = { inside: "Inside", outside: "Outside", no_preference: "No Preference" };
    const elecLabel: Record<string, string> = { none: "None", "20amp": "20 Amp ($25)", "30amp": "30 Amp ($50)", "50amp": "50 Amp ($75)" };
    return (
      <div style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#2C4A2E" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>Review Your Application</p>
          <p className="text-sm" style={{ color: "#C5D9C6" }}>Confirm your information before submitting.</p>
        </div>

        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#8B7355" }}>Booth Selection</p>
          <p className="text-lg font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>{selectedCategory?.name}</p>
          <p className="text-sm font-bold" style={{ color: "#8B2E2E" }}>Size: {selectedSize?.label} — {fmt(selectedSize?.price ?? 0)}</p>
        </div>

        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B7355" }}>Business</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm" style={{ color: "#5C4A32" }}>
            <div><span className="font-bold">Organization / Business:</span> {form.businessName}</div>
            <div><span className="font-bold">Owner:</span> {form.ownerOrAgent}</div>
            <div><span className="font-bold">Email:</span> {form.email}</div>
            <div><span className="font-bold">Phone:</span> {form.phone}</div>
            <div className="sm:col-span-2"><span className="font-bold">Address:</span> {form.address}, {form.city}, {form.state.toUpperCase()} {form.zip}</div>
          </div>
        </div>

        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B7355" }}>Vendor Details</p>
          <div className="space-y-1 text-sm" style={{ color: "#5C4A32" }}>
            <div><span className="font-bold">Type:</span> {form.businessType}</div>
            <div><span className="font-bold">Products:</span> {form.productDescription}</div>
            <div><span className="font-bold">Items Sold:</span> {form.itemsSold}</div>
            <div><span className="font-bold">Food Vendor:</span> {form.isFood === "yes" ? "Yes" : "No"} · Cooking On Site: {form.cookingOnSite === "yes" ? "Yes" : "No"}</div>
            <div><span className="font-bold">Placement:</span> {insideOutsideLabel[form.insideOrOutside]}</div>
          </div>
        </div>

        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B7355" }}>Insurance & Electrical</p>
          <div className="space-y-1 text-sm" style={{ color: "#5C4A32" }}>
            <div><span className="font-bold">Insurance Binder:</span> {form.hasInsuranceBinder === "yes" ? "Providing" : "Not providing — $100 coverage charge"}</div>
            <div><span className="font-bold">Electrical:</span> {elecLabel[form.electricalService] ?? form.electricalService}</div>
            <div><span className="font-bold">50-ft Cord:</span> {form.hasCord === "yes" ? "Providing" : "Not providing — $50 charge"}</div>
          </div>
        </div>

        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
          <CostBreakdown cost={cost} />
        </div>

        <div className="p-6 border-b" style={{ borderColor: "#E8DFC8" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#8B7355" }}>Signed By</p>
          <p className="text-sm italic" style={{ color: "#2C4A2E" }}>{form.applicantName}</p>
          <p className="text-xs mt-2" style={{ color: "#8B7355" }}>Submission does not guarantee acceptance or placement.</p>
        </div>

        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <button onClick={() => setStep("form")} className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:opacity-80" style={{ border: "1px solid #E8DFC8", color: "#5C4A32" }}>
            ← Edit
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 px-5 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}>
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────────
  const showCordAck  = form.hasCord === "no" && form.electricalService && form.electricalService !== "none";
  const showCleanup  = selectedCategory?.requiresCleanupDeposit;

  return (
    <form onSubmit={handleReview} noValidate>
      {/* Honeypot */}
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
              <Label htmlFor={fid("ownerOrAgent")} required>Owner or Agent</Label>
              <Input id={fid("ownerOrAgent")} value={form.ownerOrAgent} onChange={set("ownerOrAgent")} error={errors.ownerOrAgent} required autoComplete="name" />
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
              <Label htmlFor={fid("socialMedia")}>Social Media</Label>
              <Input id={fid("socialMedia")} value={form.socialMedia} onChange={set("socialMedia")} placeholder="Facebook, Instagram, etc." />
            </div>
          </div>
        </section>

        {/* ── Vendor Information ───────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Vendor Information</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor={fid("businessType")} required>Type of Business</Label>
              <Input id={fid("businessType")} value={form.businessType} onChange={set("businessType")} error={errors.businessType} placeholder="e.g. Food, Craft, Commercial, Service" required />
            </div>
            <div>
              <Label htmlFor={fid("productDescription")} required>Description of Products or Services</Label>
              <Textarea id={fid("productDescription")} value={form.productDescription} onChange={set("productDescription")} error={errors.productDescription} placeholder="Brief description of what you sell or offer…" required />
            </div>
            <div>
              <Label htmlFor={fid("itemsSold")} required>Complete List of Items to Be Sold</Label>
              <Textarea id={fid("itemsSold")} value={form.itemsSold} onChange={set("itemsSold")} error={errors.itemsSold} placeholder="List all items you plan to sell at the fair…" rows={4} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "#5C4A32", letterSpacing: "0.08em" }}>Food Vendor? <span style={{ color: "#8B2E2E" }}>*</span></p>
                <div className="flex gap-4">
                  {["yes", "no"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#5C4A32" }}>
                      <input type="radio" name={fid("isFood")} value={v} checked={form.isFood === v} onChange={() => set("isFood")(v)} style={{ accentColor: "#2C4A2E" }} />
                      {v === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
                <FieldError msg={errors.isFood} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "#5C4A32", letterSpacing: "0.08em" }}>Cooking On Site? <span style={{ color: "#8B2E2E" }}>*</span></p>
                <div className="flex gap-4">
                  {["yes", "no"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#5C4A32" }}>
                      <input type="radio" name={fid("cookingOnSite")} value={v} checked={form.cookingOnSite === v} onChange={() => set("cookingOnSite")(v)} style={{ accentColor: "#2C4A2E" }} />
                      {v === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
                <FieldError msg={errors.cookingOnSite} />
              </div>
            </div>

            <div>
              <Label htmlFor={fid("insideOrOutside")} required>Inside or Outside Preference</Label>
              <SelectNative id={fid("insideOrOutside")} value={form.insideOrOutside} onChange={set("insideOrOutside")} error={errors.insideOrOutside} required>
                <option value="">Select preference…</option>
                <option value="inside">Inside</option>
                <option value="outside">Outside</option>
                <option value="no_preference">No Preference</option>
              </SelectNative>
            </div>
          </div>
        </section>

        {/* ── Booth Selection + Live Estimator ─────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Booth Category & Size</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor={fid("categoryId")} required>Booth Category</Label>
              <SelectNative id={fid("categoryId")} value={form.categoryId} onChange={set("categoryId")} error={errors.categoryId} required>
                <option value="">Select booth category…</option>
                {COMMERCIAL_VENDOR_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </SelectNative>
              {selectedCategory && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "#8B7355" }}>{selectedCategory.description}</p>
              )}
            </div>

            {selectedCategory && (
              <div>
                <Label htmlFor={fid("sizeId")} required>Booth Size</Label>
                <SelectNative id={fid("sizeId")} value={form.sizeId} onChange={set("sizeId")} error={errors.sizeId} required>
                  <option value="">Select booth size…</option>
                  {selectedCategory.boothSizes.map((s) => (
                    <option key={s.id} value={s.id}>{s.label} — {fmt(s.price)}</option>
                  ))}
                </SelectNative>
              </div>
            )}

            <div>
              <Label htmlFor={fid("numberOfSpaces")}>Number of Spaces Requested</Label>
              <Input id={fid("numberOfSpaces")} value={form.numberOfSpaces} onChange={set("numberOfSpaces")} placeholder="e.g. 1 (leave blank if only one)" />
            </div>
            <div>
              <Label htmlFor={fid("placementRequest")}>Special Placement Request</Label>
              <Input id={fid("placementRequest")} value={form.placementRequest} onChange={set("placementRequest")} placeholder="Corner spot, near entrance, etc. (optional)" />
            </div>
          </div>
        </section>

        {/* ── Insurance ────────────────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Insurance</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 text-sm leading-relaxed" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#5C4A32" }}>
              <strong>Insurance Requirement:</strong> An insurance certificate naming the West Tennessee State Fair as Additional Insured is required of all vendors. If you do not provide one, an additional $100 insurance coverage charge will be added to your booth fee.
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "#5C4A32", letterSpacing: "0.08em" }}>
                Will you provide an insurance certificate naming WTSF as Additional Insured? <span style={{ color: "#8B2E2E" }}>*</span>
              </p>
              <div className="flex gap-6">
                {[{ v: "yes", label: "Yes — I will provide the binder" }, { v: "no", label: "No — add $100 coverage charge" }].map(({ v, label }) => (
                  <label key={v} className="flex items-start gap-2 cursor-pointer text-sm" style={{ color: "#5C4A32" }}>
                    <input type="radio" name={fid("hasInsuranceBinder")} value={v} checked={form.hasInsuranceBinder === v} onChange={() => set("hasInsuranceBinder")(v)} style={{ accentColor: "#2C4A2E" }} className="mt-0.5" />
                    {label}
                  </label>
                ))}
              </div>
              <FieldError msg={errors.hasInsuranceBinder} />
            </div>
            {form.hasInsuranceBinder === "no" && (
              <label className="flex items-start gap-2 cursor-pointer p-3" style={{ border: "1px solid #D4A827", backgroundColor: "#FFFCF0" }}>
                <input type="checkbox" checked={form.insuranceAckRequired} onChange={(e) => set("insuranceAckRequired")(e.target.checked)} style={{ accentColor: "#2C4A2E" }} className="mt-0.5 flex-shrink-0" aria-invalid={!!errors.insuranceAckRequired} />
                <span className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  I understand that a <strong>$100 insurance coverage charge</strong> will be added to my booth fee because I am not providing an insurance binder.
                </span>
              </label>
            )}
            <FieldError msg={errors.insuranceAckRequired} />
          </div>
        </section>

        {/* ── Electricity ──────────────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Electrical Service</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor={fid("electricalService")} required>Electrical Hookup Needed</Label>
              <SelectNative id={fid("electricalService")} value={form.electricalService} onChange={set("electricalService")} error={errors.electricalService} required>
                <option value="">Select electrical service…</option>
                <option value="none">No electricity — $0</option>
                <option value="20amp">20 Amp hookup — ${VENDOR_FEES.electrical["20amp"]}</option>
                <option value="30amp">30 Amp hookup — ${VENDOR_FEES.electrical["30amp"]}</option>
                <option value="50amp">50 Amp hookup — ${VENDOR_FEES.electrical["50amp"]}</option>
              </SelectNative>
            </div>

            {form.electricalService && form.electricalService !== "none" && (
              <>
                <div className="p-4 text-sm leading-relaxed" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#5C4A32" }}>
                  <strong>50-Foot Cord Requirement:</strong> Vendors using electrical service must provide a 50-foot electrical cord. If you do not provide one, a <strong>$50 charge</strong> will be added.
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "#5C4A32", letterSpacing: "0.08em" }}>
                    Will you provide a 50-foot electrical cord? <span style={{ color: "#8B2E2E" }}>*</span>
                  </p>
                  <div className="flex gap-6">
                    {[{ v: "yes", label: "Yes — I will provide a 50-ft cord" }, { v: "no", label: "No — add $50 cord charge" }].map(({ v, label }) => (
                      <label key={v} className="flex items-start gap-2 cursor-pointer text-sm" style={{ color: "#5C4A32" }}>
                        <input type="radio" name={fid("hasCord")} value={v} checked={form.hasCord === v} onChange={() => set("hasCord")(v)} style={{ accentColor: "#2C4A2E" }} className="mt-0.5" />
                        {label}
                      </label>
                    ))}
                  </div>
                  <FieldError msg={errors.hasCord} />
                </div>
                {showCordAck && (
                  <label className="flex items-start gap-2 cursor-pointer p-3" style={{ border: "1px solid #D4A827", backgroundColor: "#FFFCF0" }}>
                    <input type="checkbox" checked={form.cordAckRequired} onChange={(e) => set("cordAckRequired")(e.target.checked)} style={{ accentColor: "#2C4A2E" }} className="mt-0.5 flex-shrink-0" aria-invalid={!!errors.cordAckRequired} />
                    <span className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                      I understand that a <strong>$50 cord charge</strong> will be added because I am not providing a 50-foot electrical cord.
                    </span>
                  </label>
                )}
                <FieldError msg={errors.cordAckRequired} />
              </>
            )}

            {form.electricalService === "none" && (
              <div>
                <Label htmlFor={fid("hasCord")} required>50-Foot Cord</Label>
                <SelectNative id={fid("hasCord")} value={form.hasCord} onChange={set("hasCord")} error={errors.hasCord} required>
                  <option value="">Select…</option>
                  <option value="yes">Yes — providing a 50-ft cord</option>
                  <option value="no">No electrical service needed</option>
                </SelectNative>
              </div>
            )}
          </div>
        </section>

        {/* ── Cleanup Deposit (outside only) ──────── */}
        {showCleanup && (
          <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Cleanup Deposit</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 text-sm leading-relaxed" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#5C4A32" }}>
                Outside vendors are required to pay a <strong>refundable $100 cleanup deposit</strong>. This deposit will be fully refunded when your assigned area has been completely cleaned after the fair.
              </div>
              <label className="flex items-start gap-2 cursor-pointer p-3" style={{ border: `1px solid ${errors.cleanupDepositAck ? "#8B2E2E" : "#E8DFC8"}`, backgroundColor: "#FFFCF0" }}>
                <input type="checkbox" checked={form.cleanupDepositAck} onChange={(e) => set("cleanupDepositAck")(e.target.checked)} style={{ accentColor: "#2C4A2E" }} className="mt-0.5 flex-shrink-0" aria-invalid={!!errors.cleanupDepositAck} />
                <span className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  I understand that a <strong>refundable $100 cleanup deposit</strong> is required and will be returned when I have completely cleaned my assigned area after the fair.
                </span>
              </label>
              <FieldError msg={errors.cleanupDepositAck} />
            </div>
          </section>
        )}

        {/* ── Live Cost Estimator ──────────────────── */}
        {form.categoryId && form.sizeId && (
          <section>
            <CostBreakdown cost={cost} />
          </section>
        )}

        {/* ── Additional Information ───────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Additional Information</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor={fid("trailerDimensions")}>Trailer or Setup Dimensions</Label>
              <Input id={fid("trailerDimensions")} value={form.trailerDimensions} onChange={set("trailerDimensions")} placeholder="e.g. 24-ft trailer with 4-ft awning extension" />
            </div>
            <div>
              <Label htmlFor={fid("waterNeeded")}>Water Connection Needed?</Label>
              <Input id={fid("waterNeeded")} value={form.waterNeeded} onChange={set("waterNeeded")} placeholder="e.g. No / Yes — requires standard garden hose hookup" />
            </div>
            <div>
              <Label htmlFor={fid("vehicleInfo")}>Vehicle or Equipment Information</Label>
              <Input id={fid("vehicleInfo")} value={form.vehicleInfo} onChange={set("vehicleInfo")} placeholder="e.g. Pickup truck + 16-ft enclosed trailer" />
            </div>
            <div>
              <Label htmlFor={fid("specialAccommodations")}>Special Accommodations or Requests</Label>
              <Textarea id={fid("specialAccommodations")} value={form.specialAccommodations} onChange={set("specialAccommodations")} placeholder="ADA accessibility needs, setup time requirements, etc." />
            </div>
            <div>
              <Label htmlFor={fid("notes")}>Additional Notes</Label>
              <Textarea id={fid("notes")} value={form.notes} onChange={set("notes")} placeholder="Anything else we should know…" />
            </div>
          </div>
        </section>

        {/* ── Agreement ───────────────────────────── */}
        <section style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DFC8", backgroundColor: "#F5EDD4" }}>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>Agreement & Submission</p>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-xs leading-relaxed p-3" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#5C4A32" }}>
              <strong>Privacy Notice:</strong> The information you provide will be used solely to review your vendor application and to contact you about participating in the West Tennessee State Fair. It will not be shared with third parties.
            </p>

            <div>
              <Label htmlFor={fid("applicantName")} required>Typed Full Name (Electronic Acknowledgment)</Label>
              <Input id={fid("applicantName")} value={form.applicantName} onChange={set("applicantName")} error={errors.applicantName} placeholder="Type your full legal name" required autoComplete="name" />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agreed} onChange={(e) => set("agreed")(e.target.checked)} className="mt-0.5 flex-shrink-0" aria-invalid={!!errors.agreed} style={{ accentColor: "#2C4A2E" }} />
                <span className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  I confirm that all information provided is accurate and complete. I understand that submission of this form is an application and does not guarantee acceptance or placement. I understand that all decisions of the Advertising and Marketing Committee of the West Tennessee State Fair are final. I acknowledge the insurance, electrical, cord, and deposit charges selected above. If approved, I agree to pay the final approved total by the confirmed payment deadline. I understand that the fair may contact me for additional information.
                </span>
              </label>
              <FieldError msg={errors.agreed} />
            </div>

            {VENDOR_PAYMENT_DEADLINE && !VENDOR_PAYMENT_DEADLINE.confirmed && (
              <div className="p-3 text-xs leading-relaxed" style={{ backgroundColor: "#FFF8E8", border: "1px solid #E8DFC8", color: "#8B7355" }}>
                <strong>Payment Deadline:</strong> {VENDOR_PAYMENT_DEADLINE.label} (pending fair board confirmation — the specific 2026 date will be communicated upon approval).
              </div>
            )}

            {serverError && (
              <div className="p-3 text-sm" style={{ backgroundColor: "#FFF0F0", border: "1px solid #8B2E2E", color: "#8B2E2E" }} role="alert">
                {serverError}
              </div>
            )}

            <div className="pt-2">
              <p className="text-xs mb-3" style={{ color: "#8B7355" }}>Submission date will be recorded automatically.</p>
              <button type="submit" className="w-full py-4 text-sm font-bold tracking-widest uppercase hover:opacity-90 active:scale-[0.99] disabled:opacity-60" style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}>
                Review Application →
              </button>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
