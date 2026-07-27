"use client";

/**
 * FairCountdown.tsx
 * ─────────────────────────────────────────────────────────────
 * Three-state countdown for the West Tennessee State Fair.
 *
 *  BEFORE  → Live countdown: Days / Hours / Minutes / Seconds
 *  LIVE    → "The Fair Is Open" + visitor action links
 *  AFTER   → "Thank You" + follow/highlights links
 *
 * Dates come from lib/fair-config.ts — update there, not here.
 * Hydration-safe: server renders a static shell; client hydrates
 * with live values on mount. No layout shift.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FAIR_CONFIG } from "@/lib/fair-config";

// ── Types ─────────────────────────────────────────────────────

type Phase = "before" | "live" | "after";

interface TimeLeft {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
  total:   number;
}

// ── Helpers ───────────────────────────────────────────────────

function getPhase(now: number): Phase {
  if (now < FAIR_CONFIG.OPEN_DATE.getTime())  return "before";
  if (now < FAIR_CONFIG.CLOSE_DATE.getTime()) return "live";
  return "after";
}

function getTimeLeft(targetMs: number, nowMs: number): TimeLeft {
  const total = Math.max(0, targetMs - nowMs);
  return {
    days:    Math.floor(total / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000),
    total,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ── Sub-components ────────────────────────────────────────────

function CountdownUnit({
  value,
  label,
  reduceMotion,
}: {
  value: string;
  label: string;
  reduceMotion: boolean;
}) {
  return (
    <div className="flex flex-col items-center" style={{ minWidth: "4rem" }}>
      <span
        aria-hidden="true"
        style={{
          fontFamily:   "var(--font-playfair), Georgia, serif",
          fontSize:     "clamp(2.5rem, 8vw, 5rem)",
          fontWeight:   700,
          fontStyle:    "italic",
          lineHeight:   1,
          color:        "#D4A827",
          display:      "block",
          transition:   reduceMotion ? "none" : "color 0.15s ease",
          tabularNums:  "tabular-nums",
          fontVariantNumeric: "tabular-nums",
        } as React.CSSProperties}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily:     "var(--font-inter), sans-serif",
          fontSize:       "0.6rem",
          fontWeight:     700,
          letterSpacing:  "0.22em",
          textTransform:  "uppercase",
          color:          "rgba(197,217,198,0.7)",
          marginTop:      "0.5rem",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span
      aria-hidden="true"
      style={{
        color:      "#D4A827",
        opacity:    0.35,
        fontSize:   "clamp(1.5rem, 4vw, 2.5rem)",
        fontWeight: 300,
        lineHeight: 1,
        alignSelf:  "flex-start",
        paddingTop: "0.25rem",
        userSelect: "none",
      }}
    >
      ·
    </span>
  );
}

// ── Phase: BEFORE ────────────────────────────────────────────

function BeforeState({
  timeLeft,
  reduceMotion,
}: {
  timeLeft: TimeLeft | null;
  reduceMotion: boolean;
}) {
  const units = [
    { value: timeLeft ? pad(timeLeft.days)    : "--", label: "Days" },
    { value: timeLeft ? pad(timeLeft.hours)   : "--", label: "Hours" },
    { value: timeLeft ? pad(timeLeft.minutes) : "--", label: "Min" },
    { value: timeLeft ? pad(timeLeft.seconds) : "--", label: "Sec" },
  ];

  return (
    <div className="text-center">
      {/* Overline */}
      <p
        style={{
          fontFamily:    "var(--font-inter), sans-serif",
          fontSize:      "0.65rem",
          fontWeight:    700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color:         "rgba(197,217,198,0.6)",
          marginBottom:  "1.5rem",
        }}
      >
        The 2026 West Tennessee State Fair Opens In
      </p>

      {/* Live countdown numbers */}
      <div
        role="timer"
        aria-live="off"
        aria-atomic="true"
        aria-label={
          timeLeft
            ? `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until the fair opens`
            : "Loading countdown"
        }
        className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap"
      >
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-4 sm:gap-6">
            <CountdownUnit
              value={u.value}
              label={u.label}
              reduceMotion={reduceMotion}
            />
            {i < units.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {/* Date / location line */}
      <div
        style={{
          marginTop:     "2rem",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          gap:           "0.75rem",
        }}
      >
        <span
          style={{
            display:       "block",
            width:         "2rem",
            height:        "1px",
            backgroundColor: "rgba(212,168,39,0.3)",
          }}
          aria-hidden="true"
        />
        <p
          style={{
            fontFamily:    "var(--font-inter), sans-serif",
            fontSize:      "0.7rem",
            fontWeight:    600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color:         "rgba(245,237,212,0.55)",
          }}
        >
          {FAIR_CONFIG.openLabel} · {FAIR_CONFIG.location.city}
        </p>
        <span
          style={{
            display:       "block",
            width:         "2rem",
            height:        "1px",
            backgroundColor: "rgba(212,168,39,0.3)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* CTA */}
      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/fair-info"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "0.5rem",
            padding:        "0.75rem 1.75rem",
            backgroundColor:"#D4A827",
            color:          "#1A1A1A",
            fontFamily:     "var(--font-inter), sans-serif",
            fontSize:       "0.7rem",
            fontWeight:     700,
            letterSpacing:  "0.12em",
            textTransform:  "uppercase",
            textDecoration: "none",
            transition:     reduceMotion ? "none" : "opacity 0.15s ease",
          }}
          onMouseEnter={(e) => { if (!reduceMotion) (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
          onMouseLeave={(e) => { if (!reduceMotion) (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
        >
          Plan Your Visit
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ── Phase: LIVE ───────────────────────────────────────────────

function LiveState({ reduceMotion }: { reduceMotion: boolean }) {
  const liveLinks = [
    { label: "Today's Schedule", href: FAIR_CONFIG.links.schedule },
    { label: "Get Directions",   href: FAIR_CONFIG.links.directions, external: true },
    { label: "Hours & Admission",href: FAIR_CONFIG.links.admission },
  ];

  return (
    <div className="text-center">
      {/* Live badge */}
      <div
        style={{
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "0.5rem",
          padding:        "0.3rem 0.9rem",
          backgroundColor:"rgba(212,168,39,0.15)",
          border:         "1px solid rgba(212,168,39,0.35)",
          marginBottom:   "1.25rem",
        }}
      >
        {/* Pulsing dot */}
        <span
          aria-hidden="true"
          style={{
            display:      "block",
            width:        "0.45rem",
            height:       "0.45rem",
            borderRadius: "50%",
            backgroundColor: "#D4A827",
            animation:    reduceMotion ? "none" : "wtsf-pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily:    "var(--font-inter), sans-serif",
            fontSize:      "0.6rem",
            fontWeight:    700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color:         "#D4A827",
          }}
        >
          Live Now
        </span>
      </div>

      {/* Headline */}
      <h2
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize:   "clamp(1.75rem, 5vw, 3rem)",
          fontWeight: 700,
          fontStyle:  "italic",
          color:      "#F5EDD4",
          lineHeight: 1.15,
          marginBottom: "0.75rem",
        }}
      >
        The Fair Is Open — Come Join Us!
      </h2>

      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize:   "0.9rem",
          color:      "rgba(197,217,198,0.8)",
          maxWidth:   "36rem",
          margin:     "0 auto 2rem",
          lineHeight: 1.6,
        }}
      >
        The gates are open. Come experience the West Tennessee State Fair
        in Henderson, Tennessee.
      </p>

      {/* Action links */}
      <div
        style={{
          display:        "flex",
          flexWrap:       "wrap",
          gap:            "0.75rem",
          justifyContent: "center",
        }}
      >
        {liveLinks.map((link, i) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "0.4rem",
                padding:        "0.7rem 1.5rem",
                backgroundColor: i === 0 ? "#D4A827" : "transparent",
                color:           i === 0 ? "#1A1A1A" : "#F5EDD4",
                border:         `1px solid ${i === 0 ? "#D4A827" : "rgba(245,237,212,0.25)"}`,
                fontFamily:     "var(--font-inter), sans-serif",
                fontSize:       "0.7rem",
                fontWeight:     700,
                letterSpacing:  "0.12em",
                textTransform:  "uppercase",
                textDecoration: "none",
                transition:     reduceMotion ? "none" : "opacity 0.15s ease",
              }}
            >
              {link.label}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "0.4rem",
                padding:        "0.7rem 1.5rem",
                backgroundColor: i === 0 ? "#D4A827" : "transparent",
                color:           i === 0 ? "#1A1A1A" : "#F5EDD4",
                border:         `1px solid ${i === 0 ? "#D4A827" : "rgba(245,237,212,0.25)"}`,
                fontFamily:     "var(--font-inter), sans-serif",
                fontSize:       "0.7rem",
                fontWeight:     700,
                letterSpacing:  "0.12em",
                textTransform:  "uppercase",
                textDecoration: "none",
                transition:     reduceMotion ? "none" : "opacity 0.15s ease",
              }}
            >
              {link.label}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

// ── Phase: AFTER ──────────────────────────────────────────────

function AfterState({ reduceMotion }: { reduceMotion: boolean }) {
  const afterLinks = [
    { label: "View Fair Highlights",        href: FAIR_CONFIG.social.facebook, external: true },
    { label: "Follow Us for 2027 Updates",  href: FAIR_CONFIG.social.facebook, external: true },
    { label: "See You Next Year",           href: FAIR_CONFIG.social.instagram, external: true },
  ];

  return (
    <div className="text-center">
      {/* Decorative element */}
      <p
        style={{
          fontFamily:    "var(--font-inter), sans-serif",
          fontSize:      "0.65rem",
          fontWeight:    700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color:         "rgba(212,168,39,0.55)",
          marginBottom:  "1.25rem",
        }}
      >
        The 2026 Fair Has Concluded
      </p>

      <h2
        style={{
          fontFamily:   "var(--font-playfair), Georgia, serif",
          fontSize:     "clamp(1.75rem, 5vw, 2.75rem)",
          fontWeight:   700,
          fontStyle:    "italic",
          color:        "#F5EDD4",
          lineHeight:   1.2,
          marginBottom: "0.75rem",
        }}
      >
        Thank You for an Incredible 2026 Fair!
      </h2>

      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize:   "0.9rem",
          color:      "rgba(197,217,198,0.75)",
          maxWidth:   "34rem",
          margin:     "0 auto 2rem",
          lineHeight: 1.6,
        }}
      >
        171 years of tradition — and counting. Follow us on social media
        for 2027 announcements and fair highlights.
      </p>

      <div
        style={{
          display:        "flex",
          flexWrap:       "wrap",
          gap:            "0.75rem",
          justifyContent: "center",
        }}
      >
        {afterLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "0.4rem",
              padding:        "0.7rem 1.5rem",
              backgroundColor: i === 0 ? "#D4A827" : "transparent",
              color:           i === 0 ? "#1A1A1A" : "#F5EDD4",
              border:         `1px solid ${i === 0 ? "#D4A827" : "rgba(245,237,212,0.25)"}`,
              fontFamily:     "var(--font-inter), sans-serif",
              fontSize:       "0.7rem",
              fontWeight:     700,
              letterSpacing:  "0.12em",
              textTransform:  "uppercase",
              textDecoration: "none",
              transition:     reduceMotion ? "none" : "opacity 0.15s ease",
            }}
          >
            {link.label}
            {link.external && (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export default function FairCountdown() {
  const [phase,        setPhase]        = useState<Phase>("before");
  const [timeLeft,     setTimeLeft]     = useState<TimeLeft | null>(null);
  const [mounted,      setMounted]      = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const tick = useCallback(() => {
    const now = Date.now();
    const p   = getPhase(now);
    setPhase(p);
    if (p === "before") {
      setTimeLeft(getTimeLeft(FAIR_CONFIG.OPEN_DATE.getTime(), now));
    }
  }, []);

  useEffect(() => {
    // Detect reduced-motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);

    // Mark mounted (prevents hydration mismatch)
    setMounted(true);
    tick();

    const id = setInterval(tick, 1000);
    return () => {
      clearInterval(id);
      mq.removeEventListener("change", handler);
    };
  }, [tick]);

  return (
    <>
      {/* Keyframe for pulse dot — injected once, scoped */}
      <style>{`
        @keyframes wtsf-pulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>

      <section
        aria-label="Fair countdown"
        style={{ backgroundColor: "#1E3320", position: "relative", overflow: "hidden" }}
      >
        {/* Subtle grain texture — matches hero/PageHero pattern */}
        <div
          aria-hidden="true"
          style={{
            position:          "absolute",
            inset:             0,
            backgroundImage:   "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E\")",
            backgroundSize:    "256px 256px",
            pointerEvents:     "none",
            opacity:           0.6,
          }}
        />

        {/* Top border accent */}
        <div
          aria-hidden="true"
          style={{
            position:        "absolute",
            top:             0,
            left:            0,
            right:           0,
            height:          "2px",
            backgroundColor: "#D4A827",
            opacity:         0.3,
          }}
        />

        <div
          className="max-w-4xl mx-auto px-4 sm:px-6"
          style={{ paddingTop: "4rem", paddingBottom: "4rem", position: "relative" }}
        >
          {/*
            No-JS fallback: visible when JS is disabled.
            Hidden once component mounts (mounted state is client-only).
          */}
          {!mounted && (
            <noscript>
              <p
                style={{
                  fontFamily:    "var(--font-inter), sans-serif",
                  fontSize:      "0.8rem",
                  textAlign:     "center",
                  color:         "#C5D9C6",
                  letterSpacing: "0.1em",
                }}
              >
                West Tennessee State Fair — {FAIR_CONFIG.openLabel} through{" "}
                {FAIR_CONFIG.closeLabel} · {FAIR_CONFIG.location.city}
              </p>
            </noscript>
          )}

          {/* Render the right phase */}
          {phase === "before" && (
            <BeforeState timeLeft={timeLeft} reduceMotion={reduceMotion} />
          )}
          {phase === "live" && (
            <LiveState reduceMotion={reduceMotion} />
          )}
          {phase === "after" && (
            <AfterState reduceMotion={reduceMotion} />
          )}
        </div>

        {/* Bottom border accent */}
        <div
          aria-hidden="true"
          style={{
            position:        "absolute",
            bottom:          0,
            left:            0,
            right:           0,
            height:          "1px",
            backgroundColor: "rgba(212,168,39,0.15)",
          }}
        />
      </section>
    </>
  );
}
