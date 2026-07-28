import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SponsorForm from "@/components/partner/SponsorForm";
import VendorForm from "@/components/partner/VendorForm";
import VolunteerForm from "@/components/partner/VolunteerForm";
import { SPONSOR_PACKAGES } from "@/lib/sponsor-config";
import { VENDOR_CATEGORIES, VENDOR_FEES, VENDOR_PAYMENT_DEADLINE, VENDOR_POLICIES } from "@/lib/vendor-config";
import { FAIR_CONFIG } from "@/lib/fair-config";

export const metadata: Metadata = {
  title: "Partner With Us — Vendors, Sponsors & Volunteers | West Tennessee State Fair",
  description:
    "Join the West Tennessee State Fair as a sponsor, vendor, or volunteer. View 2026 sponsorship packages, booth options, and pricing. Apply online or sign up to volunteer.",
};

// ─── Small UI helpers (Server-rendered) ───────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
      {children}
    </p>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl sm:text-4xl font-bold italic leading-tight mb-5"
      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <div className="py-5" style={{ backgroundColor: "#E8DFC8" }} aria-hidden="true">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "#D4C9A8" }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "#D4A827" }} />
          <div className="flex-1 h-px" style={{ backgroundColor: "#D4C9A8" }} />
        </div>
      </div>
    </div>
  );
}

