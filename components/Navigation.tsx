"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Fair Info",       href: "/fair-info" },
  { label: "Exhibits",        href: "/exhibits" },
  { label: "Pageants",        href: "/pageants" },
  { label: "Livestock",       href: "/livestock" },
  { label: "Partner With Us", href: "/partner-with-us" },
  { label: "About",           href: "/about" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    document.body.classList.remove("nav-open");
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("nav-open", next);
      return next;
    });
  };

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
            {/*
              Dark green header: invert(1) turns black logo art → white,
              mix-blend-mode:screen dissolves the now-black areas (original
              white background) into the dark background.
            */}
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
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-150 rounded-sm"
                    style={{
                      color:             isActive ? "#D4A827" : "rgba(245,237,212,0.8)",
                      borderBottom:      isActive ? "2px solid #D4A827" : "2px solid transparent",
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
            </nav>

            {/* Slight gap between last nav link and button */}
            <div style={{ width: "12px" }} aria-hidden="true" />

            <Link
              href="/fair-info"
              className="flex-shrink-0 px-4 py-2 text-sm font-bold tracking-wider uppercase transition-opacity duration-150 hover:opacity-90"
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
            className="lg:hidden p-2 rounded transition-colors"
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
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-3 text-base font-medium border-b transition-colors"
                style={{
                  color:       isActive ? "#D4A827" : "#F5EDD4",
                  borderColor: "#3D6640",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/fair-info"
            className="block mt-4 px-4 py-3 text-center text-sm font-bold tracking-wider uppercase"
            style={{ backgroundColor: "#D4A827", color: "#1A1A1A" }}
          >
            Plan Your Visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
