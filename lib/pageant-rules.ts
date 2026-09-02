// Pageant rule sets for 2026 WTSF Traditional Fair Pageants.
//
// TWO RULE SETS:
//   2026-general -- Baby Miss through Petite Miss (6 divisions)
//   2026-junior  -- Junior Miss only
//
// Content is finalized and must not be altered without explicit approval.

export const GENERAL_RULES_VERSION = "2026-general" as const;
export const JUNIOR_RULES_VERSION = "2026-junior" as const;
export type RulesVersion = typeof GENERAL_RULES_VERSION | typeof JUNIOR_RULES_VERSION;

export const JUNIOR_DIVISION_ID = "junior-miss";

/** Returns the applicable rules version string for a given division ID. */
export function getRulesVersion(divisionId: string): RulesVersion {
  return divisionId === JUNIOR_DIVISION_ID ? JUNIOR_RULES_VERSION : GENERAL_RULES_VERSION;
}

export interface PageantRule {
  number: number;
  title: string;
  body: string;
}

export interface PageantRuleSet {
  version: RulesVersion;
  title: string;
  rules: PageantRule[];
}

// General Rules (Baby Miss through Petite Miss)

const GENERAL_RULES: PageantRule[] = [
  {
    number: 1,
    title: "ELIGIBILITY",
    body: "Contestants must be residents of West Tennessee and must meet the age requirements for the division in which they are registered.",
  },
  {
    number: 2,
    title: "ATTIRE",
    body: "Contestants must follow the attire requirements established for their age division. Younger divisions may wear Sunday Best or glitz attire. Divisions requiring pageant attire should follow the attire requirement applicable to their division.",
  },
  {
    number: 3,
    title: "REGISTRATION & FEES",
    body: "The regular entry fee is $55. A $10 late fee applies after October 10, 2026, making the late registration total $65. No entries will be accepted at the door.",
  },
  {
    number: 4,
    title: "PAGEANT DATE & LOCATION",
    body: "The Traditional Fair Pageants will be held Saturday, October 17, 2026 at Williams Auditorium in Henderson, Tennessee. Contestants must follow the schedule for their registered division.",
  },
  {
    number: 5,
    title: "PARENT/GUARDIAN & BACKSTAGE ACCESS",
    body: "Each contestant must be accompanied by a parent or guardian. Only one person may accompany the contestant backstage.",
  },
  {
    number: 6,
    title: "REHEARSAL",
    body: "There will be no rehearsal prior to the pageant.",
  },
  {
    number: 7,
    title: "JUDGING",
    body: "Contestants will be judged on attractiveness, poise, and personality. The judges' decisions are final.",
  },
  {
    number: 8,
    title: "VIDEO RECORDING",
    body: "Video recording is not permitted during pageant contests.",
  },
  {
    number: 9,
    title: "ADMISSION",
    body: "The contestant and one accompanying person are admitted to the auditorium at no cost. The accompanying person must enter with the contestant. All other attendees are responsible for their own admission.",
  },
  {
    number: 10,
    title: "PHOTOGRAPH",
    body: "Each contestant must bring ONE 5x7 COLOR PHOTOGRAPH on the day of check-in.",
  },
  {
    number: 11,
    title: "ADDITIONAL COMPETITIONS",
    body: "The entry fee includes: Most Photogenic, Best Hair, and Best Dress.",
  },
  {
    number: 12,
    title: "RULES & CONDUCT",
    body: "By completing registration, the parent/legal guardian acknowledges and agrees to follow the rules and regulations of the West Tennessee State Fair Traditional Pageants.",
  },
];

// Junior Miss Rules
// Same as General except Rule 2 (ATTIRE) and added Rule 13 (RETURNING QUEENS).

const JUNIOR_RULES: PageantRule[] = [
  {
    number: 1,
    title: "ELIGIBILITY",
    body: "Contestants must be residents of West Tennessee and must meet the age requirements for the division in which they are registered.",
  },
  {
    number: 2,
    title: "ATTIRE",
    body: "Floor-length pageant attire.",
  },
  {
    number: 3,
    title: "REGISTRATION & FEES",
    body: "The regular entry fee is $55. A $10 late fee applies after October 10, 2026, making the late registration total $65. No entries will be accepted at the door.",
  },
  {
    number: 4,
    title: "PAGEANT DATE & LOCATION",
    body: "The Traditional Fair Pageants will be held Saturday, October 17, 2026 at Williams Auditorium in Henderson, Tennessee. Contestants must follow the schedule for their registered division.",
  },
  {
    number: 5,
    title: "PARENT/GUARDIAN & BACKSTAGE ACCESS",
    body: "Each contestant must be accompanied by a parent or guardian. Only one person may accompany the contestant backstage.",
  },
  {
    number: 6,
    title: "REHEARSAL",
    body: "There will be no rehearsal prior to the pageant.",
  },
  {
    number: 7,
    title: "JUDGING",
    body: "Contestants will be judged on attractiveness, poise, and personality. The judges' decisions are final.",
  },
  {
    number: 8,
    title: "VIDEO RECORDING",
    body: "Video recording is not permitted during pageant contests.",
  },
  {
    number: 9,
    title: "ADMISSION",
    body: "The contestant and one accompanying person are admitted to the auditorium at no cost. The accompanying person must enter with the contestant. All other attendees are responsible for their own admission.",
  },
  {
    number: 10,
    title: "PHOTOGRAPH",
    body: "Each contestant must bring ONE 5x7 COLOR PHOTOGRAPH on the day of check-in.",
  },
  {
    number: 11,
    title: "ADDITIONAL COMPETITIONS",
    body: "The entry fee includes: Most Photogenic, Best Hair, and Best Dress.",
  },
  {
    number: 12,
    title: "RULES & CONDUCT",
    body: "By completing registration, the parent/legal guardian acknowledges and agrees to follow the rules and regulations of the West Tennessee State Fair Traditional Pageants.",
  },
  {
    number: 13,
    title: "RETURNING QUEENS",
    body: "Returning Queens may not compete in any pageant.",
  },
];

// Exported rule sets

export const GENERAL_RULE_SET: PageantRuleSet = {
  version: GENERAL_RULES_VERSION,
  title: "2026 Traditional Fair Pageant Rules & Regulations",
  rules: GENERAL_RULES,
};

export const JUNIOR_RULE_SET: PageantRuleSet = {
  version: JUNIOR_RULES_VERSION,
  title: "2026 Junior Miss Rules & Regulations",
  rules: JUNIOR_RULES,
};

/** Returns the rule set applicable for the given division ID. */
export function getRuleSet(divisionId: string): PageantRuleSet {
  return divisionId === JUNIOR_DIVISION_ID ? JUNIOR_RULE_SET : GENERAL_RULE_SET;
}
