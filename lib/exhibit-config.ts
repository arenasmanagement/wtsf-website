// ═══════════════════════════════════════════════════════════════════
// WEST TENNESSEE STATE FAIR — Exhibit Registration Configuration
//
// UPDATE ANNUALLY:
//   - registrationOpenDate / registrationCloseDate
//   - entryDeadlineLabel
//   - checkinInfo
//   - fair year references
//
// ADD REAL CLASS/LOT DATA:
//   The classes and lots below are PLACEHOLDERS.
//   Replace each placeholder array with the actual classes and lots
//   from the printed entry books before opening registration.
//   Each class should be:  { value: "Class 14", label: "Class 14 – Roses" }
//   Each lot should be:    { value: "Lot 2",    label: "Lot 2 – Single Rose" }
// ═══════════════════════════════════════════════════════════════════

export const FAIR_YEAR = 2026;

// ── Registration Window ─────────────────────────────────────────────
// These dates are also stored in Supabase for live edits.
// If Supabase is unavailable, the app falls back to these values.
export const REGISTRATION_OPEN_DATE  = new Date("2026-07-01T00:00:00-05:00");
export const REGISTRATION_CLOSE_DATE = new Date("2026-10-01T23:59:59-05:00");
export const ENTRY_DEADLINE_LABEL    = "October 1, 2026";
export const FAIR_NOTIFICATION_EMAILS = [
  "wtsfair@gmail.com",
  "arenasmanagementco@gmail.com",
];

// ── Check-In Information ────────────────────────────────────────────
// ⚠️  UPDATE with confirmed 2026 check-in dates before going live.
export const CHECKIN_INFO = {
  nonPerishable: "October 14–15, 2026 · 9:00 AM – 5:00 PM   [TBC — confirm with fair board]",
  perishable:    "October 16, 2026 (Opening Day) · 9:00 AM – 2:00 PM  [TBC — confirm with fair board]",
};

export const PICKUP_INFO = {
  nonPerishable: "October 25, 2026 · After 5:00 PM  [TBC]",
  perishable:    "October 25, 2026 · At Fair Close  [TBC]",
};

// ── Department → Division → Class/Lot Structure ──────────────────────
//
// ⚠️  CLASSES AND LOTS ARE PLACEHOLDERS.
//     Replace placeholder arrays with real data from the entry books.
//     The current structure uses free-text fields for Class and Lot
//     (entrants type them in). Once you have the real lists, convert
//     the classOptions and lotOptions arrays to dropdown options.
//
// Structure:
//   departments[]
//     .divisions[]
//       .classOptions[] (currently empty — converts to dropdown when populated)
//       .lotOptions[]   (currently empty — converts to dropdown when populated)

export interface LotOption {
  value: string;
  label: string;
}

export interface ClassOption {
  value: string;
  label: string;
  lots?: LotOption[];
}

export interface Division {
  value: string;
  label: string;
  note: string;
  // ⚠️ POPULATE THESE from the entry books before going live:
  classOptions: ClassOption[];
}

export interface Department {
  value: string;
  label: string;
  tagline: string;
  accentColor: string;
  divisions: Division[];
}

export const DEPARTMENTS: Department[] = [
  {
    value: "Non-Perishable",
    label: "Non-Perishable Exhibits",
    tagline: "Items that do not spoil — displayed for the full fair duration.",
    accentColor: "#2C4A2E",
    divisions: [
      {
        value: "Arts & Crafts",
        label: "Arts & Crafts",
        note: "Handmade items, ceramics, pottery, jewelry, and decorative arts",
        // ⚠️ TODO: Replace [] with real classes from entry book
        classOptions: [],
      },
      {
        value: "Needlework & Textiles",
        label: "Needlework & Textiles",
        note: "Quilts, embroidery, cross-stitch, knitting, crocheting, and woven pieces",
        classOptions: [],
      },
      {
        value: "Photography",
        label: "Photography",
        note: "Print and digital — landscape, portrait, action, and creative categories",
        classOptions: [],
      },
      {
        value: "Fine Art",
        label: "Fine Art",
        note: "Original paintings, drawings, watercolors, pastels, and mixed media",
        classOptions: [],
      },
      {
        value: "Woodworking",
        label: "Woodworking",
        note: "Furniture, carvings, and decorative woodwork",
        classOptions: [],
      },
      {
        value: "Youth Exhibits (Non-Perishable)",
        label: "Youth Exhibits — Non-Perishable",
        note: "All non-perishable categories open to entrants under 18",
        classOptions: [],
      },
    ],
  },
  {
    value: "Perishable",
    label: "Perishable Exhibits",
    tagline: "Food items, flowers, and fresh produce — delivered close to judging.",
    accentColor: "#8B2E2E",
    divisions: [
      {
        value: "Baked Goods",
        label: "Baked Goods",
        note: "Breads, cakes, pies, cookies, and specialty baked items",
        classOptions: [],
      },
      {
        value: "Canned Goods & Preserves",
        label: "Canned Goods & Preserves",
        note: "Jams, jellies, pickles, relishes, and preserved vegetables",
        classOptions: [],
      },
      {
        value: "Fresh Vegetables",
        label: "Fresh Vegetables",
        note: "Homegrown produce — judged on size, uniformity, and condition",
        classOptions: [],
      },
      {
        value: "Fresh Flowers & Plants",
        label: "Fresh Flowers & Plants",
        note: "Cut flower arrangements and container plants",
        classOptions: [],
      },
      {
        value: "Youth Perishable",
        label: "Youth Perishable",
        note: "All perishable categories open to entrants under 18",
        classOptions: [],
      },
    ],
  },
];

// Helper: get divisions for a given department value
export function getDivisionsForDepartment(departmentValue: string): Division[] {
  return DEPARTMENTS.find((d) => d.value === departmentValue)?.divisions ?? [];
}

// Helper: get classes for a given department + division
export function getClassesForDivision(
  departmentValue: string,
  divisionValue: string
): ClassOption[] {
  const dept = DEPARTMENTS.find((d) => d.value === departmentValue);
  return dept?.divisions.find((d) => d.value === divisionValue)?.classOptions ?? [];
}
