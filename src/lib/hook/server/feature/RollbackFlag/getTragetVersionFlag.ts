import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";

export class VersionNotFoundError extends Error {
  constructor() {
    super("Version not found");
    this.name = "VersionNotFoundError";
  }
}

type Params = {
  featureFlagId: string;
  version: number;
};

export async function getFeatureVersion({
  featureFlagId,
  version,
}: Params) {

  const cacheKey = `feature:version:${featureFlagId}:${version}`;

  /* 1️⃣ Check Redis cache */
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  /* 2️⃣ Fetch from DB */
  const record = await prisma.featureFlagVersion.findFirst({
    where: {
      featureFlagId,
      version,
    },
    select: {
      id: true,
      featureFlagId: true,
      version: true,
      snapshot: true,
      createdAt: true,
    },
  });

  if (!record) {
    throw new VersionNotFoundError();
  }

  /* 3️⃣ Cache result */
  await redis.set(
    cacheKey,
    JSON.stringify(record),
    "EX",
    300 // cache for 5 minutes
  );

  /* 4️⃣ Return */
  return record;
}
