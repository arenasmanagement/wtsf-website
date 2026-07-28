import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { FAIR_CONFIG } from "@/lib/fair-config";

export const metadata: Metadata = {
  title: "Partner With Us — Vendors, Sponsors & Volunteers | West Tennessee State Fair",
  description:
    "Three ways to get involved with the West Tennessee State Fair: become a sponsor, operate a vendor booth, or volunteer your time. View packages, apply online, or sign up.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
      {children}
    </p>
  );
}

export default function PartnerWithUsPage() {
  const YEAR = FAIR_CONFIG.year;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <PageHero
        overline={`${YEAR} West Tennessee State Fair`}
        headline="Partner With the"
        headlineAccent="West Tennessee State Fair"
        subtext="Ten fabulous days, thousands of visitors, and three ways to be part of something bigger. Choose the path that fits you."
        imageSrc="/images/partner-hero.webp"
        accentColor="#D4A827"
      />

      {/* ── Three opportunity cards ───────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="opportunities-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel>Three Ways to Get Involved</SectionLabel>
            <h2
              id="opportunities-heading"
              className="text-3xl sm:text-4xl font-bold italic leading-tight"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
            >
              How Would You Like to Participate?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Sponsor card */}
            <div className="relative flex flex-col p-8" style={{ backgroundColor: "#2C4A2E" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#D4A827" }} aria-hidden="true" />
              <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(212,168,39,0.15)" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>Sponsorship</p>
              <h3 className="text-2xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
                Become a Sponsor
              </h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#C5D9C6" }}>
                Get your brand in front of thousands of fair attendees. Packages from $250 to $10,000+ include naming rights, logo placement, event signage, social media exposure, and fair tickets.
              </p>
              <Link
                href="/partner-with-us/sponsors"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 self-start"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
              >
                View Packages
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Vendor card */}
            <div className="relative flex flex-col p-8" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#8B2E2E" }} aria-hidden="true" />
              <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ backgroundColor: "#F5EDD4" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#8B2E2E" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#8B2E2E", letterSpacing: "0.2em" }}>Vendor Space</p>
              <h3 className="text-2xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
                Apply as a Vendor
              </h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#5C4A32" }}>
                Operate your own booth at the fair. General merchandise, inside exhibit tent, and outside cooking-allowed spaces available. Booth sizes from 10×10 to 50×20.
              </p>
              <Link
                href="/partner-with-us/vendors"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 self-start"
                style={{ backgroundColor: "#8B2E2E", color: "#F5EDD4", letterSpacing: "0.1em" }}
              >
                View Booth Options
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Volunteer card */}
            <div className="relative flex flex-col p-8" style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#5C4A32" }} aria-hidden="true" />
              <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ backgroundColor: "#F5EDD4" }} aria-hidden="true">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#5C4A32" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#5C4A32", letterSpacing: "0.2em" }}>Community</p>
              <h3 className="text-2xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}>
                Volunteer at the Fair
              </h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#5C4A32" }}>
                Give your time to help make the fair happen. Volunteers assist with gate operations, exhibit setup, show-day support, pageant coordination, and general fair operations.
              </p>
              <Link
                href="/partner-with-us/volunteer"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 self-start"
                style={{ backgroundColor: "#5C4A32", color: "#F5EDD4", letterSpacing: "0.1em" }}
              >
                Sign Up to Volunteer
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Contact Section ────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ backgroundColor: "#2C4A2E" }}
        aria-labelledby="contact-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel>Questions?</SectionLabel>
          <h2 id="contact-heading" className="text-3xl font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
            Get in Touch
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#C5D9C6" }}>
            Questions about sponsorship, vendor spaces, or volunteering? Reach out directly and we&apos;ll help you find the right path.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={`mailto:wtsfair@gmail.com?subject=Partnership%20Inquiry%20%E2%80%94%20WTSF%20${YEAR}`}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{ color: "#F5EDD4" }}
            >
              <span style={{ color: "#D4A827" }}>✉</span>
              <span className="text-sm">wtsfair@gmail.com</span>
            </a>
            <div className="flex items-center gap-3" style={{ color: "#F5EDD4" }}>
              <span style={{ color: "#D4A827" }}>📮</span>
              <span className="text-sm">P.O. Box 1404, Jackson, TN 38302</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
