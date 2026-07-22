const facts = [
  {
    icon: "📅",
    label: "Fair Dates",
    value: "Oct 15–24, 2026",
    note: "Ten fabulous days",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Henderson, TN",
    note: "575 Fourth Street",
    href: "https://maps.google.com/?q=575+Fourth+Street+Henderson+TN+38340",
  },
  {
    icon: "🎟",
    label: "Gate Admission",
    value: "From $5",
    note: "Children under 3 FREE",
  },
  {
    icon: "🚗",
    label: "Parking",
    value: "Free",
    note: "Plenty of on-site parking",
  },
];

export default function KeyFactsBar() {
  return (
    <div
      className="relative z-20"
      style={{ backgroundColor: "#1A1A1A" }}
      aria-label="Key fair facts"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col items-center justify-center text-center py-5 px-3 sm:px-4 gap-1"
            >
              <span className="text-xl mb-1" aria-hidden="true">{fact.icon}</span>
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#D4A827" }}
              >
                {fact.label}
              </span>
              <span
                className="text-base sm:text-lg font-bold leading-tight"
                style={{ color: "#F5EDD4" }}
              >
                {fact.value}
              </span>
              {fact.href ? (
                <a
                  href={fact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs transition-colors hover:text-gold"
                  style={{ color: "#6B8F6C" }}
                >
                  {fact.note} ↗
                </a>
              ) : (
                <span className="text-xs" style={{ color: "#6B8F6C" }}>
                  {fact.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
