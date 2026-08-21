import { CONFIRMED_EVENTS } from "@/lib/entertainment-config";

export default function EntertainmentSpotlight() {
  const featuredEvent    = CONFIRMED_EVENTS.find((e) => e.isFeatured);
  const supportingEvents = CONFIRMED_EVENTS.filter((e) => !e.isFeatured);

  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: "#1A1A1A" }}
      aria-labelledby="entertainment-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Section header ──────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            Don&apos;t Miss It
          </p>
          <h2
            id="entertainment-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold italic leading-tight"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5EDD4",
            }}
          >
            Headline <span style={{ color: "#D4A827" }}>Entertainment</span>
          </h2>
        </div>

        {/* ── Confirmed events ────────────────────────────────── */}
        {CONFIRMED_EVENTS.length > 0 && (
          <div className="space-y-6 mb-10">

            {/* Featured event — large card */}
            {featuredEvent && (
              <div
                className="relative px-8 py-10 md:py-12"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,168,39,0.4)",
                }}
              >
                {/* Gold corner marks */}
                <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
                <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
                <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
                <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />

                <div className="flex flex-col md:flex-row md:items-start md:gap-12">

                  {/* Left: event info */}
                  <div className="flex-1 mb-8 md:mb-0">
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-3"
                      style={{ color: "#D4A827", letterSpacing: "0.25em" }}
                    >
                      {featuredEvent.category}
                    </p>
                    <h3
                      className="text-3xl sm:text-4xl font-bold italic mb-3"
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        color: "#F5EDD4",
                      }}
                    >
                      {featuredEvent.title}
                    </h3>
                    <div
                      className="w-10 h-0.5 mb-5"
                      style={{ backgroundColor: "#D4A827" }}
                      aria-hidden="true"
                    />
                    <p
                      className="text-sm leading-relaxed mb-2"
                      style={{ color: "#A8BFA9" }}
                    >
                      {featuredEvent.tagline}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(168,191,169,0.7)" }}
                    >
                      {featuredEvent.description}
                    </p>
                  </div>

                  {/* Optional: event image — set image: "/..." in entertainment-config.ts to activate */}
                  {featuredEvent.image && (
                    <div className="md:w-64 flex-shrink-0 mb-8 md:mb-0">
                      <img
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        className="w-full h-auto object-cover"
                        style={{ maxHeight: "220px" }}
                      />
                    </div>
                  )}

                  {/* Right: night schedule */}
                  <div className="md:w-56 flex-shrink-0">
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-4"
                      style={{ color: "#D4A827", letterSpacing: "0.2em" }}
                    >
                      Performance Dates
                    </p>
                    <div className="space-y-3">
                      {featuredEvent.nights.map((night) => (
                        <div
                          key={night.date}
                          className="px-4 py-3"
                          style={{
                            backgroundColor: "rgba(212,168,39,0.08)",
                            border: "1px solid rgba(212,168,39,0.2)",
                          }}
                        >
                          <p
                            className="text-xs font-bold uppercase tracking-wide mb-0.5"
                            style={{ color: "#D4A827", letterSpacing: "0.1em" }}
                          >
                            {night.date} · {night.day}
                          </p>
                          <p
                            className="text-lg font-bold italic"
                            style={{
                              fontFamily: "var(--font-playfair), Georgia, serif",
                              color: "#F5EDD4",
                            }}
                          >
                            {night.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Supporting events — smaller cards */}
            {supportingEvents.length > 0 && (
              <div className={`grid gap-4 ${supportingEvents.length === 1 ? "" : supportingEvents.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                {supportingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="px-6 py-6 relative"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(212,168,39,0.15)",
                    }}
                  >
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-2"
                      style={{ color: "#D4A827", letterSpacing: "0.2em" }}
                    >
                      {event.category}
                    </p>
                    <h3
                      className="text-xl font-bold italic mb-3"
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        color: "#F5EDD4",
                      }}
                    >
                      {event.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "#A8BFA9" }}>
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.nights.map((night) => (
                        <span
                          key={night.date}
                          className="px-3 py-1.5 text-xs font-bold"
                          style={{
                            backgroundColor: "rgba(212,168,39,0.1)",
                            border: "1px solid rgba(212,168,39,0.2)",
                            color: "#D4A827",
                          }}
                        >
                          {night.date} · {night.day} · {night.time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Coming Soon — concerts, derby, truck pulls, and nightly attractions ──────────*/}
        <div
          className="px-6 py-8 text-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "rgba(212,168,39,0.6)", letterSpacing: "0.25em" }}
          >
            More Entertainment
          </p>
          <p
            className="text-lg font-bold italic mb-3"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "rgba(245,237,212,0.5)",
            }}
          >
            Coming Soon
          </p>
          <p
            className="text-sm"
            style={{ color: "rgba(168,191,169,0.5)" }}
          >
            Additional entertainment — concerts, derby, truck pulls, and nightly attractions —
            will be announced as they are confirmed.
          </p>
        </div>

      </div>
    </section>
  );
}
