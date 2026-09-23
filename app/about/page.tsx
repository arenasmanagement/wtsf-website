import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { FAIR_LEADERSHIP } from "@/lib/leadership-config";

export const metadata: Metadata = {
  title: "About — 171 Years of West Tennessee Tradition",
  description:
    "Since 1855, the West Tennessee State Fair has served Henderson and Chester County as a proud annual tradition. Learn about our history, our community, and the people who make the fair happen each October.",
  alternates: {
    canonical: "https://wtsfair.com/about",
  },
  openGraph: {
    url: "https://wtsfair.com/about",
  },
};

// ─── Milestones ────────────────────────────────────────────────────────────
const milestones = [
  {
    year: "1855",
    label: "Est.",
    text: "The West Tennessee State Fair holds its first event in Henderson, Tennessee — rooted from the start in agriculture, community, and competition.",
  },
  {
    year: "100+",
    label: "Years",
    text: "Through generations of change — farming shifts, economic cycles, and a world that keeps moving — the fair has shown up every October without fail.",
  },
  {
    year: "171",
    label: "Seasons",
    text: "2026 marks 171 consecutive years of the West Tennessee State Fair. One of the longest-running community traditions in the region.",
  },
  {
    year: "2026",
    label: "Back to Our Roots",
    text: "This year's theme isn't nostalgia — it's intention. A deliberate return to what the fair has always been: local, agricultural, and community-first.",
  },
];

// ─── What the fair represents ──────────────────────────────────────────────
const fairElements = [
  "Farmers & agricultural exhibitors",
  "Craftspeople and artisans",
  "Youth competitors",
  "Livestock shows and rodeo",
  "Quilts, pies, and photography",
  "Fair Queen and pageant traditions",
  "Family memories and first ribbons",
];

// ─── Contact entries (general only — sponsorship belongs on Partner With Us) ──
const teamContacts = [
  {
    role: "General Inquiries",
    email: "wtsfair@gmail.com",
    note: "Exhibits, fair info, vendor spaces, and general questions",
  },
  {
    role: "Pageants",
    email: "wtsfpageant@outlook.com",
    note: "Entry registration, division times, and pageant-specific questions",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://wtsfair.com" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://wtsfair.com/about" },
  ],
};

