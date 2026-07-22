// ─────────────────────────────────────────────────────────────
// PageHero — shared inner-page hero used by Fair Info, Exhibits,
// Pageants, Livestock, and any future section pages.
//
// MEDIA SWAP: replace the gradient placeholder div with:
//   <Image src="/images/[page]-hero.jpg" alt="" fill priority
//          sizes="100vw" className="object-cover object-center" />
// Keep the overlay <div> below it — it keeps text readable.
// ─────────────────────────────────────────────────────────────

interface PageHeroProps {
  overline: string;
  headline: string;
  headlineAccent?: string;       // rendered in accent color after headline
  subtext?: string;
  photoHint: string;             // describes ideal photo for this hero
  photoLabel: string;            // short label shown on placeholder
  accentColor?: string;          // defaults to gold
  height?: "standard" | "tall"; // "tall" for pageants
}

export default function PageHero({
  overline,
  headline,
  headlineAccent,
  subtext,
  photoHint,
  photoLabel,
  accentColor = "#D4A827",
  height = "standard",
}: PageHeroProps) {
  const minH = height === "tall" ? "min-h-[58vh]" : "min-h-[44vh]";

  return (
    <section
      className={`relative ${minH} flex items-end overflow-hidden`}
      aria-label={`${headline}${headlineAccent ? " " + headlineAccent : ""} hero`}
    >
      {/* ══════════════════════════════════════════
          MEDIA PLACEHOLDER
          PHOTO BRIEF: {photoHint}
          Replace this entire div with an <Image> tag when photos are ready.
          ══════════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        role="img"
        aria-label={`Photo placeholder: ${photoHint}`}
      >
        {/* Gradient stand-in — remove when real photo is added */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #1E3320 0%, #2C4A2E 50%, #1A2A1A 100%)",
          }}
          aria-hidden="true"
        />
        {/* Placeholder hint text — hidden when photo is present */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="w-9 h-9 opacity-[0.12]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#F5EDD4"
            strokeWidth={1}
          >
            <rect x="2" y="4" width="20" height="16" rx="1.5" />
            <path d="M2 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
          </svg>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "rgba(245,237,212,0.18)" }}
          >
            {photoLabel}
          </span>
          <span
            className="text-xs text-center max-w-xs px-4 leading-snug"
            style={{ color: "rgba(245,237,212,0.1)" }}
          >
            {photoHint}
          </span>
        </div>
      </div>
      {/* ══ END MEDIA PLACEHOLDER ══ */}

      {/* Overlay — always keep; ensures text is legible over any photo */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.1) 25%, rgba(20,35,20,0.88) 70%, rgba(18,30,18,0.97) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Grain texture for warmth */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
        }}
        aria-hidden="true"
      />

      {/* Content — bottom-anchored editorial layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full pb-12 pt-32">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: accentColor, letterSpacing: "0.25em" }}
        >
          {overline}
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold italic leading-tight mb-3"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#F5EDD4",
          }}
        >
          {headline}
          {headlineAccent && (
            <span style={{ color: accentColor }}> {headlineAccent}</span>
          )}
        </h1>
        {subtext && (
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{ color: "#A8BFA9" }}
          >
            {subtext}
          </p>
        )}
      </div>
    </section>
  );
}
