import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Livestock Shows — West Tennessee State Fair",
  description:
    "Enter the West Tennessee State Fair livestock shows — Market Lamb, Breeding Sheep, Meat Goat, and Cattle. All entries through Showman. Youth exhibitors welcome. Henderson, TN.",
};

// ─────────────────────────────────────────────────────────────────────────────
// SHOWMAN REGISTRATION LINK
// All livestock entries go through Showman — update if URL changes.
// ─────────────────────────────────────────────────────────────────────────────
const SHOWMAN_URL =
  "https://showman.app/shows#/west-tennessee-state-fair-a98a/enter";

function IconExternal() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function LivestockPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        overline="West Tennessee State Fair"
        headline="Livestock"
        headlineAccent="Shows"
        subtext="Market lambs, breeding sheep, meat goats, and cattle — judged by certified professionals. Youth exhibitors welcome. All entries through Showman."
        imageSrc="/images/livestock-hero.webp"
        accentColor="#D4A827"
      />

      {/* ── Intro strip ──────────────────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { label: "Shows", value: "4 Livestock Shows" },
              { label: "Registration", value: "Online via Showman" },
              { label: "Exhibitors", value: "Youth (12th grade & below)" },
              { label: "Questions", value: "wtsfair@gmail.com" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-4 text-center">
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827", letterSpacing: "0.18em" }}>
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

      {/* ── 2026 Schedule Coming Soon ─────────────────────────── */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="livestock-schedule-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            2026 Livestock Shows
          </p>
          <h2
            id="livestock-schedule-heading"
            className="text-3xl sm:text-4xl font-bold italic leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            Schedule Being Finalized
          </h2>
          <div
            className="w-10 h-0.5 mx-auto mb-8"
            style={{ backgroundColor: "#D4A827" }}
            aria-hidden="true"
          />
          <p className="text-base leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
            The 2026 livestock show schedule is currently being finalized. Dates, times,
            entry fees, and class information for the Meat Goat, Breeding Sheep, Cattle,
            and Market Lamb shows will be posted here as soon as they are confirmed.
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#8B7355" }}>
            Questions in the meantime? Email us at{" "}
            <a
              href="mailto:wtsfair@gmail.com"
              className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: "#2C4A2E" }}
            >
              wtsfair@gmail.com
            </a>
            .
          </p>

          {/* Shows we expect */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {[
              { title: "Meat Goat Show",                        color: "#2C4A2E" },
              { title: "Breeding Sheep Show",                   color: "#5C4A32" },
              { title: "Cattle Show",                           color: "#8B2E2E" },
              { title: "Market Lamb Show & Commercial Ewe Show", color: "#2C4A2E" },
            ].map((show) => (
              <div
                key={show.title}
                className="flex flex-col items-center p-4 text-center"
                style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}
              >
                <div className="h-0.5 w-8 mb-3" style={{ backgroundColor: show.color }} aria-hidden="true" />
                <p
                  className="text-xs font-bold leading-snug"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: show.color }}
                >
                  {show.title}
                </p>
                <p className="text-xs mt-2" style={{ color: "#8B7355" }}>
                  Date TBD
                </p>
              </div>
            ))}
          </div>

          {/* Showman CTA */}
          <div
            className="p-8 flex flex-col sm:flex-row items-center gap-6 justify-between text-left"
            style={{ backgroundColor: "#2C4A2E" }}
          >
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#D4A827", letterSpacing: "0.18em" }}>
                Registration
              </p>
              <p className="text-base font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
                All entries go through Showman
              </p>
              <p className="text-sm" style={{ color: "#A8BFA9" }}>
                Registration will open once show dates are confirmed.
              </p>
            </div>
            <a
              href={SHOWMAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
            >
              Visit Showman
              <IconExternal />
            </a>
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
              Questions About Livestock?
            </p>
            <p
              className="text-xl font-bold italic mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
            >
              We&apos;re here to help.
            </p>
            <p className="text-sm" style={{ color: "#A8BFA9" }}>
              Livestock inquiries: wtsfair@gmail.com
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={SHOWMAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
            >
              Visit Showman
              <IconExternal />
            </a>
            <a
              href="mailto:wtsfair@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase border transition-all hover:opacity-80 active:scale-95"
              style={{ borderColor: "rgba(245,237,212,0.35)", color: "#F5EDD4", letterSpacing: "0.1em" }}
            >
              Email the Livestock Team
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
