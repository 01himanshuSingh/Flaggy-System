import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ToggleParams = {
  featureFlagId: string;
  environmentType: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  enabled: boolean;
  rollout?: number | null;
  actorId: string;
  reason?: string;
};

export async function toggleFeatureFlag({
  featureFlagId,
  environmentType,
  enabled,
  rollout,
  actorId,
  reason,
}: ToggleParams) {
  return prisma.$transaction(async (tx) => {

    /* 1️⃣ Fetch feature with environments */
    const feature = await tx.featureFlag.findUnique({
      where: { id: featureFlagId },
      include: {
        environments: {
          include: { environment: true },
        },
      },
    });

    if (!feature) {
  throw new Error("FEATURE_FLAG_NOT_FOUND");
}


    /* 2️⃣ Find environment config */
    const envConfig = feature.environments.find(
      (e) => e.environment.type === environmentType
    );

   
if (!envConfig) {
  throw new Error("ENVIRONMENT_CONFIG_NOT_FOUND");
}
    /* 3️⃣ Update environment state */
    const updatedEnv = await tx.featureFlagEnvironment.update({
      where: { id: envConfig.id },
      data: {
        enabled,
        rollout: rollout ?? envConfig.rollout,
      },
    });

    /* 4️⃣ Update main feature metadata */
    await tx.featureFlag.update({
      where: { id: featureFlagId },
      data: {
        updatedAt: new Date(), // signals change
      },
    });

    /* 5️⃣ Get latest version */
    const latestVersion = await tx.featureFlagVersion.findFirst({
      where: { featureFlagId },
      orderBy: { version: "desc" },
    });

    const newVersion = (latestVersion?.version || 0) + 1;

    /* 6️⃣ Create version snapshot */
    await tx.featureFlagVersion.create({
      data: {
        featureFlagId,
        version: newVersion,
        snapshot: {
          environment: environmentType,
          enabled: updatedEnv.enabled,
          rollout: updatedEnv.rollout,
        },
        changedById: actorId,
        reason: reason || "Toggle update",
      },
    });

    /* 7️⃣ Return clean response */
    return {
      featureFlagId,
      environment: environmentType,
      enabled: updatedEnv.enabled,
      rollout: updatedEnv.rollout,
      version: newVersion,
    };
  });
}
