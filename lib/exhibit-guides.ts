/**
 * EXHIBIT GUIDES CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for every exhibit guide card shown on the Exhibits
 * page. One entry per PDF guide.
 *
 * ANNUAL UPDATE WORKFLOW
 * ─────────────────────────────────────────────
 * 1. Replace the PDF in /public/documents/exhibits/ using the same filename.
 * 2. Update this config only if the title, audience, department, or display
 *    order changes.
 * 3. Deploy the site.
 *
 * HOW TO ACTIVATE A GUIDE
 * ─────────────────────────
 * Set  active: true  after the PDF is placed in /public/documents/exhibits/.
 * The card switches from "Guide Coming Soon" to live View + Download buttons.
 *
 * HOW TO ADD A NEW CATEGORY
 * ──────────────────────────
 * Copy an existing entry, assign a unique id, fill in the fields, and set
 * active: false until the PDF is ready.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AudienceType = "adult" | "youth" | "all";

export type DepartmentType =
  | "arts-crafts-photography"
  | "needlework-textiles"
  | "culinary-canning"
  | "garden-agriculture"
  | "educational-displays";

export interface ExhibitGuide {
  /** Internal unique key — never shown to visitors */
  id: string;
  /** Card heading, e.g. "Photography — Adult Division" */
  title: string;
  /** 1–2 sentence description based on actual PDF content */
  description: string;
  /** Path to the PDF relative to /public — must match the actual file */
  fileUrl: string;
  /** Filename proposed to the browser on download */
  fileName: string;
  /** Controls the audience badge on the card */
  audience: AudienceType;
  /** Groups the card under the correct department section */
  department: DepartmentType;
  /**
   * true  → View and Download buttons are active.
   * false → Card is visible with "Guide Coming Soon" state and no links.
   */
  active: boolean;
  /** Lower numbers appear first within the same department group */
  sortOrder: number;
  /** true → renders a "New for 2026" badge on the card */
  isNew?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTS, CRAFTS & PHOTOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────
