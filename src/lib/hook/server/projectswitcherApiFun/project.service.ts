import redis from "@/lib/redis"
import { findUserProjects } from "./project.repository"
import { prefetchNextPage } from "./prefetchNextPage"
import { refreshProjectsCacheSafe } from "./refreshProjectcachesafe"

export async function getUserProjectsPaginated(
  userId: string,
  page: number,
  limit: number
) {
  const cacheKey = `user:projects:${userId}:page:${page}:limit:${limit}`

  // 1. Try cache
  const cached = await redis.get(cacheKey)

  if (cached) {
    const parsed = JSON.parse(cached)

    // Background refresh (non-blocking)
    refreshProjectsCacheSafe(userId, page, limit)

    return parsed
  }

  // 2. Calculate pagination
  const skip = (page - 1) * limit

  // 3. Fetch DB
  const { projects, totalCount } = await findUserProjects(
    userId,
    skip,
    limit
  )

  const totalPages = Math.ceil(totalCount / limit)

  const result = {
    data: projects,
    page,
    totalPages,
    totalCount,
  }

  // 4. Store cache
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300)

  // 5. Prefetch next page (non-blocking)
  prefetchNextPage(userId, page + 1, limit, totalPages)

  return result
}
