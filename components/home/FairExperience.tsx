import Image from "next/image";
import Link from "next/link";

const attractions = [
  {
    title: "Entertainment",
    description:
      "Live music, rodeo action, a demolition derby, and nightly performances that bring the whole family together.",
    imageSrc: "/images/home-feature-entertainment.webp",
    imageAlt: "Performer with a hula hoop at the West Tennessee State Fair",
    href: "/fair-info#entertainment",
    color: "#8B2E2E",
  },
  {
    title: "Livestock Shows",
    description:
      "From cattle and hogs to rabbits and goats — witness the best of West Tennessee's agricultural heritage.",
    imageSrc: "/images/home-feature-livestock.webp",
    imageAlt: "Youth exhibitors showing goats in the livestock ring at the West Tennessee State Fair",
    href: "/livestock",
    color: "#2C4A2E",
  },
  {
    title: "Pageants",
    description:
      "Crowning the best of the best — Fair Queen, Little Miss, and many more competitions for all ages.",
    imageSrc: "/images/home-feature-pageants.webp",
    imageAlt: "Pageant contestant on stage at the West Tennessee State Fair",
    href: "/pageants",
    color: "#D4A827",
  },
  {
    title: "Exhibits & Crafts",
    description:
      "Homemade jams, quilts, fine art, vegetables, and baked goods — skill and creativity on full display.",
    imageSrc: "/images/home-feature-exhibits.webp",
    imageAlt: "Award ribbons and produce entries at the West Tennessee State Fair exhibits",
    href: "/exhibits",
    color: "#2C4A2E",
  },
  {
    title: "Food & Vendors",
    description:
      "Fair food classics, local vendors, and everything in between — there's something delicious at every turn.",
    imageSrc: "/images/home-feature-food.webp",
    imageAlt: "Grilled chicken on a food vendor grill at the West Tennessee State Fair",
    href: "/fair-info#vendors",
    color: "#8B2E2E",
  },
  {
    title: "Rides & Midway",
    description:
      "Thrill rides, carnival games, and midway magic for kids and adults alike — the heart of the fair.",
    imageSrc: "/images/home-feature-rides.webp",
    imageAlt: "Carnival ride at sunset — pink and purple sky",
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
            From the moment you walk through the gates, there&apos;s something for everyone — whether you&apos;re competing, spectating, or just here for the funnel cakes.
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
              {/* ── Card image ── */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                {/* Category color bar at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: item.color }}
                />
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
