import type { Metadata } from "next";
import Link from "next/link";
import VendorForm from "@/components/partner/VendorForm";
import {
  COMMERCIAL_VENDOR_CATEGORIES,
  FOOD_VENDOR_CONTACT,
  VENDOR_FEES,
  VENDOR_PAYMENT_DEADLINE,
  VENDOR_POLICIES,
} from "@/lib/vendor-config";
import { FAIR_CONFIG } from "@/lib/fair-config";

export const metadata: Metadata = {
  title: "Vendor Booth Applications — Commercial & Food Vendor Spaces 2026",
  description:
    "Apply for a commercial vendor booth at the 2026 West Tennessee State Fair, or learn how to contact the Food Vendor Coordinators for food vendor spaces. Henderson, TN — October 15–24.",
  alternates: {
    canonical: "https://www.wtsfair.com/partner-with-us/vendors",
  },
  openGraph: {
    url: "https://www.wtsfair.com/partner-with-us/vendors",
  },
};

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold tracking-widest uppercase mb-3"
      style={{ color: "#D4A827", letterSpacing: "0.25em" }}
    >
      {children}
    </p>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
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

function BoothTable({
  sizes,
  accentColor,
}: {
  sizes: { label: string; price: number }[];
  accentColor: string;
}) {
  return (
    <div style={{ border: "1px solid #E8DFC8" }}>
      <div className="grid" style={{ gridTemplateColumns: "1fr auto" }}>
        <div
          className="px-4 py-2.5 border-b text-xs font-bold tracking-widest uppercase"
          style={{
            borderColor: "#E8DFC8",
            color: "#8B7355",
            backgroundColor: "#F5EDD4",
            letterSpacing: "0.12em",
          }}
        >
          Booth Size
        </div>
        <div
          className="px-4 py-2.5 border-b text-xs font-bold tracking-widest uppercase text-right"
          style={{
            borderColor: "#E8DFC8",
            color: "#8B7355",
            backgroundColor: "#F5EDD4",
            letterSpacing: "0.12em",
          }}
        >
          Price
        </div>
        {sizes.map((s, i) => (
          <>
            <div
              key={`${i}-size`}
              className="px-4 py-3 border-b text-sm font-medium"
              style={{
                borderColor: "#E8DFC8",
                color: "#2C4A2E",
                backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff",
              }}
            >
              {s.label}
            </div>
            <div
              key={`${i}-price`}
              className="px-4 py-3 border-b text-sm font-bold text-right"
              style={{
                borderColor: "#E8DFC8",
                color: accentColor,
                backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff",
              }}
            >
              ${s.price.toLocaleString()}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.wtsfair.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Partner With Us",
      item: "https://www.wtsfair.com/partner-with-us",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Vendors",
      item: "https://www.wtsfair.com/partner-with-us/vendors",
    },
  ],
};

export default function VendorsPage() {
  const YEAR = FAIR_CONFIG.year;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs"
            style={{ color: "rgba(245,237,212,0.65)" }}
          >
            <Link
              href="/partner-with-us"
              className="transition-colors hover:text-white"
              style={{ color: "rgba(245,237,212,0.65)" }}
            >
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
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            {YEAR} Vendor Opportunities
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold italic leading-tight mb-5"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5EDD4",
            }}
          >
            Vendor Spaces
          </h1>
          <p
            className="text-base leading-relaxed max-w-2xl mb-8"
            style={{ color: "#C5D9C6" }}
          >
            The {YEAR} West Tennessee State Fair has two vendor programs. Review
            both below and apply to the one that fits you.
          </p>

          {/* ── Quick-pick cards ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl">
            {/* Commercial */}
            <a
              href="#commercial-vendors"
              className="group flex items-start gap-4 p-5 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "rgba(212,168,39,0.12)",
                border: "1px solid rgba(212,168,39,0.35)",
              }}
              aria-label="Go to Commercial Vendors section"
            >
              <div
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ backgroundColor: "#D4A827" }}
                aria-hidden="true"
              >
                {/* Shopping bag icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#1A1A1A"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-sm font-bold mb-1"
                  style={{ color: "#F5EDD4" }}
                >
                  Commercial Vendors
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#C5D9C6" }}>
                  Retail · Crafts · Merchandise · Services · Organizations
                </p>
                <p
                  className="text-xs font-bold mt-2 group-hover:underline"
                  style={{ color: "#D4A827" }}
                >
                  Apply online →
                </p>
              </div>
            </a>

            {/* Food */}
            <a
              href="#food-vendors"
              className="group flex items-start gap-4 p-5 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "rgba(139,115,85,0.15)",
                border: "1px solid rgba(139,115,85,0.35)",
              }}
              aria-label="Go to Food Vendors section"
            >
              <div
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ backgroundColor: "#8B7355" }}
                aria-hidden="true"
              >
                {/* Utensils icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#F5EDD4"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0L3 18m0-13.5h18"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-sm font-bold mb-1"
                  style={{ color: "#F5EDD4" }}
                >
                  Food Vendors
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#C5D9C6" }}>
                  Food · Drinks · Concessions · Cooking vendors
                </p>
                <p
                  className="text-xs font-bold mt-2 group-hover:underline"
                  style={{ color: "#C8B98A" }}
                >
                  Contact coordinators →
                </p>
              </div>
            </a>
          </div>

          {/* Jump links */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Booth Pricing", href: "#booth-pricing" },
              { label: "Fees & Requirements", href: "#fees" },
              { label: "Apply Now", href: "#vendor-form" },
              { label: "Food Vendors", href: "#food-vendors" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "rgba(212,168,39,0.15)",
                  color: "#D4A827",
                  border: "1px solid rgba(212,168,39,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  SECTION 1 — COMMERCIAL VENDORS                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        id="commercial-vendors"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="commercial-vendors-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="mb-10">
            <SectionLabel>{YEAR} Vendor Application</SectionLabel>
            <SectionHeading id="commercial-vendors-heading">
              Commercial Vendors
            </SectionHeading>
            <p
              className="text-sm leading-relaxed max-w-2xl mb-6"
              style={{ color: "#5C4A32" }}
            >
              This application is for all <strong>non-food vendors</strong> — retail
              businesses, merchandise sellers, handmade craft vendors, organizations,
              informational booths, services, and promotional exhibitors. If you sell
              food or operate a concession, see{" "}
              <a
                href="#food-vendors"
                className="font-bold underline hover:opacity-80"
                style={{ color: "#2C4A2E" }}
              >
                Food Vendors
              </a>{" "}
              below.
            </p>

            {/* Who this is for */}
            <div
              className="inline-flex flex-wrap gap-2"
              aria-label="This application is for"
            >
              {[
                "Retail",
                "Merchandise",
                "Handmade Crafts",
                "Organizations",
                "Informational Booths",
                "Services",
                "Promotional Vendors",
                "Non-food Exhibitors",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: "#2C4A2E",
                    color: "#D4A827",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Booth Pricing ───────────────────────────────────── */}
          <div id="booth-pricing" className="mb-14 scroll-mt-6">
            <div className="mb-6">
              <SectionLabel>Booth Pricing</SectionLabel>
              <h3
                className="text-2xl font-bold italic"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Commercial Vendor Booth Sizes
              </h3>
            </div>

            <div className="space-y-10">
              {COMMERCIAL_VENDOR_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="relative"
                  style={{
                    backgroundColor: "#FDFAF3",
                    border: "1px solid #E8DFC8",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 bottom-0 w-1"
                    style={{ backgroundColor: cat.accentColor }}
                    aria-hidden="true"
                  />
                  <div className="pl-6 pr-6 pt-6 pb-6 sm:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                      <div>
                        <p
                          className="text-xs font-bold tracking-widest uppercase mb-1"
                          style={{
                            color: cat.accentColor,
                            letterSpacing: "0.18em",
                          }}
                        >
                          {cat.location === "inside"
                            ? "Inside"
                            : cat.location === "outside"
                            ? "Outside"
                            : "Inside or Outside"}{" "}
                          · {cat.cookingAllowed ? "Cooking Allowed" : "No Cooking"}
                        </p>
                        <h4
                          className="text-xl font-bold italic"
                          style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            color: "#2C4A2E",
                          }}
                        >
                          {cat.name}
                        </h4>
                      </div>
                      {cat.requiresCleanupDeposit && (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: "#F5EDD4",
                            border: "1px solid #E8DFC8",
                            color: "#8B7355",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                            />
                          </svg>
                          Refundable Cleanup Deposit Required
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm leading-relaxed mb-5"
                      style={{ color: "#5C4A32" }}
                    >
                      {cat.description}
                    </p>
                    <BoothTable
                      sizes={cat.boothSizes.map((s) => ({
                        label: s.label,
                        price: s.price,
                      }))}
                      accentColor={cat.accentColor}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Fees & Requirements ─────────────────────────────── */}
          <div id="fees" className="mb-14 scroll-mt-6">
            <div className="mb-6">
              <SectionLabel>Fees &amp; Requirements</SectionLabel>
              <h3
                className="text-2xl font-bold italic"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Additional Charges
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Insurance */}
              <div
                className="p-6"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "#2C4A2E" }}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#D4A827"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </div>
                  <h4
                    className="text-base font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#2C4A2E",
                    }}
                  >
                    Insurance
                  </h4>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "#5C4A32" }}
                >
                  An insurance certificate naming the West Tennessee State Fair as
                  Additional Insured is required of all vendors.
                </p>
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
                  >
                    <span className="text-sm" style={{ color: "#5C4A32" }}>
                      Vendor provides insurance binder
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>
                      $0
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
                  >
                    <span className="text-sm" style={{ color: "#5C4A32" }}>
                      No binder provided — coverage through fair
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#8B2E2E" }}>
                      +${VENDOR_FEES.insuranceWithoutBinder}
                    </span>
                  </div>
                </div>
              </div>

              {/* Electrical */}
              <div
                className="p-6"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "#2C4A2E" }}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#D4A827"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                      />
                    </svg>
                  </div>
                  <h4
                    className="text-base font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#2C4A2E",
                    }}
                  >
                    Electrical Hookup
                  </h4>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "#5C4A32" }}
                >
                  Electrical hookup fee is based on amperage required. Vendors must
                  provide a 50-foot electrical cord.
                </p>
                <div className="space-y-2">
                  {[
                    { label: "No electricity", price: VENDOR_FEES.electrical["none"] },
                    { label: "20 Amp hookup", price: VENDOR_FEES.electrical["20amp"] },
                    { label: "30 Amp hookup", price: VENDOR_FEES.electrical["30amp"] },
                    { label: "50 Amp hookup", price: VENDOR_FEES.electrical["50amp"] },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2.5"
                      style={{
                        backgroundColor: i % 2 === 0 ? "#F5EDD4" : "#FDFAF3",
                        border: "1px solid #E8DFC8",
                      }}
                    >
                      <span className="text-sm" style={{ color: "#5C4A32" }}>
                        {row.label}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: row.price === 0 ? "#8B7355" : "#2C4A2E" }}
                      >
                        {row.price === 0 ? "$0" : `$${row.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 50-ft Cord */}
              <div
                className="p-6"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "#2C4A2E" }}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#D4A827"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      />
                    </svg>
                  </div>
                  <h4
                    className="text-base font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#2C4A2E",
                    }}
                  >
                    50-Foot Electrical Cord
                  </h4>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "#5C4A32" }}
                >
                  Vendors must provide a qualifying 50-foot electrical cord for hookup.
                </p>
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
                  >
                    <span className="text-sm" style={{ color: "#5C4A32" }}>
                      Vendor provides 50-ft cord
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>
                      $0
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
                  >
                    <span className="text-sm" style={{ color: "#5C4A32" }}>
                      Cord not provided
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#8B2E2E" }}>
                      +${VENDOR_FEES.cordNotProvided}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cleanup deposit */}
              <div
                className="p-6"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "#2C4A2E" }}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#D4A827"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                      />
                    </svg>
                  </div>
                  <h4
                    className="text-base font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#2C4A2E",
                    }}
                  >
                    Refundable Cleanup Deposit
                  </h4>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "#5C4A32" }}
                >
                  Outside vendors are required to pay a refundable cleanup deposit. This
                  deposit will be fully returned when the vendor&apos;s assigned area is
                  completely clean after the fair.
                </p>
                <div
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
                >
                  <span className="text-sm" style={{ color: "#5C4A32" }}>
                    Outside vendors — refundable deposit
                  </span>
                  <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>
                    ${VENDOR_FEES.cleanupDeposit}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment deadline */}
            <div
              className="mt-6 p-5 flex flex-col sm:flex-row sm:items-center gap-3"
              style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#D4A827"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2C4A2E" }}>
                  Payment Deadline: {VENDOR_PAYMENT_DEADLINE.label}
                </p>
                {!VENDOR_PAYMENT_DEADLINE.confirmed && (
                  <p className="text-xs mt-0.5" style={{ color: "#8B7355" }}>
                    Final payment deadline is subject to confirmation for {YEAR}. The
                    specific deadline will be communicated upon approval.
                  </p>
                )}
              </div>
            </div>

            {/* Policies */}
            <div className="mt-6 p-6" style={{ backgroundColor: "#2C4A2E" }}>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#D4A827", letterSpacing: "0.2em" }}
              >
                Vendor Policies
              </p>
              <ul className="space-y-3">
                {VENDOR_POLICIES.map((policy, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: "#D4A827" }}
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed" style={{ color: "#C5D9C6" }}>
                      {policy}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Commercial Vendor Application Form ──────────────── */}
          <div id="vendor-form" className="scroll-mt-6">
            <div className="mb-8">
              <SectionLabel>Commercial Vendor Application</SectionLabel>
              <SectionHeading id="vendor-form-heading">
                Apply as a Commercial Vendor
              </SectionHeading>
              <p
                className="text-sm leading-relaxed max-w-xl"
                style={{ color: "#5C4A32" }}
              >
                This application is for <strong>non-food vendors only</strong> —
                retail, merchandise, crafts, organizations, informational booths,
                services, and promotional exhibitors. Food vendors should contact the
                Food Vendor Coordinators{" "}
                <a
                  href="#food-vendors"
                  className="font-bold underline hover:opacity-80"
                  style={{ color: "#2C4A2E" }}
                >
                  below
                </a>
                . The interactive cost estimator will update automatically as you make
                your selections. Submission of this form is an application — it does
                not guarantee acceptance or placement.
              </p>
            </div>
            <VendorForm />
          </div>

          {/* ── What Happens Next? ──────────────────────────────── */}
          <div
            className="mt-14 p-7 sm:p-9"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.2em" }}
            >
              Application Process
            </p>
            <h2
              className="text-2xl font-bold italic mb-8"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#2C4A2E",
              }}
            >
              What Happens Next?
            </h2>
            <ol
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
              aria-label="Commercial vendor application process steps"
            >
              {[
                {
                  step: 1,
                  title: "Submit Your Application",
                  body: "Complete and submit the commercial vendor application form above, including your booth preferences and product information.",
                },
                {
                  step: 2,
                  title: "Application Review",
                  body: "The fair team reviews your application, product type, booth preferences, and available space.",
                },
                {
                  step: 3,
                  title: "We'll Contact You",
                  body: "A fair representative will reach out to discuss your application and answer any questions.",
                },
                {
                  step: 4,
                  title: "Confirmation & Next Steps",
                  body: "Once accepted, you will receive confirmation along with payment instructions, booth assignment details, and policies.",
                },
              ].map((item) => (
                <li key={item.step} className="flex flex-col gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
                    aria-hidden="true"
                  >
                    {item.step}
                  </div>
                  <p className="text-sm font-bold" style={{ color: "#2C4A2E" }}>
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  SECTION 2 — FOOD VENDORS                                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        id="food-vendors"
        className="py-16 md:py-20 scroll-mt-6"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="food-vendors-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <SectionLabel>Food Vendor Information</SectionLabel>
            <SectionHeading id="food-vendors-heading">Food Vendors</SectionHeading>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#5C4A32" }}>
              Food vendor spaces are managed separately from commercial vendor booths.
            </p>
          </div>

          {/* Food vendor info card */}
          <div
            className="relative overflow-hidden"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            {/* accent bar */}
            <div
              className="absolute top-0 left-0 bottom-0 w-1"
              style={{ backgroundColor: "#8B7355" }}
              aria-hidden="true"
            />

            <div className="pl-8 pr-6 pt-8 pb-8 sm:pl-10">
              {/* Icon + heading row */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "#8B7355" }}
                  aria-hidden="true"
                >
                  {/* Utensils / food stand icon */}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#F5EDD4"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0L3 18m0-13.5h18"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-1"
                    style={{ color: "#8B7355", letterSpacing: "0.18em" }}
                  >
                    Separate Program
                  </p>
                  <p
                    className="text-xl font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#2C4A2E",
                    }}
                  >
                    Food Vendor Spaces
                  </p>
                </div>
              </div>

              {/* Highlighted info box */}
              <div
                className="p-5 mb-6 text-sm leading-relaxed"
                style={{
                  backgroundColor: "#F5EDD4",
                  border: "1px solid #E8DFC8",
                  color: "#5C4A32",
                }}
              >
                <p className="mb-3">
                  Food vendors follow a <strong>separate approval process</strong> from
                  commercial vendors. Food vendor space availability, pricing, utility
                  requirements, and placement are handled directly by the Fair Board&apos;s
                  Food Vendor Coordinators.
                </p>
                <p>
                  If you are interested in becoming a food vendor for the {YEAR} West
                  Tennessee State Fair, please contact the Food Vendor Coordinators
                  directly for the latest availability and application information.
                </p>
              </div>

              {/* Contact info — placeholder or confirmed */}
              <div>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-4"
                  style={{ color: "#8B7355", letterSpacing: "0.2em" }}
                >
                  Contact Food Vendor Coordinators
                </p>

                {FOOD_VENDOR_CONTACT.confirmed ? (
                  /* ── Confirmed contact info ── */
                  <div className="flex flex-col sm:flex-row gap-4">
                    {FOOD_VENDOR_CONTACT.name && (
                      <div
                        className="flex items-center gap-3 p-4"
                        style={{
                          backgroundColor: "#FDFAF3",
                          border: "1px solid #E8DFC8",
                        }}
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#8B7355"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>
                          {FOOD_VENDOR_CONTACT.name}
                        </span>
                      </div>
                    )}
                    {FOOD_VENDOR_CONTACT.email && (
                      <a
                        href={`mailto:${FOOD_VENDOR_CONTACT.email}?subject=Food%20Vendor%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
                        className="flex items-center gap-3 p-4 transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: "#FDFAF3",
                          border: "1px solid #E8DFC8",
                        }}
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#8B7355"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>
                          {FOOD_VENDOR_CONTACT.email}
                        </span>
                      </a>
                    )}
                  </div>
                ) : (
                  /* ── Placeholder ── */
                  <div
                    className="p-5"
                    style={{
                      backgroundColor: "#FFF8E8",
                      border: "1px dashed #D4A827",
                    }}
                    role="note"
                    aria-label="Pending contact information"
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#D4A827"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                      <div>
                        <p
                          className="text-sm font-bold mb-1"
                          style={{ color: "#2C4A2E" }}
                        >
                          Contact Information Coming Soon
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                          Food Vendor Coordinator contact details are being finalized by
                          the Fair Board. In the meantime, please reach out to the general
                          fair contact and mention your interest in a food vendor space.
                        </p>
                        <a
                          href={`mailto:${FAIR_CONFIG.contact.email}?subject=Food%20Vendor%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
                          className="inline-flex items-center gap-2 mt-3 text-sm font-bold transition-opacity hover:opacity-80"
                          style={{ color: "#2C4A2E" }}
                        >
                          <span>✉</span>
                          {FAIR_CONFIG.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Not sure which category? helper */}
          <div
            className="mt-6 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{ backgroundColor: "#2C4A2E" }}
          >
            <div className="flex-1">
              <p className="text-sm font-bold mb-1" style={{ color: "#F5EDD4" }}>
                Not sure which program is right for you?
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#C5D9C6" }}>
                If you sell any prepared food, packaged food, beverages, or operate any
                kind of concession — you are a food vendor. For everything else
                (products, crafts, merchandise, services), use the commercial
                application above.
              </p>
            </div>
            <a
              href="#vendor-form"
              className="flex-shrink-0 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "#D4A827",
                color: "#1A1A1A",
                letterSpacing: "0.1em",
              }}
            >
              Commercial Application ↑
            </a>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Other ways to partner ──────────────────────────────── */}
      <section
        className="py-14"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="other-ways-vendor-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-6"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            Other Ways to Partner
          </p>
          <h2
            id="other-ways-vendor-heading"
            className="text-2xl font-bold italic mb-8"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#2C4A2E",
            }}
          >
            More Ways to Get Involved
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link
              href="/partner-with-us/sponsors"
              className="group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
            >
              <div
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "#2C4A2E" }}
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#D4A827"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-1"
                  style={{ color: "#D4A827", letterSpacing: "0.15em" }}
                >
                  Sponsorship
                </p>
                <p
                  className="text-lg font-bold italic mb-2"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#2C4A2E",
                  }}
                >
                  Become a Sponsor
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  Packages from $250 to $10,000+ with naming rights, signage, and
                  social media exposure.
                </p>
              </div>
            </Link>

            <Link
              href="/partner-with-us/volunteer"
              className="group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
            >
              <div
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#5C4A32"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-1"
                  style={{ color: "#5C4A32", letterSpacing: "0.15em" }}
                >
                  Community
                </p>
                <p
                  className="text-lg font-bold italic mb-2"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#2C4A2E",
                  }}
                >
                  Volunteer at the Fair
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  Give your time to help make the fair happen. No cost — just your hours.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section
        className="py-14"
        style={{ backgroundColor: "#2C4A2E" }}
        aria-labelledby="vendor-contact-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            Questions?
          </p>
          <h2
            id="vendor-contact-heading"
            className="text-3xl font-bold italic mb-4"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5EDD4",
            }}
          >
            Get in Touch
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "#C5D9C6" }}
          >
            Questions about commercial vendor spaces, booth sizing, or the application
            process? Reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={`mailto:${FAIR_CONFIG.contact.email}?subject=Vendor%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{ color: "#F5EDD4" }}
            >
              <span style={{ color: "#D4A827" }}>✉</span>
              <span className="text-sm">{FAIR_CONFIG.contact.email}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
