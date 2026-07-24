import type { Metadata } from "next";
import Link from "next/link";
import VolunteerForm from "@/components/partner/VolunteerForm";
import { FAIR_CONFIG } from "@/lib/fair-config";

export const metadata: Metadata = {
  title: "Volunteer — Partner With Us | West Tennessee State Fair",
  description:
    "Volunteer at the West Tennessee State Fair. Help with gate operations, exhibit setup, show-day support, pageant coordination, and more. Express your interest online.",
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

export default function VolunteerPage() {
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
            <span style={{ color: "#D4A827" }}>Volunteer</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="py-16 md:py-20" style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
            Give Your Time
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold italic leading-tight mb-5"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Volunteer at the Fair
          </h1>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: "#C5D9C6" }}>
            The West Tennessee State Fair runs on the effort of community members who give their time because
            they care about what this event means to Henderson. Volunteers are at the heart of everything that
            happens across those 10 days in October.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  VOLUNTEER CONTENT                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="volunteer-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <SectionLabel>How You Can Help</SectionLabel>
            <SectionHeading id="volunteer-heading">Volunteer Roles</SectionHeading>
          </div>

          {/* Roles + What to Expect */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            <div className="p-7" style={{ backgroundColor: "#2C4A2E" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>
                Where Volunteers Help
              </p>
              <ul className="space-y-3">
                {[
                  "Gate and ticket operations",
                  "Exhibit hall setup and management",
                  "Show-day livestock and staging support",
                  "Pageant-day coordination",
                  "General grounds and cleanup",
                  "Other fair operations as needed",
                ].map((role) => (
                  <li key={role} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: "#D4A827" }} aria-hidden="true" />
                    <p className="text-sm leading-relaxed" style={{ color: "#C5D9C6" }}>{role}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-7 flex flex-col gap-5" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.15em" }}>
                  What to Expect
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#5C4A32" }}>
                  Submitting the volunteer interest form does not guarantee a placement. Volunteer roles and
                  schedules are assigned based on fair needs and the availability of each applicant.
                  The fair team will review your interest and may reach out for additional information.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                  Whether you have one afternoon or the whole week, your time makes a difference.
                  This fair exists because of people like you.
                </p>
              </div>
              <div className="mt-auto p-4" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
                <p className="text-xs leading-relaxed" style={{ color: "#8B7355" }}>
                  Questions about volunteering? Email{" "}
                  <a href="mailto:wtsfair@gmail.com?subject=Volunteer%20Inquiry" className="font-bold" style={{ color: "#2C4A2E" }}>
                    wtsfair@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          </div>

          {/* ── Volunteer Interest Form ──────────────────────────── */}
          <div id="volunteer-form">
            <div className="mb-8">
              <SectionLabel>Express Your Interest</SectionLabel>
              <SectionHeading id="volunteer-form-heading">Volunteer Interest Form</SectionHeading>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#5C4A32" }}>
                Fill out the form below to express your interest in volunteering at the {YEAR} West Tennessee State Fair.
                Submission is an expression of interest — it does not guarantee a volunteer assignment.
              </p>
            </div>
            <VolunteerForm />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Other ways to partner ──────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#FDFAF3" }} aria-labelledby="other-ways-vol-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
            Other Ways to Partner
          </p>
          <h2
            id="other-ways-vol-heading"
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
              href="/partner-with-us/vendors"
              className="group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }} aria-hidden="true">
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
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#2C4A2E" }} aria-labelledby="vol-contact-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>Questions?</p>
          <h2 id="vol-contact-heading" className="text-3xl font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
            Get in Touch
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#C5D9C6" }}>
            Questions about volunteering at the fair? Reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={`mailto:wtsfair@gmail.com?subject=Volunteer%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
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
