// ═══════════════════════════════════════════════════════════════════
// WEST TENNESSEE STATE FAIR — Exhibit Registration Configuration
//
// UPDATE ANNUALLY:
//   - NONPERISHABLE_ONLINE_DEADLINE / PERISHABLE_ONLINE_DEADLINE
//   - CHECKIN_SCHEDULE windows
//   - ENTRY_DEADLINE_LABEL
//   - fair year references
// ═══════════════════════════════════════════════════════════════════

export const FAIR_YEAR = 2026;

// ── MASTER ONLINE ENTRY SWITCH ──────────────────────────────────────────────────────────
//
// Controls whether the PUBLIC online exhibit entry system is accessible.
//
// TO DISABLE ONLINE ENTRY:
//   Change the value below from `true` to `false`, then deploy.
//   Once disabled, all pages show the "Coming Soon" / "Closed" state.
//   Admin access and existing records are unaffected.
//
// TO REOPEN:
//   Set back to `true` and deploy. All deadline logic resumes:
//     - Non-Perishable closes October 9 at 11:59 PM CDT
//     - Perishable closes October 12 at 11:59 PM CDT
//
// This switch sits ABOVE the FEM preregistration.enabled flag and the
// per-type deadline gates. Both must be satisfied for entry to proceed.
export const EXHIBIT_ONLINE_ENTRY_ENABLED = true;

// ── Registration Master Switch (Supabase-controlled) ──────────────────────────────────
// Used as fallback if Supabase is unavailable.
// Actual open/close window is set via FEM fairs.settings.preregistration.
export const REGISTRATION_OPEN_DATE  = new Date("2026-07-01T05:00:00.000Z");
export const REGISTRATION_CLOSE_DATE = new Date("2026-10-13T04:59:59.000Z");

// ── Online Entry Deadlines (per department type) ───────────────────────────────────────────────────
// These mirror FEM fairs.settings.preregistration deadlines — used by
// the public website's getRegistrationOpen() gate only.
// Non-Perishable: Friday, October 9 at 11:59 PM CDT  → 2026-10-10 04:59:59 UTC
// Perishable:    Monday, October 12 at 11:59 PM CDT  → 2026-10-13 04:59:59 UTC
export const NONPERISHABLE_ONLINE_DEADLINE = new Date("2026-10-10T04:59:59.000Z");
export const PERISHABLE_ONLINE_DEADLINE    = new Date("2026-10-13T04:59:59.000Z");

export const ENTRY_DEADLINE_LABEL = "October 12, 2026";

export const FAIR_NOTIFICATION_EMAILS = [
  "wtsfair@gmail.com",
  "arenasmanagementco@gmail.com",
];

// ── Exhibit Turn-In / Check-In Schedule ──────────────────────────────────────────────────────────────────
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

// ── Department type helpers ───────────────────────────────────────────────────────────────────────
export type DepartmentType = "Non-Perishable" | "Perishable";

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

// ── Legacy check-in strings (kept for backward compatibility) ─────────────────────────
export const CHECKIN_INFO = {
  nonPerishable: "October 10–12, 2026: Saturday 10:00 AM–5:00 PM · Sunday 1:00–5:00 PM · Monday 1:00–6:00 PM",
  perishable:    "October 13, 2026: Tuesday 1:00–6:00 PM",
};

export const PICKUP_INFO = {
  nonPerishable: "TBD — check with the fair",
  perishable:    "TBD — check with the fair",
};
