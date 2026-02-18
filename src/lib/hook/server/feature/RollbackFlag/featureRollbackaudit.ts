import { prisma } from "@/lib/prisma";

type RollbackAuditParams = {
  actorId: string;
  featureFlagId: string;
  restoredVersion: number;
  projectId?: string;
  reason?: string;
};

export async function logFeatureRollback({
  actorId,
  featureFlagId,
  restoredVersion,
  projectId,
  reason,
}: RollbackAuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        event: "feature.rollback",
        actorId,
        entity: "featureFlag",
        entityId: featureFlagId,
        metadata: {
          restoredVersion,
          projectId,
          reason,
        },
      },
    });
  } catch (error) {
    // Audit should never break main flow
    console.error("Audit log failed:", error);
  }
}
