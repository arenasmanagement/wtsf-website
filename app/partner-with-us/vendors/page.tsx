import type { Metadata } from "next";
import Link from "next/link";
import VendorForm from "@/components/partner/VendorForm";
import {
  VENDOR_CATEGORIES,
  VENDOR_FEES,
  VENDOR_PAYMENT_DEADLINE,
  VENDOR_POLICIES,
} from "@/lib/vendor-config";
import { FAIR_CONFIG } from "@/lib/fair-config";

export const metadata: Metadata = {
  title: "Vendor Spaces — Partner With Us | West Tennessee State Fair",
  description:
    "Apply for a vendor booth at the 2026 West Tennessee State Fair. Three booth categories, sizes from 10×10 to 50×20. Interactive cost estimator and online application.",
};

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
      {children}
    </p>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-3xl sm:text-4xl font-bold italic leading-tight mb-5"
      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
    >
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

export default function VendorsPage() {
  const YEAR = FAIR_CONFIG.year;

  return (
    <>
      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs" style={{ color: "rgba(245,237,212,0.65)" }}>
            <Link href="/partner-with-us" className="transition-colors hover:text-white" style={{ color: "rgba(245,237,212,0.65)" }}>
              Partner With Us
            </Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: "#D4A827" }}>Vendors</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="py-16 md:py-20" style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
            {YEAR} Vendor Opportunities
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold italic leading-tight mb-5"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Apply as a Vendor
          </h1>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#C5D9C6" }}>
            The {YEAR} West Tennessee State Fair draws thousands of visitors across 10 days every October.
            Vendor spaces are available in three categories — each with different booth sizes, locations,
            and pricing. Review the options below, then use the interactive cost estimator and application form.
          </p>
          {/* Jump links */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: "Booth Categories", href: "#booth-categories" },
              { label: "Fees & Requirements", href: "#fees" },
              { label: "Apply Now", href: "#vendor-form" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
                style={{ backgroundColor: "rgba(212,168,39,0.15)", color: "#D4A827", border: "1px solid rgba(212,168,39,0.3)", letterSpacing: "0.1em" }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  BOOTH CATEGORIES                                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        id="booth-categories"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="vendor-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <SectionLabel>Booth Categories</SectionLabel>
            <SectionHeading id="vendor-heading">Vendor Spaces</SectionHeading>
          </div>

          {/* Three booth categories */}
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
          <div id="fees" className="mb-14">
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
                    { label: "20 Amp hookup",  price: VENDOR_FEES.electrical["20amp"] },
                    { label: "30 Amp hookup",  price: VENDOR_FEES.electrical["30amp"] },
                    { label: "50 Amp hookup",  price: VENDOR_FEES.electrical["50amp"] },
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

          {/* ── Vendor Application Form ─────────────────────────── */}
          <div id="vendor-form">
            <div className="mb-8">
              <SectionLabel>Apply Now</SectionLabel>
              <SectionHeading id="vendor-form-heading">Vendor Application</SectionHeading>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#5C4A32" }}>
                Fill out the form below to apply for a {YEAR} West Tennessee State Fair vendor space. The
                interactive cost estimator will update automatically as you make your selections. Submission
                of this form is an application — it does not guarantee acceptance or placement.
              </p>
            </div>
            <VendorForm />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Other ways to partner ──────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#FDFAF3" }} aria-labelledby="other-ways-vendor-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
            Other Ways to Partner
          </p>
          <h2
            id="other-ways-vendor-heading"
            className="text-2xl font-bold italic mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            More Ways to Get Involved
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link
              href="/partner-with-us/sponsors"
              className="group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#2C4A2E" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>Sponsorship</p>
                <p className="text-lg font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>Become a Sponsor</p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  Packages from $250 to $10,000+ with naming rights, signage, and social media exposure.
                </p>
              </div>
            </Link>

            <Link
              href="/partner-with-us/volunteer"
              className="group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#5C4A32" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#5C4A32", letterSpacing: "0.15em" }}>Community</p>
                <p className="text-lg font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>Volunteer at the Fair</p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  Give your time to help make the fair happen. No cost — just your hours.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#2C4A2E" }} aria-labelledby="vendor-contact-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>Questions?</p>
          <h2 id="vendor-contact-heading" className="text-3xl font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
            Get in Touch
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#C5D9C6" }}>
            Questions about vendor spaces, booth sizing, or the application process? Reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={`mailto:wtsfair@gmail.com?subject=Vendor%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{ color: "#F5EDD4" }}
            >
              <span style={{ color: "#D4A827" }}>✉</span>
              <span className="text-sm">wtsfair@gmail.com</span>
            </a>
            <div className="flex items-center gap-3" style={{ color: "#F5EDD4" }}>
              <span style={{ color: "#D4A827" }}>📞</span>
              <span className="text-sm">731-608-6009</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
