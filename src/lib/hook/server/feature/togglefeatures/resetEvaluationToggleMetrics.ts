import redis from "@/lib/redis";

/**
 * Reset evaluation metrics for a feature
 */
export async function resetEvaluationMetrics(
  projectId: string,
  flagKey: string
) {
  try {
    const pattern = `feature:metrics:${projectId}:${flagKey}:*`;

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

    console.log("Metrics reset completed");
  } catch (error) {
    console.error("Metrics reset failed:", error);
  }
}
