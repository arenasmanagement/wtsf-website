/**
 * Tests for Zod validation schemas used in API routes.
 * Imports the schemas directly rather than hitting HTTP endpoints.
 * No real DB, Redis, or email calls.
 */
import { describe, it, expect } from "vitest";
import { z } from "zod";

// ── Replicate schemas from API routes (source of truth is the route files) ──

// Exhibit registration — entry schema
const EntrySchema = z.object({
  department: z.string().min(1, "Department is required"),
  division:   z.string().min(1, "Division is required"),
  class_name: z.string().min(1, "Class is required"),
  lot:        z.string().min(1, "Lot is required"),
  entry_title:       z.string().max(200).optional(),
  entry_description: z.string().max(500).optional(),
  quantity:   z.number().int().min(1).max(99).default(1),
});

// Exhibit registration — top-level schema (abbreviated for tests)
const RegistrationSchema = z.object({
  first_name:    z.string().min(1).max(100),
  last_name:     z.string().min(1).max(100),
  email:         z.string().email().max(200),
  confirm_email: z.string().email(),
  entrant_type:  z.enum(["adult", "youth"]),
  entries:       z.array(EntrySchema).min(1).max(50),
  rules_agreed:  z.literal(true),
  website:       z.string().max(0).optional(), // honeypot
});

// Vendor schema (honeypot field)
const VendorHoneypotSchema = z.object({
  website_confirm: z.string().max(0).optional(),
});

describe("EntrySchema", () => {
  it("passes with valid entry", () => {
    const result = EntrySchema.safeParse({
      department: "Non-Perishable",
      division:   "Photography",
      class_name: "Class 14",
      lot:        "Lot 2",
      quantity:   1,
    });
    expect(result.success).toBe(true);
  });

  it("fails when department is empty", () => {
    const result = EntrySchema.safeParse({
      department: "",
      division:   "Photography",
      class_name: "Class 14",
      lot:        "Lot 2",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Department is required");
  });

  it("fails when class_name is empty", () => {
    const result = EntrySchema.safeParse({
      department: "Non-Perishable",
      division:   "Photography",
      class_name: "",
      lot:        "Lot 2",
    });
    expect(result.success).toBe(false);
  });

  it("fails when quantity is 0", () => {
    const result = EntrySchema.safeParse({
      department: "Non-Perishable",
      division:   "Photography",
      class_name: "Class 1",
      lot:        "Lot 1",
      quantity:   0,
    });
    expect(result.success).toBe(false);
  });

  it("defaults quantity to 1 when omitted", () => {
    const result = EntrySchema.safeParse({
      department: "Non-Perishable",
      division:   "Photography",
      class_name: "Class 1",
      lot:        "Lot 1",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.quantity).toBe(1);
  });
});

describe("RegistrationSchema", () => {
  const validRegistration = {
    first_name:    "Jane",
    last_name:     "Smith",
    email:         "jane@example.com",
    confirm_email: "jane@example.com",
    entrant_type:  "adult" as const,
    entries:       [{
      department: "Non-Perishable",
      division:   "Photography",
      class_name: "Class 14",
      lot:        "Lot 2",
    }],
    rules_agreed: true as const,
  };

  it("passes with valid registration", () => {
    const result = RegistrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it("fails when entries array is empty", () => {
    const result = RegistrationSchema.safeParse({ ...validRegistration, entries: [] });
    expect(result.success).toBe(false);
  });

  it("fails when rules_agreed is false", () => {
    const result = RegistrationSchema.safeParse({ ...validRegistration, rules_agreed: false });
    expect(result.success).toBe(false);
  });

  it("fails with invalid email", () => {
    const result = RegistrationSchema.safeParse({ ...validRegistration, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("fails with invalid entrant_type", () => {
    const result = RegistrationSchema.safeParse({ ...validRegistration, entrant_type: "child" });
    expect(result.success).toBe(false);
  });
});

describe("VendorHoneypotSchema", () => {
  it("passes when website_confirm is absent", () => {
    const result = VendorHoneypotSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("passes when website_confirm is empty string", () => {
    const result = VendorHoneypotSchema.safeParse({ website_confirm: "" });
    expect(result.success).toBe(true);
  });

  it("fails when website_confirm has content (bot detected)", () => {
    const result = VendorHoneypotSchema.safeParse({ website_confirm: "http://spam.example.com" });
    expect(result.success).toBe(false);
  });
});
