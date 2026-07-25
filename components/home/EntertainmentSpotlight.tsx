import Image from "next/image";

const features = [
  {
    title: "Championship Rodeo",
    description:
      "Witness the raw power and skill of professional rodeo — bull riding, barrel racing, roping, and more. One of the most popular events at the fair, drawing competitors and fans from across the region.",
    tag: "Fan Favorite",
    tagColor: "#8B2E2E",
    imageSrc: "/images/home-feature-rides-02.webp",
    imageAlt: "Carnival rides at the West Tennessee State Fair",
  },
  {
    title: "Live Concerts & Performances",
    description:
      "From country artists to gospel groups, the WTSF stage is alive every night. Enjoy free performances included with your admission, right in the heart of the fairgrounds.",
    tag: "Nightly",
    tagColor: "#2C4A2E",
    imageSrc: "/images/pageants-stage.webp",
    imageAlt: "Queens on stage at the West Tennessee State Fair",
  },
  {
    title: "BBQ & Cook-Off Competition",
    description:
      "Pit masters from around the region bring their best. Come hungry — whether you're judging or just sampling, this is a Tennessee tradition you don't want to miss.",
    tag: "Crowd Favorite",
    tagColor: "#D4A827",
    imageSrc: "/images/home-feature-food.webp",
    imageAlt: "Family enjoying food at the West Tennessee State Fair",
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
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={feat.imageSrc}
                    alt={feat.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
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
