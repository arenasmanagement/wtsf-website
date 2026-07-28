/**
 * Tests for honeypot spam-detection logic.
 * The honeypot pattern used across all partner/exhibit forms:
 *   - Field named "website_confirm" (vendor/sponsor/food-vendor)
 *   - Field named "website" (exhibit registration)
 *
 * Bots fill the hidden field; humans don't see it and leave it blank.
 * The route handler silently returns success when the field is non-empty.
 */
import { describe, it, expect } from "vitest";

/** Mirror of the honeypot check used in vendor/sponsor/food-vendor routes */
function isHoneypotFilledVendor(body: Record<string, unknown>): boolean {
  return Boolean(body.website_confirm && String(body.website_confirm).length > 0);
}

/** Mirror of the honeypot check used in exhibit register route */
function isHoneypotFilledExhibit(body: Record<string, unknown>): boolean {
  return (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    Boolean((body as Record<string, unknown>).website)
  );
}

describe("Vendor honeypot (website_confirm)", () => {
  it("is not triggered when field is absent", () => {
    expect(isHoneypotFilledVendor({ businessName: "Acme" })).toBe(false);
  });

  it("is not triggered when field is empty string", () => {
    expect(isHoneypotFilledVendor({ website_confirm: "" })).toBe(false);
  });

  it("is not triggered when field is undefined", () => {
    expect(isHoneypotFilledVendor({ website_confirm: undefined })).toBe(false);
  });

  it("is triggered when field has any content", () => {
    expect(isHoneypotFilledVendor({ website_confirm: "http://spam.com" })).toBe(true);
  });

  it("is triggered even for a single character", () => {
    expect(isHoneypotFilledVendor({ website_confirm: "x" })).toBe(true);
  });
});

describe("Exhibit honeypot (website)", () => {
  it("is not triggered when field is absent", () => {
    expect(isHoneypotFilledExhibit({ first_name: "Jane" })).toBe(false);
  });

  it("is not triggered when field is empty string", () => {
    expect(isHoneypotFilledExhibit({ website: "" })).toBe(false);
  });

  it("is triggered when field has content", () => {
    expect(isHoneypotFilledExhibit({ website: "http://bot.example.com" })).toBe(true);
  });
});
