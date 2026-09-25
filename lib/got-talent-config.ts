// WTSF Got Talent — Configuration
// $25 per act, auto-assigned divisions by primary performer DOB

export const GOT_TALENT_REGISTRATION_ENABLED =
  process.env.GOT_TALENT_REGISTRATION_ENABLED !== "false";

export const GOT_TALENT_ENTRY_FEE_CENTS = 2500; // $25.00

// Registration deadline — time configurable via DB settings; this is the date boundary
export const GOT_TALENT_REGISTRATION_DEADLINE_DATE = "2026-10-20";

export const GOT_TALENT_DIVISIONS = [
  {
    id: "kids",
    label: "Kids",
    ageLabel: "12 & Under",
    minAge: 0,
    maxAge: 12,
    performanceDate: "October 24, 2026",
    performanceTime: "5:30 PM",
    performanceDateISO: "2026-10-24",
  },
  {
    id: "youth",
    label: "Youth",
    ageLabel: "Ages 13–20",
    minAge: 13,
    maxAge: 20,
    performanceDate: "October 24, 2026",
    performanceTime: "5:30 PM",
    performanceDateISO: "2026-10-24",
  },
  {
    id: "adult",
    label: "Adult",
    ageLabel: "21 & Over",
    minAge: 21,
    maxAge: null,
    performanceDate: "October 23, 2026",
    performanceTime: "5:30 PM",
    performanceDateISO: "2026-10-23",
  },
] as const;

export type GotTalentDivisionId = "kids" | "youth" | "adult";

export function getDivisionForAge(ageYears: number): GotTalentDivisionId {
  if (ageYears <= 12) return "kids";
  if (ageYears <= 20) return "youth";
  return "adult";
}

export function getDivisionById(id: string) {
  return GOT_TALENT_DIVISIONS.find((d) => d.id === id) ?? null;
}

/** Calculate age in completed years as of a reference date */
export function calcAgeYears(dob: string, asOf: Date = new Date()): number {
  const birth = new Date(dob);
  let age = asOf.getFullYear() - birth.getFullYear();
  const m = asOf.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && asOf.getDate() < birth.getDate())) age--;
  return age;
}

export const GOT_TALENT_ACT_TYPES = [
  "Singing",
  "Dancing",
  "Comedy",
  "Magic",
  "Instrumental",
  "Variety / Novelty",
  "Other",
] as const;

export type GotTalentActType = (typeof GOT_TALENT_ACT_TYPES)[number];
