import { describe, it, expect } from "vitest";
import {
  PAGEANT_DIVISIONS,
  PAGEANT_REGISTRATION_ENABLED,
  getDivisionById,
} from "../lib/pageant-config";

describe("PAGEANT_DIVISIONS", () => {
  it("has exactly 7 entries", () => {
    expect(PAGEANT_DIVISIONS).toHaveLength(7);
  });

  it("all division IDs are unique", () => {
    const ids = PAGEANT_DIVISIONS.map((d) => d.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all division IDs are URL-safe slugs (lowercase, no spaces)", () => {
    const slugPattern = /^[a-z0-9-]+$/;
    for (const d of PAGEANT_DIVISIONS) {
      expect(d.id).toMatch(slugPattern);
    }
  });

  it("age ranges are non-overlapping", () => {
    const sorted = [...PAGEANT_DIVISIONS].sort((a, b) => a.ageMinMonths - b.ageMinMonths);
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      expect(current.ageMaxMonths).toBeLessThan(next.ageMinMonths);
    }
  });

  it("age ranges are contiguous (no gaps)", () => {
    const sorted = [...PAGEANT_DIVISIONS].sort((a, b) => a.ageMinMonths - b.ageMinMonths);
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      expect(next.ageMinMonths).toBe(current.ageMaxMonths + 1);
    }
  });

  it("each division has a non-empty name", () => {
    for (const d of PAGEANT_DIVISIONS) {
      expect(d.name.trim().length).toBeGreaterThan(0);
    }
  });

  it("each division has valid ageLabel", () => {
    for (const d of PAGEANT_DIVISIONS) {
      expect(d.ageLabel.trim().length).toBeGreaterThan(0);
    }
  });

  it("each division has arrivalTime and competitionTime set", () => {
    for (const d of PAGEANT_DIVISIONS) {
      expect(d.arrivalTime.trim().length).toBeGreaterThan(0);
      expect(d.competitionTime.trim().length).toBeGreaterThan(0);
    }
  });

  it("each division has a non-empty accentColor", () => {
    for (const d of PAGEANT_DIVISIONS) {
      expect(d.accentColor.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("getDivisionById", () => {
  it("returns correct division for known ID", () => {
    const d = getDivisionById("baby-miss");
    expect(d).toBeDefined();
    expect(d!.name).toBe("Baby Miss");
  });

  it("returns the division with matching ID", () => {
    for (const division of PAGEANT_DIVISIONS) {
      const found = getDivisionById(division.id);
      expect(found).toBe(division);
    }
  });

  it("returns undefined for unknown ID", () => {
    expect(getDivisionById("not-a-real-division")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getDivisionById("")).toBeUndefined();
  });
});

describe("PAGEANT_REGISTRATION_ENABLED", () => {
  it("is false — registration closed until explicitly opened", () => {
    expect(PAGEANT_REGISTRATION_ENABLED).toBe(false);
  });
});
