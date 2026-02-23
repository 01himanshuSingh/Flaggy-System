import redis from "@/lib/redis"
import { findUserFirstProject } from "./findforstProject.repository"

export async function getUserFirstProject(userId: string) {
  const cacheKey = `user:first-project:${userId}`

  /* -------------------------
     1️⃣ Check Redis
  -------------------------- */
  const cached = await redis.get(cacheKey)

  if (cached) {
    return JSON.parse(cached)
  }

  /* -------------------------
     2️⃣ DB fallback
  -------------------------- */
  const project = await findUserFirstProject(userId)

  /* -------------------------
     3️⃣ Cache result
  -------------------------- */
  if (project) {
    await redis.set(
      cacheKey,
      JSON.stringify(project),
      "EX",
      300 // 5 min
    )
  }

  return project
}