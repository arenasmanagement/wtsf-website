export default function EntertainmentSpotlight() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: "#1A1A1A" }}
      aria-labelledby="entertainment-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
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

        {/* Coming Soon panel */}
        <div
          className="max-w-2xl mx-auto text-center px-8 py-14 relative"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(212,168,39,0.2)",
          }}
        >
          {/* Gold corner marks */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#D4A827" }} aria-hidden="true" />

          {/* Icon */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="#D4A827" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>

          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            2026 Entertainment Lineup
          </p>

          <h3
            className="text-3xl sm:text-4xl font-bold italic mb-6"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5EDD4",
            }}
          >
            Coming Soon
          </h3>

          <div
            className="w-10 h-0.5 mx-auto mb-6"
            style={{ backgroundColor: "#D4A827" }}
            aria-hidden="true"
          />

          <p
            className="text-base leading-relaxed"
            style={{ color: "#A8BFA9" }}
          >
            The 2026 West Tennessee State Fair entertainment schedule will be announced soon.
            Check back for concert announcements, rodeo information, family entertainment,
            and nightly attractions.
          </p>
        </div>

      </div>
    </section>
  );
}
