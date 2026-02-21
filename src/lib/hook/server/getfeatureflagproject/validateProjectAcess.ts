import redis from "@/lib/redis"
import { prisma } from "@/lib/prisma"

type AccessResult = {
  allowed: boolean
  role: any
}

export async function validateProjectAccess(
  userId: string,  
  projectId: string
): Promise<AccessResult> {

  const cacheKey =
    `project:access:${userId}:${projectId}`

  try {
    /* -------------------------
       1️⃣ Check Redis cache
    -------------------------- */
    const cached = await redis.get(cacheKey)

    if (cached) {
      return JSON.parse(cached)
    }

    /* -------------------------
       2️⃣ Check DB membership
    -------------------------- */
    const membership =
      await prisma.projectMember.findFirst({
        where: {
          userId,
          projectId,
        },
        select: {
          role: true,
        },
      })

    if (!membership) {
      throw new Error("Unauthorized project access")
    }

    const result: AccessResult = {
      allowed: true,
      role: membership.role,
    }

    /* -------------------------
       3️⃣ Cache result
    -------------------------- */
    await redis.set(
      cacheKey,
      JSON.stringify(result),
      "EX",
      300 // 5 minutes
    )

    return result

  } catch (err) {
    throw err
  }
}