import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

const features = [
  {
    title: "Championship Rodeo",
    description:
      "Witness the raw power and skill of professional rodeo — bull riding, barrel racing, roping, and more. One of the most popular events at the fair, drawing competitors and fans from across the region.",
    tag: "Fan Favorite",
    tagColor: "#8B2E2E",
    photoLabel: "Rodeo Action",
    photoDescription: "Hero shot of bull rider in arena — dust, motion, crowd behind",
  },
  {
    title: "Live Concerts & Performances",
    description:
      "From country artists to gospel groups, the WTSF stage is alive every night. Enjoy free performances included with your admission, right in the heart of the fairgrounds.",
    tag: "Nightly",
    tagColor: "#2C4A2E",
    photoLabel: "Concert Stage",
    photoDescription: "Stage shot at night — performer, crowd, lighting, atmosphere",
  },
  {
    title: "BBQ & Cook-Off Competition",
    description:
      "Pit masters from around the region bring their best. Come hungry — whether you're judging or just sampling, this is a Tennessee tradition you don't want to miss.",
    tag: "Crowd Favorite",
    tagColor: "#D4A827",
    photoLabel: "BBQ Cook-Off",
    photoDescription: "Wide angle of cook-off pits — smoke, teams, judges, banners",
  },
];

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
            Don't Miss It
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

        {/* Feature rows */}
        <div className="flex flex-col gap-14">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              {/* Photo */}
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                {/* PHOTO PLACEHOLDER: See photoDescription below */}
                <div
                  className="aspect-video w-full flex flex-col items-center justify-center gap-3"
                  style={{
                    backgroundColor: "rgba(212,168,39,0.06)",
                    border: "1px dashed rgba(212,168,39,0.3)",
                  }}
                >
                  <svg
                    className="w-9 h-9 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#D4A827"
                    strokeWidth={1}
                  >
                    <rect x="2" y="4" width="20" height="16" rx="1.5" />
                    <path d="M2 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                  </svg>
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "rgba(212,168,39,0.6)" }}
                  >
                    {feat.photoLabel}
                  </span>
                  <span
                    className="text-xs text-center px-6 normal-case tracking-normal font-normal opacity-50"
                    style={{ color: "#A8BFA9" }}
                  >
                    {feat.photoDescription}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                {/* Tag */}
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 mb-4"
                  style={{
                    backgroundColor: `${feat.tagColor}22`,
                    color: feat.tagColor === "#D4A827" ? "#D4A827" : feat.tagColor === "#8B2E2E" ? "#C84040" : "#6BB86D",
                    border: `1px solid ${feat.tagColor}44`,
                  }}
                >
                  {feat.tag}
                </span>

                <h3
                  className="text-2xl sm:text-3xl font-bold italic mb-4"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#F5EDD4",
                  }}
                >
                  {feat.title}
                </h3>

                <div
                  className="w-10 h-0.5 mb-5"
                  style={{ backgroundColor: feat.tagColor }}
                  aria-hidden="true"
                />

                <p className="text-base leading-relaxed" style={{ color: "#A8BFA9" }}>
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
