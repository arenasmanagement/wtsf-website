import Link from "next/link";

// Sponsorship tiers drive presentation order, card size, and prominence.
// Tier names are intentionally NOT shown on public-facing sponsor cards.
type SponsorTier = "headline" | "featured" | "standard" | "supporting";

interface Sponsor {
  name: string;
  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
  url: string;
  tagline?: string;
  tier: SponsorTier;
}

const SPONSORS_2026: Sponsor[] = [
  // ── BEST OF SHOW ──────────────────────────────────────────────────────
  {
    name: "First Best One Tire & Service of Jackson",
    logo: "/logos/first-best-one-tire-logo-optimized.png",
    logoWidth: 880,
    logoHeight: 440,
    url: "https://www.bestoneofjackson.com",
    tagline: "Selling Tires. Serving People.",
    tier: "headline",
  },

  // ── RED RIBBON ────────────────────────────────────────────────────────
  {
    name: "R&J Feed Supply",
    logo: "/logos/r-and-j-feed-supply-logo.png",
    logoWidth: 400,
    logoHeight: 200,
    url: "#",
    tier: "standard",
  },

  // ── WHITE RIBBON ──────────────────────────────────────────────────────
  {
    name: "Lofton Chevrolet",
    logo: "/logos/lofton-chevrolet-logo.png",
    logoWidth: 400,
    logoHeight: 200,
    url: "#",
    tier: "supporting",
  },
  {
    name: "The Horsepower Factory",
    logo: "/logos/horsepower-factory-logo.png",
    logoWidth: 400,
    logoHeight: 200,
    url: "#",
    tier: "supporting",
  },
];

// ── Headline sponsor — full-width featured card, largest logo, tagline ──
function HeadlineCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative px-8 py-8 mb-4 transition-opacity duration-150 hover:opacity-90"
      style={{
        backgroundColor: "rgba(212,168,39,0.07)",
        border: "2px solid rgba(212,168,39,0.5)",
      }}
      aria-label={`Visit ${sponsor.name} website`}
    >
      <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
      <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
      <div className="text-center">
        {sponsor.logo && (
          <div className="flex justify-center mb-3">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              width={sponsor.logoWidth}
              height={sponsor.logoHeight}
              style={{ objectFit: "contain", maxWidth: "380px", width: "100%", height: "auto" }}
            />
          </div>
        )}
        {sponsor.tagline && (
          <>
            <div className="w-10 h-px mx-auto mb-2" style={{ backgroundColor: "rgba(212,168,39,0.45)" }} aria-hidden="true" />
            <p className="text-sm italic" style={{ color: "#A8BFA9" }}>&ldquo;{sponsor.tagline}&rdquo;</p>
          </>
        )}
      </div>
    </a>
  );
}

function StandardCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-5 transition-opacity duration-150 hover:opacity-85"
      style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,39,0.2)", minHeight: "100px" }}
      aria-label={`Visit ${sponsor.name} website`}
    >
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          width={sponsor.logoWidth}
          height={sponsor.logoHeight}
          style={{ objectFit: "contain", maxWidth: "140px", maxHeight: "90px", width: "auto", height: "auto" }}
        />
      ) : (
        <span className="text-center text-sm font-semibold leading-tight px-2" style={{ color: "#F5EDD4" }}>
          {sponsor.name}
        </span>
      )}
    </a>
  );
}

function SupportingCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-4 transition-opacity duration-150 hover:opacity-85"
      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,39,0.15)", minHeight: "80px" }}
      aria-label={`Visit ${sponsor.name} website`}
    >
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          width={sponsor.logoWidth}
          height={sponsor.logoHeight}
          style={{ objectFit: "contain", maxWidth: "110px", maxHeight: "70px", width: "auto", height: "auto" }}
        />
      ) : (
        <span className="text-center text-xs font-semibold leading-tight px-2" style={{ color: "#C5D9C6" }}>
          {sponsor.name}
        </span>
      )}
    </a>
  );
}

export default function SponsorSection() {
  const headline   = SPONSORS_2026.filter((s) => s.tier === "headline");
  const featured   = SPONSORS_2026.filter((s) => s.tier === "featured");
  const standard   = SPONSORS_2026.filter((s) => s.tier === "standard");
  const supporting = SPONSORS_2026.filter((s) => s.tier === "supporting");

  return (
    <section style={{ backgroundColor: "#1E3320" }} aria-labelledby="sponsors-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.25em" }}>
            With Gratitude
          </p>
          <h2 id="sponsors-heading" className="text-3xl sm:text-4xl font-bold italic leading-tight mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
            Thank You to Our <span style={{ color: "#D4A827" }}>2026 Sponsors</span>
          </h2>
          <div className="w-10 h-0.5 mx-auto mb-4" style={{ backgroundColor: "#D4A827" }} aria-hidden="true" />
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: "#A8BFA9" }}>
            These businesses and organizations make the West Tennessee State Fair possible.
            We are grateful for their commitment to our community.
          </p>
        </div>

        {headline.map((s) => <HeadlineCard key={s.name} sponsor={s} />)}

        {featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {featured.map((s) => <StandardCard key={s.name} sponsor={s} />)}
          </div>
        )}

        {standard.length > 0 && (
          <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {standard.map((s) => <StandardCard key={s.name} sponsor={s} />)}
          </div>
        )}

        {supporting.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-8">
            {supporting.map((s) => <SupportingCard key={s.name} sponsor={s} />)}
          </div>
        )}

        <div className="text-center">
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#A8BFA9" }}>
            Interested in sponsoring the 2026 West Tennessee State Fair?
          </p>
          <Link href="/partner-with-us/sponsors"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 hover:opacity-80"
            style={{ color: "#D4A827", letterSpacing: "0.1em" }}>
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
