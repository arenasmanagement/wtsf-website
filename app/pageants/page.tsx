import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import FaqAccordion, { type FaqItem } from "@/components/ui/FaqAccordion";
import StayUpdatedCallout from "@/components/updates/StayUpdatedCallout";

export const metadata: Metadata = {
  title: "Pageants â Miss Tennessee Preliminary & Traditional Fair Pageants",
  description:
    "Two pageant events at the 2026 West Tennessee State Fair: the Official Miss Tennessee Local Preliminary on September 19 and Traditional Fair Pageants on October 17. Seven traditional divisions for ages 0â13 years at Williams Auditorium in Henderson, Tennessee.",
  alternates: {
    canonical: "https://www.wtsfair.com/pageants",
  },
  openGraph: {
    url: "https://www.wtsfair.com/pageants",
  },
};

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// CONTENT GUIDE
//
// This page covers TWO separate pageant events:
//   1. Miss Tennessee Local Preliminary â September 19, 2026
//      Sanctioned event run in partnership with misstennessee.org
//      Apply at: https://www.misstennessee.org/compete
//
//   2. Traditional Fair Pageants â October 17, 2026
//      7 divisions (ages 0â13). Online registration at /pageants/register
//      Williams Auditorium, Henderson, Tennessee
//      Director: Hayley O'Neal Â· Co-Director: Lillian Snow
//
// TO ADD A FUTURE EVENT: append a new object to PAGEANT_EVENTS and add a
// corresponding section below following the same pattern as the existing two.
//
// SOURCE OF TRUTH for division names, ages, and times:
//   2026 Schedule of Events and sign-in sheets confirmed by Hayley O'Neal.
//   Do NOT update from old registration forms.
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

// ââ Event overview data (Sections 2 + 3) âââââââââââââââââââââââââââââââââââââ
const PAGEANT_EVENTS = [
  {
    id: "miss-tennessee",
    badge: "New for 2026",
    badgeColor: "#8B2E2E",
    title: "Official Miss Tennessee Local Preliminary",
    date: "September 19, 2026",
    description:
      "The West Tennessee State Fair is proud to host an Official Miss Tennessee Local Preliminary â a sanctioned qualifying event for the Miss Tennessee Organization. Compete for a title that carries you to the state stage.",
    highlights: [
      "Sanctioned Miss Tennessee qualifying event",
      "Open to eligible young women (see misstennessee.org for age/rules)",
      "Interview and on-stage competition",
      "Winner advances in the Miss Tennessee system",
    ],
    ctaLabel: "Apply at MissTennessee.org",
    ctaHref: "https://www.misstennessee.org/compete",
    accentColor: "#8B2E2E",
  },
  {
    id: "traditional",
    badge: "Annual Tradition",
    badgeColor: "#D4A827",
    title: "Traditional Fair Pageants",
    date: "October 17, 2026",
    description:
      "Our beloved tradition returns in 2026 with pageant opportunities for contestants ages 0â13 years across seven divisions. Registration opens soon â view the full schedule, divisions, and arrival times.",
    highlights: [
      "Seven divisions for ages 0â13 years",
      "Williams Auditorium Â· Henderson, Tennessee",
      "Confirmed arrival and competition times by division",
      "Online registration is now open at wtsfair.com/pageants/register",
    ],
    ctaLabel: "View Divisions & Register",
    ctaHref: "/pageants/register",
    accentColor: "#D4A827",
  },
] as const;