export default function AboutPage() {
  const { year: leadershipYear, officers, boardMembers } = FAIR_LEADERSHIP;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* ── Hero ────────────────────────────────────────── */}
      <PageHero
        overline="Our Legacy in West Tennessee"
        headline="About the"
        headlineAccent="Fair"
        subtext="For over 170 years, the West Tennessee State Fair has been a proud tradition rooted in the heart of Henderson — and a source of pride for all of West Tennessee."
        imageSrc="/images/home-about-preview.webp"
        accentColor="#D4A827"
        height="standard"
      />

      {/* ── Mission ──────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#2C4A2E" }}
        className="py-14"
        aria-labelledby="mission-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            Our Mission
          </p>
          <h2
            id="mission-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold italic leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Back to Our Roots
          </h2>
          <div
            className="w-10 h-0.5 mx-auto mb-6"
            style={{ backgroundColor: "#D4A827" }}
            aria-hidden="true"
          />
          <p className="text-lg leading-relaxed" style={{ color: "#C5D9C6" }}>
            The West Tennessee State Fair exists to celebrate the agricultural
            heritage, community spirit, and family tradition that define life
            in Henderson and Chester County. Every ribbon, every crown, every
            exhibit, and every livestock show is a piece of that story.
          </p>
        </div>
      </section>

      {/* ── History ───────────────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="history-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              The Long View
            </p>
            <h2
              id="history-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
            >
              Our History
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="relative p-6 flex flex-col"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: "#D4A827" }}
                  aria-hidden="true"
                />
                <p
                  className="text-4xl font-bold italic mb-1"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
                >
                  {m.year}
                </p>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-4"
                  style={{ color: "#D4A827", letterSpacing: "0.2em" }}
                >
                  {m.label}
                </p>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#5C4A32" }}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What the Fair Is ──────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="what-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Community photo */}
            <div
              className="relative overflow-hidden order-2 lg:order-1"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src="/images/about-community.webp"
                alt="Community gathering at the West Tennessee State Fair"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#D4A827", letterSpacing: "0.25em" }}
              >
                What the Fair Represents
              </p>
              <h2
                id="what-heading"
                className="text-3xl sm:text-4xl font-bold italic leading-tight mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
              >
                More Than 10 Days in October
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                The West Tennessee State Fair is an agricultural fair — not an
                amusement park. It exists to celebrate the work of farmers, the
                talent of craftspeople, the dedication of youth competitors, and
                the memory of everyone who&apos;s passed through those gates before.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#5C4A32" }}>
                That means livestock in the show ring. Ribbons on quilts and
                pies and photographs. A Fair Queen who represents this
                community for the year. And a rodeo that reminds everyone
                what West Tennessee looks like when it&apos;s at its best.
              </p>
              <ul className="flex flex-col gap-2" aria-label="What the fair celebrates">
                {fairElements.map((el) => (
                  <li key={el} className="flex items-center gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#D4A827" }}
                      aria-hidden="true"
                    />
                    <span className="text-sm" style={{ color: "#5C4A32" }}>{el}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who Makes It Happen ────────────────────────────── */}
      <section
        id="leadership"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="leadership-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="mb-12">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              {leadershipYear} Fair Leadership
            </p>
            <h2
              id="leadership-heading"
              className="text-3xl sm:text-4xl font-bold italic mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
            >
              Who Makes It Happen
            </h2>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#5C4A32" }}>
              The West Tennessee State Fair is made possible by a dedicated group
              of community volunteers who give their time and leadership to keep
              this tradition alive each year.
            </p>
          </div>

          {/* Officers */}
          <div className="mb-10">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: "#8B7355", letterSpacing: "0.2em" }}
            >
              Fair Officers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {officers.map((officer) => (
                <div
                  key={officer.role}
                  className="relative p-6"
                  style={{ backgroundColor: "#2C4A2E" }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: "#D4A827" }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-3"
                    style={{ color: "#D4A827", letterSpacing: "0.15em" }}
                  >
                    {officer.role}
                  </p>
                  {officer.names.length === 1 ? (
                    <p
                      className="text-base font-bold italic"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
                    >
                      {officer.names[0]}
                    </p>
                  ) : (
                    <p
                      className="text-base font-bold italic leading-snug"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
                    >
                      {officer.names[0]}
                      <span className="block text-sm font-normal not-italic" style={{ color: "#D4A827" }}>
                        &amp; {officer.names[1]}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Board Members */}
          <div
            className="relative p-8 md:p-10"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: "#D4A827" }}
              aria-hidden="true"
            />
            <p
              className="text-xs font-bold tracking-widest uppercase mb-6"
              style={{ color: "#8B7355", letterSpacing: "0.2em" }}
            >
              Board Members
            </p>
            <ul
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3"
              aria-label="Fair board members"
            >
              {boardMembers.map((member) => (
                <li key={member} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#D4A827" }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium" style={{ color: "#2C4A2E" }}>
                    {member}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Year note */}
          <p className="mt-4 text-xs text-center" style={{ color: "#8B7355" }}>
            Leadership reflects the {leadershipYear} fair year. Updated annually as confirmed by the fair board.
          </p>
        </div>
      </section>

      {/* ── Fair atmosphere photo strip ──────────────────── */}
      <div
        className="relative h-48 sm:h-56 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/images/about-photo-strip.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.35) 100%)" }}
        />
      </div>

      {/* ── Contact ───────────────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="contact-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              Reach Out
            </p>
            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
            >
              Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {teamContacts.map((c) => (
              <div
                key={c.role}
                className="relative p-6"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: "#D4A827" }}
                  aria-hidden="true"
                />
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "#D4A827", letterSpacing: "0.15em" }}
                >
                  {c.role}
                </p>
                <a
                  href={`mailto:${c.email}`}
                  className="text-base font-bold block mb-2 transition-opacity hover:opacity-70"
                  style={{ color: "#2C4A2E" }}
                >
                  {c.email}
                </a>
                <p className="text-xs leading-relaxed" style={{ color: "#5C4A32" }}>
                  {c.note}
                </p>
              </div>
            ))}
          </div>

          {/* Sponsor / volunteer links */}
          <div
            className="p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <p className="text-sm" style={{ color: "#5C4A32" }}>
              Interested in sponsoring or volunteering?{" "}
              <Link
                href="/partner-with-us"
                className="font-bold transition-opacity hover:opacity-70"
                style={{ color: "#2C4A2E" }}
              >
                Visit the Partner With Us page
              </Link>{" "}
              for sponsorship packages, vendor information, and volunteer opportunities.
            </p>
          </div>

          {/* Address cards — two separate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Card 1: Fairgrounds */}
            <div
              className="flex flex-col p-6 sm:p-8"
              style={{ backgroundColor: "#2C4A2E" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#D4A827", letterSpacing: "0.2em" }}
              >
                Fairgrounds Address
              </p>
              <address className="not-italic flex-1 mb-6">
                <p
                  className="text-xl font-bold italic mb-1"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
                >
                  575 Fourth Street
                </p>
                <p className="text-base mb-4" style={{ color: "#C5D9C6" }}>
                  Henderson, TN 38340
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#A8BFA9" }}>
                  For fair events, exhibit check-in, livestock shows, pageants, vendors, and visitor navigation.
                </p>
              </address>
              <a
                href="https://maps.google.com/?q=575+Fourth+Street+Henderson+TN+38340"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 self-start"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
              >
                Open in Google Maps
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            {/* Card 2: Mailing Address */}
            <div
              className="relative flex flex-col p-6 sm:p-8"
              style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: "#5C4A32" }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#5C4A32" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <p
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#5C4A32", letterSpacing: "0.2em" }}
                >
                  Official Mailing Address
                </p>
              </div>
              <address className="not-italic flex-1 mb-6">
                <p
                  className="text-xl font-bold italic mb-1"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
                >
                  P.O. Box 1404
                </p>
                <p className="text-base mb-4" style={{ color: "#5C4A32" }}>
                  Jackson, TN 38302
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#8B7355" }}>
                  Use this mailing address for sponsorship payments, vendor payments, checks, official correspondence, applications, contracts, and any mail sent to the West Tennessee State Fair.
                </p>
              </address>
              <p
                className="text-xs font-bold tracking-wider uppercase"
                style={{ color: "#8B7355", letterSpacing: "0.1em" }}
              >
                Not the fairgrounds — mail only
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
