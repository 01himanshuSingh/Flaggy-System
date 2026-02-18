import { Prisma } from "@prisma/client";

type Params = {
  tx: Prisma.TransactionClient; // always inside transaction
  featureFlagId: string;
  snapshot: any;
  actorId: string;
  reason?: string;
};

export async function createFeatureVersionSnapshot({
  tx,
  featureFlagId,
  snapshot,
  actorId,
  reason,
}: Params) {

  // 1️⃣ Get latest version
  const latestVersion = await tx.featureFlagVersion.findFirst({
    where: { featureFlagId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const newVersion = (latestVersion?.version || 0) + 1;

  // 2️⃣ Save new version snapshot
  const versionRecord = await tx.featureFlagVersion.create({
    data: {
      featureFlagId,
      version: newVersion,
      snapshot,
      changedById: actorId,
      reason: reason || "Update",
    },
  });

  return versionRecord;
}
