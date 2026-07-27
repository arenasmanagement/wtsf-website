"use client";

/**
 * ExhibitsNav — Sticky department navigation for the Exhibits page.
 *
 * Desktop/tablet: wrapping button row — all 5 departments always visible,
 *   no horizontal scroll, no clipping. Wraps naturally into 2 rows on tablet.
 *   Active section highlighted with gold text + gold underline.
 * Mobile: a single <select> dropdown listing all 22 guides grouped by dept.
 *
 * Sticks just below the fixed site header (72 px).
 * Active section tracking uses IntersectionObserver on `dept-*` anchors.
 */

import { useEffect, useState, useCallback } from "react";
import { DEPARTMENT_META, getGuidesByDepartment } from "@/lib/exhibit-guides";

// Must match the height in Navigation.tsx
const HEADER_H = 72;

// Conservative estimate for a 2-row wrapping nav (used for rootMargin).
// Actual height varies: ~52 px on large desktop (1 row) to ~88 px on tablet
// (2 rows). Using the larger value keeps scroll-margin generous on all widths.
const NAV_H = 92;

export default function ExhibitsNav() {
  const [activeDeptId, setActiveDeptId] = useState<string>("");

  // ── Active department tracking ───────────────────────────────────────────
  useEffect(() => {
    const targets = DEPARTMENT_META.map((m) =>
      document.getElementById(`dept-${m.id}`)
    ).filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Prefer the entry whose top edge is closest to the trigger line
          const topmost = visible.reduce((prev, cur) =>
            Math.abs(cur.boundingClientRect.top) < Math.abs(prev.boundingClientRect.top)
              ? cur
              : prev
          );
          setActiveDeptId(topmost.target.id);
        }
      },
      {
        // Trigger line sits just below both fixed headers combined
        rootMargin: `-${HEADER_H + NAV_H}px 0px -50% 0px`,
        threshold: 0,
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Smooth scroll helper ─────────────────────────────────────────────────
  const scrollTo = useCallback((elementId: string) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  }, []);

  return (
    <nav
      id="exhibit-nav-top"
      aria-label="Exhibit guide navigation"
      className="sticky z-40"
      style={{
        top: `${HEADER_H}px`,
        backgroundColor: "#2C4A2E",
        borderBottom: "2px solid #D4A827",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Desktop / Tablet (sm+): 2-column grid ────────────────────── */}
        {/*   Column 1 (max-content): "Find a Guide:" label.               */}
        {/*   Column 2 (1fr):         flex-wrap button area.               */}
        {/*   Wrapped rows always start at the column-2 left edge,         */}
        {/*   never under the label.                                        */}
        <div
          className="hidden sm:grid py-2.5 items-start"
          style={{ gridTemplateColumns: "max-content 1fr", gap: "0 1rem" }}
        >
          {/* Label — fixed-width column */}
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{
              color: "#D4A827",
              letterSpacing: "0.2em",
              whiteSpace: "nowrap",
              paddingTop: "0.5rem",   // aligns with button text on first row
            }}
            aria-hidden="true"
          >
            Find a Guide:
          </span>

          {/* Category buttons — wrap inside column 2 only */}
          <div className="flex flex-wrap gap-x-1 gap-y-0.5">
            {DEPARTMENT_META.map((dept) => {
              const isActive = activeDeptId === `dept-${dept.id}`;
              return (
                <button
                  key={dept.id}
                  onClick={() => scrollTo(`dept-${dept.id}`)}
                  className="px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors"
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: isActive
                      ? "2px solid #D4A827"
                      : "2px solid transparent",
                    color: isActive ? "#D4A827" : "rgba(245,237,212,0.68)",
                    letterSpacing: "0.07em",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    // Keeps button height consistent with or without underline
                    paddingBottom: "calc(0.5rem - 2px)",
                  }}
                  aria-current={isActive ? "true" : undefined}
                >
                  {dept.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Mobile (<sm): optgroup dropdown ─────────────────────────────── */}
        <div className="sm:hidden py-2.5">
          <label htmlFor="exhibit-guide-select" className="sr-only">
            Choose an Exhibit Guide
          </label>
          <select
            id="exhibit-guide-select"
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
              Choose an Exhibit Guide
            </option>
            {DEPARTMENT_META.map((dept) => (
              <optgroup key={dept.id} label={dept.label} style={{ color: "#333" }}>
                {getGuidesByDepartment(dept.id).map((guide) => (
                  <option
                    key={guide.id}
                    value={`guide-${guide.id}`}
                    style={{ color: "#333" }}
                  >
                    {guide.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

      </div>
    </nav>
  );
}
