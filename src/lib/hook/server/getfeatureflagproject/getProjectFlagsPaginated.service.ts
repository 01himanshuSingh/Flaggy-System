import redis from "@/lib/redis"
import { findProjectFlags } from "./findProjectFlag.repository"
import { prefetchNextFlagsPage } from "./prefetchNextFlagsPage.service"
import { refreshFlagsCacheSafe } from "./refreshProjectFlagsCacheSafe"

export async function getProjectFlagsPaginated(
  projectId: string,
  limit: number,
  cursor?: string
) {
  const cacheKey = `project:flags:${projectId}:cursor:${cursor ?? "start"}:limit:${limit}`

  /* -------------------------
     1️⃣ Redis Cache Check
  -------------------------- */

  const cached = await redis.get(cacheKey)

  if (cached) {
    const parsed = JSON.parse(cached)
       void refreshFlagsCacheSafe(
      projectId,
      limit,
      cursor
    )

    return parsed

  }

  /* -------------------------
     2️⃣ Fetch from DB
  -------------------------- */

  const { flags, hasMore, nextCursor } =
    await findProjectFlags(projectId, limit, cursor)

  const result = {
    data: flags,
    nextCursor,
    hasMore,
  }

  /* -------------------------
     3️⃣ Cache Result (Pipeline)
  -------------------------- */

  const pipeline = redis.pipeline()

  pipeline.set(
    cacheKey,
    JSON.stringify(result),
    "EX",
    300
  )

  await pipeline.exec()

  /* -------------------------
     4️⃣ Prefetch Next Page
  -------------------------- */

  if (hasMore && nextCursor) {
    void prefetchNextFlagsPage(
      projectId,
      limit,
      nextCursor
    )
  }

  return result
}