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
    photoHint: "Contestant on stage, crowning moment, sash, or fair queen",
    photoLabel: "Pageants",
    // Background shown behind image overlay label
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
    photoHint: "Ribbon-winning artwork, baked goods, quilts, crafts, or produce",
    photoLabel: "Exhibits & Crafts",
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
    photoHint: "Youth exhibitor with an animal inside the show ring",
    photoLabel: "Livestock Shows",
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
            Don't Just Watch —{" "}
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
              {/* PHOTO: {panel.photoHint} */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "4/3" }}
                role="img"
                aria-label={`Photo placeholder: ${panel.photoHint}`}
              >
                {/* Warm stand-in gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(145deg, #3D2E1E 0%, #5C4230 40%, #3A3020 100%)",
                  }}
                />

                {/* Accent color top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: panel.accentColor }}
                  aria-hidden="true"
                />

                {/* Placeholder label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
                  <svg
                    className="w-9 h-9 opacity-25"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#F5EDD4"
                    strokeWidth={1}
                  >
                    <rect x="2" y="4" width="20" height="16" rx="1.5" />
                    <path d="M2 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                  </svg>
                  <span
                    className="text-xs font-bold tracking-wider uppercase text-center"
                    style={{ color: panel.accentColor, opacity: 0.9 }}
                  >
                    {panel.photoLabel}
                  </span>
                  <span
                    className="text-xs text-center leading-snug px-2"
                    style={{ color: "rgba(245,237,212,0.45)" }}
                  >
                    {panel.photoHint}
                  </span>
                </div>

                {/* Bottom fade into card body */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12"
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
