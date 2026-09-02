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

// ── MASTER ONLINE ENTRY SWITCH ────────────────────────────────────────
//
// Controls whether the PUBLIC online exhibit entry system is accessible.
//
// TO REOPEN ONLINE ENTRY:
//   Change the value below from `false` to `true`, then deploy.
//   Once enabled, all existing deadline logic resumes automatically:
//     - Non-Perishable closes October 9 at 11:59 PM CDT
//     - Perishable closes October 12 at 11:59 PM CDT
//     - Category-level open/close behavior, confirmation flow, and
//       turn-in schedule instructions all continue working normally.
//
// This switch sits ABOVE the Supabase registration_open flag and the
// per-type deadline gates. Both must be satisfied for entry to proceed.
//
// ADMIN ACCESS AND EXISTING RECORDS ARE UNAFFECTED BY THIS FLAG.
export const EXHIBIT_ONLINE_ENTRY_ENABLED = true;

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
  // ── NON-PERISHABLE ─────────────────────────────────────────────────
  // Online entry closes: Friday, October 9, 2026 at 11:59 PM
  // Receiving: Oct 10 (Sat), Oct 11 (Sun), Oct 12 (Mon)
  {
    value: "Non-Perishable",
    label: "Non-Perishable Exhibits",
    tagline: "Items that do not spoil — displayed for the full fair duration.",
    accentColor: "#2C4A2E",
    divisions: [
      // ── VISUAL ARTS ────────────────────────────────────────────────
      {
        value: "Visual Arts — Adult Division",
        label: "Visual Arts — Adult Division",
        note: "Framed paintings, ceramics, sculpture, and rock art. Must be framed and wired ready for hanging.",
        classOptions: [
          { value: "Class 1 — Framed Art Non-Professional", label: "Class 1 — Framed Art Non-Professional" },
          { value: "Class 2 — Framed Art Professional",     label: "Class 2 — Framed Art Professional" },
          { value: "Class 3 — Ceramics",                   label: "Class 3 — Ceramics" },
          { value: "Class 4 — Miscellaneous",               label: "Class 4 — Miscellaneous" },
        ],
      },
      {
        value: "Visual Arts — Youth Division",
        label: "Visual Arts — Youth Division",
        note: "Canvas art, free-hand drawing, oils, acrylics, watercolor, pastels, pottery, and zentangle. Classes by grade level.",
        classOptions: [
          { value: "Class 1 — Visual Arts", label: "Class 1 — Visual Arts" },
        ],
      },
      // ── HOBBIES & CRAFTS ───────────────────────────────────────────
      {
        value: "Hobbies & Crafts — Adult Division",
        label: "Hobbies & Crafts — Adult Division",
        note: "Jewelry, wood crafts, metal crafts, paper crafts, scrapbooking, fabric crafts, painted crafts, holiday items, and more.",
        classOptions: [
          { value: "Class 1 — Jewelry",            label: "Class 1 — Jewelry" },
          { value: "Class 2 — Wood Crafts",         label: "Class 2 — Wood Crafts" },
          { value: "Class 3 — Metal Crafts",        label: "Class 3 — Metal Crafts" },
          { value: "Class 4 — Paper Crafts",        label: "Class 4 — Paper Crafts" },
          { value: "Class 5 — Scrapbooking",        label: "Class 5 — Scrapbooking" },
          { value: "Class 6 — Fabric Crafts",       label: "Class 6 — Fabric Crafts" },
          { value: "Class 7 — Decorated Clothing",  label: "Class 7 — Decorated Clothing" },
          { value: "Class 8 — Painted Crafts",      label: "Class 8 — Painted Crafts" },
          { value: "Class 9 — Holiday Craft",       label: "Class 9 — Holiday Craft" },
          { value: "Class 10 — Pictures, etc.",     label: "Class 10 — Pictures, etc." },
          { value: "Class 11 — Dolls",              label: "Class 11 — Dolls" },
          { value: "Class 12 — Wreath",             label: "Class 12 — Wreath" },
          { value: "Class 13 — Miscellaneous",      label: "Class 13 — Miscellaneous" },
        ],
      },
      {
        value: "Hobbies & Crafts — Youth Division",
        label: "Hobbies & Crafts — Youth Division",
        note: "Handmade candles, decorated ceramics, jewelry, leather craft, origami, woodworking, weaving, nature crafts, and holiday items.",
        classOptions: [
          { value: "Class 1 — Hobbies & Crafts", label: "Class 1 — Hobbies & Crafts" },
          { value: "Class 2 — 8 Years Old & Under", label: "Class 2 — 8 Years Old & Under" },
          { value: "Class 3 — Holiday Items",     label: "Class 3 — Holiday Items" },
        ],
      },
      // ── PHOTOGRAPHY ────────────────────────────────────────────────
      {
        value: "Photography — Adult Division",
        label: "Photography — Adult Division",
        note: "Amateur photographers only. Max 5 photos total across all lots. 5×7 prints mounted on card stock. No frames.",
        classOptions: [
          { value: "Class 1 — People",                    label: "Class 1 — People" },
          { value: "Class 2 — Animals",                   label: "Class 2 — Animals" },
          { value: "Class 3 — Nature",                    label: "Class 3 — Nature" },
          { value: "Class 4 — Scenic",                    label: "Class 4 — Scenic" },
          { value: "Class 5 — Structures",                label: "Class 5 — Structures" },
          { value: "Class 6 — Transportation & Machinery", label: "Class 6 — Transportation & Machinery" },
          { value: "Class 7 — My West Tennessee",         label: "Class 7 — My West Tennessee" },
          { value: "Class 8 — Other",                     label: "Class 8 — Other" },
        ],
      },
      {
        value: "Photography — Youth Division",
        label: "Photography — Youth Division",
        note: "Amateur photographers only. Max 5 photos total. 5×7 prints mounted on card stock. No frames. Divided by grade level.",
        classOptions: [
          { value: "Class 1 — 6th Grade & Under", label: "Class 1 — 6th Grade & Under" },
          { value: "Class 2 — 7th – 12th Grade",  label: "Class 2 — 7th – 12th Grade" },
        ],
      },
      // ── NEEDLEWORK ──────────────────────────────────────────────────
      {
        value: "Needlework — Adult Division",
        label: "Needlework — Adult Division",
        note: "Pillows, dish towels, tablecloths, pillowcases, holiday items, afghans, and needlework on clothing.",
        classOptions: [
          { value: "Class 1 — Pillows",                label: "Class 1 — Pillows" },
          { value: "Class 2 — Dish Towels",            label: "Class 2 — Dish Towels" },
          { value: "Class 3 — Tablecloths/Table Runners", label: "Class 3 — Tablecloths/Table Runners" },
          { value: "Class 4 — Pillowcases",            label: "Class 4 — Pillowcases" },
          { value: "Class 5 — Holiday Items",          label: "Class 5 — Holiday Items" },
          { value: "Class 6 — Toys",                   label: "Class 6 — Toys" },
          { value: "Class 7 — Purses/Tote Bags",       label: "Class 7 — Purses/Tote Bags" },
          { value: "Class 8 — Afghans",                label: "Class 8 — Afghans" },
          { value: "Class 9 — Bedspreads",             label: "Class 9 — Bedspreads" },
          { value: "Class 10 — Pictures & Wall Hangings", label: "Class 10 — Pictures & Wall Hangings" },
          { value: "Class 11 — Needlework on Clothing", label: "Class 11 — Needlework on Clothing" },
          { value: "Class 12 — Miscellaneous",         label: "Class 12 — Miscellaneous" },
        ],
      },
      {
        value: "Quilts & Quilted Items",
        label: "Quilts & Quilted Items",
        note: "Friendship quilts, vintage quilts (50+ years), hand-pieced, and machine-pieced. One item per lot.",
        classOptions: [
          { value: "Class 1 — Quilts & Quilted Items", label: "Class 1 — Quilts & Quilted Items" },
        ],
      },
      // ── STITCH & SEW ────────────────────────────────────────────────
      {
        value: "Stitch & Sew — Adult Division",
        label: "Stitch & Sew — Adult Division",
        note: "Sewn garments for babies, children, and adults. Judged on workmanship, decoration, and originality.",
        classOptions: [
          { value: "Class 1 — Baby (0–24 Months)",  label: "Class 1 — Baby (0–24 Months)" },
          { value: "Class 2 — Children (2–16 Years)", label: "Class 2 — Children (2–16 Years)" },
          { value: "Class 3 — Adults (17+)",         label: "Class 3 — Adults (17+)" },
        ],
      },
      {
        value: "Stitch & Sew — Youth Division",
        label: "Stitch & Sew — Youth Division",
        note: "Crocheted items, cross stitch, doll clothes, dresses, pillows, pillowcases, and sewn items.",
        classOptions: [
          { value: "Class 1 — Stitch & Sew", label: "Class 1 — Stitch & Sew" },
        ],
      },
      // ── EDUCATIONAL DISPLAYS ────────────────────────────────────────
      {
        value: "Educational Displays — Adult Division",
        label: "Educational Displays — Adult Division",
        note: "Agricultural and special-interest display boards covering native plants, entomology, crops, animal health, food safety, and more.",
        classOptions: [
          { value: "Class 1 — Agricultural Displays", label: "Class 1 — Agricultural Displays" },
          { value: "Class 2 — Special Interests",     label: "Class 2 — Special Interests" },
        ],
      },
      {
        value: "Educational Displays — Youth Division",
        label: "Educational Displays — Youth Division",
        note: "Agricultural display boards, science project displays, 4-H posters, portfolios, and special interest displays.",
        classOptions: [
          { value: "Class 1 — Agricultural & Special Interests", label: "Class 1 — Agricultural & Special Interests" },
        ],
      },
      // ── CROPS ──────────────────────────────────────────────────────
      {
        value: "Crops — Adult Division",
        label: "Crops — Adult Division",
        note: "Corn, cotton, soybeans, and hay. All entries must be grown by the exhibitor during the current year.",
        classOptions: [
          { value: "Class 1 — Corn",     label: "Class 1 — Corn" },
          { value: "Class 2 — Cotton",   label: "Class 2 — Cotton" },
          { value: "Class 3 — Soybeans", label: "Class 3 — Soybeans" },
          { value: "Class 4 — Hay",      label: "Class 4 — Hay" },
        ],
      },
      {
        value: "Crops — Youth Division",
        label: "Crops — Youth Division",
        note: "Corn, hay, cotton, and soybeans for youth growers.",
        classOptions: [
          { value: "Class 1 — Corn",     label: "Class 1 — Corn" },
          { value: "Class 2 — Hay",      label: "Class 2 — Hay" },
          { value: "Class 3 — Cotton",   label: "Class 3 — Cotton" },
          { value: "Class 4 — Soybeans", label: "Class 4 — Soybeans" },
        ],
      },
      // ── CANNING ─────────────────────────────────────────────────────
      {
        value: "Canning — Adult Division",
        label: "Canning — Adult Division",
        note: "Home-canned fruits, vegetables, jams, jellies, pickles, relishes, and juices. Standard jars with two-piece lids required.",
        classOptions: [
          { value: "Class 1 — Fresh Fruits",       label: "Class 1 — Fresh Fruits" },
          { value: "Class 2 — Vegetables",          label: "Class 2 — Vegetables" },
          { value: "Class 3 — Jams & Marmalades",   label: "Class 3 — Jams & Marmalades" },
          { value: "Class 4 — Jellies",             label: "Class 4 — Jellies" },
          { value: "Class 5 — Pickles",             label: "Class 5 — Pickles" },
          { value: "Class 6 — Relishes & Sauces",   label: "Class 6 — Relishes & Sauces" },
          { value: "Class 7 — Juices",              label: "Class 7 — Juices" },
        ],
      },
      // ── HONEY ──────────────────────────────────────────────────────
      {
        value: "Honey — Adult Division",
        label: "Honey — Adult Division",
        note: "Light amber, dark amber, and flavored honey. Must be harvested by the entrant and submitted in a pint jar with no label.",
        classOptions: [
          { value: "Class 1 — Honey", label: "Class 1 — Honey" },
        ],
      },
    ],
  },

  // ── PERISHABLE ─────────────────────────────────────────────────────
  // Online entry closes: Monday, October 12, 2026 at 11:59 PM
  // Receiving: Oct 13 (Tue)
  {
    value: "Perishable",
    label: "Perishable Exhibits",
    tagline: "Food items, flowers, and fresh produce — delivered close to judging.",
    accentColor: "#8B2E2E",
    divisions: [
      // ── CULINARY ───────────────────────────────────────────────────
      {
        value: "Culinary — Adult Division",
        label: "Culinary — Adult Division",
        note: "Bread, cakes, candies, cookies, pies, and decorated cakes. All entries in disposable/throw-away containers.",
        classOptions: [
          { value: "Class 1 — Bread",            label: "Class 1 — Bread" },
          { value: "Class 2 — Cakes",            label: "Class 2 — Cakes" },
          { value: "Class 3 — Candies",          label: "Class 3 — Candies" },
          { value: "Class 4 — Cookies",          label: "Class 4 — Cookies" },
          { value: "Class 5 — Pies",             label: "Class 5 — Pies" },
          { value: "Class 6 — Decorated Cakes",  label: "Class 6 — Decorated Cakes" },
        ],
      },
      {
        value: "Culinary — Youth Division",
        label: "Culinary — Youth Division",
        note: "Bread, candies, cakes, pies, and cookies. Review the Youth Culinary guide carefully — some lots differ from the Adult Division.",
        classOptions: [
          { value: "Class 1 — Bread",    label: "Class 1 — Bread" },
          { value: "Class 2 — Candies",  label: "Class 2 — Candies" },
          { value: "Class 3 — Cakes",    label: "Class 3 — Cakes" },
          { value: "Class 4 — Pies",     label: "Class 4 — Pies" },
          { value: "Class 5 — Cookies",  label: "Class 5 — Cookies" },
        ],
      },
      // ── EGGS ────────────────────────────────────────────────────────
      {
        value: "Eggs — Adult Division",
        label: "Eggs — Adult Division",
        note: "Must be raised by the person entering. 6 eggs per lot for white and brown classes.",
        classOptions: [
          { value: "Class 1 — Eggs", label: "Class 1 — Eggs" },
        ],
      },
      // ── FRIED PIE ───────────────────────────────────────────────────
      {
        value: "Fried Pie Competition",
        label: "Fried Pie Competition",
        note: "New for 2026. Half Moon Pie shape required. Made From Scratch or Pre-Made Ingredients. Apple, Peach, Other Fruit, and Other Flavor lots.",
        classOptions: [
          { value: "Class 1 — Made From Scratch",    label: "Class 1 — Made From Scratch" },
          { value: "Class 2 — Pre-Made Ingredients", label: "Class 2 — Pre-Made Ingredients" },
        ],
      },
      // ── FRUITS & VEGETABLES ─────────────────────────────────────────
      {
        value: "Fruits & Vegetables — Adult Division",
        label: "Fruits & Vegetables — Adult Division",
        note: "Fresh fruits and vegetables grown by the exhibitor. Includes Largest Pumpkin and Largest Watermelon lots.",
        classOptions: [
          { value: "Class 1 — Fruits",     label: "Class 1 — Fruits" },
          { value: "Class 2 — Vegetables", label: "Class 2 — Vegetables" },
        ],
      },
      {
        value: "Fruits & Vegetables — Youth Division",
        label: "Fruits & Vegetables — Youth Division",
        note: "Pumpkin, watermelon, and ornamental gourd for youth growers.",
        classOptions: [
          { value: "Class 1 — Fruits & Vegetables", label: "Class 1 — Fruits & Vegetables" },
        ],
      },
      // ── HORTICULTURE ────────────────────────────────────────────────
      {
        value: "Horticulture — Adult Division",
        label: "Horticulture — Adult Division",
        note: "Cut flowers, cut foliage, floral arrangements, potted plants, ferns, cacti, succulents, and hanging baskets.",
        classOptions: [
          { value: "Class 1 — Cut Flowers",          label: "Class 1 — Cut Flowers" },
          { value: "Class 2 — Cut Foliage",          label: "Class 2 — Cut Foliage" },
          { value: "Class 3 — Arrangements",         label: "Class 3 — Arrangements" },
          { value: "Class 4 — Potted Foliage Plants", label: "Class 4 — Potted Foliage Plants" },
          { value: "Class 5 — Ferns",                label: "Class 5 — Ferns" },
          { value: "Class 6 — Cacti",                label: "Class 6 — Cacti" },
          { value: "Class 7 — Foliage Vines or Trailers", label: "Class 7 — Foliage Vines or Trailers" },
          { value: "Class 8 — Other Potted Plants",  label: "Class 8 — Other Potted Plants" },
        ],
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
