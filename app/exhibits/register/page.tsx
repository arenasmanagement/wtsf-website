"use client";

import { useState, useEffect } from "react";
import RegistrationForm from "@/components/exhibits/RegistrationForm";
import Link from "next/link";
import type { DepartmentType } from "@/lib/exhibit-config";

interface RegistrationSettings {
  nonPerishableOpen: boolean;
  perishableOpen:    boolean;
  anyOpen:           boolean;
  entry_deadline_label?: string;
  close_date?: string;
}

export default function ExhibitRegisterPage() {
  const [settings,     setSettings]     = useState<RegistrationSettings | null>(null);
  const [loading,      setLoading]       = useState(true);
  const [successRef,   setSuccessRef]    = useState<string | null>(null);
  const [successEmail, setSuccessEmail]  = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/exhibits/register")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => setSettings({ nonPerishableOpen: false, perishableOpen: false, anyOpen: false }))
      .finally(() => setLoading(false));
  }, []);

  // Loading
  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        style={{ backgroundColor: "#F5EDD4" }}
      >
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#2C4A2E" strokeWidth="4" />
            <path className="opacity-75" fill="#2C4A2E" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "#5C4A32" }}>Loading registration…</p>
        </div>
      </div>
    );
  }

  // Success state
  if (successRef) {
    return (
      <div style={{ backgroundColor: "#F5EDD4" }} className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div
            className="p-8 md:p-10"
            style={{ backgroundColor: "#2C4A2E" }}
          >
            <div
              className="w-14 h-14 flex items-center justify-center mb-6"
              style={{ backgroundColor: "#D4A827" }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#1A1A1A" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.2em" }}
            >
              Registration Received
            </p>

            <h1
              className="text-3xl font-bold italic mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
            >
              Thank You!
            </h1>

            <p className="text-base leading-relaxed mb-6" style={{ color: "#C5D9C6" }}>
              Your exhibit registration has been received. A confirmation email has been sent to{" "}
              <strong style={{ color: "#F5EDD4" }}>{successEmail ?? "your email address"}</strong>.
            </p>

            <div
              className="p-5 mb-6"
              style={{ backgroundColor: "rgba(212,168,39,0.1)", border: "1px solid rgba(212,168,39,0.3)" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "#A8BFA9" }}
              >
                Your Website Submission Reference
              </p>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "monospace", color: "#D4A827" }}
              >
                {successRef}
              </p>
              <p className="text-xs leading-relaxed mt-3" style={{ color: "#A8BFA9" }}>
                Keep this reference for your records. <strong style={{ color: "#C5D9C6" }}>This is not your official exhibitor ID.</strong>{" "}
                Your official exhibitor ID will be assigned separately when your registration is processed through the fair&apos;s exhibit program.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/exhibits"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A" }}
              >
                Back to Exhibits
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold tracking-wider uppercase border transition-opacity hover:opacity-70"
                style={{ borderColor: "rgba(245,237,212,0.3)", color: "#F5EDD4" }}
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All entry types closed
  if (!settings?.anyOpen) {
    return (
      <div style={{ backgroundColor: "#F5EDD4" }} className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-xs" style={{ color: "#8B7355" }}>
            <Link href="/exhibits" className="hover:underline" style={{ color: "#2C4A2E" }}>Exhibits</Link>
            <span>›</span>
            <span>Online Registration</span>
          </div>

          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#D4A827", letterSpacing: "0.2em" }}
          >
            Online Registration
          </p>

          <h1
            className="text-4xl font-bold italic mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            Online Entries Have Closed
          </h1>

          <div className="p-6 mb-8" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
            <p className="text-base leading-relaxed mb-4" style={{ color: "#3D3026" }}>
              The online entry period for these exhibit categories has ended. Our team is now preparing
              exhibitor records, entry labels, and check-in materials for the upcoming exhibit
              turn-in period.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
              Thank you for your interest in participating in the 2026 West Tennessee State Fair.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/exhibits"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
            >
              View Exhibit Information
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Build open department types list for the form
  const openDepartmentTypes: DepartmentType[] = [];
  if (settings.nonPerishableOpen) openDepartmentTypes.push("Non-Perishable");
  if (settings.perishableOpen)    openDepartmentTypes.push("Perishable");

  // Registration open — show form
  return (
    <div style={{ backgroundColor: "#F5EDD4" }}>
      {/* Page header */}
      <div style={{ backgroundColor: "#2C4A2E" }} className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-3 flex items-center gap-2 text-xs" style={{ color: "#A8BFA9" }}>
            <Link href="/exhibits" className="hover:opacity-80 transition-opacity" style={{ color: "#A8BFA9" }}>
              Exhibits
            </Link>
            <span>›</span>
            <span>Online Registration</span>
          </div>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#D4A827", letterSpacing: "0.2em" }}
          >
            West Tennessee State Fair 2026
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold italic mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Enter Exhibits Online
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#A8BFA9" }}>
            Complete the form below to submit your exhibit entries. You can add as many exhibits as
            you need in one registration.
          </p>
        </div>
      </div>

      {/* Form area */}
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="p-6 sm:p-10"
            style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}
          >
            <RegistrationForm
              openDepartmentTypes={openDepartmentTypes}
              onSuccess={(ref, email) => {
                setSuccessRef(ref);
                setSuccessEmail(email);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
