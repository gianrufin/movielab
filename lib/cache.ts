import { Redis } from "@upstash/redis";

// Falls back to an in-memory Map when Upstash env vars are absent, so the
// app runs locally with zero external setup. In-memory cache is per
// server-instance and resets on redeploy — fine for dev, not for prod.
const memoryStore = new Map<string, { value: unknown; expiresAt: number }>();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const DEFAULT_TTL_SECONDS = 60 * 60 * 12; // 12h — ratings/reviews don't shift fast enough to justify shorter

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redis) {
    return (await redis.get<T>(key)) ?? null;
  }
  const entry = memoryStore.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value as T;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<void> {
  if (redis) {
    await redis.set(key, value, { ex: ttlSeconds });
    return;
  }
  memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

// Wraps a fetcher with cache-aside: check cache, miss -> compute -> store.
// Use this in route handlers instead of calling cacheGet/cacheSet by hand.
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds?: number
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}
