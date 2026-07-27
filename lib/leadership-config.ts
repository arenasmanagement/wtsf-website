/**
 * FAIR LEADERSHIP CONFIGURATION — West Tennessee State Fair
 * ─────────────────────────────────────────────────────────────────────────
 * Source of truth for fair officers and board members.
 *
 * HOW TO UPDATE ANNUALLY
 * ───────────────────────
 * 1. Change `year` to the leadership year being displayed.
 * 2. Update `officers` if roles or names change.
 * 3. Update `boardMembers` if the board composition changes.
 *
 * ⚠️  YEAR LABEL NOTE
 *   The current data reflects the 2025 leadership as listed on the official
 *   About page. Do not change `year` to 2026 until the 2026 board is
 *   officially confirmed and the data below has been verified.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface Officer {
  role: string;
  /** One or two names. Couples are stored as separate entries so layout
   *  can render them on a single card with an "&" separator. */
  names: string[];
}

export interface FairLeadership {
  year: number;
  officers: Officer[];
  boardMembers: string[];
}

/**
 * FAIR_LEADERSHIP
 * Current 2025 officers and board members.
 * Update `year` and the lists below when new leadership is confirmed.
 */
export const FAIR_LEADERSHIP: FairLeadership = {
  year: 2026,

  officers: [
    { role: "President",      names: ["Scott Woolfolk", "Cher Woolfolk"] },
    { role: "Vice-President", names: ["Chris Coughlin", "Jeannie Coughlin"] },
    { role: "Treasurer",      names: ["Chris Rawdon"] },
    { role: "Secretary",      names: ["Fred Cunningham"] },
  ],

  boardMembers: [
    "Brian Kemp",
    "Ginger Kemp",
    "Pete Johnson",
    "Hayley O'Neal",
    "Sheriff Wiser",
    "Roy Weaver",
    "Paul Jones",
    "Luke Weaver",
    "Donna Butler",
    "Nathan Ward",
    "David Watt",
    "Kevin Allen",
  ],
};
