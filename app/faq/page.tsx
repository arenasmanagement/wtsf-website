import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { FAIR_CONFIG } from "@/lib/fair-config";
import type { FaqItem } from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Get answers to the most common questions about vsiting the West Tennessee State Fair — admission prices, hours, parking, rides, exhibits, livestock, pageants, accessibility, and how to get involved.",
  alternates: {
    canonical: "https://www.wtsfair.com/faq",
  },
  openGraph: {
    url: "https://www.wtsfair.com/faq",
  },
};

// ─────────────────────────────────────────────────────────────
// FAQ sections — answers are JSX so we can include links.
// Use careful language for any policy that is not yet confirmed.
// ─────────────────────────────────────────────────────────────

const contactLine = (
  <>
    Contact us at{" "}
    <a href={`mailto:${FAIR_CONFIG.contact.email}`} className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
      {FAIR_CONFIG.contact.email}
    </a>{" "}
    for the latest information.
  </>
);

interface FaqSection {
  id: string;
  heading: string;
  items: FaqItem[];
}

const sections: FaqSection[] = [
  // ── 1. Planning Your Visit ─────────────────────────────────
  {
    id: "planning",
    heading: "Planning Your Visit",
    items: [
      {
        question: "When is the 2026 West Tennessee State Fair?",
        answer: (
          <>
            The 2026 West Tennessee State Fair runs from{" "}
            <strong>Thursday, October 15 through Saturday, October 24, 2026</strong> — ten days of
            family fun, livestock shows, exhibits, pageants, rides, and entertainment in Henderson,
            Tennessee.
          </>
        ),
      },
      {
        question: "Where is the fair located?",
        answer: (
          <>
            The fair is held at the West Tennessee State Fairgrounds at{" "}
            <strong>575 Fourth Street, Henderson, Tennessee 38340</strong>. Henderson is roughly 90
            miles east of Memphis and 30 miles east of Jackson via US-70 E.{" "}
            <a
              href={FAIR_CONFIG.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70"
              style={{ color: "#2C4A2E" }}
            >
              Open in Google Maps
            </a>
            .
          </>
        ),
      },
      {
        question: "Where should I park?",
        answer: (
          <>
            <strong>Free parking</strong> is available at the fairgrounds every day of the fair —
            there are no parking fees, ever. Final arrival and parking guidance will be posted closer
            to opening day. Follow us on{" "}
            <a
              href={FAIR_CONFIG.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70"
              style={{ color: "#2C4A2E" }}
            >
              Facebook
            </a>{" "}
            for updates.
          </>
        ),
      },
      {
        question: "What time does the fair open?",
        answer: (
          <>
            Opening times are confirmed for Saturdays — <strong>October 17 and 24 open at 11:00
            AM</strong>. Specific daily hours for other days are still to be announced. Check back at{" "}
            <Link href="/fair-info" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Fair Info
            </Link>{" "}
            or follow us on Facebook for the latest updates as the fair approaches.
          </>
        ),
      },
      {
        question: "Will a fairgrounds map be available?",
        answer: (
          <>
            Yes. The final fairgrounds map will be published on this website once the layout is
            confirmed closer to the fair&apos;s opening day. Check back at wtsfair.com or follow us on
            social media for updates.
          </>
        ),
      },
      {
        question: "What should I do if it rains?",
        answer: (
          <>
            The West Tennessee State Fair is generally planned to operate during normal seasonal
            weather. Individual events, outdoor activities, rides, or schedules may be delayed,
            relocated, or adjusted when weather conditions create safety concerns. Safety decisions may
            be made by fair management, event officials, or ride operators. Visitors should check the
            official website and social media channels for the latest updates before traveling. Updates
            will be shared through official channels when available.
          </>
        ),
      },
    ],
  },

  // ── 2. Admission & Hours ───────────────────────────────────
  {
    id: "admission",
    heading: "Admission & Hours",
    items: [
      {
        question: "How much is admission?",
        answer: (
          <>
            <strong>Most days are $5 for all ages</strong> at the gate. Special event days are priced
            higher: <strong>Rodeo Night (Oct 16)</strong>, <strong>Rodeo Saturday (Oct 17)</strong>,
            and <strong>Junior Rodeo (Oct 20)</strong> are $15 for adults and $10 for children ages
            12 and under. Children under 3 are always free. See the full{" "}
            <Link href="/fair-info#admission" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              day-by-day price guide
            </Link>
            .
          </>
        ),
      },
      {
        question: "Are children admitted free?",
        answer: (
          <>
            <strong>Children under 3 are always free</strong> — every day, at all gates, no
            exceptions. On standard $5 days, all other ages pay $5. On special event days, children
            ages 12 and under are $10.
          </>
        ),
      },
      {
        question: "Are tickets sold online?",
        answer: (
          <>
            <strong>
              The fair is not currently offering online ticket sales.
            </strong>{" "}
            Admission is purchased at the gate on the day of your visit.
          </>
        ),
      },
      {
        question: "Can I purchase admission at the gate?",
        answer: (
          <>
            Yes. Admission tickets are purchased at the gate on arrival. Gate admission accepts <strong>Cash or Card</strong>. {contactLine}
          </>
        ),
      },
      {
        question: "Are ride armbands available?",
        answer: (
          <>
            Yes. Unlimited-ride armbands are sold separately from gate admission. On Saturdays,
            armbands are split into two sessions — Round 1 (10:00 AM–4:00 PM, $30) and Round 2
            (5:00 PM–Close, $30). Armbands are purchased at the gate.
          </>
        ),
      },
      {
        question: "Can I leave and re-enter?",
        answer: (
          <>
            Re-entry policy details will be posted as they are confirmed. {contactLine}
          </>
        ),
      },
    ],
  },

  // ── 3. Rides & Entertainment ───────────────────────────────
  {
    id: "rides",
    heading: "Rides & Entertainment",
    items: [
      {
        question: "Where can I find carnival and ride information?",
        answer: (
          <>
            Ride and carnival information will be announced as it is confirmed. Check the{" "}
            <Link href="/fair-info" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Fair Info
            </Link>{" "}
            page and follow us on{" "}
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
            for updates as opening day approaches.
          </>
        ),
      },
      {
        question: "Are there height or age restrictions on rides?",
        answer: (
          <>
            Individual ride restrictions are set by the ride operators and vary by attraction. Specific
            requirements will be posted at each ride. Parents and guardians are encouraged to review
            ride requirements on arrival.
          </>
        ),
      },
      {
        question: "Is food available at the fair?",
        answer: (
          <>
            Yes. Food vendors serve a variety of fair favorites throughout the fairgrounds during the
            event. Additional vendor information will be posted as it is confirmed.
          </>
        ),
      },
      {
        question: "Can I bring outside food or drinks?",
        answer: (
          <>
            Outside food and beverage policy details will be posted as they are confirmed. {contactLine}
          </>
        ),
      },
      {
        question: "Are cash and cards accepted?",
        answer: (
          <>
            Yes. Gate admission accepts <strong>Cash</strong> or <strong>Card</strong>. Checks are not accepted at the gate. {contactLine}
          </>
        ),
      },
    ],
  },

  // ── 4. Accessibility ───────────────────────────────────────
  {
    id: "accessibility",
    heading: "Accessibility",
    items: [
      {
        question: "Is the fair accessible for guests with disabilities?",
        answer: (
          <>
            The West Tennessee State Fair welcomes guests with disabilities. Accessibility
            arrangements may vary by area and event. Guests who need accessibility assistance or
            information are encouraged to contact the fair <strong>before attending</strong> so that
            staff can help plan their visit. Final details regarding accessible parking, routes,
            restrooms, seating, and event access will be shared as they are confirmed.{" "}
            {contactLine}
          </>
        ),
      },
      {
        question: "Are service animals allowed?",
        answer: (
          <>
            Yes. <strong>Service animals are permitted</strong> in accordance with applicable law.
            Please contact the fair if you have specific questions about access.
          </>
        ),
      },
      {
        question: "Can I bring a pet?",
        answer: (
          <>
            Pets and emotional-support animals are generally not permitted at the fair. Service animals
            as defined under applicable law are welcome. {contactLine}
          </>
        ),
      },
    ],
  },

  // ── 5. Exhibits & Competitions ─────────────────────────────
  {
    id: "exhibits",
    heading: "Exhibits & Competitions",
    items: [
      {
        question: "Where can I find information about exhibits?",
        answer: (
          <>
            Visit the{" "}
            <Link href="/exhibits" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Exhibits page
            </Link>{" "}
            for a complete list of exhibit categories, entry guidelines, and downloadable premium
            books across all five departments: Arts &amp; Crafts, Agriculture, Culinary, Clothing
            &amp; Textiles, and Photography.
          </>
        ),
      },
      {
        question: "How do I enter livestock?",
        answer: (
          <>
            Visit the{" "}
            <Link href="/livestock" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Livestock page
            </Link>{" "}
            for information about the 2026 livestock shows, including the Cattle Show, Meat Goat Show, and Breeding Sheep Show.
          </>
        ),
      },
      {
        question: "How do I enter a pageant?",
        answer: (
          <>
            Visit the{" "}
            <Link href="/pageants" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Pageants page
            </Link>{" "}
            for information about our pageant programs, entry details, eligibility requirements, and
            crowning schedules.
          </>
        ),
      },
    ],
  },

  // ── 6. Vendors, Sponsors & Volunteers ─────────────────────
  {
    id: "participate",
    heading: "Vendors, Sponsors & Volunteers",
    items: [
      {
        question: "How do I become a vendor?",
        answer: (
          <>
            Visit our{" "}
            <Link href="/partner-with-us/vendors" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Vendors page
            </Link>{" "}
            to review vendor information and submit an application for a commercial or food vendor
            space at the 2026 fair.
          </>
        ),
      },
      {
        question: "How do I become a sponsor?",
        answer: (
          <>
            Visit our{" "}
            <Link href="/partner-with-us/sponsors" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Sponsors page
            </Link>{" "}
            to learn about sponsorship opportunities and submit an inquiry. Sponsorship helps support
            the fair and connects your brand with the West Tennessee community.
          </>
        ),
      },
      {
        question: "How do I volunteer?",
        answer: (
          <>
            Visit our{" "}
            <Link href="/partner-with-us/volunteer" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Volunteer page
            </Link>{" "}
            to submit a volunteer interest form. The fair relies on the generosity of our community
            volunteers every year.
          </>
        ),
      },
    ],
  },

  // ── 7. Contact & Updates ───────────────────────────────────
  {
    id: "contact",
    heading: "Contact & Updates",
    items: [
      {
        question: "How can I contact the fair?",
        answer: (
          <>
            You can reach the West Tennessee State Fair by email at{" "}
            <a
              href={`mailto:${FAIR_CONFIG.contact.email}`}
              className="underline hover:opacity-70 font-medium"
              style={{ color: "#2C4A2E" }}
            >
              {FAIR_CONFIG.contact.email}
            </a>
            .
          </>
        ),
      },
      {
        question: "Where will the fairgrounds map be posted?",
        answer: (
          <>
            The fairgrounds map will be published on this website once the layout is confirmed closer
            to opening day. Check back at wtsfair.com or follow us on Facebook and Instagram for
            updates.
          </>
        ),
      },
      {
        question: "How do I receive fair updates?",
        answer: (
          <>
            Sign up for our{" "}
            <Link href="/#stay-updated" className="underline hover:opacity-70" style={{ color: "#2C4A2E" }}>
              Fair Updates email list
            </Link>{" "}
            at the bottom of the homepage to receive announcements about the topics that matter most
            to you — entertainment, exhibits, livestock, pageants, vendors, and more. You can also
            follow us on{" "}
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
            </a>
            .
          </>
        ),
      },
    ],
  },
];

// FAQPage JSON-LD structured data
// Plain-text answers for search engine rich results — keep in sync with the JSX answers above.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "When is the 2026 West Tennessee State Fair?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 2026 West Tennessee State Fair runs from Thursday, October 15 through Saturday, October 24, 2026 — ten days of family fun, livestock shows, exhibits, pageants, rides, and entertainment in Henderson, Tennessee.",
      },
    },
    {
      "@type": "Question",
      "name": "Where is the fair located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fair is held at the West Tennessee State Fairgrounds at 575 Fourth Street, Henderson, Tennessee 38340. Henderson is roughly 90 miles east of Memphis and 30 miles east of Jackson via US-70 E.",
      },
    },
    {
      "@type": "Question",
      "name": "Where should I park?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free parking is available at the fairgrounds every day of the fair — there are no parking fees. Final parking guidance will be posted closer to opening day.",
      },
    },
    {
      "@type": "Question",
      "name": "What time does the fair open?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Opening times are confirmed for Saturdays — October 17 and 24 open at 11:00 AM. Specific daily hours for other days are still to be announced. Check the Fair Info page at wtsfair.com/fair-info for updates.",
      },
    },
    {
      "@type": "Question",
      "name": "What should I do if it rains?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The West Tennessee State Fair generally operates during normal seasonal weather. Individual events may be adjusted when weather creates safety concerns. Check the official website and social media for updates before traveling.",
      },
    },
    {
      "@type": "Question",
      "name": "How much is admission?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most days are $5 for all ages at the gate. Special event days (Rodeo Night Oct 16, Rodeo Saturday Oct 17, and Junior Rodeo Oct 20) are $15 for adults and $10 for children ages 12 and under. Children under 3 are always free.",
      },
    },
    {
      "@type": "Question",
      "name": "Are children admitted free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Children under 3 are always free — every day, at all gates. On standard $5 days, all other ages pay $5. On special event days, children ages 12 and under are $10.",
      },
    },
    {
      "@type": "Question",
      "name": "Are tickets sold online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fair is not currently offering online ticket sales. Admission is purchased at the gate on the day of your visit.",
      },
    },
    {
      "@type": "Question",
      "name": "Are ride armbands available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Unlimited-ride armbands are sold separately from gate admission. On Saturdays, armbands are split into two sessions — Round 1 (10:00 AM–4:00 PM, $30) and Round 2 (5:00 PM–Close, $30). Armbands are purchased at the gate.",
      },
    },
    {
      "@type": "Question",
      "name": "Is food available at the fair?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Food vendors serve a variety of fair favorites throughout the fairgrounds during the event.",
      },
    },
    {
      "@type": "Question",
      "name": "Is the fair accessible for guests with disabilities?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The West Tennessee State Fair welcomes guests with disabilities. Guests needing accessibility assistance are encouraged to contact the fair before attending at wtsfair@gmail.com. Final accessibility details will be shared as they are confirmed.",
      },
    },
    {
      "@type": "Question",
      "name": "Are service animals allowed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Service animals are permitted in accordance with applicable law.",
      },
    },
    {
      "@type": "Question",
      "name": "Where can I find information about exhibits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit the Exhibits page at wtsfair.com/exhibits for a complete list of exhibit categories, entry guidelines, and downloadable premium books across Arts & Crafts, Agriculture, Culinary, Clothing & Textiles, and Photography.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I enter livestock?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit the Livestock page at wtsfair.com/livestock for information about the 2026 livestock shows — Cattle, Meat Goat, and Breeding Sheep. Registration opens soon.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I enter a pageant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit the Pageants page at wtsfair.com/pageants for information about pageant programs, entry details, eligibility requirements, and crowning schedules.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I become a vendor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit the Vendors page at wtsfair.com/partner-with-us/vendors to review vendor information and submit an application for a commercial or food vendor space at the 2026 fair.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I become a sponsor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit the Sponsors page at wtsfair.com/partner-with-us/sponsors to learn about sponsorship opportunities and submit an inquiry. Sponsorship connects your brand with the West Tennessee community.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I volunteer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit the Volunteer page at wtsfair.com/partner-with-us/volunteer to submit a volunteer interest form. The fair relies on community volunteers every year.",
      },
    },
    {
      "@type": "Question",
      "name": "How can I contact the fair?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can reach the West Tennessee State Fair by email at wtsfair@gmail.com.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I receive fair updates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sign up for the Fair Updates email list at wtsfair.com to receive announcements about entertainment, exhibits, livestock, pageants, vendors, and more. You can also follow us on Facebook (facebook.com/WTSFAIR) and Instagram (@westtnstatefair).",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wtsfair.com" },
    { "@type": "ListItem", position: 2, name: "Frequently Asked Questions", item: "https://www.wtsfair.com/faq" },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHero
        overline="West Tennessee State Fair 2026"
        headline="Frequently Asked"
        headlineAccent="Questions"
        subtext="Find quick answers to the most common questions about visiting, participating, and getting in touch."
        accentColor="#D4A827"
      />

      {/* ── Jump-link section nav ─────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <nav aria-label="FAQ section jump links">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-semibold tracking-wider uppercase">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
                    style={{ color: "#D4A827", letterSpacing: "0.12em" }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* ── FAQ sections ─────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F5EDD4" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">

          {sections.map((section, si) => (
            <section
              key={section.id}
              id={section.id}
              className={si > 0 ? "mt-16" : ""}
              aria-labelledby={`faq-section-${section.id}`}
            >
              {/* Section header */}
              <div className="mb-6">
                <div
                  className="inline-block w-10 h-0.5 mb-3"
                  style={{ backgroundColor: "#D4A827" }}
                  aria-hidden="true"
                />
                <h2
                  id={`faq-section-${section.id}`}
                  className="text-2xl sm:text-3xl font-bold italic"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#2C4A2E",
                  }}
                >
                  {section.heading}
                </h2>
              </div>

              <FaqAccordion items={section.items} idPrefix={section.id} />
            </section>
          ))}

          {/* ── Contact CTA ──────────────────────────────────── */}
          <div
            className="mt-16 p-8 text-center"
            style={{ backgroundColor: "#2C4A2E" }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.2em" }}
            >
              Still have questions?
            </p>
            <p
              className="text-2xl font-bold italic mb-5"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#F5EDD4",
              }}
            >
              We&apos;re happy to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href={`mailto:${FAIR_CONFIG.contact.email}`}
                className="flex items-center gap-2 px-6 py-3 font-bold tracking-wider uppercase transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
              >
                {FAIR_CONFIG.contact.email}
              </a>
            </div>
          </div>

          {/* Back to top */}
          <div className="mt-8 text-center">
            <a
              href="#"
              className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
              style={{ color: "#8B7355", letterSpacing: "0.15em" }}
            >
              ↑ Back to top
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
