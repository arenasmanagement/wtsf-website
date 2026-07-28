import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { FAIR_CONFIG } from "@/lib/fair-config";

export const metadata: Metadata = {
  title: "Fair Info — Dates, Hours & Admission",
  description:
    "Plan your visit to the 2026 West Tennessee State Fair, October 15–24. Gate prices, special event days, free parking, and directions to 575 Fourth Street, Henderson, TN.",
};

// ─────────────────────────────────────────────────────────────
// 2026 CONFIRMED PRICING — source: Ticket Pricing.png
// Gate prices are admission only. Armbands & season passes
// are sold separately at the gate.
// Children under 3 are always FREE.
// ─────────────────────────────────────────────────────────────

// Per-day pricing — verified from Ticket Pricing.png
const dailyPricing = [
  {
    date: "Oct 15",
    day: "Thu",
    label: "Opening Day",
    adults: "$5",
    youth: "$5",            // All ages
    allAges: true,
    note: "",
    isSpecial: true,
  },
  {
    date: "Oct 16",
    day: "Fri",
    label: "Rodeo Night",
    adults: "$15",
    youth: "$10",           // Ages 12 & under
    allAges: false,
    note: "Rodeo",
    isSpecial: true,
  },
  {
    date: "Oct 17",
    day: "Sat",
    label: "Rodeo Saturday",
    adults: "$15",
    youth: "$10",
    allAges: false,
    note: "Rides shut down 4 PM · Open 11 AM",
    isSpecial: true,
  },
  {
    date: "Oct 18",
    day: "Sun",
    label: "Sunday",
    adults: "$5",
    youth: "$5",
    allAges: true,
    note: "",
    isSpecial: false,
  },
  {
    date: "Oct 19",
    day: "Mon",
    label: "Monday",
    adults: "$5",
    youth: "$5",
    allAges: true,
    note: "",
    isSpecial: false,
  },
  {
    date: "Oct 20",
    day: "Tue",
    label: "Special Event",
    adults: "$15",
    youth: "$10",
    allAges: false,
    note: "Special event — details TBA",
    isSpecial: true,
  },
  {
    date: "Oct 21",
    day: "Wed",
    label: "Wednesday",
    adults: "$5",
    youth: "$5",
    allAges: true,
    note: "",
    isSpecial: false,
  },
  {
    date: "Oct 22",
    day: "Thu",
    label: "Thursday",
    adults: "$5",
    youth: "$5",
    allAges: true,
    note: "",
    isSpecial: false,
  },
  {
    date: "Oct 23",
    day: "Fri",
    label: "Friday",
    adults: "$5",
    youth: "$5",
    allAges: true,
    note: "",
    isSpecial: false,
  },
  {
    date: "Oct 24",
    day: "Sat",
    label: "Closing Day · Wrestling",
    adults: "$5",
    youth: "$5",
    allAges: true,
    note: "Open 11 AM · Rides shut down 4–5 PM · Wrestling 4 PM",
    isSpecial: true,
  },
];

const hoursData = [
  {
    dayType: "Opening Day",
    days: "Thursday, Oct 15",
    open: "TBA",
    close: "TBA",
    note: "Hours to be announced",
  },
  {
    dayType: "Fridays",
    days: "Fri Oct 16 & Oct 23",
    open: "TBA",
    close: "TBA",
    note: "Oct 16 opens with Rodeo Night",
  },
  {
    dayType: "Saturdays",
    days: "Sat Oct 17 & Oct 24",
    open: "11:00 AM",
    close: "Close",
    note: "Oct 17: Rides shut down 4 PM · Oct 24: Rides shut down 4–5 PM",
  },
  {
    dayType: "Sun – Fri",
    days: "Oct 18–23 (except special days)",
    open: "TBA",
    close: "TBA",
    note: "Hours to be announced — check back closer to fair",
  },
];

