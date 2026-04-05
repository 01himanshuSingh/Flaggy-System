import redis from "@/lib/redis"
import { findProjectFlags } from "./findProjectFlag.repository"

export async function refreshFlagsCacheSafe(
  projectId: string,
  limit: number,
  cursor?: string
) {

  const cacheKey =
    `project:flags:${projectId}:cursor:${cursor ?? "start"}:limit:${limit}`

  const lockKey = `lock:${cacheKey}`

  let lockAcquired = false

  try {

    /* ---------------------------
       1️⃣ Check Cache TTL
    ---------------------------- */

    const ttl = await redis.ttl(cacheKey)

    // cache still fresh
    if (ttl > 60) return

    /* ---------------------------
       2️⃣ Acquire Redis Lock
    ---------------------------- */

    const lock = await redis.set(lockKey, "1", { nx: true, ex: 30 } as any)

    if (!lock) return

    lockAcquired = true

    /* ---------------------------
       3️⃣ Fetch Fresh Data
    ---------------------------- */

    const { flags, hasMore, nextCursor } =
      await findProjectFlags(projectId, limit, cursor)

    const result = {
      data: flags,
      nextCursor,
      hasMore,
    }

    /* ---------------------------
       4️⃣ Update Cache (PIPELINE)
    ---------------------------- */

    const pipeline = redis.pipeline()

    pipeline.set(
      cacheKey,
      JSON.stringify(result),
      "EX",
      300
    )

    // optional: store metadata
    // pipeline.set(
    //   `project:flags:${projectId}:meta`,
    //   JSON.stringify({
    //     lastRefresh: Date.now(),
    //   }),
    //   "EX",
    //   300
    // )

    await pipeline.exec()

  } catch (err) {

    console.error("refreshFlagsCacheSafe error:", err)

  } finally {

    /* ---------------------------
       5️⃣ Release Lock
    ---------------------------- */

    if (lockAcquired) {
      try {
        await redis.del(lockKey)
      } catch (err) {
        console.error("Lock release failed:", err)
      }
    }

  }
}