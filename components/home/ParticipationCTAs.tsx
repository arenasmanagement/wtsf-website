import Image from "next/image";
import Link from "next/link";

const panels = [
  {
    title: "Enter a Pageant",
    subtitle: "Crown Your Champion",
    description:
      "Fair Queen, Little Miss, Baby Show, and more. Pageant competitions are open to all ages — register early to secure your spot.",
    cta: "Pageant Info",
    href: "/pageants",
    accentColor: "#D4A827",
    imageSrc: "/images/home-cta-pageants.webp",
    imageAlt: "West Tennessee State Fair pageant queens with crowns, sashes, and trophies",
    bgDark: "#1E2A1E",
  },
  {
    title: "Enter an Exhibit",
    subtitle: "Show Your Skills",
    description:
      "Homemade goods, fine art, vegetables, flowers, needlework, and baked goods. If you made it, grew it, or created it — there's a class for it.",
    cta: "Exhibit Categories",
    href: "/exhibits",
    accentColor: "#8B2E2E",
    imageSrc: "/images/home-cta-exhibits.webp",
    imageAlt: "Artwork entries with blue and purple ribbons displayed at the West Tennessee State Fair",
    bgDark: "#2A1A1A",
  },
  {
    title: "Show Livestock",
    subtitle: "Let Them Compete",
    description:
      "Cattle, hogs, sheep, goats, rabbits, poultry — bring your best. Livestock shows are judged by qualified professionals and open to youth and adults.",
    cta: "Livestock Divisions",
    href: "/livestock",
    accentColor: "#D4A827",
    imageSrc: "/images/home-cta-livestock.webp",
    imageAlt: "Youth exhibitors with a goat and a purple ribbon at the West Tennessee State Fair",
    bgDark: "#1A2A1A",
  },
];

export default function ParticipationCTAs() {
  return (
    <section
      className="py-20 md:py-24"
      style={{ backgroundColor: "#F5EDD4" }}
      aria-labelledby="participation-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            Join the Competition
          </p>
          <h2
            id="participation-heading"
            className="text-3xl sm:text-4xl font-bold italic leading-tight"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#2C4A2E",
            }}
          >
            Don&apos;t Just Watch —{" "}
            <span style={{ color: "#8B2E2E" }}>Compete</span>
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {panels.map((panel) => (
            <Link
              key={panel.title}
              href={panel.href}
              className="group relative flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              style={{ backgroundColor: panel.bgDark }}
            >
              {/* ── IMAGE AREA ── */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={panel.imageSrc}
                  alt={panel.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Accent color top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 z-10"
                  style={{ backgroundColor: panel.accentColor }}
                  aria-hidden="true"
                />

                {/* Bottom fade into card body */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-16 z-10"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${panel.bgDark})`,
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* ── TEXT BODY ── */}
              <div className="flex flex-col flex-1 px-6 pt-4 pb-6">
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: panel.accentColor, opacity: 0.85 }}
                >
                  {panel.subtitle}
                </p>

                <h3
                  className="text-xl font-bold italic mb-3 leading-tight"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#F5EDD4",
                  }}
                >
                  {panel.title}
                </h3>

                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#A8BFA9" }}>
                  {panel.description}
                </p>

                <span
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 group-hover:gap-3"
                  style={{ color: panel.accentColor }}
                >
                  {panel.cta}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
