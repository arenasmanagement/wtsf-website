// ═══════════════════════════════════════════════════════════════════
// WEST TENNESSEE STATE FAIR — Exhibit Registration Configuration
//
// UPDATE ANNUALLY:
//   - NONPERISHABLE_ONLINE_DEADLINE / PERISHABLE_ONLINE_DEADLINE
//   - CHECKIN_SCHEDULE windows
//   - ENTRY_DEADLINE_LABEL
//   - fair year references
//
// ADD REAL CLASS/LOT DATA:
//   The classes and lots below are PLACEHOLDERS.
//   Replace each placeholder array with the actual classes and lots
//   from the printed entry books before opening registration.
// ═══════════════════════════════════════════════════════════════════

export const FAIR_YEAR = 2026;

// ── Registration Master Switch (Supabase-controlled) ────────────────
// Used as fallback if Supabase is unavailable.
// Actual open/close window is set in Supabase → exhibit_registration_settings.
export const REGISTRATION_OPEN_DATE  = new Date("2026-07-01T05:00:00.000Z");
export const REGISTRATION_CLOSE_DATE = new Date("2026-10-13T04:59:59.000Z");

// ── Online Entry Deadlines (per department type) ─────────────────────
// These are INTERNAL operational deadlines — online submissions only.
// Non-Perishable: Friday, October 9 at 11:59 PM CDT  → 2026-10-10 04:59:59 UTC
// Perishable:    Monday, October 12 at 11:59 PM CDT  → 2026-10-13 04:59:59 UTC
export const NONPERISHABLE_ONLINE_DEADLINE = new Date("2026-10-10T04:59:59.000Z");
export const PERISHABLE_ONLINE_DEADLINE    = new Date("2026-10-13T04:59:59.000Z");

export const ENTRY_DEADLINE_LABEL = "October 12, 2026";

export const FAIR_NOTIFICATION_EMAILS = [
  "wtsfair@gmail.com",
  "arenasmanagementco@gmail.com",
];

// ── Exhibit Turn-In / Check-In Schedule ──────────────────────────────
// These are the official exhibit check-in windows for 2026.
// Update annually with confirmed Fair Board dates.
export interface TurninWindow {
  day:   string;
  hours: string;
}

export interface TurninGroup {
  label:   string;
  windows: TurninWindow[];
}

export const CHECKIN_SCHEDULE: { nonPerishable: TurninGroup; perishable: TurninGroup } = {
  nonPerishable: {
    label: "Non-Perishable Exhibits",
    windows: [
      { day: "Saturday, October 10", hours: "10:00 AM – 5:00 PM" },
      { day: "Sunday, October 11",   hours: "1:00 PM – 5:00 PM"  },
      { day: "Monday, October 12",   hours: "1:00 PM – 6:00 PM"  },
    ],
  },
  perishable: {
    label: "Perishable Exhibits",
    windows: [
      { day: "Tuesday, October 13",  hours: "1:00 PM – 6:00 PM"  },
    ],
  },
};

// ── Department type helpers ───────────────────────────────────────────
export type DepartmentType = "Non-Perishable" | "Perishable";

export function getDepartmentType(departmentValue: string): DepartmentType | null {
  const dept = DEPARTMENTS.find((d) => d.value === departmentValue);
  if (!dept) return null;
  return dept.value as DepartmentType;
}

/** Returns true if the online entry deadline for this department type has passed. */
export function isDeadlinePassed(type: DepartmentType): boolean {
  const now = Date.now();
  return type === "Non-Perishable"
    ? now > NONPERISHABLE_ONLINE_DEADLINE.getTime()
    : now > PERISHABLE_ONLINE_DEADLINE.getTime();
}

/** Returns department types still accepting online entries right now. */
export function getOpenDepartmentTypes(): DepartmentType[] {
  return (["Non-Perishable", "Perishable"] as DepartmentType[]).filter(
    (t) => !isDeadlinePassed(t)
  );
}

// ── Legacy check-in strings (kept for backward compatibility) ─────────
export const CHECKIN_INFO = {
  nonPerishable: "October 10–12, 2026: Saturday 10:00 AM–5:00 PM · Sunday 1:00–5:00 PM · Monday 1:00–6:00 PM",
  perishable:    "October 13, 2026: Tuesday 1:00–6:00 PM",
};

export const PICKUP_INFO = {
  nonPerishable: "TBD — check with the fair",
  perishable:    "TBD — check with the fair",
};

// ── Department → Division → Class/Lot Structure ──────────────────────
//
// ⚠️  CLASSES AND LOTS ARE PLACEHOLDERS.
//     Replace placeholder arrays with real data from the entry books.
//     The current structure uses free-text fields for Class and Lot
//     (entrants type them in). Once you have the real lists, convert
//     the classOptions and lotOptions arrays to dropdown options.

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