// ââ Traditional Fair division data (Section 4) ââââââââââââââââââââââââââââââââ
// Source of truth: 2026 Schedule of Events and sign-in sheets (Hayley O'Neal)
// DO NOT update from old registration forms- names, ages, and times are confirmed.
const TRADITIONAL_DIVISIONS = [
  {
    id: "baby-miss",
    ageRange: "0 â 11 Months",
    title: "Baby Miss",
    color: "#D4A827",
    arrivalTime: "9:30 AM",
    competitionTime: "10:00 AM",
  },
  {
    id: "tiny-miss",
    ageRange: "12 â 23 Months",
    title: "Tiny Miss",
    color: "#D4A827",
    arrivalTime: "10:00 AM",
    competitionTime: "10:30 AM",
  },
  {
    id: "toddler-miss",
    ageRange: "2 â 3 Years",
    title: "Toddler Miss",
    color: "#2C4A2E",
    arrivalTime: "10:30 AM",
    competitionTime: "11:00 AM",
  },
  {
    id: "little-miss",
    ageRange: "4 â 5 Years",
    title: "Little Miss",
    color: "#2C4A2E",
    arrivalTime: "11:00 AM",
    competitionTime: "11:30 AM",
  },
  {
    id: "young-miss",
    ageRange: "6 â 7 Years",
    title: "Young Miss",
    color: "#8B2E2E",
    arrivalTime: "12:30 PM",
    competitionTime: "1:00 PM",
  },
  {
    id: "petite-miss",
    ageRange: "8 â 10 Years",
    title: "Petite Miss",
    color: "#8B2E2E",
    arrivalTime: "1:00 PM",
    competitionTime: "1:30 PM",
  },
  {
    id: "junior-miss",
    ageRange: "11 â 13 Years",
    title: "Junior Miss",
    color: "#2C4A2E",
    arrivalTime: "1:30 PM",
    competitionTime: "2:00 PM",
  },
] as const;

// ââ FAQ data (Section 6) âââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const FAQS: FaqItem[] = [
  {
    question: "What is the Miss Tennessee Local Preliminary?",
    answer:
      "The Miss Tennessee Local Preliminary is an official sanctioned event run in partnership with the Miss Tennessee Organization. It is a qualifying competition that gives eligible young women the opportunity to earn a title and advance within the Miss Tennessee system. The West Tennessee State Fair is proud to host one of these official local events on September 19, 2026.",
  },
  {
    question: "How is the Miss Tennessee event different from the Traditional Fair Pageants?",
    answer:
      "The Miss Tennessee Local Preliminary (September 19) is a separately sanctioned event governed by the Miss Tennessee Organization, with its own eligibility requirements, format, and advancement path. The Traditional Fair Pageants (October 17) are our long-running fair divisions open to contestants ages 0â13 years, with no affiliation to the state organization. Both events are held during the West Tennessee State Fair but operate independently.",
  },
  {
    question: "Can a contestant participate in both events?",
    answer:
      "Potentially, yes â but eligibility for the Miss Tennessee Local Preliminary is governed by the Miss Tennessee Organization's rules, which may affect participation. Please review the requirements at misstennessee.org/compete for the preliminary, and contact wtsfpageant@outlook.com for questions about the Traditional Fair Pageants. Entry into each event is handled separately.",
  },
  {
    question: "How do I register for the Traditional Fair Pageants?",
    answer:
      "Online registration for the 2026 Traditional Fair Pageants is now open! Register at wtsfair.com/pageants/register. Registration closes October 14, 2026. For questions, contact the pageant team at wtsfpageant@outlook.com.",
  },
  {
    question: "What are the arrival and competition times for each division?",
    answer:
      "All seven divisions compete on October 17, 2026 at Williams Auditorium in Henderson, Tennessee. Baby Miss: arrive 9:30 AM, competition 10:00 AM. Tiny Miss: arrive 10:00 AM, competition 10:30 AM. Toddler Miss: arrive 10:30 AM, competition 11:00 AM. Little Miss: arrive 11:00 AM, competition 11:30 AM. Young Miss: arrive 12:30 PM, competition 1:00 PM. Petite Miss: arrive 1:00 PM, competition 1:30 PM. Junior Miss: arrive 1:30 PM, competition 2:00 PM.",
  },
  {
    question: "Who do I contact with pageant questions?",
    answer:
      "For Traditional Fair Pageant questions â divisions, registration, or scheduling â email the pageant team at wtsfpageant@outlook.com. The 2026 Traditional Pageants are directed by Hayley O'Neal with Lillian Snow as Co-Director. For questions specific to the Miss Tennessee Local Preliminary, visit misstennessee.org or contact the Miss Tennessee Organization directly.",
  },
];

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wtsfair.com" },
    { "@type": "ListItem", position: 2, name: "Pageants", item: "https://www.wtsfair.com/pageants" },
  ],
};

