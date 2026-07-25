import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Pageants — Our Tradition",
  description:
    "Compete in the West Tennessee State Fair pageants — divisions open for ages 0 through 20. Email wtsfpageant@outlook.com to enter. Miss Fairest, Baby Show, Little Miss, and more.",
};

// ─────────────────────────────────────────────────────────────
// CONTENT: Update arrival/check-in times and dates for 2026.
// All times marked [TBC] need confirming before the site goes live.
// Contact email: wtsfpageant@outlook.com
// ─────────────────────────────────────────────────────────────

const divisions = [
  {
    id: "0-11m",
    ageRange: "0 – 11 Months",
    title: "Baby Class",
    arrival: "8:00 AM",
    checkIn: "8:30 AM",
    note: "[TBC — Confirm for 2026]",
    color: "#D4A827",
  },
  {
    id: "12-23m",
    ageRange: "12 – 23 Months",
    title: "Tiny Tot",
    arrival: "8:30 AM",
    checkIn: "9:00 AM",
    note: "[TBC — Confirm for 2026]",
    color: "#D4A827",
  },
  {
    id: "2-3y",
    ageRange: "2 – 3 Years",
    title: "Toddler Class",
    arrival: "9:00 AM",
    checkIn: "9:30 AM",
    note: "[TBC — Confirm for 2026]",
    color: "#2C4A2E",
  },
  {
    id: "4-5y",
    ageRange: "4 – 5 Years",
    title: "Little Miss/Mister",
    arrival: "9:30 AM",
    checkIn: "10:00 AM",
    note: "[TBC — Confirm for 2026]",
    color: "#2C4A2E",
  },
  {
    id: "6-8y",
    ageRange: "6 – 8 Years",
    title: "Young Miss/Mister",
    arrival: "10:00 AM",
    checkIn: "10:30 AM",
    note: "[TBC — Confirm for 2026]",
    color: "#8B2E2E",
  },
  {
    id: "9-11y",
    ageRange: "9 – 11 Years",
    title: "Junior Class",
    arrival: "10:30 AM",
    checkIn: "11:00 AM",
    note: "[TBC — Confirm for 2026]",
    color: "#8B2E2E",
  },
  {
    id: "12-14y",
    ageRange: "12 – 14 Years",
    title: "Preteen Miss",
    arrival: "11:00 AM",
    checkIn: "11:30 AM",
    note: "[TBC — Confirm for 2026]",
    color: "#2C4A2E",
  },
  {
    id: "15-16y",
    ageRange: "15 – 16 Years",
    title: "Teen Miss",
    arrival: "11:30 AM",
    checkIn: "12:00 PM",
    note: "[TBC — Confirm for 2026]",
    color: "#2C4A2E",
  },
  {
    id: "17-20y",
    ageRange: "17 – 20 Years",
    title: "Miss Fairest",
    arrival: "12:00 PM",
    checkIn: "12:30 PM",
    note: "[TBC — Confirm for 2026] · Interview judging",
    color: "#D4A827",
    featured: true,
  },
];

const entrySteps = [
  {
    number: "01",
    title: "Email Your Entry",
    description:
      "Send your name, age, division, and contact information to wtsfpageant@outlook.com. We'll confirm your spot and send next steps.",
    detail: "wtsfpageant@outlook.com",
    color: "#2C4A2E",
  },
  {
    number: "02",
    title: "Receive Your Invoice",
    description:
      "After your entry is confirmed, you'll receive an invoice with your entry fee and all the details you need to prepare.",
    detail: "Emailed directly to you",
    color: "#D4A827",
  },
  {
    number: "03",
    title: "Pay via Payment Link",
    description:
      "Pay your entry fee securely using the payment link included in your invoice. Your entry is complete once payment is received.",
    detail: "Secure online payment",
    color: "#8B2E2E",
  },
];

