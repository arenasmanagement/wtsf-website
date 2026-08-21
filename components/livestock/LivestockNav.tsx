"use client";

/**
 * LivestockNav — Sticky show-jump navigation for the Livestock page.
 *
 * Desktop/tablet: horizontal bar with one button per livestock show.
 *   Active show highlighted with a gold underline via IntersectionObserver.
 * Mobile: a <select> dropdown listing all 4 shows.
 *
 * Sticks just below the fixed site header (72 px).
 * Target IDs on the page: cattle, meat-goat, breeding-sheep
 * (already present on ShowSection components).
 */

import { useEffect, useState, useCallback } from "react";

// Must match the height in Navigation.tsx
const HEADER_H = 72;

// Approximate height of this nav bar (used for rootMargin)
const NAV_H = 50;

const SHOWS = [
  { id: "meat-goat",        label: "Meat Goat Show" },
  { id: "breeding-sheep",   label: "Breeding Sheep Show" },
  { id: "cattle",           label: "Cattle Show" },
] as const;

export default function LivestockNav() {
  const [activeShowId, setActiveShowId] = useState<string>("");

  // ── Active show tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const targets = SHOWS.map((s) =>
      document.getElementById(s.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((prev, cur) =>
            Math.abs(cur.boundingClientRect.top) < Math.abs(prev.boundingClientRect.top)
              ? cur
              : prev
          );
          setActiveShowId(topmost.target.id);
        }
      },
      {
        rootMargin: `-${HEADER_H + NAV_H}px 0px -50% 0px`,
        threshold: 0,
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Smooth scroll helper ─────────────────────────────────────────────────
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  }, []);

  return (
    <nav
      id="livestock-nav-top"
      aria-label="Livestock show navigation"
      className="sticky z-40"
      style={{
        top: `${HEADER_H}px`,
        backgroundColor: "#2C4A2E",
        borderBottom: "2px solid #D4A827",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Desktop / Tablet (sm+): horizontal button bar ────────────── */}
        <div className="hidden sm:flex items-stretch overflow-x-auto">
          <span
            className="flex-shrink-0 flex items-center text-xs font-bold tracking-widest uppercase pr-5 py-3"
            style={{ color: "#D4A827", letterSpacing: "0.2em", whiteSpace: "nowrap" }}
            aria-hidden="true"
          >
            Jump to a Show:
          </span>

          {SHOWS.map((show) => {
            const isActive = activeShowId === show.id;
            return (
              <button
                key={show.id}
                onClick={() => scrollTo(show.id)}
                className="flex-shrink-0 px-4 py-3 text-xs font-bold tracking-wider uppercase transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid #D4A827"
                    : "2px solid transparent",
                  marginBottom: "-2px",
                  color: isActive ? "#D4A827" : "rgba(245,237,212,0.68)",
                  letterSpacing: "0.07em",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
                aria-current={isActive ? "true" : undefined}
              >
                {show.label}
              </button>
            );
          })}
        </div>

        {/* ── Mobile (<sm): dropdown ──────────────────────────────────────── */}
        <div className="sm:hidden py-2.5">
          <label htmlFor="livestock-show-select" className="sr-only">
            Jump to a Livestock Show
          </label>
          <select
            id="livestock-show-select"
            defaultValue=""
            className="w-full text-sm px-3 py-2 font-medium"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(245,237,212,0.3)",
              color: "#F5EDD4",
              outline: "none",
            }}
            onChange={(e) => {
              if (e.target.value) scrollTo(e.target.value);
            }}
          >
            <option value="" disabled style={{ color: "#333" }}>
              Jump to a Livestock Show
            </option>
            {SHOWS.map((show) => (
              <option key={show.id} value={show.id} style={{ color: "#333" }}>
                {show.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </nav>
  );
}
