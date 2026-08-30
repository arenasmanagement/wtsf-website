// Single source of truth for pageant configuration.
// AUTHORITATIVE 2026 DIVISION DATA — do not change without Hayley's confirmation.

export const PAGEANT_FAIR_YEAR = 2026;
export const PAGEANT_DATE = "October 17, 2026";
export const PAGEANT_VENUE = "Williams Auditorium";
export const PAGEANT_LOCATION = "Henderson, Tennessee";

/**
 * Master switch: set to true once registration is ready to open publicly.
 * This sits ABOVE the Supabase registration_open flag.
 * Both must be true for registration to be available.
 */
export const PAGEANT_REGISTRATION_ENABLED = false;

export interface PageantDivision {
  id: string;
  name: string;
  ageLabel: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  arrivalTime: string;
  competitionTime: string;
  accentColor: string;
}

export const PAGEANT_DIVISIONS: PageantDivision[] = [
  {
    id: "baby-miss",
    name: "Baby Miss",
    ageLabel: "0–11 months",
    ageMinMonths: 0,
    ageMaxMonths: 11,
    arrivalTime: "9:30 AM",
    competitionTime: "10:00 AM",
    accentColor: "#8B2E2E",
  },
  {
    id: "tiny-miss",
    name: "Tiny Miss",
    ageLabel: "12–23 months",
    ageMinMonths: 12,
    ageMaxMonths: 23,
    arrivalTime: "10:00 AM",
    competitionTime: "10:30 AM",
    accentColor: "#7A4A2A",
  },
  {
    id: "toddler-miss",
    name: "Toddler Miss",
    ageLabel: "2–3 years",
    ageMinMonths: 24,
    ageMaxMonths: 47,
    arrivalTime: "10:30 AM",
    competitionTime: "11:00 AM",
    accentColor: "#5C4A32",
  },
  {
    id: "little-miss",
    name: "Little Miss",
    ageLabel: "4–5 years",
    ageMinMonths: 48,
    ageMaxMonths: 71,
    arrivalTime: "11:00 AM",
    competitionTime: "11:30 AM",
    accentColor: "#2C4A2E",
  },
  {
    id: "young-miss",
    name: "Young Miss",
    ageLabel: "6–7 years",
    ageMinMonths: 72,
    ageMaxMonths: 95,
    arrivalTime: "12:30 PM",
    competitionTime: "1:00 PM",
    accentColor: "#1A3A5C",
  },
  {
    id: "petite-miss",
    name: "Petite Miss",
    ageLabel: "8–10 years",
    ageMinMonths: 96,
    ageMaxMonths: 131,
    arrivalTime: "1:00 PM",
    competitionTime: "1:30 PM",
    accentColor: "#3A1A5C",
  },
  {
    id: "junior-miss",
    name: "Junior Miss",
    ageLabel: "11–13 years",
    ageMinMonths: 132,
    ageMaxMonths: 167,
    arrivalTime: "1:30 PM",
    competitionTime: "2:00 PM",
    accentColor: "#1A1A1A",
  },
];

export function getDivisionById(id: string): PageantDivision | undefined {
  return PAGEANT_DIVISIONS.find((d) => d.id === id);
}

/**
 * Age cutoff date policy: CONFIGURABLE — not yet confirmed by Hayley.
 * Once confirmed, update this value. Until then, age validation is advisory only.
 * Example: "2026-10-17" means age calculated as of pageant date.
 */
export const AGE_REFERENCE_DATE: string | null = null;

// ── Square configuration ───────────────────────────────────────────────────────
// Never expose SQUARE_ACCESS_TOKEN to the client.
// NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID are
// needed client-side for Square Web Payments SDK.
export const SQUARE_SANDBOX_MODE =
  process.env.NODE_ENV !== "production" ||
  process.env.SQUARE_SANDBOX_MODE === "true";
