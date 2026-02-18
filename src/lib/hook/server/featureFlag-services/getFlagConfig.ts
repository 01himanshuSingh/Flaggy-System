import { prisma } from "@/lib/prisma";

export async function getFlagConfig(
  projectId: string,
  flagKey: string,
  environmentType: string
) {
  const feature = await prisma.featureFlag.findFirst({
    where: {
      projectId,
      key: flagKey,
      archived: false,
    },
    select: {
      environments: {
        select: {
          enabled: true,
          rollout: true,
          environment: {
            select: { type: true },
          },
        },
      },
    },
  });

  if (!feature) return null;

  const envConfig = feature.environments.find(
    (e) => e.environment.type === environmentType
  );

  if (!envConfig) return null;

  return {
    enabled: envConfig.enabled,
    rollout: envConfig.rollout,
  };
}
