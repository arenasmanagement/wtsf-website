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
            <span style={{ color: "#D4A827" }}>Community Partners</span>
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
            The 2026 West Tennessee State Fair sponsorship lineup will be announced soon.
            We appreciate the businesses and organizations that continue supporting this
            tradition each year.
          </p>
        </div>

        {/* ── Coming Soon panel ── */}
        <div
          className="relative max-w-xl mx-auto text-center px-8 py-12"
          style={{
            backgroundColor: "rgba(212,168,39,0.05)",
            border: "1px solid rgba(212,168,39,0.18)",
          }}
        >
          {/* Gold corner marks */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />

          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            2026 Sponsors
          </p>
          <p
            className="text-2xl sm:text-3xl font-bold italic mb-8"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5EDD4",
            }}
          >
            Coming Soon
          </p>

          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ backgroundColor: "rgba(212,168,39,0.3)" }}
            aria-hidden="true"
          />

          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "#A8BFA9" }}
          >
            Interested in becoming a sponsor?
          </p>
          <Link
            href="/partner-with-us/sponsors"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 hover:opacity-80"
            style={{ color: "#D4A827", letterSpacing: "0.1em" }}
          >
            Visit our Partner With Us page to learn more
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
