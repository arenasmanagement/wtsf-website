import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// SPONSOR DATA — update each season.
// Replace placeholder names with confirmed sponsors.
// Swap in <Image> logos when files are received.
//
// Internal tier order (DO NOT display these labels publicly):
//   group 0 → Best of Show  (1 sponsor, featured)
//   group 1 → Blue Ribbon   (2–3 sponsors, prominent)
//   group 2 → Red Ribbon    (3–5 sponsors, standard)
//   group 3 → White Ribbon  (5+ sponsors, compact)
//
// Visual hierarchy communicates prominence — no text labels needed.
// ─────────────────────────────────────────────────────────────

const sponsorGroups = [
  // ── Featured (Best of Show) ──────────────────────────────
  // Full-width solo treatment. Gold accent border.
  {
    sponsors: [{ name: "Presenting Sponsor" }],
    cols: "grid-cols-1",
    cardHeight: "160px",
    logoSize: "text-base",
    gap: "gap-4",
    featured: true,
  },

  // ── Prominent (Blue Ribbon) ──────────────────────────────
  // 2-column, taller cards, visible presence.
  {
    sponsors: [
      { name: "Chester County Bank" },
      { name: "West TN Healthcare" },
    ],
    cols: "grid-cols-1 sm:grid-cols-2",
    cardHeight: "108px",
    logoSize: "text-sm",
    gap: "gap-3",
    featured: false,
  },

  // ── Standard (Red Ribbon) ────────────────────────────────
  // 4-column, standard height.
  {
    sponsors: [
      { name: "Henderson Auto Group" },
      { name: "Simmons Bank" },
      { name: "Pinson Ford" },
      { name: "Farm Bureau Insurance" },
    ],
    cols: "grid-cols-2 sm:grid-cols-4",
    cardHeight: "80px",
    logoSize: "text-xs",
    gap: "gap-2.5",
    featured: false,
  },

  // ── Supporting (White Ribbon) ────────────────────────────
  // 5-column, compact, acknowledged.
  {
    sponsors: [
      { name: "Jackson Purchase Energy" },
      { name: "Tennessee Farmers Co-op" },
      { name: "Local Business" },
      { name: "Local Business" },
      { name: "Local Business" },
    ],
    cols: "grid-cols-3 sm:grid-cols-5",
    cardHeight: "60px",
    logoSize: "text-xs",
    gap: "gap-2",
    featured: false,
  },
];

export default function SponsorSection() {
  return (
    <section
      style={{ backgroundColor: "#1E3320" }}
      aria-labelledby="sponsors-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">

        {/* ── Header ── */}
        <div className="text-center mb-14">
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
            The West Tennessee State Fair exists because of the generosity of
            local businesses and community partners who believe in our mission
            and our tradition.
          </p>
        </div>

        {/* ── Sponsor wall ── */}
        <div className="flex flex-col gap-8">
          {sponsorGroups.map((group, gi) => (
            <div key={gi} className={`grid ${group.cols} ${group.gap}`}>
              {group.sponsors.map((s, si) => (
                <div
                  key={`${gi}-${si}`}
                  className="relative flex items-center justify-center px-4 text-center transition-all duration-150 hover:opacity-75"
                  style={{
                    minHeight: group.cardHeight,
                    backgroundColor: group.featured
                      ? "rgba(212,168,39,0.07)"
                      : "rgba(255,255,255,0.04)",
                    border: group.featured
                      ? "1px solid rgba(212,168,39,0.2)"
                      : "1px solid rgba(255,255,255,0.07)",
                  }}
                  role="img"
                  aria-label={`Sponsor: ${s.name}`}
                >
                  {/* Gold corner marks on featured slot only */}
                  {group.featured && (
                    <>
                      <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
                      <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
                      <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
                    </>
                  )}

                  {/* LOGO PLACEHOLDER
                      Replace this entire inner div with:
                        <Image
                          src="/sponsors/filename.png"
                          alt="Business Name"
                          fill
                          className="object-contain p-4"
                        />
                      and remove the text span below.
                  */}
                  <span
                    className={`font-semibold leading-snug ${group.logoSize}`}
                    style={{
                      color: group.featured
                        ? "rgba(212,168,39,0.45)"
                        : "rgba(245,237,212,0.35)",
                    }}
                  >
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div
          className="mt-14 grid sm:grid-cols-2 overflow-hidden"
          style={{ border: "1px solid rgba(245,237,212,0.08)" }}
        >
          <div
            className="p-7"
            style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827" }}
            >
              Partner With Us
            </p>
            <h3
              className="text-xl font-bold italic mb-3 leading-tight"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#F5EDD4",
              }}
            >
              Support the Fair,<br />Support the Community
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#A8BFA9" }}>
              Sponsoring the West Tennessee State Fair puts your business at
              the center of one of the region's longest-standing community
              traditions — reaching thousands of West Tennessee families
              every October.
            </p>
          </div>
          <div
            className="p-7 flex flex-col justify-between gap-6"
            style={{ backgroundColor: "rgba(0,0,0,0.12)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#A8BFA9" }}>
              Partnership opportunities are available for businesses of all
              sizes. Recognition is provided online, on-site, and across our
              social media platforms throughout the season.
            </p>
            <Link
              href="/about#sponsorship"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "#D4A827",
                color: "#1A1A1A",
                letterSpacing: "0.1em",
              }}
            >
              Contact Us to Learn More
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
