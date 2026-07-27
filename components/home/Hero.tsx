"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * HERO MEDIA INSTRUCTIONS
 * ─────────────────────────────────────────────────────────────
 * This hero is media-ready. To add real content later:
 *
 * OPTION A — Background Photo:
 *   1. Add your image to /public/images/hero.jpg (min 1920×1080)
 *   2. Replace the <HeroMediaPlaceholder /> comment below with:
 *      <Image
 *        src="/images/hero.jpg"
 *        alt=""
 *        fill
 *        priority
 *        sizes="100vw"
 *        className="object-cover object-center"
 *      />
 *   3. Remove the gradient fallback div
 *
 * OPTION B — Background Video:
 *   1. Add your video to /public/video/hero.mp4 (+ hero.webm for best compression)
 *   2. Replace the <HeroMediaPlaceholder /> comment below with:
 *      <video
 *        ref={videoRef}
 *        autoPlay
 *        muted
 *        loop
 *        playsInline
 *        poster="/images/hero-poster.jpg"   ← fallback frame for mobile/slow connections
 *        className="absolute inset-0 w-full h-full object-cover object-center"
 *        aria-hidden="true"
 *      >
 *        <source src="/video/hero.webm" type="video/webm" />
 *        <source src="/video/hero.mp4"  type="video/mp4" />
 *      </video>
 *   3. Keep the gradient fallback below for reduced-motion users
 *
 * The overlay layer (dark gradient) stays in both cases — it keeps text readable.
 * ─────────────────────────────────────────────────────────────
 */

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Respect reduced-motion: pause video if user prefers reduced motion
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
      {/* ══════════════════════════════════════════
          MEDIA LAYER — hero background video
          ══════════════════════════════════════════ */}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.webp"
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4"  type="video/mp4" />
      </video>

      {/* ══════════════════════════════════════════
          OVERLAY — always keep this; maintains text contrast over any media
          Adjust opacity values if photo/video is very dark or very bright
          ══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)",
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
          style={{ color: "#D4A827", letterSpacing: "0.3em" }}
        >
          Henderson, Tennessee · Est. 1855
        </p>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold italic leading-tight mb-4"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#F5EDD4",
          }}
        >
          Back to
          <span className="block not-italic font-black" style={{ color: "#D4A827" }}>
            Our Roots
          </span>
        </h1>

        {/* Fair name */}
        <p
          className="text-lg sm:text-xl md:text-2xl font-semibold tracking-widest uppercase mb-3 mt-6"
          style={{ color: "#A8BFA9", letterSpacing: "0.25em" }}
        >
          West Tennessee State Fair 2026
        </p>

        {/* Sub-headline */}
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: "#C5D9C6" }}
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
              borderColor: "rgba(245,237,212,0.5)",
              color: "#F5EDD4",
              letterSpacing: "0.1em",
            }}
          >
            Enter This Year
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-60" aria-hidden="true">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#A8BFA9" }}>
            Scroll
          </span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#A8BFA9"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
