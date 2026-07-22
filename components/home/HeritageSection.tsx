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

          {/* Left: photo placeholder */}
          <div className="order-2 md:order-1">
            {/* PHOTO PLACEHOLDER: Historical fair photograph (1950s–1980s archival image) paired with a modern equivalent */}
            <div
              className="aspect-[4/3] w-full flex flex-col items-center justify-center gap-3 border-2"
              style={{
                borderColor: "#D4A827",
                backgroundColor: "rgba(212,168,39,0.08)",
              }}
            >
              <svg
                className="w-10 h-10 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#D4A827"
                strokeWidth={1}
              >
                <rect x="2" y="4" width="20" height="16" rx="1.5" />
                <path d="M2 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
              </svg>
              <span
                className="text-xs font-bold tracking-widest uppercase text-center px-4"
                style={{ color: "#D4A827", opacity: 0.7 }}
              >
                Historical Fair Photo
              </span>
              <span
                className="text-xs text-center px-6 normal-case tracking-normal font-normal"
                style={{ color: "#6B8F6C" }}
              >
                Replace with archival photograph from Chester County Historical Society or fair archives (1950s–1980s)
              </span>
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
