// Canonical source of truth for all Fair Updates categories
export const VALID_CATEGORIES = [
  "entertainment",
  "tickets",
  "exhibits",
  "livestock",
  "pageants",
  "vendors",
  "volunteers",
  "general",
] as const;

export type Category = (typeof VALID_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  entertainment: "Entertainment",
  tickets:       "Tickets",
  exhibits:      "Exhibits",
  livestock:     "Livestock & Rodeo",
  pageants:      "Pageants",
  vendors:       "Vendors",
  volunteers:    "Volunteers",
  general:       "General Updates",
};

// Zod-compatible values array
export const CATEGORY_VALUES = VALID_CATEGORIES as unknown as [Category, ...Category[]];
