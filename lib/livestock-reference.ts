/**
 * livestock-reference.ts
 * ─────────────────────────────────────────────────────────────
 * REFERENCE ARCHIVE — 2025 West Tennessee State Fair livestock show data.
 *
 * This file preserves ALL 2025 show information so it can be used as a
 * template when updating for 2026. DO NOT DELETE.
 *
 * HOW TO USE FOR 2026:
 *   1. Copy SHOWS_2025 into app/livestock/page.tsx as SHOWS
 *   2. Update all dates, times, and year references
 *   3. Verify rules / premiums / class windows with the fair board
 *   4. Remove the Coming Soon banner from the public livestock page
 *
 * ─────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
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
  date: string;
  time: string;
  checkInBy: string;
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

// ─────────────────────────────────────────────────────────────
// 2025 SHOWMAN REGISTRATION LINK
// All livestock entries go through Showman — update if URL changes.
// ─────────────────────────────────────────────────────────────
export const SHOWMAN_URL_2025 =
  "https://showman.app/shows#/west-tennessee-state-fair-a98a/enter";

// ─────────────────────────────────────────────────────────────
// 2025 SHOW DATA
// Source of truth: https://www.wtsfair.com/livestock (2025 season)
// ─────────────────────────────────────────────────────────────
export const SHOWS_2025: LivestockShow[] = [
  // ── 1. Meat Goat Show ────────────────────────────────────────────────────
  {
    id: "meat-goat",
    title: "Meat Goat Show",
    date: "Friday, October 17, 2025",
    time: "6:00 PM",
    checkInBy: "5:00 PM",
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
          "Exhibitors must be in 12th grade or below as of January 1, 2025.",
          "Animals showing symptoms of sore mouth, ringworm, or club lamb fungus (wet or dry) will be disqualified and returned to trailer.",
          "All calls by the show committee are final.",
          "All animals are required to have scrapie tags or tattoos.",
          "Does can either be shown as market goats or breeding does, not both.",
        ],
      },
      {
        title: "Breeding Doe Rules & Regulations",
        rules: [
          "Exhibitors must be in 12th grade or below as of January 1, 2025.",
          "Animals showing symptoms of sore mouth, ringworm, or club lamb fungus (wet or dry) will be disqualified and returned to trailer.",
          "All calls by the show committee are final.",
          "Health Certificates are required and will be checked at weigh-in.",
          "All animals are required to have scrapie tags or tattoos.",
          "Any exhibitor leaving before the show is over will forfeit premium money.",
        ],
      },
    ],
    premiums: [
      { label: "1st Place", amount: "$25", isChampion: false },
      { label: "2nd Place", amount: "$20", isChampion: false },
      { label: "3rd Place", amount: "$15", isChampion: false },
      { label: "4th Place", amount: "$10", isChampion: false },
      { label: "5th Place", amount: "$5",  isChampion: false },
      { label: "Grand Champion",         amount: "$30", isChampion: true },
      { label: "Reserve Grand Champion", amount: "$20", isChampion: true },
    ],
    accentColor: "#2C4A2E",
  },

  // ── 2. Breeding Sheep Show ────────────────────────────────────────────────
  {
    id: "breeding-sheep",
    title: "Breeding Sheep Show",
    date: "Saturday, October 18, 2025",
    time: "11:00 AM",
    checkInBy: "10:00 AM",
    checkInNotes: [
      "Breeding Sheep must be on the grounds by 10:00 AM for check-in.",
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
          "Students must be in 12th grade or below as of January 1, 2025.",
          "All sheep must comply with General Rules and Health Regulations of the Livestock Department.",
          "Exhibitors may enter a maximum of 2 entries per class.",
          "Animals are expected to be clean and fitted as appropriate to breed.",
          "To have a separate breed show, there must be a minimum of 10 head represented by at least 3 separate exhibitors.",
          "Breeds are not set and subject to change.",
        ],
      },
    ],
    breeds: [
      "White Dorper",
      "Dorset",
      "Katahdin",
      "Shropshire",
      "Southdown",
      "Suffolk",
      "Hampshire",
      "AOB – Meat",
      "AOB – Wool",
    ],
    classGroups: [
      {
        title: "Open Registered Breeding Sheep Classes",
        classes: [
          "1.  Sr. Ram Lamb (Sept. 1 – Dec. 31, 2024)",
          "2.  Early Jr. Ram Lamb (Jan. 1 – Feb. 14, 2025)",
          "3.  Late Jr. Ram Lamb (Feb. 15, 2025 and after)",
          "4.  Champion Ram",
          "5.  Reserve Champion Ram",
          "6.  Sr. Yearling Ewes (Sept. 1, 2023 – Feb. 14, 2024)",
          "7.  Jr. Yearling Ewes (Feb. 15 – Aug. 31, 2024)",
          "8.  Senior Ewe Lambs (Sept. 1 – Dec. 31, 2024)",
          "9.  January Ewe Lambs (Jan. 1 – Jan. 31, 2025)",
          "10. February Ewe Lambs (Feb. 1 – Feb. 28, 2025)",
          "11. March Ewe Lambs (Mar. 1 – Mar. 31, 2025)",
          "12. Champion Ewe",
          "13. Reserve Champion Ewe",
          "14. Supreme Ram",
          "15. Supreme Ewe",
        ],
      },
    ],
    premiums: [
      { label: "1st Place", amount: "$25", isChampion: false },
      { label: "2nd Place", amount: "$20", isChampion: false },
      { label: "3rd Place", amount: "$15", isChampion: false },
      { label: "4th Place", amount: "$12", isChampion: false },
      { label: "5th Place", amount: "$10", isChampion: false },
      { label: "Grand Champion",            amount: "$30", isChampion: true },
      { label: "Reserve Grand Champion",    amount: "$20", isChampion: true },
      { label: "Supreme Champion",          amount: "$50", isChampion: true },
      { label: "Reserve Supreme Champion",  amount: "$25", isChampion: true },
    ],
    accentColor: "#5C4A32",
  },

  // ── 3. Cattle Show ────────────────────────────────────────────────────────
  {
    id: "cattle",
    title: "Cattle Show",
    date: "Monday, October 20, 2025",
    time: "6:00 PM",
    checkInBy: "5:00 PM",
    checkInNotes: [
      "Cattle must be on the grounds by 5:00 PM for check-in.",
      "Registration and health papers must be checked in at the Livestock Office upon arrival.",
    ],
    entryFee: "$10 per head",
    divisions: ["Showmanship", "Heifers", "Bulls"],
    format:
      "Only Commercial Heifers will be shown by weight. Breed TBD. No particular order will be followed.",
    ruleSets: [
      {
        title: "Rules & Regulations",
        rules: [
          "Students must be in 12th grade or below as of January 1, 2025.",
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
          "Spring Heifer Calves after Mar. 1, 2025",
          "Junior Heifer Calves Jan. 1 – Feb. 28, 2025",
          "Late Senior Heifer Calves Nov. 1 – Dec. 31, 2024",
          "Early Senior Heifer Calves Sept. 1 – Oct. 31, 2024",
          "Summer Yearling Heifers July 1 – Aug. 31, 2024",
          "Late Spring Yearling Heifers May 1 – June 30, 2024",
          "Spring Yearling Heifers Mar. 1 – Apr. 30, 2024",
          "Junior Yearling Heifers Jan. 1 – Feb. 28, 2024",
          "Senior Yearling Heifers Sept. 1 – Dec. 31, 2023",
          "Champion Female — Classes 1–10",
          "Reserve Champion Female — Classes 1–10",
        ],
      },
      {
        title: "Open Beef Classes — Bulls",
        classes: [
          "Spring Bull Calf born Mar. 1+, 2025",
          "Junior Bull Calf born Jan. 1 – Feb. 28, 2025",
          "Winter Bull Calf born Nov. 1 – Dec. 31, 2024",
          "Senior Bull Calf born Sept. 1 – Oct. 31, 2024",
          "Summer Yearling Bulls May 1 – Aug. 31, 2024",
          "Spring Yearling Bulls Mar. 1 – Apr. 30, 2024",
          "Junior Yearling Bulls Jan. 1 – Feb. 28, 2024",
          "Senior Yearling Bulls Sept. 1 – Dec. 31, 2023",
          "Champion Bull — Classes 12–20",
          "Reserve Champion Bull — Classes 12–20",
        ],
      },
    ],
    premiums: [
      { label: "1st Place", amount: "$25", isChampion: false },
      { label: "2nd Place", amount: "$20", isChampion: false },
      { label: "3rd Place", amount: "$15", isChampion: false },
      { label: "Grand Champion",           amount: "$30", isChampion: true },
      { label: "Reserve Grand Champion",   amount: "$20", isChampion: true },
      { label: "Supreme Champion",         amount: "$50", isChampion: true },
      { label: "Reserve Supreme Champion", amount: "$25", isChampion: true },
    ],
    accentColor: "#8B2E2E",
  },

  // ── 4. Market Lamb Show & Commercial Ewe Show ─────────────────────────────
  {
    id: "market-lamb",
    title: "Market Lamb Show & Commercial Ewe Show",
    date: "Tuesday, October 21, 2025",
    time: "6:00 PM",
    checkInBy: "5:00 PM",
    checkInNotes: [
      "Market Lambs must be on the grounds by 5:00 PM for check-in.",
      "Health Certificates are required and will be checked at weigh-in.",
    ],
    entryFee: "$5 per head",
    divisions: ["Showmanship", "Market Whether Lambs", "Commercial Ewes"],
    format: "All classes will be shown by weight (no particular order).",
    ruleSets: [
      {
        title: "Market Lamb Rules & Regulations",
        rules: [
          "Exhibitors must be in 12th grade or below as of January 1, 2025.",
          "Animals showing symptoms of sore mouth, ringworm, or club lamb fungus (wet or dry) will be disqualified and returned to trailer.",
          "All calls by the show committee are final.",
          "All animals are required to have scrapie tags or tattoos.",
          "Ewes can either be shown as market lambs or commercial ewes, not both.",
          "All lambs must have Lamb Teeth.",
        ],
      },
      {
        title: "Commercial Ewe Rules & Regulations",
        rules: [
          "Exhibitors must be in 12th grade or below as of January 1, 2025.",
          "Animals showing symptoms of sore mouth, ringworm, or club lamb fungus (wet or dry) will be disqualified and returned to trailer.",
          "All calls by the show committee are final.",
          "Health Certificates are required and will be checked at weigh-in.",
          "All animals are required to have scrapie tags or tattoos.",
          "Any exhibitor leaving before the show is over will forfeit premium money.",
          "All lambs must have Lamb Teeth.",
        ],
      },
    ],
    premiums: [
      { label: "1st Place", amount: "$25", isChampion: false },
      { label: "2nd Place", amount: "$20", isChampion: false },
      { label: "3rd Place", amount: "$15", isChampion: false },
      { label: "4th Place", amount: "$10", isChampion: false },
      { label: "5th Place", amount: "$5",  isChampion: false },
      { label: "Grand Champion",         amount: "$30", isChampion: true },
      { label: "Reserve Grand Champion", amount: "$20", isChampion: true },
    ],
    accentColor: "#2C4A2E",
  },
];
