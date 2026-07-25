import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { DEPARTMENT_META, getGuidesByDepartment } from "@/lib/exhibit-guides";
import type { ExhibitGuide, DepartmentMeta } from "@/lib/exhibit-guides";

export const metadata: Metadata = {
  title: "Exhibits & Crafts — West Tennessee State Fair",
  description:
    "Enter your best work in the West Tennessee State Fair exhibits — arts & crafts, photography, needlework, baked goods, vegetables, and more. Download exhibit guides and register online.",
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION STATUS
// Set to true once Supabase is configured and registration is open.
// When true → "Enter Exhibits Online" links to /exhibits/register.
// When false → disabled "Registration Opens Soon" button is shown.
// ─────────────────────────────────────────────────────────────────────────────
const REGISTRATION_OPEN = false;

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ENTER — STEPS
// ─────────────────────────────────────────────────────────────────────────────
const HOW_TO_ENTER_STEPS = [
  {
    number: "01",
    title: "Find Your Exhibit Guide",
    description:
      "Select the category below that matches your exhibit. Open the guide for that department.",
  },
  {
    number: "02",
    title: "Review Classes, Lots & Rules",
    description:
      "Read the categories, classes, lots, and instructions for your department. Department-specific rules are near the end of each guide.",
  },
  {
    number: "03",
    title: "Complete Online Registration",
    description:
      "Use the online registration form to submit your entries. Enter the Department, Division, Class, and Lot exactly as shown in the guide. One form covers all your entries.",
  },
  {
    number: "04",
    title: "Receive Your Confirmation",
    description:
      "You will receive a confirmation email with a website submission reference number. This is a tracking number only — not your official exhibitor ID. Your official exhibitor ID is assigned separately after your entry is processed through the fair's exhibit management program.",
  },
  {
    number: "05",
    title: "Bring Exhibits During Check-In",
    description:
      "Bring your physical exhibits to the fairgrounds during the check-in window for your department. Check-in dates will be announced when confirmed.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AUDIENCE BADGE LABELS
// ─────────────────────────────────────────────────────────────────────────────
const AUDIENCE_LABEL: Record<string, string> = {
  adult: "Adult",
  youth: "Youth",
  all: "All Ages",
};

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function GuideCard({ guide, accentColor }: { guide: ExhibitGuide; accentColor: string }) {
  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}
    >
      {/* Colored top bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />

      <div className="flex flex-col flex-1 p-5">
        {/* Icon + badges row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* PDF icon */}
          <div
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#F5EDD4" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>

          {/* Audience badge */}
          <span
            className="flex-shrink-0 px-2 py-0.5 text-xs font-bold tracking-wider uppercase"
            style={{ backgroundColor: "#F5EDD4", color: "#5C4A32", border: "1px solid #E8DFC8" }}
          >
            {AUDIENCE_LABEL[guide.audience] ?? guide.audience}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold mb-2 leading-snug"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
        >
          {guide.title}
        </h3>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "#5C4A32" }}>
          {guide.description}
        </p>

        {/* Includes note */}
        <p className="text-xs mb-4 flex items-start gap-1" style={{ color: "#8B7355" }}>
          <svg
            className="w-3 h-3 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          Includes categories, classes, lots, instructions, and department-specific rules.
        </p>

        {/* Action buttons */}
        {guide.active ? (
          <div className="flex gap-2">
            <a
              href={guide.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold tracking-wider uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor, color: "#F5EDD4", letterSpacing: "0.07em" }}
              aria-label={`View ${guide.title} guide — opens in new tab`}
            >
              View Guide
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <a
              href={guide.fileUrl}
              download={guide.fileName}
              className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-80"
              style={{ borderColor: accentColor, color: accentColor }}
              aria-label={`Download ${guide.title} guide`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              PDF
            </a>
          </div>
        ) : (
          /* Coming Soon state */
          <div
            className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 text-xs font-bold tracking-wider uppercase select-none"
            style={{ backgroundColor: "#F5EDD4", color: "#B0A080", letterSpacing: "0.07em" }}
            role="status"
            aria-label={`${guide.title} guide coming soon`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Guide Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function DepartmentSection({ meta }: { meta: DepartmentMeta }) {
  const guides = getGuidesByDepartment(meta.id);
  if (guides.length === 0) return null;

  return (
    <div>
      {/* Department header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-1 h-8 flex-shrink-0" style={{ backgroundColor: meta.accentColor }} aria-hidden="true" />
        <div>
          <h3
            className="text-xl font-bold italic leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            {meta.label}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#8B7355" }}>
            {meta.tagline}
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} accentColor={meta.accentColor} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ExhibitsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        overline="Show Your Best Work"
        headline="Exhibits &"
        headlineAccent="Crafts"
        subtext="You don't have to be a professional — you just have to love what you do. If you made it, grew it, or created it, there's a class for it at the West Tennessee State Fair."
        imageSrc="/images/exhibits-hero.webp"
        photoHint="Table of ribbon-winning exhibits — baked goods, quilts, crafts, or vegetables on display. Warm natural light, rustic fair hall environment."
        photoLabel="Exhibits Hall"
        accentColor="#D4A827"
      />

      {/* ── Intro strip ──────────────────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { label: "Who Can Enter", value: "Youth & Adult Divisions" },
              { label: "Skill Level", value: "All Levels Welcome" },
              { label: "Questions", value: "wtsfair@gmail.com" },
            ].map((item) => (
              <div key={item.label} className="px-6 py-4 text-center">
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827" }}>
                  {item.label}
                </p>
                <p className="text-sm font-semibold" style={{ color: "#F5EDD4" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Enter Your Exhibits Online ────────────────────────── */}
      <section
        className="py-12"
        style={{ backgroundColor: "#FDFAF3", borderBottom: "1px solid #E8DFC8" }}
        aria-labelledby="register-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 justify-between"
            style={{ backgroundColor: "#2C4A2E" }}
          >
            <div className="flex-1">
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#D4A827", letterSpacing: "0.2em" }}
              >
                New for 2026
              </p>
              <h2
                id="register-heading"
                className="text-2xl sm:text-3xl font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
              >
                Enter Your Exhibits Online
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#A8BFA9" }}>
                Submit your exhibit entries from home — no paper forms required. You can register
                multiple exhibits in a single submission and receive an instant confirmation email.
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(168,191,169,0.8)" }}>
                <strong style={{ color: "#A8BFA9" }}>Before you register:</strong> Open the exhibit
                guide for your category below. You will need the Department, Division, Class, and
                Lot exactly as printed in the guide.
              </p>
            </div>

            <div className="flex flex-col items-stretch sm:items-center gap-3 flex-shrink-0 w-full sm:w-auto">
              {REGISTRATION_OPEN ? (
                <>
                  <Link
                    href="/exhibits/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 text-center"
                    style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
                  >
                    Enter Exhibits Online
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <p className="text-xs text-center" style={{ color: "rgba(168,191,169,0.6)" }}>
                    Review exhibit guides below before starting
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold tracking-wider uppercase select-none text-center"
                    style={{
                      backgroundColor: "rgba(212,168,39,0.2)",
                      color: "rgba(212,168,39,0.45)",
                      letterSpacing: "0.08em",
                    }}
                    role="status"
                    aria-label="Registration not yet open"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Registration Opens Soon
                  </div>
                  <p className="text-xs text-center" style={{ color: "rgba(168,191,169,0.6)" }}>
                    Online registration will open before the fair
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Important Notice — Rules Vary by Department ────────── */}
      <section
        className="py-8"
        style={{ backgroundColor: "#F5EDD4", borderBottom: "1px solid #E8DFC8" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="flex gap-4 p-5"
            style={{
              backgroundColor: "#FEF9EC",
              border: "1px solid #D4A827",
              borderLeft: "4px solid #D4A827",
            }}
          >
            <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "#92400E", letterSpacing: "0.1em" }}>
                Important — Rules Vary by Department
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#78350F" }}>
                Each exhibit department has its own categories, classes, lots, instructions, and
                rules. Please review the complete guide for every department you plan to enter.
                Rules are included near the end of each department&apos;s guide.{" "}
                <strong>The guide PDF is the official source for all rules and class information.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exhibit Guides ────────────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="guides-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="mb-12">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              Start Here
            </p>
            <h2
              id="guides-heading"
              className="text-3xl sm:text-4xl font-bold italic mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
            >
              Exhibit Guides
            </h2>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#5C4A32" }}>
              Select the category that matches your exhibit. Each guide includes the available
              categories, classes, lots, instructions, and rules for that exhibit area. Review the
              guide for your department before completing online registration.
            </p>
          </div>

          {/* Department groups */}
          <div className="flex flex-col gap-14">
            {DEPARTMENT_META.map((meta) => (
              <DepartmentSection key={meta.id} meta={meta} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Enter ─────────────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="how-to-enter-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              The Process
            </p>
            <h2
              id="how-to-enter-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
            >
              How to Enter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {HOW_TO_ENTER_STEPS.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Connector line — lg screens only */}
                {i < HOW_TO_ENTER_STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-6 left-[calc(50%+28px)] right-0 h-px z-0"
                    style={{ backgroundColor: "#E8DFC8" }}
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-4 text-sm font-bold"
                    style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-sm font-bold mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#5C4A32" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reference number disclaimer */}
          <div
            className="mt-12 p-5 flex gap-4"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#8B7355" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#5C4A32" }}>
                About Your Submission Reference
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                The reference number in your confirmation email (e.g.{" "}
                <span className="font-mono" style={{ color: "#2C4A2E" }}>
                  WTSF-ONLINE-2026-0001
                </span>
                ) is a website-only tracking number — it is not your official exhibitor ID. Your
                official exhibitor ID is assigned by the fair after your entry is processed through
                the fair&apos;s exhibit management program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#2C4A2E" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "#D4A827" }}
            >
              Questions About Exhibits?
            </p>
            <p
              className="text-xl font-bold italic mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
            >
              We&apos;re here to help.
            </p>
            <p className="text-sm" style={{ color: "#A8BFA9" }}>
              Reach the exhibits team directly at wtsfair@gmail.com
            </p>
          </div>
          <a
            href="mailto:wtsfair@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 flex-shrink-0"
            style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
          >
            Email the Exhibits Team
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