// 2026 confirmed schedule — Oct 15–24
const scheduleData = [
  {
    date: "Oct 15",
    day: "Thu",
    tag: "Opening Day",
    events: ["Gates Open", "Exhibits Open", "Pageants Begin", "Midway Opens"],
    isSpecial: true,
  },
  {
    date: "Oct 16",
    day: "Fri",
    tag: "Rodeo Night",
    events: ["Rodeo", "Live Entertainment", "Midway", "Exhibits"],
    isSpecial: true,
  },
  {
    date: "Oct 17",
    day: "Sat",
    tag: "Rodeo Saturday",
    events: ["Open 11 AM", "Rodeo", "Rides Until 4 PM", "Midway"],
    isSpecial: true,
  },
  {
    date: "Oct 18",
    day: "Sun",
    tag: "",
    events: ["Family Day", "Livestock Shows", "Midway", "Exhibits"],
    isSpecial: false,
  },
  {
    date: "Oct 19",
    day: "Mon",
    tag: "",
    events: ["Exhibits", "Livestock", "Midway"],
    isSpecial: false,
  },
  {
    date: "Oct 20",
    day: "Tue",
    tag: "Special Event",
    events: ["Special Event TBA", "Exhibits", "Midway"],
    isSpecial: true,
  },
  {
    date: "Oct 21",
    day: "Wed",
    tag: "",
    events: ["Exhibits", "Livestock Shows", "Midway"],
    isSpecial: false,
  },
  {
    date: "Oct 22",
    day: "Thu",
    tag: "",
    events: ["Livestock Finals", "Exhibit Results", "Midway"],
    isSpecial: false,
  },
  {
    date: "Oct 23",
    day: "Fri",
    tag: "",
    events: ["Exhibits", "Live Entertainment", "Midway"],
    isSpecial: false,
  },
  {
    date: "Oct 24",
    day: "Sat",
    tag: "Closing Day",
    events: ["Open 11 AM", "Wrestling 4 PM", "Rides Until 4–5 PM", "Grand Finale"],
    isSpecial: true,
  },
];

