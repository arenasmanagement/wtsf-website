import Link from "next/link";
import Image from "next/image";
import { FAIR_CONFIG } from "@/lib/fair-config";

const footerLinks = [
  {
    heading: "Visit the Fair",
    links: [
      { label: "Fair Info & Schedule",     href: "/fair-info" },
      { label: "Admission & Hours",         href: "/fair-info#admission" },
      { label: "Parking & Directions",      href: "/fair-info#parking" },
      { label: "First-Time Visitors Guide", href: "/first-time-visitors" },
      { label: "FAQ",                       href: "/faq" },
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
      { label: "Become a Vendor",  href: "/partner-with-us/vendors" },
      { label: "Become a Sponsor", href: "/partner-with-us/sponsors" },
      { label: "Volunteer",        href: "/partner-with-us/volunteer" },
      { label: "About the Fair",   href: "/about" },
    ],
  },
];

// Official brand SVG icons — inline so no extra dependency is required.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#1E3320", color: "#F5EDD4" }}>

      {/* ── Main footer body ── */}
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

            {/* Contact info */}
            <address className="not-italic space-y-2 text-sm mb-6">
              <div className="flex items-start gap-2">
                <span style={{ color: "#D4A827" }} aria-hidden="true">📍</span>
                <span style={{ color: "#C5D9C6" }}>575 Fourth Street, Henderson, TN 38340</span>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: "#D4A827" }} aria-hidden="true">✉</span>
                <a
                  href={`mailto:${FAIR_CONFIG.contact.email}`}
                  className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
                  style={{ color: "#C5D9C6" }}
                >
                  {FAIR_CONFIG.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: "#D4A827" }} aria-hidden="true">📞</span>
                <a
                  href={FAIR_CONFIG.contact.phoneHref}
                  className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
                  style={{ color: "#C5D9C6" }}
                >
                  {FAIR_CONFIG.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: "#D4A827" }} aria-hidden="true">🎟</span>
                <span style={{ color: "#C5D9C6" }}>Admission From $5 · Free Parking</span>
              </div>
            </address>

            {/* Social buttons with brand icons */}
            <div className="flex gap-3">
              <a
                href={FAIR_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E3320]"
                style={{ backgroundColor: "#1877F2", color: "#fff" }}
                aria-label="Follow the West Tennessee State Fair on Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
                Facebook
              </a>
              <a
                href={FAIR_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E3320]"
                style={{ backgroundColor: "#E1306C", color: "#fff" }}
                aria-label="Follow the West Tennessee State Fair on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
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
                      className="text-sm transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
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
