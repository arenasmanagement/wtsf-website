"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────
interface FieldErrors {
  name?:         string;
  businessName?: string;
  email?:        string;
  phone?:        string;
  message?:      string;
  general?:      string;
}

interface FormState {
  name:         string;
  businessName: string;
  email:        string;
  phone:        string;
  message:      string;
}

// ── Shared input style ────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2.5 text-sm border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1";
const inputStyle = {
  borderColor: "#D4C9A8",
  color: "#2C4A2E",
  fontFamily: "inherit",
};
const focusRingStyle = { "--tw-ring-color": "#2C4A2E" } as React.CSSProperties;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs font-medium" style={{ color: "#8B2E2E" }} role="alert">
      {msg}
    </p>
  );
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-bold tracking-wide uppercase mb-1.5"
      style={{ color: "#5C4A32", letterSpacing: "0.1em" }}
    >
      {children}
      {required && (
        <span className="ml-1" style={{ color: "#8B2E2E" }} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

// ── Component ─────────────────────────────────────────────────────────
export default function FoodVendorForm() {
  const [form, setForm] = useState<FormState>({
    name:         "",
    businessName: "",
    email:        "",
    phone:        "",
    message:      "",
  });
  const [errors, setErrors]   = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/partner/food-vendor", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:         form.name.trim(),
          businessName: form.businessName.trim(),
          email:        form.email.trim(),
          phone:        form.phone.trim(),
          message:      form.message.trim(),
          website_confirm: "", // honeypot
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        setSubmitted(true);
        return;
      }

      if (res.status === 422 && json.errors) {
        setErrors(json.errors as FieldErrors);
        return;
      }

      setErrors({
        general:
          (json.error as string | undefined) ??
          "Something went wrong. Please try again.",
      });
    } catch {
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ─────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="p-6"
        style={{
          backgroundColor: "#F0F7F0",
          border: "1px solid #A8C5AA",
        }}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: "#2C4A2E" }}
            aria-hidden="true"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p
              className="text-base font-bold italic mb-1"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#2C4A2E",
              }}
            >
              Inquiry Received
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
              Your inquiry has been sent to the Food Vendor Coordinators. They
              will follow up with you directly at{" "}
              <strong>{form.email}</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Food vendor inquiry form">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website_confirm"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
        readOnly
      />

      <div className="space-y-5">
        {/* Name */}
        <div>
          <Label htmlFor="fv-name" required>
            Your Name
          </Label>
          <input
            id="fv-name"
            type="text"
            className={inputCls}
            style={{ ...inputStyle, ...focusRingStyle }}
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? "fv-name-err" : undefined}
          />
          <FieldError msg={errors.name} />
        </div>

        {/* Business Name */}
        <div>
          <Label htmlFor="fv-business" required>
            Business / Food Vendor Name
          </Label>
          <input
            id="fv-business"
            type="text"
            className={inputCls}
            style={{ ...inputStyle, ...focusRingStyle }}
            value={form.businessName}
            onChange={set("businessName")}
            aria-required="true"
          />
          <FieldError msg={errors.businessName} />
        </div>

        {/* Email + Phone row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="fv-email" required>
              Email Address
            </Label>
            <input
              id="fv-email"
              type="email"
              className={inputCls}
              style={{ ...inputStyle, ...focusRingStyle }}
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              aria-required="true"
            />
            <FieldError msg={errors.email} />
          </div>
          <div>
            <Label htmlFor="fv-phone">Phone (optional)</Label>
            <input
              id="fv-phone"
              type="tel"
              className={inputCls}
              style={{ ...inputStyle, ...focusRingStyle }}
              value={form.phone}
              onChange={set("phone")}
              autoComplete="tel"
            />
            <FieldError msg={errors.phone} />
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="fv-message" required>
            What do you sell? / Message
          </Label>
          <textarea
            id="fv-message"
            rows={4}
            className={inputCls}
            style={{ ...inputStyle, ...focusRingStyle, resize: "vertical" }}
            value={form.message}
            onChange={set("message")}
            placeholder="Tell the coordinators about your food products, cooking setup, space needs, or any questions you have."
            aria-required="true"
          />
          <FieldError msg={errors.message} />
        </div>

        {/* General error */}
        {errors.general && (
          <div
            className="p-4 text-sm"
            style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#8B2E2E" }}
            role="alert"
          >
            {errors.general}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3 text-sm font-bold tracking-wide uppercase transition-opacity disabled:opacity-60"
          style={{
            backgroundColor: "#2C4A2E",
            color: "#D4A827",
            letterSpacing: "0.1em",
            fontFamily: "inherit",
          }}
        >
          {submitting ? "Sending…" : "Send Inquiry"}
        </button>
      </div>
    </form>
  );
}
