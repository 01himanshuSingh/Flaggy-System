import redis from "@/lib/redis";

/**
 * Invalidate all cached configs for a feature.
 * Uses SCAN instead of KEYS for production safety.
 */
export async function invalidateFeatureCache(
  projectId: string,
  flagKey: string
) {
  try {
    const pattern = `feature:config:${projectId}:*`;

    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }

    } while (cursor !== "0");

  } catch (error) {
    console.error("Cache invalidation failed:", error);
  }
}
