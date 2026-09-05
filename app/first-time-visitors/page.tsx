import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { FAIR_CONFIG } from "@/lib/fair-config";

export const metadata: Metadata = {
  title: "First-Time Visitors Guide — Plan Your Trip to the Fair",
  description:
    "New to the West Tennessee State Fair? This guide covers everything before you arrive — admission, parking, what to bring, getting there from Jackson, Lexington, and across West Tennessee, and tips for your first visit.",
  alternates: {
    canonical: "https://wtsfair.com/first-time-visitors",
  },
  openGraph: {
    url: "https://wtsfair.com/first-time-visitors",
  },
};

function SectionHeading({ overline, headline, id }: { overline: string; headline: string; id: string }) {
  return (
    <div className="mb-6" id={id}>
      <p
        className="text-xs font-bold tracking-widest uppercase mb-2"
        style={{ color: "#D4A827", letterSpacing: "0.22em" }}
      >
        {overline}
      </p>
      <h2
        className="text-2xl sm:text-3xl font-bold italic"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
      >
        {headline}
      </h2>
    </div>
  );
}

function InfoCard({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className="p-6"
      style={{
        backgroundColor: accent ? "#2C4A2E" : "#FDFAF3",
        border:          accent ? "none" : "1px solid #E8DFC8",
      }}
    >
      {children}
    </div>
  );
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://wtsfair.com" },
    { "@type": "ListItem", position: 2, name: "First-Time Visitors Guide", item: "https://wtsfair.com/first-time-visitors" },
  ],
};

