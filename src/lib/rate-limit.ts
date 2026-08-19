/**
 * Simple in-memory rate limiter for serverless-friendly burst control.
 * Resets per deploy / cold start — add Redis (e.g. Upstash) for distributed limits.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune(key: string, now: number): Bucket {
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    return { count: 0, resetAt: now };
  }
  return b;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

/**
 * Fixed window counter. Returns ok: false when limit exceeded.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const b = prune(key, now);
  if (now >= b.resetAt) {
    b.count = 0;
    b.resetAt = now + windowMs;
  }
  b.count += 1;
  buckets.set(key, b);
  if (b.count > max) {
    const retryAfterSec = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
    return { ok: false, retryAfterSec };
  }
  return { ok: true };
}

/** v2 spec: auth routes — 10 requests / minute / IP */
export const AUTH_RATE_LIMIT = { max: 10, windowMs: 60_000 } as const;

/** Draft autosave — generous to avoid blocking typing */
export const INTAKE_DRAFT_RATE_LIMIT = { max: 60, windowMs: 60_000 } as const;
