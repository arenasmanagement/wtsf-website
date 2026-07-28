import type { MetadataRoute } from "next";

const BASE_URL = "https://www.wtsfair.com";

/**
 * Static last-modified dates for each route.
 *
 * Update the date for a route when its content changes meaningfully.
 * These dates guide crawler re-indexing priority — don't set them
 * to today's date on every build; that misleads search engines.
 *
 * Format: "YYYY-MM-DD" — Next.js converts these to ISO 8601.
 */
const DATES = {
  // Homepage refreshed seasonally (countdown, sponsor section, etc.)
  home:          "2026-07-27",
  // Fair-info page refreshed when schedule/admission details change
  fairInfo:      "2026-07-01",
  // Exhibit page refreshed when guides are updated
  exhibits:      "2026-07-01",
  // Pageants page — stable for the season
  pageants:      "2026-06-01",
  // Livestock page — stable for the season
  livestock:     "2026-06-01",
  // About page — updated annually (leadership roster, etc.)
  about:         "2026-06-01",
  // Partner hub — stable
  partnerHub:    "2026-06-01",
  // Subpages — stable unless packages or pricing change
  vendors:       "2026-06-01",
  sponsors:      "2026-06-01",
  volunteer:     "2026-06-01",
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: DATES.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/fair-info`,
      lastModified: DATES.fairInfo,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/exhibits`,
      lastModified: DATES.exhibits,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pageants`,
      lastModified: DATES.pageants,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/livestock`,
      lastModified: DATES.livestock,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: DATES.about,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/partner-with-us`,
      lastModified: DATES.partnerHub,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/partner-with-us/vendors`,
      lastModified: DATES.vendors,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/partner-with-us/sponsors`,
      lastModified: DATES.sponsors,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/partner-with-us/volunteer`,
      lastModified: DATES.volunteer,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
