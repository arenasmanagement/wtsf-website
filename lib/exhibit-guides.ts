/**
 * EXHIBIT GUIDES CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for every exhibit guide card shown on the Exhibits
 * page.  One entry per exhibit category / division.
 *
 * HOW TO ADD A PDF FOR A NEW OR EXISTING GUIDE
 * ─────────────────────────────────────────────
 * 1. Place the PDF file in /public/files/
 *    The filename must match the `fileUrl` field below (after "/files/").
 *    Example:  /public/files/guide-photography.pdf
 *
 * 2. Set  active: true  on the matching entry.
 *    The card immediately switches from "Guide Coming Soon" to live buttons.
 *
 * HOW TO ADD A NEW CATEGORY
 * ──────────────────────────
 * Copy an existing entry, give it a unique `id`, fill in the details, and
 * set `active: false` until the PDF is ready.
 *
 * HOW TO HIDE A CATEGORY WITHOUT DELETING IT
 * ────────────────────────────────────────────
 * Set  active: false.  The card still appears but shows "Guide Coming Soon."
 *
 * HOW TO CHANGE DISPLAY ORDER
 * ─────────────────────────────
 * Adjust `sortOrder`.  Lower numbers appear first within the same department.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AudienceType = "adult" | "youth" | "all";
export type DepartmentType = "non-perishable" | "perishable";

export interface ExhibitGuide {
  /** Internal unique key — never shown to visitors */
  id: string;
  /** Card heading, e.g. "Photography" */
  title: string;
  /** 1–2 sentence description shown on the card */
  description: string;
  /**
   * Path to the PDF relative to /public — must match the actual file location.
   * Example:  "/files/guide-photography.pdf"
   * Set `active: false` if the file is not yet available.
   */
  fileUrl: string;
  /**
   * Filename proposed to the browser when the visitor clicks Download.
   * Example:  "WTSF-Photography-Exhibit-Guide.pdf"
   */
  fileName: string;
  /** Controls the audience badge shown on the card */
  audience: AudienceType;
  /** Groups the card under "Non-Perishable Exhibits" or "Perishable Exhibits" */
  department: DepartmentType;
  /**
   * Set true only after the PDF file is in /public/files/.
   * false → card is visible with a "Guide Coming Soon" state and no links.
   * true  → View and Download buttons are active.
   */
  active: boolean;
  /** Lower numbers appear first within the same department group */
  sortOrder: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// NON-PERISHABLE EXHIBIT GUIDES