const ARTS_CRAFTS_PHOTOGRAPHY: ExhibitGuide[] = [
  {
    id: "visual-arts-adults",
    title: "Visual Arts — Adult Division",
    description:
      "Framed paintings in acrylic, oils, watercolor, charcoal, colored pencil, and mixed media. Also includes ceramics, sculpture, and rock art. All artwork must be framed and wired ready for hanging.",
    fileUrl: "/documents/exhibits/Adult%20Visual%20Arts.pdf",
    fileName: "WTSF-Visual-Arts-Adults.pdf",
    audience: "adult",
    department: "arts-crafts-photography",
    active: true,
    sortOrder: 1,
  },
  {
    id: "visual-arts-youth",
    title: "Visual Arts — Youth Division",
    description:
      "Canvas art, free-hand drawing, oils and acrylics, watercolor, pastels, painting on wood, pottery, and zentangle. Classes are separated by grade level (6th grade & under; 7th–12th grade).",
    fileUrl: "/documents/exhibits/Youth%20Visual%20Arts.pdf",
    fileName: "WTSF-Visual-Arts-Youth.pdf",
    audience: "youth",
    department: "arts-crafts-photography",
    active: true,
    sortOrder: 2,
  },
  {
    id: "hobbies-crafts-adults",
    title: "Hobbies & Crafts — Adult Division",
    description:
      "Jewelry, wood crafts, metal crafts, paper crafts, scrapbooking, fabric crafts, floral arrangements, home décor, and more. Multiple classes cover a wide range of handmade items.",
    fileUrl: "/documents/exhibits/Adult%20Hobbies%20%26%20Crafts.pdf",
    fileName: "WTSF-Hobbies-Crafts-Adults.pdf",
    audience: "adult",
    department: "arts-crafts-photography",
    active: true,
    sortOrder: 3,
  },
  {
    id: "hobbies-crafts-youth",
    title: "Hobbies & Crafts — Youth Division",
    description:
      "Handmade candles, decorated ceramics, jewelry, leather craft, origami, woodworking, weaving, nature crafts, and creative projects. Organized by grade level including a separate class for 8 years old & under.",
    fileUrl: "/documents/exhibits/Youth%20Hobbies%20%26%20Crafts.pdf",
    fileName: "WTSF-Hobbies-Crafts-Youth.pdf",
    audience: "youth",
    department: "arts-crafts-photography",
    active: true,
    sortOrder: 4,
  },
  {
    id: "photography-adults",
    title: "Photography — Adult Division",
    description:
      "People, animals, nature, scenic, and special-interest categories. Classes include portraits, children at play, pets, wildlife, landscapes, nightscapes, and more. Entries must be amateur work not previously shown at WTSF.",
    fileUrl: "/documents/exhibits/Adult%20Photography.pdf",
    fileName: "WTSF-Photography-Adults.pdf",
    audience: "adult",
    department: "arts-crafts-photography",
    active: true,
    sortOrder: 5,
  },
  {
    id: "photography-youth",
    title: "Photography — Youth Division",
    description:
      "Animal, flower, landscape, waterscape, portrait, and West Tennessee Event categories. Divided into two classes: 6th grade & under, and 7th–12th grade. Includes a Best of Show lot.",
    fileUrl: "/documents/exhibits/Youth%20Photography.pdf",
    fileName: "WTSF-Photography-Youth.pdf",
    audience: "youth",
    department: "arts-crafts-photography",
    active: true,
    sortOrder: 6,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEEDLEWORK & TEXTILES
// ─────────────────────────────────────────────────────────────────────────────
const NEEDLEWORK_TEXTILES: ExhibitGuide[] = [
  {
    id: "needlework-adults",
    title: "Needlework — Adult Division",
    description:
      "Pillows, dish towels, tablecloths, table runners, pillowcases, and holiday items worked in appliqué, cross stitch, embroidery, and machine embroidery.",
    fileUrl: "/documents/exhibits/Adult%20Needlework.pdf",
    fileName: "WTSF-Needlework-Adults.pdf",
    audience: "adult",
    department: "needlework-textiles",
    active: true,
    sortOrder: 1,
  },
  {
    id: "quilts",
    title: "Quilts & Quilted Items",
    description:
      "Friendship quilts, vintage quilts (50+ years old), hand-pieced, machine-pieced, and combination quilting methods. Includes a Best of Show lot. Check-in is Sunday of fair week.",
    fileUrl: "/documents/exhibits/Adult%20Quilts.pdf",
    fileName: "WTSF-Quilts.pdf",
    audience: "all",
    department: "needlework-textiles",
    active: true,
    sortOrder: 2,
  },
  {
    id: "stitch-sew-adults",
    title: "Stitch & Sew — Adult Division",
    description:
      "Sewn garments for babies (0–24 months), children (2–16 years), and adults (17+). Includes bibs, dresses, blouses, coats, aprons, and smocked outfits. Judged on workmanship, decoration, and originality.",
    fileUrl: "/documents/exhibits/Adult%20Stitch%20%26%20Sew.pdf",
    fileName: "WTSF-Stitch-Sew-Adults.pdf",
    audience: "adult",
    department: "needlework-textiles",
    active: true,
    sortOrder: 3,
  },
  {
    id: "stitch-sew-youth",
    title: "Stitch & Sew — Youth Division",
    description:
      "Crocheted items, cross stitch, knitted items, doll clothes, pillows, pillowcases, dresses, separates, and recycled clothing items. Youth may also enter the Adult Division if a lot is not available in Youth.",
    fileUrl: "/documents/exhibits/Youth%20Stitch%20%26%20Sew.pdf",
    fileName: "WTSF-Stitch-Sew-Youth.pdf",
    audience: "youth",
    department: "needlework-textiles",
    active: true,
    sortOrder: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CULINARY & CANNING
// ─────────────────────────────────────────────────────────────────────────────
const CULINARY_CANNING: ExhibitGuide[] = [
  {
    id: "culinary-adults",
    title: "Culinary — Adult Division",
    description:
      "Bread, cakes, candies, cookies, and pies — multiple classes and lots for each. Includes banana bread, pound cake, fudge, chocolate chip cookies, fruit pies, and more.",
    fileUrl: "/documents/exhibits/Adult%20Culinary.pdf",
    fileName: "WTSF-Culinary-Adults.pdf",
    audience: "adult",
    department: "culinary-canning",
    active: true,
    sortOrder: 1,
  },
  {
    id: "culinary-youth",
    title: "Culinary — Youth Division",
    description:
      "Bread, candies, cakes, pies, and cookies including a fair-theme cake class and decorated cupcakes. Youth-specific lots differ from the Adult Division — review this guide carefully.",
    fileUrl: "/documents/exhibits/Youth%20Culinary.pdf",
    fileName: "WTSF-Culinary-Youth.pdf",
    audience: "youth",
    department: "culinary-canning",
    active: true,
    sortOrder: 2,
  },
  {
    id: "canning-adults",
    title: "Canning — Adult Division",
    description:
      "Home-canned fresh fruits, vegetables, jams, marmalades, jellies, and pickles. Classes cover applesauce, peaches, green beans, blueberry jam, dill pickles, and more.",
    fileUrl: "/documents/exhibits/Adult%20Canning.pdf",
    fileName: "WTSF-Canning-Adults.pdf",
    audience: "adult",
    department: "culinary-canning",
    active: true,
    sortOrder: 3,
  },
  {
    id: "honey-adults",
    title: "Honey — Adult Division",
    description:
      "Light amber, dark amber, and flavored honey. All entries must be harvested by the entrant, submitted in a pint jar with no label. Judged on appearance, purity, and flavor.",
    fileUrl: "/documents/exhibits/Adult%20Honey.pdf",
    fileName: "WTSF-Honey-Adults.pdf",
    audience: "adult",
    department: "culinary-canning",
    active: true,
    sortOrder: 4,
  },
  {
    id: "eggs-adults",
    title: "Eggs — Adult Division",
    description:
      "White, brown, and most unusual/multicolored egg classes. Entries must be raised by the person entering — six eggs per lot.",
    fileUrl: "/documents/exhibits/Adult%20Eggs.pdf",
    fileName: "WTSF-Eggs-Adults.pdf",
    audience: "adult",
    department: "culinary-canning",
    active: true,
    sortOrder: 5,
  },
  {
    id: "fried-pie",
    title: "Fried Pie Competition",
    description:
      "New for 2026. Enter half-moon fried pies in Made From Scratch or Pre-Made Ingredients classes, with Apple, Peach, Other Fruit, and Other Flavor lots.",
    fileUrl: "/documents/exhibits/Fried%20Pie.pdf",
    fileName: "WTSF-Fried-Pie.pdf",
    audience: "all",
    department: "culinary-canning",
    active: true,
    sortOrder: 6,
    isNew: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GARDEN & AGRICULTURE
// ─────────────────────────────────────────────────────────────────────────────
const GARDEN_AGRICULTURE: ExhibitGuide[] = [
  {
    id: "fruits-vegetables-adults",
    title: "Fruits & Vegetables — Adult Division",
    description:
      "Fresh fruits and vegetables grown by the exhibitor — cucumbers, okra, peppers, tomatoes, squash, cabbage, potatoes, and more. Special lots for Largest Pumpkin and Largest Watermelon.",
    fileUrl: "/documents/exhibits/Adult%20Fruits%20%26%20Vegetables.pdf",
    fileName: "WTSF-Fruits-Vegetables-Adults.pdf",
    audience: "adult",
    department: "garden-agriculture",
    active: true,
    sortOrder: 1,
  },
  {
    id: "fruits-vegetables-youth",
    title: "Fruits & Vegetables — Youth Division",
    description:
      "Pumpkin, watermelon, and ornamental gourd classes for youth growers. Youth may enter the Adult Division if a lot is not available in the Youth Division.",
    fileUrl: "/documents/exhibits/Youth%20Fruits%20%26%20Vegetables.pdf",
    fileName: "WTSF-Fruits-Vegetables-Youth.pdf",
    audience: "youth",
    department: "garden-agriculture",
    active: true,
    sortOrder: 2,
  },
  {
    id: "crops-adults",
    title: "Crops — Adult Division",
    description:
      "Corn, cotton, soybeans, and hay. Judged on size, uniformity, and quality. Ear corn must be wired together in a pyramid. Includes a Best of Show lot.",
    fileUrl: "/documents/exhibits/Adult%20Crops.pdf",
    fileName: "WTSF-Crops-Adults.pdf",
    audience: "adult",
    department: "garden-agriculture",
    active: true,
    sortOrder: 3,
  },
  {
    id: "crops-youth",
    title: "Crops — Youth Division",
    description:
      "Corn, hay, cotton, and soybean classes for youth exhibitors. Judged on the same standards as the Adult Division.",
    fileUrl: "/documents/exhibits/Youth%20Crops.pdf",
    fileName: "WTSF-Crops-Youth.pdf",
    audience: "youth",
    department: "garden-agriculture",
    active: true,
    sortOrder: 4,
  },
  {
    id: "horticulture-adults",
    title: "Horticulture — Adult Division",
    description:
      "Cut flowers, cut foliage, floral arrangements, potted foliage plants, ferns, cacti, succulents, and hanging baskets. Includes a fair-theme cut flower arrangement class.",
    fileUrl: "/documents/exhibits/Adult%20Horticulture.pdf",
    fileName: "WTSF-Horticulture-Adults.pdf",
    audience: "adult",
    department: "garden-agriculture",
    active: true,
    sortOrder: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATIONAL DISPLAYS
// ─────────────────────────────────────────────────────────────────────────────
const EDUCATIONAL_DISPLAYS: ExhibitGuide[] = [
  {
    id: "educational-displays-adults",
    title: "Educational Displays — Adult Division",
    description:
      "Agricultural and special-interest display boards and exhibits covering native Tennessee plants, entomology, crops, forestry, horticulture, animal health, food safety, and more.",
    fileUrl: "/documents/exhibits/Adult%20Educational%20Displays.pdf",
    fileName: "WTSF-Educational-Displays-Adults.pdf",
    audience: "adult",
    department: "educational-displays",
    active: true,
    sortOrder: 1,
  },
  {
    id: "educational-displays-youth",
    title: "Educational Displays — Youth Division",
    description:
      "Educational display boards and exhibits on agricultural topics including native plants, entomology, animal health, food safety, and more. Also includes a science project display class.",
    fileUrl: "/documents/exhibits/Youth%20Educational%20Displays.pdf",
    fileName: "WTSF-Educational-Displays-Youth.pdf",
    audience: "youth",
    department: "educational-displays",
    active: true,
    sortOrder: 2,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const EXHIBIT_GUIDES: ExhibitGuide[] = [
  ...ARTS_CRAFTS_PHOTOGRAPHY,
  ...NEEDLEWORK_TEXTILES,
  ...CULINARY_CANNING,
  ...GARDEN_AGRICULTURE,
  ...EDUCATIONAL_DISPLAYS,
];

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT METADATA
// Labels, accent colors, and taglines for the five department groups.
// ─────────────────────────────────────────────────────────────────────────────
export interface DepartmentMeta {
  id: DepartmentType;
  label: string;
  tagline: string;
  accentColor: string;
}

export const DEPARTMENT_META: DepartmentMeta[] = [
  {
    id: "arts-crafts-photography",
    label: "Arts, Crafts & Photography",
    tagline: "Paintings, drawings, handmade crafts, jewelry, and photography.",
    accentColor: "#8B2E2E",
  },
  {
    id: "needlework-textiles",
    label: "Needlework & Textiles",
    tagline: "Quilts, embroidery, sewn garments, and stitched home goods.",
    accentColor: "#2C4A2E",
  },
  {
    id: "culinary-canning",
    label: "Culinary & Canning",
    tagline: "Baked goods, home-canned preserves, honey, eggs, and fried pies.",
    accentColor: "#D4A827",
  },
  {
    id: "garden-agriculture",
    label: "Garden & Agriculture",
    tagline: "Fresh produce, row crops, horticulture, and flowers.",
    accentColor: "#2C4A2E",
  },
  {
    id: "educational-displays",
    label: "Educational Displays",
    tagline: "Agricultural and science display boards and exhibits.",
    accentColor: "#5C4A32",
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
