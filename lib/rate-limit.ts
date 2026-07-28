/**
 * rate-limit.ts
 * ─────────────────────────────────────────────────────────────
 * Serverless-safe rate limiting.
 *
 * When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set,
 * uses @upstash/ratelimit backed by Redis (persists across cold starts).
 *
 * When those env vars are absent (local dev or env not yet configured),
 * falls back to an in-memory Map — suitable for development only.
 *
 * When env vars are absent in production (NODE_ENV=production),
 * requests are DENIED as a fail-safe rather than silently allowed.
 *
 * Required env vars (set in .env.local / Vercel dashboard):
 *   UPSTASH_REDIS_REST_URL   - from Upstash console
 *   UPSTASH_REDIS_REST_TOKEN - from Upstash console
 * ─────────────────────────────────────────────────────────────
 */

// ── Upstash path ──────────────────────────────────────────────
// Cache limiters per (maxRequests, windowMs) config to avoid rebuilding each call.
const limiterCache = new Map<string, { limit: (id: string) => Promise<{ success: boolean }> }>();

function getRedisLimiter(
  maxRequests: number,
  windowMs: number,
): { limit: (id: string) => Promise<{ success: boolean }> } {
  const cacheKey = `${maxRequests}:${windowMs}`;
  if (limiterCache.has(cacheKey)) {
    return limiterCache.get(cacheKey)!;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Ratelimit } = require("@upstash/ratelimit");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require("@upstash/redis");

  const redis = new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // Convert windowMs to seconds for Upstash
  const windowSeconds = Math.max(1, Math.round(windowMs / 1000));

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    analytics: false,
    prefix: "wtsf_rl",
  }) as { limit: (id: string) => Promise<{ success: boolean }> };

  limiterCache.set(cacheKey, limiter);
  return limiter;
}

// ── In-memory fallback ─────────────────────────────────────────
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryCheck(
  key: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const record = memoryStore.get(key);
  if (!record || now > record.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

// ── Public API ────────────────────────────────────────────────
export interface RateLimitResult {
  success: boolean;
  /** true when using the in-memory fallback (Upstash not configured) */
  fallback: boolean;
}

/**
 * Check rate limit for a given identifier (typically the requester's IP).
 *
 * @param id          Unique identifier (IP address, user ID, etc.)
 * @param prefix      Namespace prefix so different endpoints don't share limits
 * @param maxRequests Max requests allowed in the window
 * @param windowMs    Window in milliseconds
 */
export async function checkRateLimit(
  id: string,
  prefix = "default",
  maxRequests = 5,
  windowMs = 60 * 60 * 1000,
): Promise<RateLimitResult> {
  const hasUpstash =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;

  // Use Upstash when configured
  if (hasUpstash) {
    try {
      const limiter = getRedisLimiter(maxRequests, windowMs);
      const result = await limiter.limit(`${prefix}:${id}`);
      return { success: result.success, fallback: false };
    } catch (err) {
      console.error("[rate-limit] Upstash error, falling back to memory:", err);
      // Fall through to in-memory
    }
  }

  // Fail-safe: in production without Upstash configured, deny all requests
  if (process.env.NODE_ENV === "production" && !hasUpstash) {
    console.error("[rate-limit] UPSTASH env vars not set in production — denying request");
    return { success: false, fallback: true };
  }

  // In-memory fallback (dev/test only)
  const success = memoryCheck(`${prefix}:${id}`, maxRequests, windowMs);
  return { success, fallback: true };
}
