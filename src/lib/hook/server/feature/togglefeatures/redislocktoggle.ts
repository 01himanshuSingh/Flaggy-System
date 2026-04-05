import redis from "@/lib/redis";

export async function withRedisLock<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const lockKey = `lock:${key}`;

 const acquired = await redis.set(
  lockKey,
  "1",
  { ex: ttlSeconds, nx: true } as any
);
  if (!acquired) {
    throw new Error("OPERATION_IN_PROGRESS");
  }

  try {
    return await fn();
  } finally {
    await redis.del(lockKey);
  }
}
