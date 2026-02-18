import { Prisma } from "@prisma/client";

type SnapshotEnv = {
  environmentType: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  enabled: boolean;
  rollout?: number | null;
};

type Snapshot = {
  environments: SnapshotEnv[];
};

/**
 * Restores environment configuration from snapshot
 * Must be called inside a transaction
 */
export async function restoreFeatureEnvironmentConfig(
  tx: Prisma.TransactionClient,
  featureFlagId: string,
  snapshot: Snapshot
) {
  if (!snapshot?.environments || snapshot.environments.length === 0) {
    throw new Error("INVALID_SNAPSHOT");
  }

  // 1️⃣ Fetch existing environment mappings
  const existingConfigs = await tx.featureFlagEnvironment.findMany({
    where: { featureFlagId },
    include: {
      environment: {
        select: { type: true },
      },
    },
  });

  if (!existingConfigs.length) {
    throw new Error("NO_ENV_CONFIG_FOUND");
  }

  // 2️⃣ Map snapshot environments
  const updates = [];

  for (const envConfig of existingConfigs) {
    const snapEnv = snapshot.environments.find(
      (s) => s.environmentType === envConfig.environment.type
    );

    // If snapshot doesn't include this environment, skip safely
    if (!snapEnv) continue;

    updates.push(
      tx.featureFlagEnvironment.update({
        where: { id: envConfig.id },
        data: {
          enabled: snapEnv.enabled,
          rollout: snapEnv.rollout ?? null,
        },
      })
    );
  }

  // 3️⃣ Execute all updates in parallel inside transaction
  await Promise.all(updates);
}
