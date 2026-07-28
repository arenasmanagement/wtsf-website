/**
 * fair-config.ts
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for the West Tennessee State Fair dates.
 * Update OPEN_DATE and CLOSE_DATE each season before publishing.
 *
 * TIMEZONE NOTE:
 *   Tennessee observes Central Time (America/Chicago).
 *   October 15-24, 2026 falls within CDT (UTC-5).
 *   The ISO offset "-05:00" is correct for those dates.
 *   When DST ends (first Sunday in November), use "-06:00" instead.
 *
 * HOW TO UPDATE FOR NEXT YEAR:
 *   1. Change OPEN_DATE  — fair opening day at the confirmed open time
 *   2. Change CLOSE_DATE — end of the last fair day (midnight after closing)
 *   3. Update year, openLabel, and closeLabel strings if desired.
 * ─────────────────────────────────────────────────────────────
 */

export const FAIR_CONFIG = {
  year: 2026,
  name: "West Tennessee State Fair",
  theme: "Back to Our Roots",

  // ── UPDATE THESE EACH SEASON ─────────────────────────────────
  //
  // Opening: Thursday, October 15, 2026 at 4:00 PM CDT
  // NOTE: Official opening time is TBA — update "T16:00:00" once
  // confirmed. Currently set to 4:00 PM as a reasonable default.
  OPEN_DATE: new Date("2026-10-15T16:00:00-05:00"),

  // Closing: Saturday, October 24, 2026 at midnight (end of day)
  CLOSE_DATE: new Date("2026-10-25T00:00:00-05:00"),
  // ─────────────────────────────────────────────────────────────

  // Human-readable labels (used in countdown display & meta)
  openLabel:  "October 15, 2026",
  closeLabel: "October 24, 2026",

  location: {
    city:    "Henderson, Tennessee",
    address: "575 Fourth Street, Henderson, TN 38340",
    mapsUrl: "https://maps.google.com/?q=575+Fourth+Street+Henderson+TN+38340",
  },

  contact: {
    email: "wtsfair@gmail.com",
  },

  social: {
    facebook:  "https://www.facebook.com/WTSFAIR",
    instagram: "https://www.instagram.com/westtnstatefair",
  },

  links: {
    schedule:   "/fair-info",
    directions: "https://maps.google.com/?q=575+Fourth+Street+Henderson+TN+38340",
    admission:  "/fair-info#admission",
  },
} as const;
