import redis from "@/lib/redis"
import { refreshFlagsCacheSafe } from "./refreshProjectFlagsCacheSafe"
import { findProjectFlags } from "./findProjectFlag.repository"
import { prefetchNextFlagsPage } from "./prefetchNextFlagsPage.service"
export async function getProjectFlagsPaginated(
  projectId: string,
  page: number,
  limit: number
) {
  const cacheKey =
    `project:flags:${projectId}:page:${page}:limit:${limit}`

  /* -------------------------
     1️⃣ Try Redis cache
  -------------------------- */
  const cached = await redis.get(cacheKey)

  if (cached) {
    const parsed = JSON.parse(cached)

    // non-blocking background refresh
    refreshFlagsCacheSafe(projectId, page, limit)

    return parsed
  }

  /* -------------------------
     2️⃣ Pagination calculation
  -------------------------- */
  const skip = (page - 1) * limit

  /* -------------------------
     3️⃣ Fetch from DB
  -------------------------- */
  const { flags, totalCount } =
    await findProjectFlags(projectId, skip, limit)

  const totalPages = Math.ceil(totalCount / limit)

  const result = {
    data: flags,
    page,
    totalPages,
    totalCount,
  }

  /* -------------------------
     4️⃣ Store in Redis
  -------------------------- */
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300)

  /* -------------------------
     5️⃣ Prefetch next page
  -------------------------- */
  prefetchNextFlagsPage(
    projectId,
    page + 1,
    limit,
    totalPages
  )

  return result
}