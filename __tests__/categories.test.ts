import { describe, it, expect } from "vitest";
import {
  VALID_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_VALUES,
  type Category,
} from "@/lib/updates/categories";

describe("VALID_CATEGORIES", () => {
  it("is a non-empty readonly array", () => {
    expect(VALID_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("contains the eight expected categories", () => {
    const expected: Category[] = [
      "entertainment",
      "tickets",
      "exhibits",
      "livestock",
      "pageants",
      "vendors",
      "volunteers",
      "general",
    ];
    expect([...VALID_CATEGORIES]).toEqual(expected);
  });

  it("has no duplicate values", () => {
    const set = new Set(VALID_CATEGORIES);
    expect(set.size).toBe(VALID_CATEGORIES.length);
  });
});

describe("CATEGORY_LABELS", () => {
  it("has a label for every category in VALID_CATEGORIES", () => {
    for (const cat of VALID_CATEGORIES) {
      expect(CATEGORY_LABELS[cat]).toBeTruthy();
    }
  });

  it("has no extra keys beyond VALID_CATEGORIES", () => {
    const labelKeys = Object.keys(CATEGORY_LABELS);
    expect(labelKeys.length).toBe(VALID_CATEGORIES.length);
  });

  it("all labels are non-empty strings", () => {
    for (const cat of VALID_CATEGORIES) {
      expect(typeof CATEGORY_LABELS[cat]).toBe("string");
      expect(CATEGORY_LABELS[cat].length).toBeGreaterThan(0);
    }
  });
});

describe("CATEGORY_VALUES (Zod-compatible tuple)", () => {
  it("has the same elements as VALID_CATEGORIES", () => {
    expect([...CATEGORY_VALUES]).toEqual([...VALID_CATEGORIES]);
  });

  it("first element is 'entertainment' (tuple requires at least one member)", () => {
    expect(CATEGORY_VALUES[0]).toBe("entertainment");
  });
});