export default function PageantsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* ââ Section 1: Hero ââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <PageHero
        overline="Two Events Â· One Tradition"
        headline="Pageants &"
        headlineAccent="Competitions"
        subtext="The West Tennessee State Fair now hosts two pageant events â an Official Miss Tennessee Local Preliminary in September and our beloved Traditional Fair Pageants in October."
        imageSrc="/images/pageants-hero-landscape.webp"
        accentColor="#D4A827"
        height="tall"
        objectPosition="center 22%"
      />

      {/* ââ Section 2: Two Event Overview Cards ââââââââââââââââââââââââââââââ */}
      <section
        style={{ backgroundColor: "#2C4A2E" }}
        className="py-16 md:py-20"
        aria-labelledby="events-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              2026 Pageant Events
            </p>
            <h2
              id="events-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#F5EDD4",
              }}
            >
              Two Separate Events
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PAGEANT_EVENTS.map((event) => (
              <div
                key={event.id}
                className="relative flex flex-col p-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                {/* Top color bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: event.accentColor }}
                  aria-hidden="true"
                />

                {/* Badge */}
                <div className="mb-5">
                  <span
                    className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase"
                    style={{
                      backgroundColor: event.badgeColor,
                      color: "#F5EDD4",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {event.badge}
                  </span>
                </div>

                {/* Date */}
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: event.accentColor, letterSpacing: "0.2em" }}
                >
                  {event.date}
                </p>

                {/* Title */}
                <h3
                  className="text-xl sm:text-2xl font-bold italic leading-snug mb-4"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#F5EDD4",
                  }}
                >
                  {event.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "#C5D9C6" }}
                >
                  {event.description}
                </p>

                {/* Highlights */}
                <ul className="flex flex-col gap-2 mb-8 flex-1">
                  {event.highlights.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                        style={{ backgroundColor: event.accentColor }}
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-snug" style={{ color: "#A8BFA9" }}>
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={event.ctaHref}
                  {...(event.ctaHref.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-widest uppercase self-start transition-all hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: event.accentColor,
                    color: event.accentColor === "#D4A827" ? "#1A1A1A" : "#F5EDD4",
                    letterSpacing: "0.1em",
                  }}
                >
                  {event.ctaLabel}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      d={
                        event.ctaHref.startsWith("http")
                          ? "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          : "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      }
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ââ Section 3: Visual Timeline ââââââââââââââââââââââââââââââââââââââââ */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="timeline-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              2026 Schedule at a Glance
            </p>
            <h2
              id="timeline-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#2C4A2E",
              }}
            >
              Pageant Timeline
            </h2>
          </div>

          {/* Timeline â side by side on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row items-stretch gap-0">

            {/* Miss Tennessee block */}
            <div className="flex-1 flex flex-col">
              <div
                className="flex flex-col h-full p-8"
                style={{
                  backgroundColor: "#FDFAF3",
                  border: "1px solid #E8DFC8",
                  borderBottom: "4px solid #8B2E2E",
                }}
              >
                <div className="mb-5">
                  <span
                    className="inline-block px-4 py-1.5 text-sm font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      backgroundColor: "#8B2E2E",
                      color: "#F5EDD4",
                    }}
                  >
                    September 19, 2026
                  </span>
                </div>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#8B2E2E", letterSpacing: "0.2em" }}
                >
                  New for 2026
                </p>
                <h3
                  className="text-lg font-bold italic leading-snug mb-4"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#1A1A1A",
                  }}
                >
                  Official Miss Tennessee Local Preliminary
                </h3>
                <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "#5C4A32" }}>
                  A sanctioned qualifying event for the Miss Tennessee Organization, featuring an on-stage competition and interview.
                </p>
                <a
                  href="https://www.misstennessee.org/compete"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-opacity hover:opacity-70"
                  style={{ color: "#8B2E2E" }}
                >
                  Apply at MissTennessee.org
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Divider */}
            <div
              className="flex md:flex-col items-center justify-center px-0 py-4 md:px-4 md:py-0"
              aria-hidden="true"
            >
              <div
                className="flex-1 h-px w-full md:h-auto md:w-px"
                style={{ backgroundColor: "#D4C9A8" }}
              />
              <div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A" }}
              >
                +
              </div>
              <div
                className="flex-1 h-px w-full md:h-auto md:w-px"
                style={{ backgroundColor: "#D4C9A8" }}
              />
            </div>

            {/* Traditional Fair Pageants block */}
            <div className="flex-1 flex flex-col">
              <div
                className="flex flex-col h-full p-8"
                style={{
                  backgroundColor: "#FDFAF3",
                  border: "1px solid #E8DFC8",
                  borderBottom: "4px solid #D4A827",
                }}
              >
                <div className="mb-5">
                  <span
                    className="inline-block px-4 py-1.5 text-sm font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      backgroundColor: "#D4A827",
                      color: "#1A1A1A",
                    }}
                  >
                    October 17, 2026
                  </span>
                </div>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#D4A827", letterSpacing: "0.2em" }}
                >
                  Annual Tradition
                </p>
                <h3
                  className="text-lg font-bold italic leading-snug mb-4"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#1A1A1A",
                  }}
                >
                  Traditional Fair Pageants
                </h3>

                <div className="flex-1 flex flex-col">
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                    Seven divisions for contestants ages 0â13 years at Williams Auditorium
                    in Henderson, Tennessee. Morning and afternoon sessions run 10:00 AM â 2:00 PM.
                  </p>
                  <ul className="flex flex-col gap-1.5 mb-5">
                    {[
                      "Baby Miss Â· Tiny Miss Â· Toddler Miss Â· Little Miss",
                      "Young Miss Â· Petite Miss Â· Junior Miss",
                      "Register online at wtsfair.com/pageants/register",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                          style={{ backgroundColor: "#D4A827" }}
                          aria-hidden="true"
                        />
                        <p className="text-xs leading-snug" style={{ color: "#5C4A32" }}>{item}</p>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/pageants/register"
                    className="mt-auto text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-opacity hover:opacity-70"
                    style={{ color: "#D4A827" }}
                  >
                    View Divisions &amp; Register
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ââ Traditional Pageants Stay Updated callout ââââââââââââââââââââââââââ */}
      <div style={{ backgroundColor: "#F5EDD4" }} className="px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <StayUpdatedCallout
            heading="2026 Pageant Registration Is Now Open"
            description="Register your contestant online at wtsfair.com/pageants/register. Registration closes October 14, 2026. Stay subscribed for updates and pageant news."
            topic="pageants"
          />
        </div>
      </div>

      {/* ââ Full-width stage banner âââââââââââââââââââââââââââââââââââââââââââââ */}
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
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ââ Section 4: Traditional Fair Division Cards ââââââââââââââââââââââââ */}
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
                October 17, 2026 Â· Age Groups
              </p>
              <h2
                id="divisions-heading"
                className="text-3xl sm:text-4xl font-bold italic"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Traditional Pageant Divisions
              </h2>
            </div>

            {/* Venue badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4" }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Williams Auditorium Â· Henderson, TN
            </div>
          </div>

          {/* Division cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRADITIONAL_DIVISIONS.map((div) => (
              <div
                key={div.id}
                className="relative p-5 flex flex-col"
                style={{
                  backgroundColor: "#FDFAF3",
                  border: "1px solid #E8DFC8",
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
                        color: div.color,
                        letterSpacing: "0.15em",
                      }}
                    >
                      {div.ageRange}
                    </p>
                    <h3
                      className="text-lg font-bold italic leading-tight"
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        color: "#1A1A1A",
                      }}
                    >
                      {div.title}
                    </h3>
                  </div>
                </div>

                {/* Arrival and competition times */}
                <div
                  className="mt-auto pt-4"
                  style={{ borderTop: "1px solid #E8DFC8" }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-xs" style={{ color: "#8B7355" }}>Arrival</p>
                    <p className="text-xs font-semibold" style={{ color: "#2C4A2E" }}>{div.arrivalTime}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs" style={{ color: "#8B7355" }}>Competition</p>
                    <p className="text-xs font-semibold" style={{ color: "#2C4A2E" }}>{div.competitionTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs mt-5 leading-relaxed" style={{ color: "#8B7355" }}>
            All times are at Williams Auditorium, Henderson, Tennessee. Registration closes October 14, 2026. Contact{" "}
            <a
              href="mailto:wtsfpageant@outlook.com"
              className="underline hover:no-underline"
              style={{ color: "#2C4A2E" }}
            >
              wtsfpageant@outlook.com
            </a>{" "}
            with any questions.
          </p>
        </div>
      </section>

      {/* ââ Section 5: Miss Tennessee Premium Feature âââââââââââââââââââââââââ */}
      <section
        className="py-14"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="miss-tn-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Photo */}
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
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "rgba(139,46,46,0.6)" }} aria-hidden="true" />
              <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "rgba(139,46,46,0.6)" }} aria-hidden="true" />
              <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "rgba(139,46,46,0.6)" }} aria-hidden="true" />
              <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "rgba(139,46,46,0.6)" }} aria-hidden="true" />
              {/* Badge overlay */}
              <div
                className="absolute top-4 left-4 px-3 py-1.5"
                style={{ backgroundColor: "#8B2E2E" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#F5EDD4", letterSpacing: "0.15em" }}
                >
                  New for 2026
                </p>
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-col justify-center">
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#8B2E2E", letterSpacing: "0.25em" }}
              >
                Official Local Preliminary
              </p>
              <h2
                id="miss-tn-heading"
                className="text-3xl sm:text-4xl font-bold italic leading-tight mb-5"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Miss Tennessee Local Preliminary
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#5C4A32" }}
              >
                New in 2026, the West Tennessee State Fair is proud to host an
                Official Miss Tennessee Local Preliminary â a sanctioned qualifying
                event run in partnership with the Miss Tennessee Organization.
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "#5C4A32" }}
              >
                This event takes place on{" "}
                <strong style={{ color: "#2C4A2E" }}>September 19, 2026</strong> â
                giving eligible young women the chance to earn a title and advance
                within the Miss Tennessee system. The competition includes an
                on-stage competition and a private interview with a panel of judges.
              </p>

              {/* Detail box */}
              <div
                className="p-5 mb-6"
                style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "#8B2E2E" }}
                >
                  What to Know
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Sanctioned event governed by the Miss Tennessee Organization",
                    "On-stage competition plus private interview with judges",
                    "Winner earns a title and advances in the Miss Tennessee system",
                    "Eligibility and entry rules set by Miss Tennessee â see their website",
                    "Held September 19, 2026 at the West Tennessee State Fairgrounds",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                        style={{ backgroundColor: "#8B2E2E" }}
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply CTA */}
              <a
                href="https://www.misstennessee.org/compete"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 self-start"
                style={{
                  backgroundColor: "#8B2E2E",
                  color: "#F5EDD4",
                  letterSpacing: "0.1em",
                }}
              >
                Apply at MissTennessee.org
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ââ Section 6: FAQ ââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="faq-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              Common Questions
            </p>
            <h2
              id="faq-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#2C4A2E",
              }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <FaqAccordion items={FAQS} idPrefix="pageants-faq" />
        </div>
      </section>

      {/* ââ Section 7: Contact CTA ââââââââââââââââââââââââââââââââââââââââââââ */}
      <section style={{ backgroundColor: "#2C4A2E" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "#D4A827" }}
              >
                Questions? Ready to Compete?
              </p>
              <p
                className="text-xl font-bold italic mb-1"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#F5EDD4",
                }}
              >
                We&apos;d love to hear from you.
              </p>
              <p className="text-sm" style={{ color: "#A8BFA9" }}>
                Traditional Pageant inquiries: wtsfpageant@outlook.com
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B9970" }}>
                Director: Hayley O&apos;Neal &middot; Co-Director: Lillian Snow
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
