import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    heading: "Visit the Fair",
    links: [
      { label: "Fair Info & Schedule", href: "/fair-info" },
      { label: "Admission & Hours",    href: "/fair-info#admission" },
      { label: "Parking & Directions", href: "/fair-info#parking" },
    ],
  },
  {
    heading: "Participate",
    links: [
      { label: "Exhibits",  href: "/exhibits" },
      { label: "Pageants",  href: "/pageants" },
      { label: "Livestock", href: "/livestock" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Become a Vendor",   href: "/vendors-sponsors" },
      { label: "Become a Sponsor",  href: "/vendors-sponsors#sponsor" },
      { label: "Volunteer",         href: "/about#volunteer" },
      { label: "About the Fair",    href: "/about" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#1E3320", color: "#F5EDD4" }}>

      {/* ── Main footer body — 4-column grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-8 items-start">

          {/* Column 1: Brand, contact, social */}
          <div>
            <div className="mb-5">
              <Image
                src="/fair-logo.png"
                alt="West Tennessee State Fair"
                width={80}
                height={80}
                style={{ filter: "invert(1)", mixBlendMode: "screen" }}
              />
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8BFA9" }}>
              Since 1855, the West Tennessee State Fair has been a proud tradition rooted in the heart of Henderson — bringing together generations of families, farmers, and community members every October.
            </p>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-start gap-2">
                <span style={{ color: "#D4A827" }}>📍</span>
                <span style={{ color: "#C5D9C6" }}>575 Fourth Street, Henderson, TN 38340</span>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: "#D4A827" }}>✉</span>
                <a
                  href="mailto:wtsfair@gmail.com"
                  className="transition-opacity hover:opacity-70"
                  style={{ color: "#C5D9C6" }}
                >
                  wtsfair@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: "#D4A827" }}>🎟</span>
                <span style={{ color: "#C5D9C6" }}>Admission From $5 · Free Parking</span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/WTSFAIR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all hover:opacity-90"
                style={{ backgroundColor: "#1877F2", color: "#fff" }}
                aria-label="Follow us on Facebook"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/westtnstatefair"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all hover:opacity-90"
                style={{ backgroundColor: "#E1306C", color: "#fff" }}
                aria-label="Follow us on Instagram"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Columns 2–4: Nav link groups */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h3
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#D4A827" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-opacity hover:opacity-70"
                      style={{ color: "#A8BFA9" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t" style={{ borderColor: "#2C4A2E" }}>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "#6B8F6C" }}
        >
          <p>© {currentYear} West Tennessee State Fair. All rights reserved.</p>
          <p>
            Marketing &amp; Web by{" "}
            <a
              href="https://www.arenasmanagementco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              style={{ color: "#A8BFA9" }}
            >
              Arenas Management Co.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
