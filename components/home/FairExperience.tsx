import Link from "next/link";

const attractions = [
  {
    title: "Entertainment",
    description:
      "Live music, rodeo action, a demolition derby, and nightly performances that bring the whole family together.",
    photoLabel: "Entertainment",
    photoHint: "Concert, rodeo, or live event photo",
    href: "/fair-info#entertainment",
    color: "#8B2E2E",
  },
  {
    title: "Livestock Shows",
    description:
      "From cattle and hogs to rabbits and goats — witness the best of West Tennessee's agricultural heritage.",
    photoLabel: "Livestock Shows",
    photoHint: "Youth exhibitor with animal",
    href: "/livestock",
    color: "#2C4A2E",
  },
  {
    title: "Pageants",
    description:
      "Crowning the best of the best — Fair Queen, Little Miss, and many more competitions for all ages.",
    photoLabel: "Pageants",
    photoHint: "Contestant or crowning moment",
    href: "/pageants",
    color: "#D4A827",
  },
  {
    title: "Exhibits & Crafts",
    description:
      "Homemade jams, quilts, fine art, vegetables, and baked goods — skill and creativity on full display.",
    photoLabel: "Exhibits & Crafts",
    photoHint: "Ribbon-winning exhibit, quilt, artwork, or baked goods",
    href: "/exhibits",
    color: "#2C4A2E",
  },
  {
    title: "Food & Vendors",
    description:
      "Fair food classics, local vendors, and everything in between — there's something delicious at every turn.",
    photoLabel: "Food & Vendors",
    photoHint: "Fair food or vendor booth",
    href: "/fair-info#vendors",
    color: "#8B2E2E",
  },
  {
    title: "Rides & Midway",
    description:
      "Thrill rides, carnival games, and midway magic for kids and adults alike — the heart of the fair.",
    photoLabel: "Rides & Midway",
    photoHint: "Rides at dusk or midway lights",
    href: "/fair-info#rides",
    color: "#D4A827",
  },
];

export default function FairExperience() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: "#F5EDD4" }}
      aria-labelledby="experience-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            What Awaits You
          </p>
          <h2
            id="experience-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold italic leading-tight mb-4"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#2C4A2E",
            }}
          >
            A Full Week of <span style={{ color: "#8B2E2E" }}>Fair Fun</span>
          </h2>
          <div
            className="w-12 h-0.5 mx-auto mb-5"
            style={{ backgroundColor: "#D4A827" }}
            aria-hidden="true"
          />
          <p className="text-base leading-relaxed" style={{ color: "#5C4A32" }}>
            From the moment you walk through the gates, there's something for everyone — whether you're competing, spectating, or just here for the funnel cakes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
              style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
            >
              {/* ── Image placeholder (replace with <Image> tag when photos are ready) ── */}
              {/* PHOTO: {item.photoHint} */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "16/9" }}
                role="img"
                aria-label={`Photo placeholder: ${item.photoHint}`}
              >
                {/* Warm gradient stand-in */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, #E8DFC8 0%, #F2EAD5 60%, #EAE0CC 100%)`,
                  }}
                />
                {/* Category color wash at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: item.color }}
                />
                {/* Placeholder label centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
                  <svg
                    className="w-8 h-8 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#5C4A32"
                    strokeWidth={1}
                  >
                    <rect x="2" y="4" width="20" height="16" rx="1.5" />
                    <path d="M2 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                  </svg>
                  <span
                    className="text-xs font-bold tracking-wider uppercase text-center"
                    style={{ color: "#8B7355", opacity: 0.8 }}
                  >
                    {item.photoLabel}
                  </span>
                  <span
                    className="text-xs text-center leading-snug"
                    style={{ color: "#8B7355", opacity: 0.6 }}
                  >
                    {item.photoHint}
                  </span>
                </div>
              </div>

              {/* ── Card body ── */}
              <div className="flex flex-col flex-1 p-5">
                {/* Subtle color dot accent */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <h3
                    className="text-lg font-bold"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#1A1A1A",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "#5C4A32" }}>
                  {item.description}
                </p>

                <span
                  className="text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-150 group-hover:gap-3"
                  style={{ color: item.color }}
                >
                  Learn More
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
