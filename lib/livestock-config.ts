/**
 * livestock-config.ts
 * ─────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH — 2026 West Tennessee State Fair livestock show data.
 *
 * HOW TO UPDATE ANNUALLY:
 *   1. Update dates, times, and scheduleRows per show.
 *   2. Advance all class birth-year windows +1 year.
 *   3. Update eligibility year in all ruleSets ("January 1, XXXX").
 *   4. If a show's date is unconfirmed, set dateConfirmed: false and
 *      leave scheduleRows empty.
 *
 * NOTE: app/fair-info/page.tsx scheduleData is maintained separately —
 * update it when confirmed show dates change.
 * ─────────────────────────────────────────────────────────────
 */

export interface ScheduleRow {
  label: string;
  time: string;
}

export interface RuleSet {
  title: string;
  rules: string[];
}

export interface Premium {
  label: string;
  amount: string;
  isChampion: boolean;
}

export interface ClassGroup {
  title: string;
  classes: string[];
}

export interface LivestockShow {
  id: string;
  title: string;
  navLabel: string;
  dateConfirmed: boolean;
  date: string;
  shortDate: string;
  scheduleRows: ScheduleRow[];
  checkInNotes: string[];
  entryFee: string;
  divisions: string[];
  format: string;
  ruleSets: RuleSet[];
  premiums: Premium[];
  classGroups?: ClassGroup[];
  breeds?: string[];
  accentColor: string;
}

// NOTE: Livestock registration is handled separately by Paul — do NOT link here publicly.
// Update this URL when the system is ready to go live.
export const SHOWMAN_URL =
  "https://showman.app/shows#/west-tennessee-state-fair-a98a/enter";

