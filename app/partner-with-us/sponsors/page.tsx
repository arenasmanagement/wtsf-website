import type { Metadata } from "next";
import Link from "next/link";
import SponsorForm from "@/components/partner/SponsorForm";
import { SPONSOR_PACKAGES } from "@/lib/sponsor-config";
import { FAIR_CONFIG } from "@/lib/fair-config";
import StayUpdatedCallout from "@/components/updates/StayUpdatedCallout";

export const metadata: Metadata = {
  title: "Become a 2026 Sponsor — Packages from $250 to $10,000+",
  description:
    "Support the West Tennessee State Fair and connect your business with visitors from across West Tennessee. View 2026 sponsorship packages — naming rights, logo placement, signage, social media, and fair tickets.",
  alternates: {
    canonical: "https://www.wtsfair.com/partner-with-us/sponsors",
  },
  openGraph: {
    url: "https://www.wtsfair.com/partner-with-us/sponsors",
  },
};

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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wtsfair.com" },
    { "@type": "ListItem", position: 2, name: "Partner With Us", item: "https://www.wtsfair.com/partner-with-us" },
    { "@type": "ListItem", position: 3, name: "Sponsors", item: "https://www.wtsfair.com/partner-with-us/sponsors" },
  ],
};

export default function SponsorsPage() {
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
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs" style={{ color: "rgba(245,237,212,0.65)" }}>
            <Link href="/partner-with-us" className="transition-colors hover:text-white" style={{ color: "rgba(245,237,212,0.65)" }}>
              Partner With Us
            </Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: "#D4A827" }}>Sponsors</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="py-16 md:py-20" style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
            {YEAR} Sponsorship Opportunities
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold italic leading-tight mb-5"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Become a Sponsor
          </h1>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#C5D9C6" }}>
            Sponsoring the West Tennessee State Fair puts your brand at the center of one of West
            Tennessee&apos;s longest-standing community traditions. Ten fabulous days, thousands of
            visitors, and lots of opportunities to showcase your business or organization.
          </p>
        </div>
      </div>

      {/* ── Sponsorship packages ──────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="packages-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <SectionLabel>Packages</SectionLabel>
            <SectionHeading id="packages-heading">Sponsorship Packages</SectionHeading>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#5C4A32" }}>
              We can work out ideas to fit every budget. Review the tiers below, then use the application
              form to apply or request a custom arrangement.
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
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{ color: tier.id === "best-of-show" ? "rgba(212,168,39,0.75)" : "#8B7355", letterSpacing: "0.15em" }}
                    >
                      {tier.name}
                    </p>
                    <p
                      className="text-3xl font-bold italic"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: tier.id === "best-of-show" ? "#F5EDD4" : tier.ribbonColor }}
                    >
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

          {/* Custom options callout */}
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
                Fill out the form below to apply for a {YEAR} West Tennessee State Fair sponsorship.
                Submission of this form is an application — it does not guarantee acceptance. We will
                review your application and contact you about next steps.
              </p>
            </div>
            <SponsorForm />
          </div>

          {/* ── What Happens Next? ────────────────────────────── */}
          <div className="mt-14 p-7 sm:p-9" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>
              Application Process
            </p>
            <h2
              className="text-2xl font-bold italic mb-8"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
            >
              What Happens Next?
            </h2>
            <ol
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
              aria-label="Sponsorship application process steps"
            >
              {[
                {
                  step: 1,
                  title: "Submit Your Application",
                  body: "Complete and submit the sponsorship application form above.",
                },
                {
                  step: 2,
                  title: "Application Review",
                  body: "The fair team reviews your application and selected sponsorship package.",
                },
                {
                  step: 3,
                  title: "We'll Contact You",
                  body: "A fair representative will reach out to confirm your sponsorship and answer any questions.",
                },
                {
                  step: 4,
                  title: "Confirmation & Next Steps",
                  body: "Once accepted, you will receive confirmation along with payment instructions and logo submission details.",
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
                  <p className="text-sm font-bold" style={{ color: "#2C4A2E" }}>{item.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>{item.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Paying by Check? ──────────────────────────────── */}
          <div className="mt-6 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#2C4A2E" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>
                Paying by Check?
              </p>
              <p className="text-base font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
                Mail your payment to:
              </p>
              <address className="not-italic mb-3 text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                West Tennessee State Fair<br />
                P.O. Box 1404<br />
                Jackson, TN 38302
              </address>
              <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                Please include your business or organization name with your payment so it can be matched
                to your sponsorship application.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Other ways to partner ──────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#F5EDD4" }} aria-labelledby="other-ways-sponsor-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
            Other Ways to Partner
          </p>
          <h2
            id="other-ways-sponsor-heading"
            className="text-2xl font-bold italic mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            More Ways to Get Involved
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link
              href="/partner-with-us/vendors"
              className="group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#F5EDD4" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#8B2E2E" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#8B2E2E", letterSpacing: "0.15em" }}>Vendor Space</p>
                <p className="text-lg font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>Apply as a Vendor</p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  Operate your own booth across 10 days in October. Booth sizes from 10×10 to 50×20.
                </p>
              </div>
            </Link>

            <Link
              href="/partner-with-us/volunteer"
              className="group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#F5EDD4" }} aria-hidden="true">
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

      {/* ── Stay Updated callout ──────────────────────────────── */}
      <div style={{ backgroundColor: "#F5EDD4" }} className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <StayUpdatedCallout
            heading="Stay Informed on Sponsorship News"
            description="Sign up to be notified when new sponsorship opportunities, packages, or fair announcements are made."
            topic="general"
          />
        </div>
      </div>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#2C4A2E" }} aria-labelledby="sponsor-contact-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>Questions?</p>
          <h2 id="sponsor-contact-heading" className="text-3xl font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
            Get in Touch
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#C5D9C6" }}>
            Have questions about a sponsorship package or want to discuss custom options? Reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={`mailto:wtsfair@gmail.com?subject=Sponsorship%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{ color: "#F5EDD4" }}
            >
              <span style={{ color: "#D4A827" }}>✉</span>
              <span className="text-sm">wtsfair@gmail.com</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
