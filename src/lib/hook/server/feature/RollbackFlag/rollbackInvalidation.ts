import redis from "@/lib/redis";

export async function invalidateFeatureCache(flagId: string) {
  const configKey = `feature:config:${flagId}`;
  const versionPattern = `feature:version:${flagId}:*`;

  // delete main config
  await redis.del(configKey);

  // delete all version caches
  const keys = await redis.keys(versionPattern);
  if (keys.length > 0) {
    await redis.del(keys);
  }
}
