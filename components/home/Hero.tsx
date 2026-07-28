"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  // videoRef is kept for any future JS-level controls (e.g. play/pause toggle).
  // Reduced-motion is handled CSS-first (see <style> below) so the video never
  // starts playing before JS runs for users who prefer reduced motion.
  const videoRef = useRef<HTMLVideoElement>(null);

  // Belt-and-suspenders: also pause via JS once mounted, in case the CSS
  // rule hasn't taken effect or the browser ignores prefers-reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero — Back to Our Roots"
    >
      {/*
        CSS-first reduced-motion solution:
        - .hero-video is hidden before JS runs for prefers-reduced-motion users,
          preventing video autoplay entirely (no network fetch, no motion).
        - .hero-poster-rm is shown instead, displaying the poster as a static image.
        - This works even with JavaScript disabled.
      */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .hero-video   { display: none !important; }
          .hero-poster-rm { display: block !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          MEDIA LAYER — hero background video
          (hidden for prefers-reduced-motion via CSS above)
          ══════════════════════════════════════════ */}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.webp"
        className="hero-video absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4"  type="video/mp4" />
      </video>

      {/*
        Poster image — shown for prefers-reduced-motion users (CSS above) and
        also covers the no-JS case. Hidden by default; CSS overrides to block.
      */}
      <div
        className="hero-poster-rm absolute inset-0"
        style={{
          display:            "none",
          backgroundImage:    "url('/images/hero-poster.webp')",
          backgroundSize:     "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* Fallback for users with JavaScript disabled */}
      <noscript>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/hero-poster.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
      </noscript>

      {/* ══════════════════════════════════════════
          OVERLAY SYSTEM — three composited layers
          1. Base vertical gradient (top/bottom darker, center breathes)
          2. Edge vignette (radial — corners and sides darken)
          3. Soft center backdrop (radial ellipse behind text, no hard edges)
          Combined: edges/corners ~70-75% dark, center ~40-45% dark
          Video remains clearly visible through the center.
          ══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: [
            /* 1 — base vertical gradient */
            "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.75) 100%)",
            /* 2 — edge vignette: transparent center → dark edges */
            "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 28%, rgba(0,0,0,0.55) 100%)",
            /* 3 — soft center text backdrop: barely perceptible, no box edges */
            "radial-gradient(ellipse 62% 52% at 50% 44%, rgba(0,0,0,0.38) 0%, transparent 100%)",
          ].join(", "),
        }}
        aria-hidden="true"
      />

      {/* Grain texture — keeps warmth over any background */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════
          CONTENT — unchanged from original design
          ══════════════════════════════════════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20">

        {/* Section label */}
        <p
          className="text-xs font-bold tracking-widest uppercase mb-6"
          style={{
            color: "#D4A827",
            letterSpacing: "0.3em",
            textShadow: "0 1px 4px rgba(0,0,0,0.75)",
          }}
        >
          Henderson, Tennessee · Est. 1855
        </p>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold italic leading-tight mb-4"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#F5EDD4",
            textShadow: "0 2px 12px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          Back to
          <span
            className="block not-italic font-black"
            style={{
              color: "#D4A827",
              textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            Our Roots
          </span>
        </h1>

        {/* Fair name — changed from sage green (#A8BFA9) to warm pale gold for readability */}
        <p
          className="text-lg sm:text-xl md:text-2xl font-semibold tracking-widest uppercase mb-3 mt-6"
          style={{
            color: "#E2D08A",
            letterSpacing: "0.25em",
            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
          }}
        >
          West Tennessee State Fair 2026
        </p>

        {/* Sub-headline — changed from sage green (#C5D9C6) to warm off-white for readability */}
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{
            color: "#EDE8DD",
            textShadow: "0 1px 4px rgba(0,0,0,0.7)",
          }}
        >
          171 years of tradition, competition, and community — coming back to Henderson this October.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/fair-info"
            className="px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
          >
            Plan Your Visit
          </Link>
          <Link
            href="/exhibits"
            className="px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-150 hover:bg-white/10 border-2"
            style={{
              borderColor: "rgba(245,237,212,0.75)",
              color: "#F5EDD4",
              letterSpacing: "0.1em",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            Enter This Year
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-60" aria-hidden="true">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#E2D9C4" }}>
            Scroll
          </span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#E2D9C4"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
