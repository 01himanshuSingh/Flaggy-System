import redis from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function getFlagVersion(
  projectId: string,
  flagKey: string
): Promise<number> {
  const versionKey = `feature:version:${projectId}:${flagKey}`;

  // 1️⃣ Redis first
  const cached = await redis.get(versionKey);
  if (cached) return Number(cached);

  // 2️⃣ DB fallback
  const feature = await prisma.featureFlag.findFirst({
    where: { projectId, key: flagKey },
    select: {
      versions: {
        orderBy: { version: "desc" },
        take: 1,
        select: { version: true },
      },
    },
  });

  const version = feature?.versions[0]?.version || 1;

  // 3️⃣ Cache version
  await redis.set(versionKey, version, "EX", 60);

  return version;
}
