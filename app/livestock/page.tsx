import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Livestock Shows — West Tennessee State Fair",
  description:
    "Enter the West Tennessee State Fair livestock shows — Market Lamb, Breeding Sheep, Meat Goat, and Cattle. All entries through Showman. Youth exhibitors welcome. Henderson, TN.",
};

// ─────────────────────────────────────────────────────────────────────────────
// SHOWMAN REGISTRATION LINK
// All livestock entries go through Showman — update if URL changes.
// ─────────────────────────────────────────────────────────────────────────────
const SHOWMAN_URL =
  "https://showman.app/shows#/west-tennessee-state-fair-a98a/enter";

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface RuleSet {
  title: string;
  rules: string[];
}

interface Premium {
  label: string;
  amount: string;
  isChampion: boolean;
}

interface ClassGroup {
  title: string;
  classes: string[];
}

interface LivestockShow {
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

// ─────────────────────────────────────────────────────────────────────────────
// LIVESTOCK SHOWS DATA
// Source of truth: https://www.wtsfair.com/livestock
// Do not edit wording without verifying against the official page.
// ─────────────────────────────────────────────────────────────────────────────
const SHOWS: LivestockShow[] = [
  // ── 1. Meat Goat Show ─────────────────────────────────────────────────────
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

  // ── 2. Breeding Sheep Show ─────────────────────────────────────────────────
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

  // ── 3. Cattle Show ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// ICON COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function IconCalendar() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconMoney() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconTruck() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}
function IconList() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}
function IconExternal() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOWMAN REGISTER BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function ShowmanButton({
  label = "Register for This Show",
  size = "md",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const padding =
    size === "lg"
      ? "px-10 py-4 text-sm"
      : size === "sm"
      ? "px-4 py-2.5 text-xs"
      : "px-6 py-3.5 text-xs";
  return (
    <a
      href={SHOWMAN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-bold tracking-wider uppercase transition-opacity hover:opacity-90 active:scale-95 ${padding}`}
      style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
    >
      {label}
      <IconExternal />
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOW CARD
// ─────────────────────────────────────────────────────────────────────────────
function ShowSection({
  show,
  index,
}: {
  show: LivestockShow;
  index: number;
}) {
  const bg = index % 2 === 0 ? "#FDFAF3" : "#F5EDD4";

  return (
    <section
      id={show.id}
      className="py-14 md:py-16"
      style={{ backgroundColor: bg }}
      aria-labelledby={`show-${show.id}-heading`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Show Header ───────────────────────────────────── */}
        <div
          className="p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6"
          style={{ backgroundColor: show.accentColor }}
        >
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "rgba(212,168,39,0.85)", letterSpacing: "0.2em" }}
            >
              Livestock Show
            </p>
            <h2
              id={`show-${show.id}-heading`}
              className="text-2xl sm:text-3xl font-bold italic mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
            >
              {show.title}
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5" style={{ color: "#A8BFA9" }}>
                <IconCalendar />
                <span className="text-sm font-medium">{show.date}</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: "#A8BFA9" }}>
                <IconClock />
                <span className="text-sm font-medium">{show.time}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <ShowmanButton label="Register for This Show" size="md" />
          </div>
        </div>

        {/* ── Key Info Row ──────────────────────────────────── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-0 mb-8"
          style={{ border: "1px solid #E8DFC8", backgroundColor: "#fff" }}
        >
          {[
            {
              icon: <IconCalendar />,
              label: "Show Date",
              value: show.date,
            },
            {
              icon: <IconTruck />,
              label: "Check-In By",
              value: show.checkInBy,
            },
            {
              icon: <IconMoney />,
              label: "Entry Fee",
              value: show.entryFee,
            },
            {
              icon: <IconList />,
              label: "Divisions",
              value: show.divisions.length.toString(),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 flex flex-col gap-1"
              style={{
                borderRight: i < 3 ? "1px solid #E8DFC8" : undefined,
                borderBottom: i < 2 ? "1px solid #E8DFC8" : undefined,
              }}
            >
              <div className="flex items-center gap-1.5" style={{ color: "#8B7355" }}>
                {item.icon}
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#2C4A2E" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Left col: Arrival, Divisions, Format */}
          <div className="flex flex-col gap-5">

            {/* Arrival & Check-In */}
            <div className="p-5" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: show.accentColor }} aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#F5EDD4" strokeWidth={2}>
                    <path strokeLinecap="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#2C4A2E" }}>
                  Arrival &amp; Check-In
                </h3>
              </div>
              <ul className="flex flex-col gap-2">
                {show.checkInNotes.map((note, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                    <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: show.accentColor }} aria-hidden="true" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Entry Information */}
            <div className="p-5" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: show.accentColor }} aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#F5EDD4" strokeWidth={2}>
                    <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#2C4A2E" }}>
                  Entry Information
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#8B7355" }}>
                    Entry Fee
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#2C4A2E" }}>{show.entryFee}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#8B7355" }}>
                    Divisions
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {show.divisions.map((div) => (
                      <li key={div} className="flex items-center gap-2 text-sm" style={{ color: "#5C4A32" }}>
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: show.accentColor }} aria-hidden="true" />
                        {div}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#8B7355" }}>
                    Format
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>{show.format}</p>
                </div>
              </div>
            </div>

            {/* Breeds (if present) */}
            {show.breeds && (
              <div className="p-5" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: show.accentColor }} aria-hidden="true">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#F5EDD4" strokeWidth={2}>
                      <path strokeLinecap="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#2C4A2E" }}>
                    Registered Breeding Sheep Divisions
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {show.breeds.map((breed) => (
                    <span
                      key={breed}
                      className="px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: "#F5EDD4", color: "#5C4A32", border: "1px solid #E8DFC8" }}
                    >
                      {breed}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col: Rules */}
          <div className="flex flex-col gap-5">
            {show.ruleSets.map((rs) => (
              <div key={rs.title} className="p-5" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: show.accentColor }} aria-hidden="true">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#F5EDD4" strokeWidth={2}>
                      <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#2C4A2E" }}>
                    {rs.title}
                  </h3>
                </div>
                <ol className="flex flex-col gap-2.5" aria-label={rs.title}>
                  {rs.rules.map((rule, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                      <span
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ backgroundColor: "#F5EDD4", color: show.accentColor, border: `1px solid #E8DFC8` }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* ── Classes (if present) ──────────────────────────── */}
        {show.classGroups && show.classGroups.length > 0 && (
          <div
            className={`grid gap-5 mb-6 ${
              show.classGroups.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {show.classGroups.map((cg) => (
              <div key={cg.title} className="p-5" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: show.accentColor }} aria-hidden="true">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#F5EDD4" strokeWidth={2}>
                      <path strokeLinecap="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#2C4A2E" }}>
                    {cg.title}
                  </h3>
                </div>
                <ol className="flex flex-col gap-1.5" aria-label={cg.title}>
                  {cg.classes.map((cls, i) => (
                    <li
                      key={i}
                      className="flex gap-3 py-1.5 text-sm leading-snug"
                      style={{
                        color: "#5C4A32",
                        borderBottom: i < cg.classes.length - 1 ? "1px solid #F0E8D0" : undefined,
                      }}
                    >
                      <span className="text-xs font-mono mt-0.5 flex-shrink-0" style={{ color: "#8B7355" }}>
                        {String(i + 1).padStart(2, " ")}
                      </span>
                      {cls.replace(/^\d+\.\s+/, "")}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* ── Premiums & Awards ─────────────────────────────── */}
        <div className="p-5 sm:p-6 mb-6" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: show.accentColor }} aria-hidden="true">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#F5EDD4" strokeWidth={2}>
                <path strokeLinecap="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
              </svg>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#2C4A2E" }}>
              Premiums &amp; Awards
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {/* Place premiums */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8B7355" }}>
                Place Premiums
              </p>
              <div className="flex flex-col">
                {show.premiums.filter((p) => !p.isChampion).map((p, i, arr) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between py-2"
                    style={{ borderBottom: i < arr.length - 1 ? "1px solid #F0E8D0" : undefined }}
                  >
                    <span className="text-sm" style={{ color: "#5C4A32" }}>{p.label}</span>
                    <span className="text-sm font-bold" style={{ color: "#2C4A2E" }}>{p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Champion awards */}
            <div className="mt-6 sm:mt-0">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8B7355" }}>
                Champion Awards
              </p>
              <div className="flex flex-col gap-2">
                {show.premiums.filter((p) => p.isChampion).map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ backgroundColor: "#FEF9EC", border: "1px solid #D4A827" }}
                  >
                    <span className="text-sm font-semibold" style={{ color: "#5C4A32" }}>
                      {p.label === "Supreme Champion" || p.label === "Reserve Supreme Champion"
                        ? "👑 " + p.label
                        : p.label === "Grand Champion"
                        ? "🏆 " + p.label
                        : "🥈 " + p.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#92400E" }}>{p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom register button ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <p className="text-sm" style={{ color: "#8B7355" }}>
            All entries submitted online through Showman.
          </p>
          <ShowmanButton label="Register for This Show" size="md" />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function LivestockPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        overline="West Tennessee State Fair"
        headline="Livestock"
        headlineAccent="Shows"
        subtext="Market lambs, breeding sheep, meat goats, and cattle — judged by certified professionals. Youth exhibitors welcome. All entries through Showman."
        photoHint="Youth exhibitor leading an animal in the show ring — confident stride, fair arena environment, golden hour or show-day lighting."
        photoLabel="Show Ring"
        accentColor="#D4A827"
      />

      {/* ── Intro strip ──────────────────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { label: "Shows", value: "4 Livestock Shows" },
              { label: "Registration", value: "Online via Showman" },
              { label: "Exhibitors", value: "Youth (12th grade & below)" },
              { label: "Questions", value: "wtsfair@gmail.com" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-4 text-center">
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827", letterSpacing: "0.18em" }}>
                  {item.label}
                </p>
                <p className="text-sm font-semibold" style={{ color: "#F5EDD4" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Register Online CTA ───────────────────────────────── */}
      <section
        className="py-14"
        style={{ backgroundColor: "#F5EDD4", borderBottom: "1px solid #E8DFC8" }}
        aria-labelledby="showman-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 justify-between"
            style={{ backgroundColor: "#2C4A2E" }}
          >
            <div className="flex-1">
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#D4A827", letterSpacing: "0.2em" }}
              >
                Registration
              </p>
              <h2
                id="showman-heading"
                className="text-2xl sm:text-3xl font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
              >
                Enter Livestock Shows Online
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#A8BFA9" }}>
                All West Tennessee State Fair livestock entries are completed online through{" "}
                <strong style={{ color: "#F5EDD4" }}>Showman</strong>. Review the show
                information and deadlines in each section below before registering.
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(168,191,169,0.75)" }}>
                Registration deadlines and requirements are listed within each individual show
                section on this page.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
              <a
                href={SHOWMAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 text-center"
                style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
              >
                Register Through Showman
                <IconExternal />
              </a>
              <a
                href="#meat-goat"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-80 text-center"
                style={{ borderColor: "rgba(245,237,212,0.3)", color: "#F5EDD4", letterSpacing: "0.08em" }}
              >
                View Livestock Shows
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview / Schedule Summary ───────────────────────── */}
      <section className="py-10" style={{ backgroundColor: "#FDFAF3", borderBottom: "1px solid #E8DFC8" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: "#D4A827", letterSpacing: "0.25em" }}
          >
            2025 Show Schedule
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOWS.map((show) => (
              <a
                key={show.id}
                href={`#${show.id}`}
                className="flex flex-col p-4 transition-all hover:-translate-y-0.5 hover:shadow-md group"
                style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8", textDecoration: "none" }}
                aria-label={`Jump to ${show.title} section`}
              >
                <div className="h-0.5 w-8 mb-3" style={{ backgroundColor: show.accentColor }} aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#8B7355" }}>
                  {show.date.split(", ")[0]}
                </p>
                <p
                  className="text-sm font-bold mb-1 group-hover:underline"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
                >
                  {show.title}
                </p>
                <p className="text-xs" style={{ color: "#8B7355" }}>
                  {show.date} · {show.time}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Individual Show Sections ──────────────────────────── */}
      {SHOWS.map((show, i) => (
        <ShowSection key={show.id} show={show} index={i} />
      ))}

      {/* ── Contact CTA ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#2C4A2E" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "#D4A827" }}
            >
              Questions About Livestock?
            </p>
            <p
              className="text-xl font-bold italic mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
            >
              We&apos;re here to help.
            </p>
            <p className="text-sm" style={{ color: "#A8BFA9" }}>
              Livestock inquiries: wtsfair@gmail.com
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={SHOWMAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
            >
              Register Through Showman
              <IconExternal />
            </a>
            <a
              href="mailto:wtsfair@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase border transition-all hover:opacity-80 active:scale-95"
              style={{ borderColor: "rgba(245,237,212,0.35)", color: "#F5EDD4", letterSpacing: "0.1em" }}
            >
              Email the Livestock Team
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