export default function PageantsPage() {
  return (
    <>
      <PageHero
        overline="Our Tradition"
        headline="Pageants &"
        headlineAccent="Competitions"
        subtext="From the tiniest contestants to our Miss Fairest, pageants at the West Tennessee State Fair are a tradition that has crowned champions for generations."
        imageSrc="/images/pageants-hero-landscape.webp"
        photoHint="Contestant on stage at crowning moment, OR fair queen wearing sash and crown, OR group of contestants in gowns. Warm stage lighting, community atmosphere."
        photoLabel="Pageants"
        accentColor="#D4A827"
        height="tall"
      />

      {/* ── Tradition intro ───────────────────────────────── */}
      <section
        style={{ backgroundColor: "#2C4A2E" }}
        className="py-14"
        aria-labelledby="tradition-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#D4A827", letterSpacing: "0.25em" }}
              >
                A Community Tradition
              </p>
              <h2
                id="tradition-heading"
                className="text-3xl sm:text-4xl font-bold italic leading-tight mb-5"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#F5EDD4",
                }}
              >
                171 Years of Crowning the Best of West Tennessee
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#C5D9C6" }}
              >
                Pageants have been a cornerstone of the West Tennessee State
                Fair since the beginning. Every year, contestants from across
                the region gather to compete — not just for a crown, but to be
                part of something bigger.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#A8BFA9" }}
              >
                Divisions are open from 0 months through 20 years old. Every
                contestant is welcomed, celebrated, and remembered. This is what
                "Back to Our Roots" looks like.
              </p>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Age Range", value: "0 – 20 Years" },
                { label: "Divisions", value: "9 Divisions" },
                { label: "Entry", value: "Email to Enter" },
                { label: "Payment", value: "Invoice & Link" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 text-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-2"
                    style={{ color: "#A8BFA9" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-lg font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#D4A827",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-width stage banner ────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/5", maxHeight: "280px" }}
      >
        <Image
          src="/images/pageants-contestants.webp"
          alt="Pageant contestants lined up on stage at the West Tennessee State Fair"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)" }}
          aria-hidden="true"
        />
      </div>

      {/* ── Division Schedule ─────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="divisions-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#D4A827", letterSpacing: "0.25em" }}
              >
                Age Groups & Timing
              </p>
              <h2
                id="divisions-heading"
                className="text-3xl sm:text-4xl font-bold italic"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Pageant Divisions
              </h2>
            </div>

            {/* TBC badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              Times shown are approximate — 2026 TBC
            </div>
          </div>

          {/* Division cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisions.map((div) => (
              <div
                key={div.id}
                className="relative p-5 flex flex-col"
                style={{
                  backgroundColor: div.featured ? "#2C4A2E" : "#FDFAF3",
                  border: div.featured ? "none" : "1px solid #E8DFC8",
                }}
              >
                {/* Top color bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: div.color }}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{
                        color: div.featured ? "#D4A827" : div.color,
                        letterSpacing: "0.15em",
                      }}
                    >
                      {div.ageRange}
                    </p>
                    <h3
                      className="text-lg font-bold italic leading-tight"
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        color: div.featured ? "#F5EDD4" : "#1A1A1A",
                      }}
                    >
                      {div.title}
                    </h3>
                  </div>

                  {/* Crown icon for Miss Fairest */}
                  {div.featured && (
                    <svg
                      className="w-6 h-6 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#D4A827"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                  )}
                </div>

                {/* Arrival / Check-in times */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <div>
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{
                        color: div.featured ? "rgba(168,191,169,0.8)" : "#8B7355",
                      }}
                    >
                      Arrival
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: div.featured ? "#F5EDD4" : "#2C4A2E" }}
                    >
                      {div.arrival}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{
                        color: div.featured ? "rgba(168,191,169,0.8)" : "#8B7355",
                      }}
                    >
                      Check-In
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: div.featured ? "#F5EDD4" : "#2C4A2E" }}
                    >
                      {div.checkIn}
                    </p>
                  </div>
                </div>

                {div.note && (
                  <p
                    className="text-xs mt-3 leading-snug"
                    style={{
                      color: div.featured ? "rgba(168,191,169,0.7)" : "#8B7355",
                    }}
                  >
                    {div.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs mt-5 leading-relaxed" style={{ color: "#8B7355" }}>
            * All times are approximate and subject to change. Confirmed arrival
            and check-in times will be provided with your entry confirmation
            email. Contact wtsfpageant@outlook.com with any scheduling questions.
          </p>
        </div>
      </section>

      {/* ── Miss Fairest ──────────────────────────────────── */}
      <section
        className="py-14"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="miss-fairest-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Miss Fairest photo */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4", maxHeight: "480px" }}
            >
              <Image
                src="/images/pageants-crowning.webp"
                alt="Crowning moment at the West Tennessee State Fair pageant"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
              {/* Gold corner accents */}
              <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "rgba(212,168,39,0.6)" }} aria-hidden="true" />
              <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "rgba(212,168,39,0.6)" }} aria-hidden="true" />
              <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "rgba(212,168,39,0.6)" }} aria-hidden="true" />
              <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "rgba(212,168,39,0.6)" }} aria-hidden="true" />
            </div>

            {/* Miss Fairest text */}
            <div className="flex flex-col justify-center">
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#D4A827", letterSpacing: "0.25em" }}
              >
                The Crown
              </p>
              <h2
                id="miss-fairest-heading"
                className="text-3xl sm:text-4xl font-bold italic leading-tight mb-5"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Competing for Miss Fairest
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#5C4A32" }}
              >
                Miss Fairest is the highest honor in our pageant program —
                open to contestants ages 17 to 20. The title is earned through
                poise, character, and an interview with a panel of judges.
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "#5C4A32" }}
              >
                The Miss Fairest interview is conducted separately from the
                stage competition. Contestants are evaluated on confidence,
                community values, and their vision for representing the West
                Tennessee State Fair.
              </p>

              {/* Interview detail box */}
              <div
                className="p-5"
                style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "#D4A827" }}
                >
                  Interview Process
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Private interview with a panel of judges",
                    "Questions focus on community, character, and goals",
                    "Interview results combined with stage competition score",
                    "Crown awarded during the official crowning ceremony",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                        style={{ backgroundColor: "#D4A827" }}
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Enter ─────────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="entry-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              Register to Compete
            </p>
            <h2
              id="entry-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#2C4A2E",
              }}
            >
              How to Enter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entrySteps.map((step) => (
              <div
                key={step.number}
                className="relative p-7 flex flex-col"
                style={{
                  backgroundColor: "#FDFAF3",
                  border: "1px solid #E8DFC8",
                }}
              >
                {/* Top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: step.color }}
                  aria-hidden="true"
                />

                <div
                  className="w-10 h-10 flex items-center justify-center mb-5 text-sm font-bold"
                  style={{ backgroundColor: step.color, color: "#F5EDD4" }}
                >
                  {step.number}
                </div>
                <h3
                  className="text-lg font-bold italic mb-3 leading-snug"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#2C4A2E",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed flex-1 mb-4"
                  style={{ color: "#5C4A32" }}
                >
                  {step.description}
                </p>
                <p
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: step.color, letterSpacing: "0.12em" }}
                >
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────── */}
      <section style={{ backgroundColor: "#2C4A2E" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "#D4A827" }}
              >
                Ready to Compete?
              </p>
              <p
                className="text-xl font-bold italic mb-1"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#F5EDD4",
                }}
              >
                Email us to get your entry started.
              </p>
              <p className="text-sm" style={{ color: "#A8BFA9" }}>
                Pageant inquiries: wtsfpageant@outlook.com
              </p>
            </div>
            <a
              href="mailto:wtsfpageant@outlook.com"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 flex-shrink-0"
              style={{
                backgroundColor: "#D4A827",
                color: "#1A1A1A",
                letterSpacing: "0.1em",
              }}
            >
              Email the Pageant Team
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