// Items that do not spoil — displayed for the full fair duration.
// ─────────────────────────────────────────────────────────────────────────────
const NON_PERISHABLE_GUIDES: ExhibitGuide[] = [
  {
    id: "arts-crafts",
    title: "Arts & Crafts",
    description:
      "Handmade items, ceramics, pottery, jewelry, and decorative arts. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-arts-crafts.pdf",
    fileName: "WTSF-Arts-Crafts-Exhibit-Guide.pdf",
    audience: "adult",
    department: "non-perishable",
    active: false,
    sortOrder: 1,
  },
  {
    id: "needlework-textiles",
    title: "Needlework & Textiles",
    description:
      "Quilts, embroidery, cross-stitch, knitting, crocheting, and woven pieces. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-needlework-textiles.pdf",
    fileName: "WTSF-Needlework-Textiles-Exhibit-Guide.pdf",
    audience: "adult",
    department: "non-perishable",
    active: false,
    sortOrder: 2,
  },
  {
    id: "photography",
    title: "Photography",
    description:
      "Print and digital photography — landscape, portrait, action, and creative categories. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-photography.pdf",
    fileName: "WTSF-Photography-Exhibit-Guide.pdf",
    audience: "adult",
    department: "non-perishable",
    active: false,
    sortOrder: 3,
  },
  {
    id: "fine-art",
    title: "Fine Art",
    description:
      "Original paintings, drawings, watercolors, pastels, and mixed media. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-fine-art.pdf",
    fileName: "WTSF-Fine-Art-Exhibit-Guide.pdf",
    audience: "adult",
    department: "non-perishable",
    active: false,
    sortOrder: 4,
  },
  {
    id: "woodworking",
    title: "Woodworking",
    description:
      "Furniture, carvings, and decorative woodwork. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-woodworking.pdf",
    fileName: "WTSF-Woodworking-Exhibit-Guide.pdf",
    audience: "adult",
    department: "non-perishable",
    active: false,
    sortOrder: 5,
  },
  {
    id: "youth-non-perishable",
    title: "Youth Exhibits — Non-Perishable",
    description:
      "All non-perishable exhibit categories open to youth entrants under 18. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-youth-non-perishable.pdf",
    fileName: "WTSF-Youth-Non-Perishable-Exhibit-Guide.pdf",
    audience: "youth",
    department: "non-perishable",
    active: false,
    sortOrder: 6,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PERISHABLE EXHIBIT GUIDES
// Food items, flowers, and fresh produce — delivered close to judging time.
// ─────────────────────────────────────────────────────────────────────────────
const PERISHABLE_GUIDES: ExhibitGuide[] = [
  {
    id: "baked-goods",
    title: "Baked Goods",
    description:
      "Breads, cakes, pies, cookies, and specialty baked items. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-baked-goods.pdf",
    fileName: "WTSF-Baked-Goods-Exhibit-Guide.pdf",
    audience: "adult",
    department: "perishable",
    active: false,
    sortOrder: 1,
  },
  {
    id: "canned-goods",
    title: "Canned Goods & Preserves",
    description:
      "Jams, jellies, pickles, relishes, and preserved vegetables. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-canned-goods.pdf",
    fileName: "WTSF-Canned-Goods-Exhibit-Guide.pdf",
    audience: "adult",
    department: "perishable",
    active: false,
    sortOrder: 2,
  },
  {
    id: "fresh-vegetables",
    title: "Fresh Vegetables",
    description:
      "Homegrown produce judged on size, uniformity, and condition. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-fresh-vegetables.pdf",
    fileName: "WTSF-Fresh-Vegetables-Exhibit-Guide.pdf",
    audience: "adult",
    department: "perishable",
    active: false,
    sortOrder: 3,
  },
  {
    id: "flowers-plants",
    title: "Fresh Flowers & Plants",
    description:
      "Cut flower arrangements and container plants. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-flowers-plants.pdf",
    fileName: "WTSF-Fresh-Flowers-Plants-Exhibit-Guide.pdf",
    audience: "adult",
    department: "perishable",
    active: false,
    sortOrder: 4,
  },
  {
    id: "youth-perishable",
    title: "Youth Perishable",
    description:
      "All perishable exhibit categories open to youth entrants under 18. Review available classes, lots, instructions, and rules before registering.",
    fileUrl: "/files/guide-youth-perishable.pdf",
    fileName: "WTSF-Youth-Perishable-Exhibit-Guide.pdf",
    audience: "youth",
    department: "perishable",
    active: false,
    sortOrder: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const EXHIBIT_GUIDES: ExhibitGuide[] = [
  ...NON_PERISHABLE_GUIDES,
  ...PERISHABLE_GUIDES,
];

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT METADATA
// Labels, accent colors, and taglines for the two department groups.
// ─────────────────────────────────────────────────────────────────────────────
export interface DepartmentMeta {
  id: DepartmentType;
  label: string;
  tagline: string;
  accentColor: string;
}

export const DEPARTMENT_META: DepartmentMeta[] = [
  {
    id: "non-perishable",
    label: "Non-Perishable Exhibits",
    tagline: "Items that do not spoil — displayed for the full duration of the fair.",
    accentColor: "#2C4A2E",
  },
  {
    id: "perishable",
    label: "Perishable Exhibits",
    tagline: "Food items, flowers, and fresh produce — delivered close to judging time.",
    accentColor: "#8B2E2E",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** All guides for a given department, sorted by sortOrder. */
export function getGuidesByDepartment(dept: DepartmentType): ExhibitGuide[] {
  return EXHIBIT_GUIDES.filter((g) => g.department === dept).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

/** All active guides, sorted by department then sortOrder. */
export function getActiveGuides(): ExhibitGuide[] {
  return EXHIBIT_GUIDES.filter((g) => g.active).sort(
    (a, b) =>
      a.department.localeCompare(b.department) || a.sortOrder - b.sortOrder
  );
}

/** All guides regardless of active status, sorted by department then sortOrder. */
export function getAllGuides(): ExhibitGuide[] {
  return [...EXHIBIT_GUIDES].sort(
    (a, b) =>
      a.department.localeCompare(b.department) || a.sortOrder - b.sortOrder
  );
}
