import redis from "@/lib/redis"
import { refreshProjectsCacheSafe } from "./refreshProjectcachesafe"

export async function prefetchNextPage(
  userId: string,
  nextPage: number,
  limit: number,
  totalPages: number
) {
  try {
    if (nextPage > totalPages) return

    const cacheKey = `user:projects:${userId}:page:${nextPage}:limit:${limit}`

    const exists = await redis.get(cacheKey)
    if (exists) return

    await refreshProjectsCacheSafe(userId, nextPage, limit)
  } catch (err) {
    console.error("Prefetch failed:", err)
  }
}
