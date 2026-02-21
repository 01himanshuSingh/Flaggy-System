import redis from "@/lib/redis"
import { findProjectFlags } from "./findProjectFlag.repository"
export async function prefetchNextFlagsPage(
  projectId: string,
  nextPage: number,
  limit: number,
  totalPages: number
) {
  try {
    // stop if no next page
    if (nextPage > totalPages) return

    const cacheKey =
      `project:flags:${projectId}:page:${nextPage}:limit:${limit}`

    // already cached → skip
    const exists = await redis.exists(cacheKey)
    if (exists) return

    const skip = (nextPage - 1) * limit

    const { flags, totalCount } =
      await findProjectFlags(projectId, skip, limit)

    const result = {
      data: flags,
      page: nextPage,
      totalPages,
      totalCount,
    }

    // cache next page
    await redis.set(cacheKey, JSON.stringify(result), "EX", 300)

  } catch (err) {
    console.error("Prefetch failed:", err)
  }
}