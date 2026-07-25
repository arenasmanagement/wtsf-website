import Image from "next/image";

export default function HeritageSection() {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "#2C4A2E" }}
      aria-labelledby="heritage-heading"
    >
      {/* Decorative background numeral */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="text-[20rem] font-black leading-none opacity-5"
          style={{
            color: "#D4A827",
            fontFamily: "var(--font-playfair), Georgia, serif",
          }}
        >
          171
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left: heritage photo */}
          <div className="order-2 md:order-1">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden border-2"
              style={{ borderColor: "#D4A827" }}
            >
              <Image
                src="/images/about-history.webp"
                alt="West Tennessee State Fair wooden sign — a landmark of the fairgrounds"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right: text */}
          <div className="order-1 md:order-2">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              Our Legacy in West Tennessee
            </p>

            <h2
              id="heritage-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold italic leading-tight mb-6"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#F5EDD4",
              }}
            >
              Celebrating Over{" "}
              <span style={{ color: "#D4A827" }}>170 Years</span>{" "}
              of Heritage
            </h2>

            <div
              className="w-12 h-0.5 mb-6"
              style={{ backgroundColor: "#D4A827" }}
              aria-hidden="true"
            />

            <p className="text-base leading-relaxed mb-5" style={{ color: "#A8BFA9" }}>
              Since 1855, the West Tennessee State Fair has been a pillar of tradition in our region — growing from an agricultural showcase into a celebration of community, competition, and family.
            </p>

            <p className="text-base leading-relaxed mb-8" style={{ color: "#A8BFA9" }}>
              What began as a small gathering of local farmers and families has transformed into a multi-day celebration of everything we love: livestock shows, delicious food, thrilling rides, crafts, pageants, and music that fills the air. As one of the longest-running events in the region, the fair continues to evolve — bringing together generations of fairgoers, old and new.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: "rgba(212,168,39,0.2)" }}>
              {[
                { num: "1855", label: "Founded" },
                { num: "171", label: "Years Running" },
                { num: "10", label: "Days of Fun" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-2xl sm:text-3xl font-black"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#D4A827",
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="text-xs font-semibold tracking-wider uppercase mt-1"
                    style={{ color: "#6B8F6C" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
