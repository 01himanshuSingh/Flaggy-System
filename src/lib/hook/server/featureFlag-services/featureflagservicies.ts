// this is only for making the feature flag creation of flag 


import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";
import { FeatureAlreadyExistsError } from "../serverError/FeatureAlreadyExistsError";
import { invalidateProjectFlagsCache } from "../getfeatureflagproject/invalidateProjectFlagsCache";

export async function createFeatureFlag({
  projectId,
  actorId,
  key,
  description,
  valueType,
}: {
  projectId: string;
  actorId: string;
  key: string;
  description?: string;
  valueType: string;
}) {

function buildInitialSnapshot(feature:any, environments:any[]) {
  return {
    key: feature.key,
    description: feature.description,
    valueType: feature.valueType,
    environments: environments.map(e => ({
      environmentId: e.id,
      
      enabled: false,
    })),
  };
}



  return prisma.$transaction(async (tx) => {
    const existing = await tx.featureFlag.findFirst({
      where: { key, projectId },
    });

    if (existing) {
      throw new FeatureAlreadyExistsError();
    }

    const feature = await tx.featureFlag.create({
      data: { key, description, valueType, projectId , 
        createdById: actorId
      },
    });

    const environments = await tx.environment.findMany({
      where: { projectId },
    });

    if (environments.length === 0) {
      throw new Error("NO_ENVIRONMENTS_FOUND");
    }

    await tx.featureFlagEnvironment.createMany({
      data: environments.map(env => ({
        featureFlagId: feature.id,
        environmentId: env.id,
        rollout: 0,
        enabled: false
      })),
    });

    await tx.featureFlagVariation.create({
  data: {
    featureFlagId: feature.id,
    name: "control",
    value: false, // default OFF
    weight: 100,
  },
});

    const snapshot = buildInitialSnapshot(feature, environments);

    await tx.featureFlagVersion.create({
      data: {
        featureFlagId: feature.id,
        version: 1,
        snapshot,
        changedById: actorId,
        reason: "Initial creation",
      },
    });
await invalidateProjectFlagsCache(projectId);
    auditLog({
      event: "feature.create",
      actorId,
      entity: "feature",
      entityId: feature.id,
      metadata: { key, projectId },
    }).catch(() => {});

    return {
      id: feature.id,
      key: feature.key,
    };
  });
}
