import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// We test the pure helper functions in lib/admin-auth.ts.
// These tests run without a network or database.

// Reset env before each test to avoid cross-test pollution.
beforeEach(() => {
  delete process.env.ADMIN_SECRET;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_ACCOUNTS_JSON;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Dynamically import so env vars are read fresh each test.
async function getAdminAuth() {
  return await import("../lib/admin-auth");
}

describe("getAccounts", () => {
  it("returns empty array when ADMIN_ACCOUNTS_JSON is not set", async () => {
    const { getAccounts } = await getAdminAuth();
    expect(getAccounts()).toEqual([]);
  });

  it("returns empty array for invalid JSON", async () => {
    process.env.ADMIN_ACCOUNTS_JSON = "not-valid-json";
    const { getAccounts } = await getAdminAuth();
    expect(getAccounts()).toEqual([]);
  });

  it("returns empty array when JSON is not an array", async () => {
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify({ id: "test", password: "pw", role: "pageants" });
    const { getAccounts } = await getAdminAuth();
    expect(getAccounts()).toEqual([]);
  });

  it("parses valid ADMIN_ACCOUNTS_JSON correctly", async () => {
    const accounts = [
      { id: "hayley", password: "secret123", role: "pageants" },
      { id: "exhibits-staff", password: "another123", role: "exhibits" },
    ];
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify(accounts);
    const { getAccounts } = await getAdminAuth();
    const result = getAccounts();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("hayley");
    expect(result[0].role).toBe("pageants");
    expect(result[1].id).toBe("exhibits-staff");
    expect(result[1].role).toBe("exhibits");
  });

  it("filters out entries with invalid roles", async () => {
    const accounts = [
      { id: "valid", password: "pw", role: "pageants" },
      { id: "invalid", password: "pw", role: "unknown-role" },
    ];
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify(accounts);
    const { getAccounts } = await getAdminAuth();
    const result = getAccounts();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("valid");
  });

  it("filters out entries with missing fields", async () => {
    const accounts = [
      { id: "valid", password: "pw", role: "super" },
      { id: "no-password", role: "pageants" },
      { password: "pw", role: "exhibits" },
    ];
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify(accounts);
    const { getAccounts } = await getAdminAuth();
    const result = getAccounts();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("valid");
  });
});

describe("verifyAccountCredentials", () => {
  it("returns null when ADMIN_SECRET is not set", async () => {
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify([
      { id: "hayley", password: "correct-pw", role: "pageants" },
    ]);
    const { verifyAccountCredentials } = await getAdminAuth();
    expect(verifyAccountCredentials("hayley", "correct-pw")).toBeNull();
  });

  it("returns null for unknown account ID", async () => {
    process.env.ADMIN_SECRET = "test-secret";
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify([
      { id: "hayley", password: "correct-pw", role: "pageants" },
    ]);
    const { verifyAccountCredentials } = await getAdminAuth();
    expect(verifyAccountCredentials("unknown-user", "correct-pw")).toBeNull();
  });

  it("returns null for wrong password", async () => {
    process.env.ADMIN_SECRET = "test-secret";
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify([
      { id: "hayley", password: "correct-pw", role: "pageants" },
    ]);
    const { verifyAccountCredentials } = await getAdminAuth();
    expect(verifyAccountCredentials("hayley", "wrong-password")).toBeNull();
  });

  it("returns correct role for valid account credentials", async () => {
    process.env.ADMIN_SECRET = "test-secret";
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify([
      { id: "hayley", password: "correct-pw", role: "pageants" },
    ]);
    const { verifyAccountCredentials } = await getAdminAuth();
    expect(verifyAccountCredentials("hayley", "correct-pw")).toBe("pageants");
  });

  it("returns 'super' for super-role account", async () => {
    process.env.ADMIN_SECRET = "test-secret";
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify([
      { id: "diego", password: "superpassword", role: "super" },
    ]);
    const { verifyAccountCredentials } = await getAdminAuth();
    expect(verifyAccountCredentials("diego", "superpassword")).toBe("super");
  });

  it("returns 'exhibits' for exhibits-role account", async () => {
    process.env.ADMIN_SECRET = "test-secret";
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify([
      { id: "exhibits-user", password: "exhibitspw", role: "exhibits" },
    ]);
    const { verifyAccountCredentials } = await getAdminAuth();
    expect(verifyAccountCredentials("exhibits-user", "exhibitspw")).toBe("exhibits");
  });

  it("returns null for empty ID with no ADMIN_PASSWORD", async () => {
    process.env.ADMIN_SECRET = "test-secret";
    // No ADMIN_PASSWORD set
    const { verifyAccountCredentials } = await getAdminAuth();
    expect(verifyAccountCredentials("", "anything")).toBeNull();
  });
});
