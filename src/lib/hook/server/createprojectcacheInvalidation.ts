import redis from "@/lib/redis"

export async function invalidateUserProjectsCache(userId: string) {
  const pattern = `user:projects:${userId}:*`

  const keys = await redis.keys(pattern)

  if (keys.length) {
    await redis.del(...keys)
  }
}
