import { prisma } from "@/lib/prisma";

type AuditParams = {
  actorId: string;
  featureFlagId: string;
  previousState: any;
  newState: any;
  reason?: string;
};

export async function logFeatureToggle({
  actorId,
  featureFlagId,
  previousState,
  newState,
  reason,
}: AuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        event: "feature.toggle",
        actorId,
        entity: "feature",
        entityId: featureFlagId,
        metadata: {
          previousState,
          newState,
          reason,
        },
      },
    });
  } catch (error) {
    console.error("Audit logging failed:", error);
  }
}