export const SHOWS_2026: LivestockShow[] = [

  {
    id: "cattle",
    title: "Cattle Show",
    navLabel: "Cattle Show · Oct 15",
    dateConfirmed: true,
    date: "Thursday, October 15, 2026",
    shortDate: "Oct 15",
    scheduleRows: [
      { label: "Arrival",      time: "2:00 PM"  },
      { label: "Scales Open",  time: "4:30 PM"  },
      { label: "Scales Close", time: "5:45 PM"  },
      { label: "Show Begins",  time: "6:30 PM"  },
    ],
    checkInNotes: [
      "Cattle must be on the grounds by 5:00 PM for check-in.",
      "Registration and health papers must be checked in at the Livestock Office upon arrival.",
    ],
    entryFee: "$10 per head",
    divisions: ["Showmanship", "Heifers", "Bulls"],
    format: "Only Commercial Heifers will be shown by weight. Breed TBD. No particular order will be followed.",
    ruleSets: [
      {
        title: "Rules & Regulations",
        rules: [
          "Students must be in 12th grade or below as of January 1, 2026.",
          "Must have at least five (5) head to have a breed show. Of the five head, there must be more than one exhibitor represented.",
          "Must have an official certificate of Veterinary Inspection signed by an accredited veterinarian.",
          "Registration papers and tattoos will be checked — no exceptions.",
          "Animals showing clinical signs of infectious or communicable disease will not be allowed to enter or remain on the grounds.",
          "All entries must be entered and paid for online through the Fair website.",
          "Entries must be in the name shown on the registration papers.",
          "Online entry forms must be filled out completely, including registration name & number.",
          "No premium will be paid to any exhibitor failing to observe these rules.",
        ],
      },
    ],
    classGroups: [
      {
        title: "Open Beef Classes — Heifers",
        classes: [
          "Spring Heifer Calves after Mar. 1, 2026",
          "Junior Heifer Calves Jan. 1 – Feb. 28, 2026",
          "Late Senior Heifer Calves Nov. 1 – Dec. 31, 2025",
          "Early Senior Heifer Calves Sept. 1 – Oct. 31, 2025",
          "Summer Yearling Heifers July 1 – Aug. 31, 2025",
          "Late Spring Yearling Heifers May 1 – June 30, 2025",
          "Spring Yearling Heifers Mar. 1 – Apr. 30, 2025",
          "Junior Yearling Heifers Jan. 1 – Feb. 28, 2025",
          "Senior Yearling Heifers Sept. 1 – Dec. 31, 2024",
          "Champion Female — Classes 1–10",
          "Reserve Champion Female — Classes 1–10",
        ],
      },
      {
        title: "Open Beef Classes — Bulls",
        classes: [
          "Spring Bull Calf born Mar. 1+, 2026",
          "Junior Bull Calf born Jan. 1 – Feb. 28, 2026",
          "Winter Bull Calf borm Nov. 1 – Dec. 31, 2025",
          "Senior Bull Calf borm Sept. 1 – Oct. 31, 2025",
          "Summer Yearling Bulls May 1 – Aug. 31, 2025",
          "Spring Yearling Bulls Mar. 1 – Apr. 30, 2025",
          "Junior Yearling Bulls Jan. 1 – Feb. 28, 2025",
          "Senior Yearling Bulls Sept. 1 – Dec. 31, 2024",
          "Champion Bull — Classes 12–20",
          "Reserve Champion Bull — Classes 12–20",
        ],
      },
    ],
    premiums: [
      { label: "1st Place",                amount: "$25", isChampion: false },
      { label: "2nd Place",                amount: "$20", isChampion: false },
      { label: "3rd Place",                amount: "$15", isChampion: false },
      { label: "Grand Champion",           amount: "$30", isChampion: true  },
      { label: "Reserve Grand Champion",   amount: "$20", isChampion: true  },
      { label: "Supreme Champion",         amount: "$50", isChampion: true  },
      { label: "Reserve Supreme Champion", amount: "$25", isChampion: true  },
    ],
    accentColor: "#8B2E2E",
  },

  {
    id: "meat-goat",
    title: "Meat Goat Show",
    navLabel: "Meat Goat Show · Oct 16",
    dateConfirmed: true,
    date: "Friday, October 16, 2026",
    shortDate: "Oct 16",
    scheduleRows: [
      { label: "Arrival",      time: "2:00 PM"  },
      { label: "Scales Close", time: "5:15 PM"  },
      { label: "Show Begins",  time: "6:00 PM"  },
    ],
    checkInNotes: [
      "Goats must be on the grounds by 5:00 PM for check-in.",
      "Health Certificates are required and will be checked at weigh-in.",
    ],
    entryFee: "$5 per head",
    divisions: ["Showmanship", "Market Wether", "Doe Kid", "Yearling Doe"],
    format: "All classes will be shown by weight (no particular order).",
    ruleSets: [
      {
        title: "Market Goat Rules & Regulations",
        rules: [
          "Exhibitors must be in 12th grade or below as of January 1, 2026.",
          "Animals showing symptoms of sore mouth, ringworm, or club lamb fungus (wet or dry) will be disqualified and returned to trailer.",
          "All calls by the show committee are final.",
          "All animals are required to have scrapie tags or tattoos.",
          "Does can either be shown as market goats or breeding does, not both.",
        ],
      },
      {
        title: "Breeding Doe Rules & Regulations",
        rules: [
          "Exhibitors must be in 12th grade or below as of January 1, 2026.",
          "Animals showing symptoms of sore mouth, ringworm, or club lamb fungus (wet or dry) will be disqualified and returned to trailer.",
          "All calls by the show committee are final.",
          "Health Certificates are required and will be checked at weigh-in.",
          "All animals are required to have scrapie tags or tattoos.",
          "Any exhibitor leaving before the show is over will forfeit premium money.",
        ],
      },
    ],
    premiums: [
      { label: "1st Place",              amount: "$25", isChampion: false },
      { label: "2nd Place",              amount: "$20", isChampion: false },
      { label: "3rd Place",              amount: "$15", isChampion: false },
      { label: "4th Place",              amount: "$10", isChampion: false },
      { label: "5th Place",              amount: "$5",  isChampion: false },
      { label: "Grand Champion",         amount: "$30", isChampion: true  },
      { label: "Reserve Grand Champion", amount: "$20", isChampion: true  },
    ],
    accentColor: "#2C4A2E",
  },

  {
    id: "breeding-sheep",
    title: "Breeding Sheep Show",
    navLabel: "Breeding Sheep Show · Oct 17",
    dateConfirmed: true,
    date: "Saturday, October 17, 2026",
    shortDate: "Oct 17",
    scheduleRows: [
      { label: "Arrival",         time: "7:00 AM"         },
      { label: "Check-In Opens",  time: "8:00 AM"         },
      { label: "Check-In Closes", time: "9:30 AM"         },
      { label: "Show Time",       time: "To Be Announced" },
    ],
    checkInNotes: [
      "Breeding Sheep must be on the grounds by 9:30 AM for check-in.",
      "Registration papers will be checked upon arrival.",
      "Original registration papers required (showing exhibitor as owner) OR a valid lease agreement.",
    ],
    entryFee: "$5 per head",
    divisions: ["Showmanship", "Registered Ram", "Registered Ewe"],
    format: "Breed TBD. No particular order will be followed.",
    ruleSets: [
      {
        title: "Rules & Regulations",
        rules: [
          "Students must be in 12th grade or below as of January 1, 2026.",
          "All sheep must comply with General Rules and Health Regulations of the Livestock Department.",
          "Exhibitors may enter a maximum of 2 entries per class.",
          "Animals are expected to be clean and fitted as appropriate to breed.",
          "To have a separate breed show, there must be a minimum of 10 head represented by at least 3 separate exhibitors.",
          "Breeds are not set and subject to change.",
        ],
      },
    ],
    breeds: [
      "White Dorper", "Dorset", "Katahdin", "Shropshire", "Southdown",
      "Suffolk", "Hampshire", "AOB – Meat", "AOB – Wool",
    ],
    classGroups: [
      {
        title: "Open Registered Breeding Sheep Classes",
        classes: [
          "1.  Sr. Ram Lamb (Sept. 1 – Dec. 31, 2025)",
          "2.  Early Jr. Ram Lamb (Jan. 1 – Feb. 14, 2026)",
          "3.  Late Jr. Ram Lamb (Feb. 15, 2026 and after)",
          "4.  Champion Ram",
          "5.  Reserve Champion Ram",
          "6.  Sr. Yearling Ewes (Sept. 1, 2024 – Feb. 14, 2025)",
          "7.  Jr. Yearling Ewes (Feb. 15 – Aug. 31, 2025)",
          "8.  Senior Ewe Lambs (Sept. 1 – Dec. 31, 2025)",
          "9.  January Ewe Lambs (Jan. 1 – Jan. 31, 2026)",
          "10. February Ewe Lambs (Feb. 1 – Feb. 28, 2026)",
          "11. March Ewe Lambs (Mar. 1 – Mar. 31, 2026)",
          "12. Champion Ewe",
          "13. Reserve Champion Ewe",
          "14. Supreme Ram",
          "15. Supreme Ewe",
        ],
      },
    ],
    premiums: [
      { label: "1st Place",                amount: "$25", isChampion: false },
      { label: "2nd Place",                amount: "$20", isChampion: false },
      { label: "3rd Place",                amount: "$15", isChampion: false },
      { label: "4th Place",                amount: "$12", isChampion: false },
      { label: "5th Place",                amount: "$10", isChampion: false },
      { label: "Grand Champion",           amount: "$30", isChampion: true  },
      { label: "Reserve Grand Champion",   amount: "$20", isChampion: true  },
      { label: "Supreme Champion",         amount: "$50", isChampion: true  },
      { label: "Reserve Supreme Champion", amount: "$25", isChampion: true  },
    ],
    accentColor: "#5C4A32",
  },
];
