import redis from "@/lib/redis"
import { findUserProjects } from "./project.repository"

export async function refreshProjectsCacheSafe(
  userId: string,
  page: number,
  limit: number
) {
  const cacheKey = `user:projects:${userId}:page:${page}:limit:${limit}`
  const lockKey = `lock:${cacheKey}`

  let lockAcquired = false

  try {
    // 1. Check TTL safely
    let ttl: number = -1
    try {
      ttl = await redis.ttl(cacheKey)
    } catch (err) {
      console.error("Redis TTL check failed:", err)
      return
    }

    // If TTL high, skip refresh
    if (ttl > 60) return

    // 2. Acquire lock safely
    try {
      const lock = await redis.set(
        lockKey,
        "1",
        { ex: 30, nx: true } as any
      )
      if (!lock) return
      lockAcquired = true
    } catch (err) {
      console.error("Redis lock acquisition failed:", err)
      return
    }

    // 3. Fetch fresh data from DB
    let projects, totalCount
    try {
      const result = await findUserProjects(
        userId,
        (page - 1) * limit,
        limit
      )
      projects = result.projects
      totalCount = result.totalCount
    } catch (err) {
      console.error("Database fetch failed:", err)
      return
    }

    const totalPages = Math.ceil(totalCount / limit)

    const response = {
      data: projects || [],
      page,
      totalPages,
      totalCount,
    }

    // 4. Update cache safely
    try {
      await redis.set(cacheKey, JSON.stringify(response), "EX", 300)
    } catch (err) {
      console.error("Redis cache update failed:", err)
    }

  } catch (err) {
    console.error("Unexpected error in refreshProjectsCacheSafe:", err)
  } finally {
    // 5. Release lock only if acquired
    if (lockAcquired) {
      try {
        await redis.del(lockKey)
      } catch (err) {
        console.error("Redis lock release failed:", err)
      }
    }
  }
}
