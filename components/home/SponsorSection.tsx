import Link from "next/link";

export default function SponsorSection() {
  return (
    <section
      style={{ backgroundColor: "#1E3320" }}
      aria-labelledby="sponsors-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            With Gratitude
          </p>
          <h2
            id="sponsors-heading"
            className="text-3xl sm:text-4xl font-bold italic leading-tight mb-4"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5EDD4",
            }}
          >
            Thank You to Our{" "}
            <span style={{ color: "#D4A827" }}>2026 Sponsors</span>
          </h2>
          <div
            className="w-10 h-0.5 mx-auto mb-5"
            style={{ backgroundColor: "#D4A827" }}
            aria-hidden="true"
          />
          <p
            className="text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: "#A8BFA9" }}
          >
            These businesses and organizations make the West Tennessee State Fair possible.
            We are grateful for their commitment to our community.
          </p>
        </div>

        {/* ── Best of Show Sponsor — First Best One Tire ── */}
        <div
          className="relative mb-6 px-8 py-10 md:py-12"
          style={{
            backgroundColor: "rgba(212,168,39,0.07)",
            border: "2px solid rgba(212,168,39,0.5)",
          }}
        >
          {/* Gold corner marks */}
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />

          <div className="text-center">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.3em" }}
            >
              Best of Show Sponsor
            </p>

            {/* TODO: Replace with official First Best One Tire logo image when available */}
            {/* <img src="/logos/first-best-one-tire-logo.png" alt="First Best One Tire" className="h-20 mx-auto mb-5 object-contain" /> */}
            <p
              className="text-4xl sm:text-5xl font-bold italic mb-2"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#F5EDD4",
              }}
            >
              First Best One Tire
            </p>

            <div
              className="w-12 h-0.5 mx-auto mb-4"
              style={{ backgroundColor: "rgba(212,168,39,0.4)" }}
              aria-hidden="true"
            />
            <p
              className="text-base italic mb-6"
              style={{ color: "#A8BFA9" }}
            >
              &ldquo;Selling Tires, Serving People.&rdquo;
            </p>
          </div>
        </div>

        {/* ── Yellow Ribbon Sponsor — Arenas Management Co. ── */}
        <div
          className="relative mb-10 px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:gap-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(212,168,39,0.2)",
          }}
        >
          <div className="flex-shrink-0 mb-4 sm:mb-0 flex items-center justify-center sm:justify-start">
            {/* AMC Logo */}
            <img
              src="/logos/amc-logo.svg"
              alt="Arenas Management Co."
              width={120}
              height={70}
              style={{ objectFit: "contain", maxHeight: "70px" }}
            />
          </div>
          <div className="flex-1">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: "rgba(212,168,39,0.7)", letterSpacing: "0.2em" }}
            >
              Yellow Ribbon Sponsor
            </p>
            <p
              className="text-xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#F5EDD4",
              }}
            >
              Arenas Management Co.
            </p>
          </div>
        </div>

        {/* ── Become a Sponsor CTA ── */}
        <div className="text-center">
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "#A8BFA9" }}
          >
            Interested in sponsoring the 2026 West Tennessee State Fair?
          </p>
          <Link
            href="/partner-with-us/sponsors"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 hover:opacity-80"
            style={{ color: "#D4A827", letterSpacing: "0.1em" }}
          >
            View Sponsorship Packages
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
