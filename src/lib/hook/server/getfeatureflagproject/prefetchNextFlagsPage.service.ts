import redis from "@/lib/redis"
import { findProjectFlags } from "./findProjectFlag.repository"

export async function prefetchNextFlagsPage(
  projectId: string,
  limit: number,
  cursor: string
) {
  try {

    const cacheKey = `project:flags:${projectId}:cursor:${cursor}:limit:${limit}`

    const cached = await redis.get(cacheKey)

    if (cached) return

    const { flags, hasMore, nextCursor } =
      await findProjectFlags(projectId, limit, cursor)

    if (!flags.length) return

    const result = {
      data: flags,
      nextCursor,
      hasMore,
    }

    const pipeline = redis.pipeline()

    pipeline.set(
      cacheKey,
      JSON.stringify(result),
      "EX",
      300
    )

    await pipeline.exec()

  } catch (err) {
    console.error("Prefetch failed:", err)
  }
}