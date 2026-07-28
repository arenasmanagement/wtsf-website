import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | West Tennessee State Fair",
  description: "The page you were looking for could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center"
      style={{ backgroundColor: "#F5EDD4" }}
    >
      {/* 404 heading */}
      <p
        className="text-8xl font-bold italic mb-4"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#D4A827" }}
        aria-hidden="true"
      >
        404
      </p>

      <p
        className="text-xs font-bold tracking-widest uppercase mb-4"
        style={{ color: "#8B7355", letterSpacing: "0.25em" }}
      >
        Page Not Found
      </p>

      <h1
        className="text-3xl sm:text-4xl font-bold italic leading-tight mb-5 max-w-lg"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
      >
        We couldn&apos;t find that page.
      </h1>

      <p className="text-base leading-relaxed mb-10 max-w-md" style={{ color: "#5C4A32" }}>
        The link may have moved or the address may have been typed incorrectly.
        Try one of the pages below or head back home.
      </p>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-10">
        {[
          { label: "Home",                href: "/" },
          { label: "Fair Info & Schedule", href: "/fair-info" },
          { label: "First-Time Visitors",  href: "/first-time-visitors" },
          { label: "FAQ",                  href: "/faq" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="px-5 py-3 text-sm font-bold tracking-wide uppercase text-center transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C4A2E]"
            style={{
              backgroundColor: "#2C4A2E",
              color: "#D4A827",
              letterSpacing: "0.08em",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Home button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827]"
        style={{
          backgroundColor: "#D4A827",
          color: "#1A1A1A",
          letterSpacing: "0.1em",
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <path strokeLinecap="round" d="M9 22V12h6v10" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
