"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

const navLinks: NavLink[] = [
  {
    label: "Fair Info",
    href: "/fair-info",
    children: [
      { label: "Fair Info & Schedule",      href: "/fair-info" },
      { label: "First-Time Visitors Guide", href: "/first-time-visitors" },
      { label: "FAQ",                       href: "/faq" },
    ],
  },
  { label: "Exhibits",        href: "/exhibits" },
  { label: "Pageants",        href: "/pageants" },
  { label: "Livestock",       href: "/livestock" },
  { label: "Partner With Us", href: "/partner-with-us" },
  { label: "About",           href: "/about" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const pathname  = usePathname();
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const closeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setMobileSubOpen(false);
    document.body.classList.remove("nav-open");
  }, [pathname]);

  // Close dropdown when clicking outside
  const handleDocumentClick = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleDocumentClick);
    }
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [dropdownOpen, handleDocumentClick]);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("nav-open", next);
      return next;
    });
  };

  // Fair Info pathname matching — active when on /fair-info, /first-time-visitors, or /faq
  const fairInfoActive =
    pathname === "/fair-info" ||
    pathname.startsWith("/fair-info/") ||
    pathname === "/first-time-visitors" ||
    pathname === "/faq";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{ backgroundColor: "#2C4A2E" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Nav bar — logo left, nav+CTA grouped right */}
        <div className="flex items-center justify-between" style={{ height: "72px" }}>

          {/* ── Logo (left) ── */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 group"
            aria-label="West Tennessee State Fair — Home"
          >
            <Image
              src="/fair-logo.png"
              alt="West Tennessee State Fair"
              width={68}
              height={68}
              priority
              style={{
                filter:       "invert(1)",
                mixBlendMode: "screen",
                transition:   "opacity 0.2s",
              }}
              className="group-hover:opacity-80"
            />
          </Link>

          {/* ── Desktop: nav links + CTA grouped right ── */}
          <div className="hidden lg:flex items-center gap-1">
            <nav aria-label="Main navigation" className="flex items-center gap-0.5">

              {/* Fair Info — dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
                }}
              >
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  onClick={() => setDropdownOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-150 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827]"
                  style={{
                    color:        fairInfoActive ? "#D4A827" : "rgba(245,237,212,0.8)",
                    borderBottom: fairInfoActive ? "2px solid #D4A827" : "2px solid transparent",
                    background:   "none",
                    cursor:       "pointer",
                  }}
                >
                  Fair Info
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu — no mt gap so hover region is continuous */}
                {dropdownOpen && (
                  <div
                    role="menu"
                    aria-label="Fair Info submenu"
                    className="absolute top-full left-0 w-56 py-1 z-50"
                    onMouseEnter={() => {
                      if (closeTimer.current) clearTimeout(closeTimer.current);
                    }}
                    onMouseLeave={() => {
                      closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
                    }}
                    style={{
                      backgroundColor: "#1E3320",
                      border:          "1px solid rgba(255,255,255,0.08)",
                      boxShadow:       "0 8px 24px rgba(0,0,0,0.35)",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setDropdownOpen(false);
                    }}
                  >
                    {navLinks[0].children!.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-3 text-sm transition-colors focus:outline-none focus-visible:bg-[#2C4A2E]"
                          style={{
                            color:           childActive ? "#D4A827" : "#C5D9C6",
                            backgroundColor: childActive ? "rgba(212,168,39,0.08)" : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,168,39,0.08)";
                            (e.currentTarget as HTMLAnchorElement).style.color = "#D4A827";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = childActive ? "rgba(212,168,39,0.08)" : "transparent";
                            (e.currentTarget as HTMLAnchorElement).style.color = childActive ? "#D4A827" : "#C5D9C6";
                          }}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Other flat nav links */}
              {navLinks.slice(1).map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-150 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827]"
                    style={{
                      color:        isActive ? "#D4A827" : "rgba(245,237,212,0.8)",
                      borderBottom: isActive ? "2px solid #D4A827" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#D4A827";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,237,212,0.8)";
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Stay Updated — text link, smooth scroll on homepage */}
              <Link
                href="/#stay-updated"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    const el = document.getElementById("stay-updated");
                    if (el) {
                      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
                    }
                  }
                }}
                className="px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-150 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827]"
                style={{ color: "rgba(245,237,212,0.8)", borderBottom: "2px solid transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#D4A827"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,237,212,0.8)"; }}
              >
                Stay Updated
              </Link>
            </nav>

            <div style={{ width: "12px" }} aria-hidden="true" />

            <Link
              href="/fair-info"
              className="flex-shrink-0 px-4 py-2 text-sm font-bold tracking-wider uppercase transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2C4A2E]"
              style={{
                backgroundColor: "#D4A827",
                color:           "#1A1A1A",
                letterSpacing:   "0.08em",
              }}
            >
              Plan Your Visit
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827]"
            style={{ color: "#F5EDD4" }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="square" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu"
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "#1E3320" }}
      >
        <nav
          className="px-4 py-4 space-y-1 border-t"
          style={{ borderColor: "#3D6640" }}
          aria-label="Mobile navigation"
        >
          {/* Fair Info — expandable sub-section on mobile */}
          <div>
            <button
              type="button"
              onClick={() => setMobileSubOpen((v) => !v)}
              aria-expanded={mobileSubOpen}
              className="w-full flex items-center justify-between px-3 py-3 text-base font-medium border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827] focus-visible:ring-inset"
              style={{
                color:       fairInfoActive ? "#D4A827" : "#F5EDD4",
                borderColor: "#3D6640",
                background:  "none",
              }}
            >
              Fair Info
              <svg
                className="w-4 h-4 transition-transform duration-200"
                style={{ transform: mobileSubOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileSubOpen && (
              <div className="pl-4 py-1" style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
                {navLinks[0].children!.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-2.5 text-sm border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827] focus-visible:ring-inset"
                      style={{
                        color:       childActive ? "#D4A827" : "rgba(245,237,212,0.75)",
                        borderColor: "#3D6640",
                      }}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Other flat mobile links */}
          {navLinks.slice(1).map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-3 text-base font-medium border-b transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827] focus-visible:ring-inset"
                style={{
                  color:       isActive ? "#D4A827" : "#F5EDD4",
                  borderColor: "#3D6640",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Stay Updated — mobile */}
          <Link
            href="/#stay-updated"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                setMenuOpen(false);
                document.body.classList.remove("nav-open");
                const el = document.getElementById("stay-updated");
                if (el) {
                  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
                }
              }
            }}
            className="block px-3 py-3 text-base font-medium border-b transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827] focus-visible:ring-inset"
            style={{ color: "#F5EDD4", borderColor: "#3D6640" }}
          >
            Stay Updated
          </Link>

          <Link
            href="/fair-info"
            className="block mt-4 px-4 py-3 text-center text-sm font-bold tracking-wider uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
            style={{ backgroundColor: "#D4A827", color: "#1A1A1A" }}
          >
            Plan Your Visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
