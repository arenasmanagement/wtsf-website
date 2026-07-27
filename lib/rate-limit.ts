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
 * Required env vars (set in .env.local / Vercel dashboard):
 *   UPSTASH_REDIS_REST_URL   - from Upstash console
 *   UPSTASH_REDIS_REST_TOKEN - from Upstash console
 * ─────────────────────────────────────────────────────────────
 */

// ── Upstash path ──────────────────────────────────────────────
let redisRateLimiter: ReturnType<typeof buildRedisLimiter> | null = null;

function buildRedisLimiter() {
  // Lazily import to avoid errors when env vars are absent
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Ratelimit } = require("@upstash/ratelimit");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis }     = require("@upstash/redis");
  const redis = new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: false,
    prefix: "wtsf_rl",
  }) as { limit: (id: string) => Promise<{ success: boolean }> };
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
 * @param maxRequests Max requests allowed in the window (fallback only; Redis uses defaults)
 * @param windowMs    Window in milliseconds (fallback only)
 */
export async function checkRateLimit(
  id: string,
  prefix = "default",
  maxRequests = 5,
  windowMs = 60 * 60 * 1000,
): Promise<RateLimitResult> {
  // Use Upstash when configured
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      if (!redisRateLimiter) {
        redisRateLimiter = buildRedisLimiter();
      }
      const result = await redisRateLimiter.limit(`${prefix}:${id}`);
      return { success: result.success, fallback: false };
    } catch (err) {
      console.error("[rate-limit] Upstash error, falling back to memory:", err);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const success = memoryCheck(`${prefix}:${id}`, maxRequests, windowMs);
  return { success, fallback: true };
}
