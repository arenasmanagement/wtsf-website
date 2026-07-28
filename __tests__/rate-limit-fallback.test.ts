/**
 * Tests for the in-memory rate-limit fallback in lib/rate-limit.ts.
 *
 * Strategy: run with NO Upstash env vars so the in-memory path is taken.
 * All external modules (Upstash) are never imported because the env var
 * guard prevents it — no mocking is required.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Clear the module cache before each test so the in-memory Map is reset.
// We use vi.resetModules() + dynamic import to get a fresh module.
beforeEach(() => {
  // Ensure Upstash env vars are absent so the fallback path is used
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  vi.resetModules();
});

async function getRateLimit() {
  const mod = await import("@/lib/rate-limit");
  return mod.checkRateLimit;
}

describe("checkRateLimit — in-memory fallback", () => {
  it("reports fallback: true when Upstash is not configured", async () => {
    const checkRateLimit = await getRateLimit();
    const result = await checkRateLimit("test-ip", "test_prefix", 5, 60_000);
    expect(result.fallback).toBe(true);
  });

  it("allows requests within the limit", async () => {
    const checkRateLimit = await getRateLimit();
    const ip = `test-ip-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      const result = await checkRateLimit(ip, "prefix_a", 3, 60_000);
      expect(result.success).toBe(true);
    }
  });

  it("blocks requests exceeding the limit", async () => {
    const checkRateLimit = await getRateLimit();
    const ip = `test-ip-${Math.random()}`;
    // Use 3 allowed requests
    for (let i = 0; i < 3; i++) {
      await checkRateLimit(ip, "prefix_b", 3, 60_000);
    }
    // 4th request should be blocked
    const result = await checkRateLimit(ip, "prefix_b", 3, 60_000);
    expect(result.success).toBe(false);
    expect(result.fallback).toBe(true);
  });

  it("uses separate counters for different prefixes", async () => {
    const checkRateLimit = await getRateLimit();
    const ip = `test-ip-${Math.random()}`;
    // Exhaust prefix_c
    for (let i = 0; i < 3; i++) {
      await checkRateLimit(ip, "prefix_c", 3, 60_000);
    }
    // prefix_d should still allow requests for the same IP
    const result = await checkRateLimit(ip, "prefix_d", 3, 60_000);
    expect(result.success).toBe(true);
  });

  it("uses separate counters for different IPs on same prefix", async () => {
    const checkRateLimit = await getRateLimit();
    const ip1 = `test-ip-${Math.random()}-1`;
    const ip2 = `test-ip-${Math.random()}-2`;
    // Exhaust ip1
    for (let i = 0; i < 3; i++) {
      await checkRateLimit(ip1, "prefix_e", 3, 60_000);
    }
    const blockedResult = await checkRateLimit(ip1, "prefix_e", 3, 60_000);
    expect(blockedResult.success).toBe(false);

    // ip2 is unaffected
    const allowedResult = await checkRateLimit(ip2, "prefix_e", 3, 60_000);
    expect(allowedResult.success).toBe(true);
  });
});
