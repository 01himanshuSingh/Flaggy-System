import redis from "@/lib/redis"
import { findProjectFlags } from "./findProjectFlag.repository"

export async function refreshFlagsCacheSafe(
  projectId: string,
  page: number,
  limit: number
) {
  const cacheKey =
    `project:flags:${projectId}:page:${page}:limit:${limit}`

  const lockKey = `lock:${cacheKey}`

  let lockAcquired = false

  try {
    /* ---------------------------
       1️⃣ Check TTL
    ---------------------------- */
    let ttl = -1

    try {
      ttl = await redis.ttl(cacheKey)
    } catch (err) {
      console.error("TTL check failed:", err)
      return
    }

    // cache still fresh → skip refresh
    if (ttl > 60) return

    /* ---------------------------
       2️⃣ Acquire Redis Lock
    ---------------------------- */
    try {
      const lock = await redis.set(
        lockKey,
        "1",
        "NX",   // only if not exists
        "EX",   // auto expire
        30
      )

      if (!lock) return // another worker refreshing

      lockAcquired = true
    } catch (err) {
      console.error("Lock acquire failed:", err)
      return
    }

    /* ---------------------------
       3️⃣ Fetch Fresh DB Data
    ---------------------------- */
    const skip = (page - 1) * limit

    const { flags, totalCount } =
      await findProjectFlags(projectId, skip, limit)

    const totalPages = Math.ceil(totalCount / limit)

    const result = {
      data: flags,
      page,
      totalPages,
      totalCount,
    }

    /* ---------------------------
       4️⃣ Update Cache
    ---------------------------- */
    await redis.set(
      cacheKey,
      JSON.stringify(result),
      "EX",
      300
    )

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