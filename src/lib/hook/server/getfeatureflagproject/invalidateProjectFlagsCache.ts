import redis from "@/lib/redis"

export async function invalidateProjectFlagsCache(
  projectId: string
) {
  const pattern = `project:flags:${projectId}:*`

  try {
    let cursor = "0"

    do {
      // SCAN is safe for production
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      )

      cursor = nextCursor

      if (keys.length > 0) {
        await redis.del(...keys)
      }

    } while (cursor !== "0")

  } catch (err) {
    console.error("Cache invalidation failed:", err)
  }
}