export default function FairInfoPage() {
  return (
    <>
      <PageHero
        overline="Plan Your Visit"
        headline="Fair Info"
        subtext="Everything you need before you arrive — dates, hours, admission, and how to get here."
        imageSrc="/images/fairinfo-hero.webp"
        accentColor="#D4A827"
      />

      {/* ── Quick Reference Bar ────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            {[
              { label: "Fair Dates", value: "Oct 15–24, 2026" },
              { label: "Gate Admission", value: "From $5" },
              { label: "Parking", value: "Free — Always" },
              { label: "Location", value: "Henderson, TN" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-4 text-center">
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-1"
                  style={{ color: "#D4A827", letterSpacing: "0.18em" }}
                >
                  {item.label}
                </p>
                <p className="text-sm font-semibold" style={{ color: "#F5EDD4" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Admission & Tickets ────────────────────────── */}
      <section
        id="admission"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="admission-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="mb-10">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              2026 Gate Prices
            </p>
            <h2
              id="admission-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#2C4A2E",
              }}
            >
              Admission & Pricing
            </h2>
            <p className="mt-3 text-sm leading-relaxed max-w-xl" style={{ color: "#5C4A32" }}>
              Gate prices vary by day. Most days are <strong>$5 for all ages</strong>.
              Special event days (Rodeo, special events) are priced higher.
              Children under 3 are <strong>always free</strong> at the gate.
            </p>
          </div>

          {/* Two price-track cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Standard days */}
            <div
              className="relative p-6 flex flex-col"
              style={{ backgroundColor: "#2C4A2E" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "rgba(212,168,39,0.85)", letterSpacing: "0.18em" }}
              >
                Most Days
              </p>
              <p
                className="text-5xl font-bold italic mb-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
              >
                $5
              </p>
              <p className="text-sm mb-4" style={{ color: "#A8BFA9" }}>All ages · Gate admission</p>
              <ul className="space-y-1 mt-auto">
                {["Oct 15 · 18 · 19 · 21 · 22 · 23 · 24"].map((d) => (
                  <li key={d} className="text-xs" style={{ color: "#C5D9C6" }}>{d}</li>
                ))}
              </ul>
            </div>

            {/* Special event days */}
            <div
              className="relative p-6 flex flex-col"
              style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#8B2E2E" }} aria-hidden="true" />
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#8B7355", letterSpacing: "0.18em" }}
              >
                Special Event Days
              </p>
              <div className="flex items-baseline gap-3 mb-1">
                <div>
                  <p
                    className="text-5xl font-bold italic"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#8B2E2E" }}
                  >
                    $15
                  </p>
                  <p className="text-xs" style={{ color: "#5C4A32" }}>Adults</p>
                </div>
                <span className="text-2xl" style={{ color: "#C0A878" }}>/</span>
                <div>
                  <p
                    className="text-5xl font-bold italic"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#8B2E2E" }}
                  >
                    $10
                  </p>
                  <p className="text-xs" style={{ color: "#5C4A32" }}>Ages 12 &amp; Under</p>
                </div>
              </div>
              <ul className="space-y-1 mt-4">
                {[
                  "Oct 16 — Rodeo Night",
                  "Oct 17 — Rodeo Saturday",
                  "Oct 20 — Special Event",
                ].map((d) => (
                  <li key={d} className="text-xs" style={{ color: "#5C4A32" }}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Always free callout */}
          <div
            className="flex items-center gap-4 p-5 mb-8"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
              style={{ backgroundColor: "#2C4A2E" }}
              aria-hidden="true"
            >
              <span className="text-base">🎠</span>
            </div>
            <p className="text-sm" style={{ color: "#2C4A2E" }}>
              <strong>Children under 3 are always free</strong> — every day, all gates, no exceptions.
            </p>
          </div>

          {/* Per-day pricing table */}
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "#8B7355", letterSpacing: "0.18em" }}
            >
              Day-by-Day Price Guide
            </p>

            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase"
              style={{ backgroundColor: "#2C4A2E", color: "#D4A827", letterSpacing: "0.12em" }}
            >
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Day</div>
              <div className="col-span-4">Event / Notes</div>
              <div className="col-span-2 text-right">Adults</div>
              <div className="col-span-3 text-right">Ages 12 &amp; Under</div>
            </div>

            {/* Table rows */}
            {dailyPricing.map((row, i) => (
              <div
                key={row.date}
                className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm"
                style={{
                  backgroundColor: row.isSpecial
                    ? "rgba(44,74,46,0.06)"
                    : i % 2 === 0 ? "#FDFAF3" : "#F5EDD4",
                  borderBottom: "1px solid #E8DFC8",
                }}
              >
                <div className="col-span-2 font-bold" style={{ color: row.isSpecial ? "#8B2E2E" : "#2C4A2E" }}>
                  {row.date}
                </div>
                <div className="col-span-1 text-xs font-medium" style={{ color: "#8B7355" }}>
                  {row.day}
                </div>
                <div className="col-span-4">
                  {row.label && (
                    <span
                      className="block text-xs font-semibold"
                      style={{ color: row.isSpecial ? "#8B2E2E" : "#2C4A2E" }}
                    >
                      {row.label}
                    </span>
                  )}
                  {row.note && (
                    <span className="block text-xs leading-snug" style={{ color: "#8B7355" }}>
                      {row.note}
                    </span>
                  )}
                </div>
                <div
                  className="col-span-2 text-right font-bold italic text-base"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: row.isSpecial ? "#8B2E2E" : "#2C4A2E",
                  }}
                >
                  {row.adults}
                </div>
                <div
                  className="col-span-3 text-right font-bold italic text-base"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: row.isSpecial ? "#8B2E2E" : "#2C4A2E",
                  }}
                >
                  {row.allAges ? "Same" : row.youth}
                </div>
              </div>
            ))}

            <p className="text-xs mt-3 leading-relaxed" style={{ color: "#8B7355" }}>
              * &ldquo;Same&rdquo; means the same price applies to all ages that day. Children under 3 are always free.
              Armbands and season passes are sold separately at the gate.
            </p>
          </div>

          {/* Armbands / Season Passes note */}
          <div
            className="mt-8 p-6"
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.18em" }}
            >
              Also Available at the Gate
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "#2C4A2E" }}>Ride Armbands</p>
                <p className="text-xs leading-relaxed" style={{ color: "#5C4A32" }}>
                  Unlimited-ride armbands are available for purchase separately from your gate ticket.
                  Saturday sessions are split into two windows. Pricing confirmed at the gate.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "#2C4A2E" }}>Season Pass</p>
                <p className="text-xs leading-relaxed" style={{ color: "#5C4A32" }}>
                  A season pass covers gate admission for all 10 days of the fair.
                  Available at the gate or contact wtsfair@gmail.com for more information.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Hours ──────────────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="hours-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#D4A827", letterSpacing: "0.25em" }}
            >
              When We&apos;re Open
            </p>
            <h2
              id="hours-heading"
              className="text-3xl sm:text-4xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#2C4A2E",
              }}
            >
              Fair Hours
            </h2>
          </div>

          {/* Hours grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {hoursData.map((h) => (
              <div
                key={h.dayType}
                className="p-6"
                style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-1"
                  style={{ color: "#D4A827", letterSpacing: "0.15em" }}
                >
                  {h.dayType}
                </p>
                <p
                  className="text-xs font-medium mb-5"
                  style={{ color: "#8B7355" }}
                >
                  {h.days}
                </p>
                <p
                  className="text-2xl font-bold italic"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#2C4A2E",
                  }}
                >
                  {h.open}
                </p>
                <p
                  className="text-xs font-bold tracking-widest uppercase my-1"
                  style={{ color: "#D4A827" }}
                >
                  to
                </p>
                <p
                  className="text-2xl font-bold italic"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#2C4A2E",
                  }}
                >
                  {h.close}
                </p>
                {h.note && (
                  <p
                    className="text-xs mt-4 leading-snug"
                    style={{ color: "#8B7355" }}
                  >
                    {h.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Saturday armband sessions */}
          <div style={{ backgroundColor: "#2C4A2E" }} className="p-6">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "#D4A827" }}
            >
              Saturday Armband Sessions
            </p>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "#C5D9C6" }}
            >
              Ride armbands on Saturdays are split into two sessions — same
              price, same rides, just two windows so everyone gets their turn.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { session: "Round 1", time: "10:00 AM – 4:00 PM", price: "$30" },
                { session: "Round 2", time: "5:00 PM – Close", price: "$30" },
              ].map((s) => (
                <div
                  key={s.session}
                  className="flex items-center justify-between p-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  <div>
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{ color: "#A8BFA9" }}
                    >
                      {s.session}
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#F5EDD4" }}
                    >
                      {s.time}
                    </p>
                  </div>
                  <p
                    className="text-2xl font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#D4A827",
                    }}
                  >
                    {s.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Daily Schedule ──────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="schedule-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header row with TBC notice */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#D4A827", letterSpacing: "0.25em" }}
              >
                10 Days
              </p>
              <h2
                id="schedule-heading"
                className="text-3xl sm:text-4xl font-bold italic"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Daily Schedule
              </h2>
            </div>

            {/* 2026 confirmed badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold"
              style={{ backgroundColor: "#2C4A2E", color: "#D4A827" }}
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2026 Confirmed Dates
            </div>
          </div>

          {/* 10-day grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {scheduleData.map((day) => (
              <div
                key={day.date}
                className="p-4 flex flex-col gap-2"
                style={{
                  backgroundColor: day.isSpecial ? "#2C4A2E" : "#FDFAF3",
                  border: day.isSpecial ? "none" : "1px solid #E8DFC8",
                }}
              >
                {day.tag && (
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "#D4A827", letterSpacing: "0.15em" }}
                  >
                    {day.tag}
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-lg font-bold italic leading-none"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: day.isSpecial ? "#F5EDD4" : "#2C4A2E",
                    }}
                  >
                    {day.date}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: day.isSpecial ? "#A8BFA9" : "#8B7355" }}
                  >
                    {day.day}
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  {day.events.map((ev, i) => (
                    <li
                      key={i}
                      className="text-xs leading-snug"
                      style={{ color: day.isSpecial ? "#C5D9C6" : "#5C4A32" }}
                    >
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            className="text-xs mt-5 leading-relaxed"
            style={{ color: "#8B7355" }}
          >
            * Dates confirmed for 2026. Specific entertainment acts, times, and
            additional event announcements will be added closer to the fair.
            Check back for updates or follow us on Facebook for the latest news.
          </p>
        </div>
      </section>

      {/* ── Location & Directions ──────────────────────── */}
      <section
        id="parking"
        className="py-16 md:py-20"
        style={{ backgroundColor: "#FDFAF3" }}
        aria-labelledby="location-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: address + details */}
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#D4A827", letterSpacing: "0.25em" }}
              >
                Getting Here
              </p>
              <h2
                id="location-heading"
                className="text-3xl sm:text-4xl font-bold italic mb-7"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                Location & Directions
              </h2>

              {/* Address card */}
              <div
                className="p-6 mb-5"
                style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "#D4A827" }}
                >
                  Fairgrounds Address
                </p>
                <address className="not-italic mb-4">
                  <p
                    className="text-2xl font-bold italic mb-1"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#2C4A2E",
                    }}
                  >
                    575 Fourth Street
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#5C4A32" }}
                  >
                    Henderson, TN 38340
                  </p>
                </address>
                <a
                  href="https://maps.google.com/?q=575+Fourth+Street+Henderson+TN+38340"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{ color: "#2C4A2E", letterSpacing: "0.12em" }}
                >
                  Open in Google Maps
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>

              {/* Info bullets */}
              <div className="space-y-3">
                {[
                  {
                    icon: (
                      <path strokeLinecap="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    ),
                    title: "Free Parking On-Site",
                    body: "Ample free parking is available at the fairgrounds every day of the fair. No parking fees, ever.",
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    ),
                    title: "Henderson, Chester County",
                    body: "Located roughly 90 miles northeast of Memphis and 80 miles east of Jackson via US-45.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4"
                    style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                      style={{ backgroundColor: "#2C4A2E" }}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#D4A827"
                        strokeWidth={1.75}
                      >
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold mb-1"
                        style={{ color: "#2C4A2E" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#5C4A32" }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Google Maps embed */}
            <div className="flex flex-col gap-3">
              <div
                className="overflow-hidden"
                style={{ border: "1px solid #D4C9A8" }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=575+Fourth+Street+Henderson+TN+38340&z=15&output=embed"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="West Tennessee State Fair — 575 Fourth Street, Henderson, TN 38340"
                />
              </div>
              {/* Get Directions CTA */}
              <a
                href="https://maps.google.com/?q=575+Fourth+Street+Henderson+TN+38340"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "#2C4A2E",
                  color: "#D4A827",
                  letterSpacing: "0.12em",
                }}
              >
                Get Directions
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Weather Policy ─────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: "#F5EDD4" }}
        aria-labelledby="weather-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#D4A827", letterSpacing: "0.25em" }}
              >
                Before You Arrive
              </p>
              <h2
                id="weather-heading"
                className="text-3xl sm:text-4xl font-bold italic mb-6"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
              >
                Weather & Schedules
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                The West Tennessee State Fair is generally planned to operate during normal seasonal
                weather. Individual events, outdoor activities, rides, or schedules may be delayed,
                relocated, or adjusted when weather conditions create safety concerns.
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#5C4A32" }}>
                Safety decisions may be made by fair management, event officials, or ride operators.
                Visitors should check the official website and our social media channels for the
                latest updates before traveling.
              </p>
              <ul className="space-y-2 text-sm" style={{ color: "#5C4A32" }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#D4A827" }} aria-hidden="true">✓</span>
                  Check the forecast before leaving home.
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#D4A827" }} aria-hidden="true">✓</span>
                  Monitor our social media on the day of your visit.
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#D4A827" }} aria-hidden="true">✓</span>
                  Updates will be shared through official channels when conditions change.
                </li>
              </ul>
            </div>
            {/* Visitor guide & FAQ promo */}
            <div className="space-y-4">
              <Link
                href="/first-time-visitors"
                className="block p-6 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C4A2E]"
                style={{ backgroundColor: "#2C4A2E" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#D4A827", letterSpacing: "0.18em" }}
                >
                  New to the fair?
                </p>
                <p
                  className="text-xl font-bold italic mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
                >
                  First-Time Visitors Guide
                </p>
                <p className="text-sm" style={{ color: "#A8BFA9" }}>
                  Everything you need to know before you arrive — parking, admission, what to
                  expect, accessibility, and more.
                </p>
              </Link>
              <Link
                href="/faq"
                className="block p-6 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DFC8]"
                style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#D4A827", letterSpacing: "0.18em" }}
                >
                  Common questions
                </p>
                <p
                  className="text-xl font-bold italic mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
                >
                  FAQ
                </p>
                <p className="text-sm" style={{ color: "#5C4A32" }}>
                  Answers to the most common questions about admission, hours, rides, exhibits,
                  accessibility, and getting in touch.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────── */}
      <section style={{ backgroundColor: "#2C4A2E" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "#D4A827" }}
            >
              Have Questions?
            </p>
            <p
              className="text-xl font-bold italic"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#F5EDD4",
              }}
            >
              We&apos;re happy to help you plan your visit.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={`mailto:${FAIR_CONFIG.contact.email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "#D4A827",
                color: "#1A1A1A",
                letterSpacing: "0.1em",
              }}
            >
              {FAIR_CONFIG.contact.email}
            </a>
            <a
              href={FAIR_CONFIG.contact.phoneHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase border transition-all hover:opacity-80"
              style={{
                borderColor: "rgba(245,237,212,0.4)",
                color: "#F5EDD4",
                letterSpacing: "0.1em",
              }}
            >
              {FAIR_CONFIG.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
