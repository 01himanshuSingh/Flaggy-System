import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";

export class FeatureNotFoundError extends Error {
  constructor() {
    super("Feature flag not found");
    this.name = "FeatureNotFoundError";
  }
}

export async function getFeatureFlagWithEnvironments(
  featureFlagId: string
) {

  const cacheKey = `feature:config:${featureFlagId}`;

  /* 1️⃣ Check Redis cache */
  const cached = await redis.get(cacheKey); 

  if (cached) {
    return JSON.parse(cached);
  }

  /* 2️⃣ Fetch from DB */
  const feature = await prisma.featureFlag.findUnique({
    where: { id: featureFlagId },
    select: {
      id: true,
      key: true,
      projectId: true,
      archived: true,
      updatedAt: true,
      environments: {
        select: {
          id: true,
          enabled: true,
          rollout: true,
          rules: true,
          schedule: true,
          environment: {
            select: {
              id: true,
              type: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!feature) {
    throw new FeatureNotFoundError();
  }

  /* 3️⃣ Cache result */
  await redis.set(
    cacheKey,
    JSON.stringify(feature),
    "EX",
    60 // 1 minute TTL
  );

  /* 4️⃣ Return */
  return feature;
}