export default function FirstTimeVisitorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHero
        overline="Welcome to the 2026 Fair"
        headline="First-Time Visitors"
        headlineAccent="Guide"
        subtext="Everything you need to know before you arrive — from admission and parking to what to expect once you&apos;re inside."
        accentColor="#D4A827"
      />

      {/* ── Section jump links ───────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <nav aria-label="Guide section jump links">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-semibold tracking-wider uppercase">
              {[
                { id: "welcome",       label: "Welcome" },
                { id: "before",        label: "Before You Leave" },
                { id: "getting-here",  label: "Getting Here" },
                { id: "parking",       label: "Parking" },
                { id: "gate",          label: "At the Gate" },
                { id: "inside",        label: "What You'll Find" },
                { id: "families",      label: "Families" },
                { id: "accessibility", label: "Accessibility" },
                { id: "weather",       label: "Weather" },
                { id: "map",           label: "Fairgrounds Map" },
                { id: "connected",     label: "Stay Connected" },
                { id: "questions",     label: "Questions" },
              ].map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
                    style={{ color: "#D4A827", letterSpacing: "0.12em" }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* ── Guide body ──────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F5EDD4" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 space-y-20">

          {/* ── 1. Welcome ──────────────────────────────────── */}
          <section aria-labelledby="welcome">
            <SectionHeading overline="Section 1" headline="Welcome to the Fair" id="welcome" />
            <div className="prose-style space-y-4 text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
              <p>
                We&apos;re glad you&apos;re joining us. The West Tennessee State Fair has been a cherished
                tradition in Henderson and Chester County since 1855 — and every October, it brings
                together something for everyone.
              </p>
              <p>
                Whether you&apos;re coming for the livestock shows, the pageants, the carnival rides, the
                homemade pies in the exhibit hall, or just a great evening out with your family, this
                guide is here to help you make the most of your first visit.
              </p>
              <p>
                The <strong>2026 West Tennessee State Fair</strong> runs{" "}
                <strong>October 15–24</strong> at the West Tennessee State Fairgrounds in Henderson,
                Tennessee. We hope to see you there.
              </p>
            </div>
          </section>

          {/* ── 2. Before You Leave Home ─────────────────────── */}
          <section aria-labelledby="before">
            <SectionHeading overline="Section 2" headline="Before You Leave Home" id="before" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Check the schedule",
                  body: (
                    <>
                      Review the{" "}
                      <Link href="/fair-info" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
                        daily schedule
                      </Link>{" "}
                      so you know what&apos;s happening on the day you plan to attend.
                    </>
                  ),
                },
                {
                  title: "Review admission pricing",
                  body: (
                    <>
                      Most days are $5 for all ages. Rodeo nights (Oct 16 &amp; 17) and Junior Rodeo night (Oct 20) are priced
                      higher. See the full{" "}
                      <Link href="/fair-info#admission" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
                        day-by-day price guide
                      </Link>
                      .
                    </>
                  ),
                },
                {
                  title: "Confirm opening hours",
                  body: "Some hours are still to be announced. Check the Fair Info page for the latest confirmed times.",
                },
                {
                  title: "Check the weather",
                  body: "West Tennessee Octobers can be warm or cool. Check the forecast and dress in comfortable layers.",
                },
                {
                  title: "Follow us on social media",
                  body: (
                    <>
                      Follow us on{" "}
                      <a
                        href={FAIR_CONFIG.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-70"
                        style={{ color: "#2C4A2E" }}
                      >
                        Facebook
                      </a>{" "}
                      and{" "}
                      <a
                        href={FAIR_CONFIG.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-70"
                        style={{ color: "#2C4A2E" }}
                      >
                        Instagram
                      </a>{" "}
                      for announcements, schedule updates, and last-minute changes.
                    </>
                  ),
                },
                {
                  title: "Save the address",
                  body: "575 Fourth Street, Henderson, TN 38340. Allow extra time for travel and parking, especially on opening day and special event nights.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 flex gap-4 items-start"
                  style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
                >
                  <div
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: "#2C4A2E" }}>{item.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. Getting There ─────────────────────────────── */}
          <section aria-labelledby="getting-here">
            <SectionHeading overline="Section 3" headline="Getting There" id="getting-here" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <InfoCard>
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-3"
                    style={{ color: "#D4A827" }}
                  >
                    Fairgrounds Address
                  </p>
                  <address className="not-italic mb-4">
                    <p
                      className="text-2xl font-bold italic mb-1"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
                    >
                      575 Fourth Street
                    </p>
                    <p className="text-base font-medium" style={{ color: "#5C4A32" }}>
                      Henderson, TN 38340
                    </p>
                  </address>
                  <a
                    href={FAIR_CONFIG.location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
                    style={{ color: "#2C4A2E", letterSpacing: "0.12em" }}
                  >
                    Open in Google Maps
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </InfoCard>
                <div
                  className="p-5 text-sm"
                  style={{ backgroundColor: "#2C4A2E" }}
                >
                  <p className="font-bold mb-1" style={{ color: "#F5EDD4" }}>From Memphis</p>
                  <p style={{ color: "#A8BFA9" }}>Roughly 90 miles northeast via I-40 E and US-45 N.</p>
                  <p className="font-bold mt-3 mb-1" style={{ color: "#F5EDD4" }}>From Jackson</p>
                  <p style={{ color: "#A8BFA9" }}>Roughly 30 miles east via US-70 E.</p>
                </div>
              </div>
              <div className="overflow-hidden" style={{ border: "1px solid #D4C9A8" }}>
                <iframe
                  src="https://maps.google.com/maps?q=575+Fourth+Street+Henderson+TN+38340&z=15&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="West Tennessee State Fair — 575 Fourth Street, Henderson, TN 38340"
                />
              </div>
            </div>
          </section>

          {/* ── 4. Parking & Arrival ─────────────────────────── */}
          <section aria-labelledby="parking">
            <SectionHeading overline="Section 4" headline="Parking & Arrival" id="parking" />
            <div className="space-y-4 text-sm" style={{ color: "#5C4A32" }}>
              <InfoCard accent>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#D4A827" }}
                >
                  Free Parking — Always
                </p>
                <p className="text-base font-bold mb-1" style={{ color: "#F5EDD4" }}>
                  Parking at the fairgrounds is free every day of the fair.
                </p>
                <p style={{ color: "#A8BFA9" }}>
                  There are no parking fees. Additional parking details and directional guidance
                  will be posted closer to opening day.
                </p>
              </InfoCard>
              <InfoCard>
                <p className="font-bold mb-2" style={{ color: "#2C4A2E" }}>Plan for extra time</p>
                <p className="leading-relaxed">
                  On opening day and rodeo evenings (Oct 16, 17, and 20), arrival
                  traffic may be heavier than usual. Allow a few extra minutes for parking and walking
                  to the gates.
                </p>
              </InfoCard>
              <p className="text-xs leading-relaxed" style={{ color: "#8B7355" }}>
                Final arrival and parking instructions will be posted on this page and on our social
                media channels closer to the fair.
              </p>
            </div>
          </section>

          {/* ── 5. At the Gate ───────────────────────────────── */}
          <section aria-labelledby="gate">
            <SectionHeading overline="Section 5" headline="At the Gate" id="gate" />
            <div className="space-y-4 text-sm" style={{ color: "#5C4A32" }}>
              <p className="leading-relaxed">
                The West Tennessee State Fair is <strong>not currently offering online ticket
                sales</strong>. Admission is purchased at the gate on the day of your visit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard>
                  <p className="font-bold mb-2" style={{ color: "#2C4A2E" }}>Standard Days — $5</p>
                  <p className="leading-relaxed">
                    Most days of the fair are $5 for all ages at the gate. Children under 3 are
                    always free.
                  </p>
                </InfoCard>
                <InfoCard>
                  <p className="font-bold mb-2" style={{ color: "#2C4A2E" }}>Special Event Days</p>
                  <p className="leading-relaxed">
                    Rodeo Night (Oct 16), Rodeo Saturday (Oct 17), and Junior Rodeo (Oct 20)
                    are $15 adults / $10 for ages 12 &amp; under. Rodeo performances start at 7:00 PM.
                  </p>
                </InfoCard>
              </div>
              <InfoCard>
                <p className="font-bold mb-2" style={{ color: "#2C4A2E" }}>Ride Armbands</p>
                <p className="leading-relaxed">
                  Unlimited-ride armbands are <strong>$30 every day</strong>, sold separately from gate admission. On Saturdays, rides run two sessions — daytime (until 4 PM) and evening (5 PM–Close). <strong>A new armband is required for the evening session.</strong> Rides temporarily close 4–5 PM between sessions. Purchase at the gate.
                </p>
              </InfoCard>
              <p className="text-xs leading-relaxed" style={{ color: "#8B7355" }}>
                Gate admission accepts <strong>Cash or Card</strong>. Other gate details will be posted closer
                to the fair.{" "}
                <a
                  href={`mailto:${FAIR_CONFIG.contact.email}`}
                  className="underline hover:opacity-70"
                  style={{ color: "#8B7355" }}
                >
                  Contact us
                </a>{" "}
                with specific questions.
              </p>
            </div>
          </section>

          {/* ── 6. What You'll Find ──────────────────────────── */}
          <section aria-labelledby="inside">
            <SectionHeading overline="Section 6" headline="What You'll Find" id="inside" />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#5C4A32" }}>
              The West Tennessee State Fair is a full experience — there&apos;s something happening
              every day across the grounds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Exhibit Hall",
                  body: "Browse hundreds of entries across Arts & Crafts, Agriculture, Culinary, Clothing & Textiles, and Photography.",
                  href: "/exhibits",
                },
                {
                  title: "Livestock Shows",
                  body: "Watch or enter the Cattle Show, Meat Goat Show, and Breeding Sheep Show.",
                  href: "/livestock",
                },
                {
                  title: "Pageants",
                  body: "Cheer on competitors in the Fair Queen & Princess Pageant, Junior Miss Pageant, and more.",
                  href: "/pageants",
                },
                {
                  title: "Rides & Midway",
                  body: "The midway features carnival rides for all ages. Armbands are available for unlimited rides.",
                  href: null,
                },
                {
                  title: "Food Vendors",
                  body: "From fair classics to local favorites, food vendors serve up something for every taste throughout the fairgrounds.",
                  href: null,
                },
                {
                  title: "Entertainment",
                  body: "Bulls & Barrels – Buckin’ by Faith (Oct 16 & 17 at 7 PM), Junior Rodeo (Oct 20 at 7 PM), Grill Competition (Oct 15), Antique Tractor Show (Oct 24), and more fill the schedule.",
                  href: "/fair-info",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5"
                  style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
                >
                  <p className="text-sm font-bold mb-2" style={{ color: "#2C4A2E" }}>{item.title}</p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#5C4A32" }}>{item.body}</p>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
                      style={{ color: "#2C4A2E", letterSpacing: "0.1em" }}
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── 7. Families with Children ────────────────────── */}
          <section aria-labelledby="families">
            <SectionHeading overline="Section 7" headline="Families with Children" id="families" />
            <div className="space-y-4 text-sm" style={{ color: "#5C4A32" }}>
              <p className="leading-relaxed">
                The fair is a great outing for families. A little planning goes a long way toward a
                smooth, enjoyable visit.
              </p>
              <ul className="space-y-3">
                {[
                  "Review age-based admission pricing before you arrive — most days are $5, with children under 3 always free.",
                  "Plan breaks during longer visits, especially with young children on warm October afternoons.",
                  "Choose a meeting point near a recognizable landmark in case family members get separated.",
                  "Keep children supervised, especially near the midway and livestock areas.",
                  "Check individual ride requirements at the midway — restrictions are set by each ride operator and posted at the attraction.",
                  "Review the daily schedule before arriving so you can time your visit around the events your kids will enjoy most.",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ backgroundColor: "#D4A827", color: "#1A1A1A" }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── 8. Accessibility ─────────────────────────────── */}
          <section aria-labelledby="accessibility">
            <SectionHeading overline="Section 8" headline="Accessibility" id="accessibility" />
            <div className="space-y-4 text-sm" style={{ color: "#5C4A32" }}>
              <p className="leading-relaxed">
                The West Tennessee State Fair welcomes guests with disabilities. Accessibility
                arrangements may vary by area and event. Guests who need accessibility assistance
                are encouraged to <strong>contact the fair before attending</strong> so that staff
                can help plan their visit.
              </p>
              <InfoCard>
                <ul className="space-y-2 text-sm" style={{ color: "#5C4A32" }}>
                  <li><strong style={{ color: "#2C4A2E" }}>Service animals</strong> are permitted in accordance with applicable law.</li>
                  <li>Final details about accessible parking, pathways, restrooms, and event seating will be shared as they are confirmed.</li>
                  <li>Accessibility arrangements may vary by area and event. Please contact the fair for the most current information.</li>
                </ul>
              </InfoCard>
              <div
                className="flex flex-col sm:flex-row gap-3 p-5"
                style={{ backgroundColor: "#2C4A2E" }}
              >
                <div>
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-2"
                    style={{ color: "#D4A827" }}
                  >
                    Accessibility Inquiries
                  </p>
                  <p style={{ color: "#C5D9C6" }}>
                    Contact us at{" "}
                    <a
                      href={`mailto:${FAIR_CONFIG.contact.email}`}
                      className="underline hover:opacity-70 font-medium"
                      style={{ color: "#F5EDD4" }}
                    >
                      {FAIR_CONFIG.contact.email}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 9. Weather ───────────────────────────────────── */}
          <section aria-labelledby="weather">
            <SectionHeading overline="Section 9" headline="Weather" id="weather" />
            <div className="space-y-4 text-sm" style={{ color: "#5C4A32" }}>
              <p className="leading-relaxed">
                The West Tennessee State Fair is generally planned to operate during normal seasonal
                weather. October in West Tennessee can bring warm afternoons, cool evenings, or the
                occasional shower.
              </p>
              <InfoCard accent>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#D4A827" }}
                >
                  Weather Policy
                </p>
                <p className="leading-relaxed" style={{ color: "#C5D9C6" }}>
                  Individual events, outdoor activities, rides, or schedules may be delayed,
                  relocated, or adjusted when weather conditions create safety concerns. Safety
                  decisions may be made by fair management, event officials, or ride operators.
                  Visitors should check the official website and social media channels for the
                  latest updates before traveling.
                </p>
              </InfoCard>
              <ul className="space-y-2 text-sm" style={{ color: "#5C4A32" }}>
                <li>✓ Check the forecast before you leave home.</li>
                <li>✓ Monitor official channels on the day of your visit.</li>
                <li>
                  ✓ Follow us on{" "}
                  <a
                    href={FAIR_CONFIG.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-70"
                    style={{ color: "#2C4A2E" }}
                  >
                    Facebook
                  </a>{" "}
                  for real-time updates when conditions change.
                </li>
              </ul>
            </div>
          </section>

          {/* ── 10. Fairgrounds Map ──────────────────────────── */}
          <section aria-labelledby="map">
            <SectionHeading overline="Section 10" headline="Fairgrounds Map" id="map" />
            <InfoCard>
              <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                The final fairgrounds layout is confirmed closer to the fair&apos;s opening after all
                vendors, exhibitors, and event placements are finalized. The official map will be
                published on this website and shared on our social media channels once it is ready.
                Check back at{" "}
                <Link href="/" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
                  wtsfair.com
                </Link>{" "}
                as opening day approaches.
              </p>
            </InfoCard>
          </section>

          {/* ── 11. Stay Connected ───────────────────────────── */}
          <section aria-labelledby="connected">
            <SectionHeading overline="Section 11" headline="Stay Connected" id="connected" />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#5C4A32" }}>
              Follow the West Tennessee State Fair for announcements, schedules, event updates,
              photos, and important changes as opening day approaches.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <a
                href={FAIR_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDD4]"
                style={{ backgroundColor: "#1877F2", color: "#fff" }}
                aria-label="Follow the West Tennessee State Fair on Facebook"
              >
                <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div>
                  <p className="font-bold text-sm">Facebook</p>
                  <p className="text-xs opacity-80">@WTSFAIR</p>
                </div>
              </a>
              <a
                href={FAIR_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E1306C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDD4]"
                style={{ backgroundColor: "#E1306C", color: "#fff" }}
                aria-label="Follow the West Tennessee State Fair on Instagram"
              >
                <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <div>
                  <p className="font-bold text-sm">Instagram</p>
                  <p className="text-xs opacity-80">@westtnstatefair</p>
                </div>
              </a>
            </div>

            {/* Fair Updates email signup */}
            <div
              className="p-6"
              style={{ backgroundColor: "#2C4A2E" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "#D4A827", letterSpacing: "0.2em" }}
              >
                Email Updates
              </p>
              <p className="text-sm mb-4" style={{ color: "#C5D9C6" }}>
                Sign up for our Fair Updates email list to receive announcements about the topics
                that matter most to you — delivered straight to your inbox.
              </p>
              <Link
                href="/#stay-updated"
                className="inline-block px-6 py-3 text-xs font-bold tracking-wider uppercase transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
              >
                Sign Up for Updates
              </Link>
            </div>
          </section>

          {/* ── 12. Questions ────────────────────────────────── */}
          <section aria-labelledby="questions">
            <SectionHeading overline="Section 12" headline="Questions?" id="questions" />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#5C4A32" }}>
              If you have questions that weren&apos;t answered here, we&apos;re happy to help. Reach out
              before your visit so we can make sure you have everything you need.
            </p>
            <div
              className="p-8 text-center"
              style={{ backgroundColor: "#2C4A2E" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#D4A827", letterSpacing: "0.2em" }}
              >
                Contact the Fair
              </p>
              <p
                className="text-2xl font-bold italic mb-6"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
              >
                We&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`mailto:${FAIR_CONFIG.contact.email}`}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
                >
                  {FAIR_CONFIG.contact.email}
                </a>
              </div>
            </div>

            {/* Also see the FAQ */}
            <div className="mt-6 text-center">
              <p className="text-sm mb-3" style={{ color: "#8B7355" }}>
                You might also find your answer in our full FAQ.
              </p>
              <Link
                href="/faq"
                className="text-sm font-bold tracking-widest uppercase underline transition-opacity hover:opacity-70 focus:outline-none focus-visible:no-underline focus-visible:ring-2 focus-visible:ring-[#2C4A2E]"
                style={{ color: "#2C4A2E", letterSpacing: "0.1em" }}
              >
                View All FAQs →
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
