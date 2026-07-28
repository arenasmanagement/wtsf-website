/**
 * Tests for email confirmation matching logic used in API routes.
 * Both the vendor route and exhibit register route perform a case-insensitive
 * comparison between email and confirm_email / confirmEmail fields.
 */
import { describe, it, expect } from "vitest";

/** Mirrors the check used in app/api/exhibits/register/route.ts */
function emailsMatch(email: string, confirmEmail: string): boolean {
  return email.toLowerCase() === confirmEmail.toLowerCase();
}

describe("Email confirmation matching", () => {
  it("matches identical lowercase emails", () => {
    expect(emailsMatch("jane@example.com", "jane@example.com")).toBe(true);
  });

  it("matches when one is uppercase and one is lowercase", () => {
    expect(emailsMatch("Jane@Example.COM", "jane@example.com")).toBe(true);
  });

  it("matches when both are uppercase", () => {
    expect(emailsMatch("JANE@EXAMPLE.COM", "JANE@EXAMPLE.COM")).toBe(true);
  });

  it("does not match different email addresses", () => {
    expect(emailsMatch("jane@example.com", "john@example.com")).toBe(false);
  });

  it("does not match when domain differs by one character", () => {
    expect(emailsMatch("user@example.com", "user@example.org")).toBe(false);
  });

  it("does not match when local part has typo", () => {
    expect(emailsMatch("jane@example.com", "jne@example.com")).toBe(false);
  });

  it("treats email with trailing space as different", () => {
    // Route code does not trim — leading/trailing whitespace counts as mismatch
    expect(emailsMatch("jane@example.com", "jane@example.com ")).toBe(false);
  });
});
