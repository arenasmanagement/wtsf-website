import Image from "next/image";

// ─────────────────────────────────────────────────────────────
// PageHero — shared inner-page hero used by Fair Info, Exhibits,
// Pageants, Livestock, and any future section pages.
// ─────────────────────────────────────────────────────────────

interface PageHeroProps {
  overline: string;
  headline: string;
  headlineAccent?: string;       // rendered in accent color after headline
  subtext?: string;
  imageSrc?: string;             // path to hero image in /public/images/
  accentColor?: string;          // defaults to gold
  height?: "standard" | "tall"; // "tall" for pageants
  objectPosition?: string;       // override object-position on the hero image (e.g. "center 20%")
}

export default function PageHero({
  overline,
  headline,
  headlineAccent,
  subtext,
  imageSrc,
  accentColor = "#D4A827",
  height = "standard",
  objectPosition = "center",
}: PageHeroProps) {
  const minH = height === "tall" ? "min-h-[58vh]" : "min-h-[44vh]";

  return (
    <section
      className={`relative ${minH} flex items-end overflow-hidden`}
      aria-label={`${headline}${headlineAccent ? " " + headlineAccent : ""} hero`}
    >
      {/* ══════════════════════════════════════════
          MEDIA LAYER
          ══════════════════════════════════════════ */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      ) : (
        /* Gradient fallback when no image is supplied */
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #1E3320 0%, #2C4A2E 50%, #1A2A1A 100%)",
          }}
          aria-hidden="true"
        />
      )}

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