// Booth pricing table for vendor section
function BoothTable({ sizes, accentColor }: {
  sizes: { label: string; price: number }[];
  accentColor: string;
}) {
  return (
    <div style={{ border: "1px solid #E8DFC8" }}>
      <div className="grid" style={{ gridTemplateColumns: "1fr auto" }}>
        <div className="px-4 py-2.5 border-b text-xs font-bold tracking-widest uppercase" style={{ borderColor: "#E8DFC8", color: "#8B7355", backgroundColor: "#F5EDD4", letterSpacing: "0.12em" }}>
          Booth Size
        </div>
        <div className="px-4 py-2.5 border-b text-xs font-bold tracking-widest uppercase text-right" style={{ borderColor: "#E8DFC8", color: "#8B7355", backgroundColor: "#F5EDD4", letterSpacing: "0.12em" }}>
          Price
        </div>
        {sizes.map((s, i) => (
          <>
            <div key={`${i}-size`} className="px-4 py-3 border-b text-sm font-medium" style={{ borderColor: "#E8DFC8", color: "#2C4A2E", backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff" }}>
              {s.label}
            </div>
            <div key={`${i}-price`} className="px-4 py-3 border-b text-sm font-bold text-right" style={{ borderColor: "#E8DFC8", color: accentColor, backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff" }}>
              ${s.price.toLocaleString()}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default function VendorsSponsorsPage() {
  const YEAR = FAIR_CONFIG.year;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <PageHero
        overline={`${YEAR} West Tennessee State Fair`}
        headline="Partner With the"
        headlineAccent="West Tennessee State Fair"
        subtext="The West Tennessee State Fair offers three ways to get involved: support the fair as a sponsor, operate a vendor booth across 10 days in October, or give your time as a community volunteer."
        accentColor="#D4A827"
      />

      {/* ── Quick-nav opportunity cards ───────────────────────────── */}
      <section
        className="py-12 md:py-16"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-label="Partnership opportunities"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel>Three Ways to Get Involved</SectionLabel>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#5C4A32" }}>
              Ten fabulous days and lots of opportunities to be part of something bigger. Choose the path that fits your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Sponsor card */}
            <div className="relative flex flex-col p-8" style={{ backgroundColor: "#2C4A2E" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#D4A827" }} aria-hidden="true" />
              <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(212,168,39,0.15)" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>Sponsorship</p>
              <h3 className="text-2xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
                Become a Sponsor
              </h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#C5D9C6" }}>
                Get your brand in front of thousands of fair attendees. Packages from $250 to $10,000+ include naming rights, logo placement, event signage, social media exposure, and fair tickets.
              </p>
              <a
                href="#sponsor-section"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 self-start"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
              >
                View Packages
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>
            </div>

            {/* Vendor card */}
            <div className="relative flex flex-col p-8" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#8B2E2E" }} aria-hidden="true" />
              <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ backgroundColor: "#F5EDD4" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#8B2E2E" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#8B2E2E", letterSpacing: "0.2em" }}>Vendor Space</p>
              <h3 className="text-2xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
                Apply as a Vendor
              </h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#5C4A32" }}>
                Operate your own booth at the fair. General merchandise, inside exhibit tent, and outside cooking-allowed spaces available. Booth sizes from 10×10 to 50×20.
              </p>
              <a
                href="#vendor-section"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 self-start"
                style={{ backgroundColor: "#8B2E2E", color: "#F5EDD4", letterSpacing: "0.1em" }}
              >
                Apply as a Vendor
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>
            </div>

            {/* Volunteer card */}
            <div className="relative flex flex-col p-8" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#5C4A32" }} aria-hidden="true" />
              <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ backgroundColor: "#F5EDD4" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#5C4A32" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#5C4A32", letterSpacing: "0.2em" }}>Community</p>
              <h3 className="text-2xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
                Volunteer at the Fair
              </h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#5C4A32" }}>
                Give your time to help make the fair happen. Volunteers assist with gate operations, exhibit setup, show-day support, pageant coordination, and general fair operations.
              </p>
              <a
                href="#volunteer-section"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 self-start"
                style={{ backgroundColor: "#5C4A32", color: "#F5EDD4", letterSpacing: "0.1em" }}
              >
                Volunteer at the Fair
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  SPONSORSHIP SECTION                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        id="sponsor-section"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="sponsor-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <SectionLabel>{YEAR} Sponsorship Opportunities</SectionLabel>
            <SectionHeading id="sponsor-heading">Sponsorship Packages</SectionHeading>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#5C4A32" }}>
              Sponsoring the West Tennessee State Fair puts your brand at the center of one of West Tennessee&apos;s longest-standing community traditions. Ten fabulous days, thousands of visitors, and lots of opportunities to showcase your business or organization. We can work out ideas to fit every budget.
            </p>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
            {SPONSOR_PACKAGES.map((tier) => (
              <div
                key={tier.id}
                className="relative flex flex-col p-7"
                style={{
                  backgroundColor: tier.id === "best-of-show" ? "#2C4A2E" : "#FDFAF3",
                  border: tier.id === "best-of-show" ? "none" : "1px solid #E8DFC8",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: tier.ribbonColor }} aria-hidden="true" />
                <div className="flex items-start justify-between mb-4 mt-1">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{ color: tier.id === "best-of-show" ? "rgba(212,168,39,0.75)" : "#8B7355", letterSpacing: "0.15em" }}>
                      {tier.name}
                    </p>
                    <p className="text-3xl font-bold italic"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: tier.id === "best-of-show" ? "#F5EDD4" : tier.ribbonColor }}>
                      {tier.price}
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: tier.ribbonColor }} aria-hidden="true" />
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tier.ribbonColor }} aria-hidden="true" />
                      <span className="text-xs leading-relaxed" style={{ color: tier.id === "best-of-show" ? "#C5D9C6" : "#5C4A32" }}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* "Fit every budget" note */}
          <div className="p-6 sm:p-8 mb-16" style={{ backgroundColor: "#2C4A2E" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#D4A827" }}>Custom Options Available</p>
            <p className="text-xl font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
              We can work out ideas to fit every budget.
            </p>
            <p className="text-sm" style={{ color: "#C5D9C6" }}>
              Not sure which package is right for you? Select &ldquo;I would like to discuss a custom sponsorship&rdquo; in the application form below and we&apos;ll be in touch.
            </p>
          </div>

          {/* ── Sponsor Application Form ─────────────── */}
          <div id="sponsor-form">
            <div className="mb-8">
              <SectionLabel>Apply Now</SectionLabel>
              <SectionHeading id="sponsor-form-heading">Sponsor Application</SectionHeading>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#5C4A32" }}>
                Fill out the form below to apply for a {YEAR} West Tennessee State Fair sponsorship. Submission of this form is an application — it does not guarantee acceptance. We will review your application and contact you about next steps.
              </p>
            </div>
            <SponsorForm />
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  VENDOR SECTION                                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        id="vendor-section"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="vendor-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="mb-12">
            <SectionLabel>Vendor Opportunities</SectionLabel>
            <SectionHeading id="vendor-heading">Become a Vendor</SectionHeading>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#5C4A32" }}>
              The {YEAR} West Tennessee State Fair draws thousands of visitors across 10 days every October. Vendor spaces are available in three categories — each with different booth sizes, locations, and pricing. Review the options below, then use the interactive cost estimator and application form.
            </p>
          </div>

          {/* ── Three booth categories ──────────────── */}
          <div className="space-y-10 mb-14">
            {VENDOR_CATEGORIES.map((cat) => (
              <div key={cat.id} className="relative" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
                <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: cat.accentColor }} aria-hidden="true" />
                <div className="pl-6 pr-6 pt-6 pb-6 sm:pl-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: cat.accentColor, letterSpacing: "0.18em" }}>
                        {cat.location === "inside" ? "Inside" : cat.location === "outside" ? "Outside" : "Inside or Outside"} ·{" "}
                        {cat.cookingAllowed ? "Cooking Allowed" : "No Cooking"}
                      </p>
                      <h3 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
                        {cat.name}
                      </h3>
                    </div>
                    {cat.requiresCleanupDeposit && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8", color: "#8B7355", flexShrink: 0 }}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        Refundable Cleanup Deposit Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "#5C4A32" }}>{cat.description}</p>
                  <BoothTable
                    sizes={cat.boothSizes.map((s) => ({ label: s.label, price: s.price }))}
                    accentColor={cat.accentColor}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Fees & Requirements ─────────────────── */}
          <div className="mb-14">
            <div className="mb-6">
              <SectionLabel>Fees & Requirements</SectionLabel>
              <h3 className="text-2xl font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
                Additional Charges
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Insurance */}
              <div className="p-6" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#2C4A2E" }} aria-hidden="true">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.75}>
                      <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>Insurance</h4>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                  An insurance certificate naming the West Tennessee State Fair as Additional Insured is required of all vendors.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
                    <span className="text-sm" style={{ color: "#5C4A32" }}>Vendor provides insurance binder</span>
                    <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>$0</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
                    <span className="text-sm" style={{ color: "#5C4A32" }}>No binder provided — coverage through fair</span>
                    <span className="text-sm font-bold" style={{ color: "#8B2E2E" }}>+${VENDOR_FEES.insuranceWithoutBinder}</span>
                  </div>
                </div>
              </div>

              {/* Electrical */}
              <div className="p-6" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#2C4A2E" }} aria-hidden="true">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.75}>
                      <path strokeLinecap="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>Electrical Hookup</h4>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                  Electrical hookup fee is based on amperage required. Vendors must provide a 50-foot electrical cord.
                </p>
                <div className="space-y-2">
                  {[
                    { label: "No electricity", price: VENDOR_FEES.electrical["none"] },
                    { label: "20 Amp hookup", price: VENDOR_FEES.electrical["20amp"] },
                    { label: "30 Amp hookup", price: VENDOR_FEES.electrical["30amp"] },
                    { label: "50 Amp hookup", price: VENDOR_FEES.electrical["50amp"] },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: i % 2 === 0 ? "#F5EDD4" : "#FDFAF3", border: "1px solid #E8DFC8" }}>
                      <span className="text-sm" style={{ color: "#5C4A32" }}>{row.label}</span>
                      <span className="text-sm font-bold" style={{ color: row.price === 0 ? "#8B7355" : "#2C4A2E" }}>
                        {row.price === 0 ? "$0" : `$${row.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 50-ft Cord */}
              <div className="p-6" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#2C4A2E" }} aria-hidden="true">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.75}>
                      <path strokeLinecap="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>50-Foot Electrical Cord</h4>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                  Vendors must provide a qualifying 50-foot electrical cord for hookup.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
                    <span className="text-sm" style={{ color: "#5C4A32" }}>Vendor provides 50-ft cord</span>
                    <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>$0</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
                    <span className="text-sm" style={{ color: "#5C4A32" }}>Cord not provided</span>
                    <span className="text-sm font-bold" style={{ color: "#8B2E2E" }}>+${VENDOR_FEES.cordNotProvided}</span>
                  </div>
                </div>
              </div>

              {/* Cleanup deposit */}
              <div className="p-6" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#2C4A2E" }} aria-hidden="true">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.75}>
                      <path strokeLinecap="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>Refundable Cleanup Deposit</h4>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                  Outside vendors are required to pay a refundable cleanup deposit. This deposit will be fully returned when the vendor&apos;s assigned area is completely clean after the fair.
                </p>
                <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
                  <span className="text-sm" style={{ color: "#5C4A32" }}>Outside vendors — refundable deposit</span>
                  <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>${VENDOR_FEES.cleanupDeposit}</span>
                </div>
              </div>
            </div>

            {/* Payment deadline */}
            <div className="mt-6 p-5 flex flex-col sm:flex-row sm:items-center gap-3" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2C4A2E" }}>Payment Deadline: {VENDOR_PAYMENT_DEADLINE.label}</p>
                {!VENDOR_PAYMENT_DEADLINE.confirmed && (
                  <p className="text-xs mt-0.5" style={{ color: "#8B7355" }}>
                    Final payment deadline is subject to confirmation for {YEAR}. The specific deadline will be communicated upon approval.
                  </p>
                )}
              </div>
            </div>

            {/* Policies */}
            <div className="mt-6 p-6" style={{ backgroundColor: "#2C4A2E" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>Vendor Policies</p>
              <ul className="space-y-3">
                {VENDOR_POLICIES.map((policy, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: "#D4A827" }} aria-hidden="true" />
                    <p className="text-sm leading-relaxed" style={{ color: "#C5D9C6" }}>{policy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Vendor Application Form ─────────────── */}
          <div id="vendor-form">
            <div className="mb-8">
              <SectionLabel>Apply Now</SectionLabel>
              <SectionHeading id="vendor-form-heading">Vendor Application</SectionHeading>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#5C4A32" }}>
                Fill out the form below to apply for a {YEAR} West Tennessee State Fair vendor space. The interactive cost estimator will update automatically as you make your selections. Submission of this form is an application — it does not guarantee acceptance or placement.
              </p>
            </div>
            <VendorForm />
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  VOLUNTEER SECTION                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        id="volunteer-section"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="volunteer-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <SectionLabel>Give Your Time</SectionLabel>
            <SectionHeading id="volunteer-heading">Volunteer at the Fair</SectionHeading>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#5C4A32" }}>
              The West Tennessee State Fair runs on the effort of community members who give their time because they care about what this event means to Henderson. Volunteers are at the heart of everything that happens across those 10 days in October.
            </p>
          </div>

          {/* Volunteer roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            <div className="p-7" style={{ backgroundColor: "#2C4A2E" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>
                Where Volunteers Help
              </p>
              <ul className="space-y-3">
                {[
                  "Gate and ticket operations",
                  "Exhibit hall setup and management",
                  "Show-day livestock and staging support",
                  "Pageant-day coordination",
                  "General grounds and cleanup",
                  "Other fair operations as needed",
                ].map((role) => (
                  <li key={role} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: "#D4A827" }} aria-hidden="true" />
                    <p className="text-sm leading-relaxed" style={{ color: "#C5D9C6" }}>{role}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-7 flex flex-col gap-5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>
                  What to Expect
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#5C4A32" }}>
                  Submitting the volunteer interest form does not guarantee a placement. Volunteer roles and
                  schedules are assigned based on fair needs and the availability of each applicant.
                  The fair team will review your interest and may reach out for additional information.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  Whether you have one afternoon or the whole week, your time makes a difference.
                  This fair exists because of people like you.
                </p>
              </div>
              <div className="mt-auto p-4" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
                <p className="text-xs leading-relaxed" style={{ color: "#8B7355" }}>
                  Questions about volunteering? Email{" "}
                  <a href="mailto:wtsfair@gmail.com?subject=Volunteer%20Inquiry" className="font-bold" style={{ color: "#2C4A2E" }}>
                    wtsfair@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          </div>

          {/* ── Volunteer Interest Form ─────────────────── */}
          <div id="volunteer-form">
            <div className="mb-8">
              <SectionLabel>Express Your Interest</SectionLabel>
              <SectionHeading id="volunteer-form-heading">Volunteer Interest Form</SectionHeading>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#5C4A32" }}>
                Fill out the form below to express your interest in volunteering at the {YEAR} West Tennessee State Fair.
                Submission is an expression of interest — it does not guarantee a volunteer assignment.
              </p>
            </div>
            <VolunteerForm />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Contact Section ────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ backgroundColor: "#2C4A2E" }}
        aria-labelledby="contact-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel>Questions?</SectionLabel>
          <h2 id="contact-heading" className="text-3xl font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
            Get in Touch
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#C5D9C6" }}>
            Questions about sponsorship, vendor spaces, or volunteering? Reach out directly and we&apos;ll help you find the right path.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={`mailto:wtsfair@gmail.com?subject=Partnership%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{ color: "#F5EDD4" }}
            >
              <span style={{ color: "#D4A827" }}>✉</span>
              <span className="text-sm">wtsfair@gmail.com</span>
            </a>
            <div className="flex items-center gap-3" style={{ color: "#F5EDD4" }}>
              <span style={{ color: "#D4A827" }}>📮</span>
              <span className="text-sm">P.O. Box 1404, Jackson, TN 38302</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
