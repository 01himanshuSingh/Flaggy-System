import redis from "@/lib/redis";

export async function withRedisLock<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const exists = await redis.get(key);
  if (exists) {
    throw new Error("OPERATION_IN_PROGRESS");
  }

  await redis.set(key, "1", "EX", ttlSeconds);

  try {
    return await fn();
  } finally {
    await redis.del(key);
  }
}
