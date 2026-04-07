import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { prisma } from "@/lib/prisma";
import { validateRollbackInput } from "@/lib/hook/server/feature/RollbackFlag/validateRollbackFlag";
import { withRedisLock } from "@/lib/hook/server/feature/togglefeatures/redislocktoggle";
import { getFeatureFlagWithEnvironments } from "@/lib/hook/server/feature/RollbackFlag/getfeatureflagwithEnvironment";
import { requirePermission } from "@/lib/hook/server/permission";
import { getFeatureVersion } from "@/lib/hook/server/feature/RollbackFlag/getTragetVersionFlag";
import { restoreFeatureEnvironmentConfig } from "@/lib/hook/server/feature/RollbackFlag/restorefeatureEnvironment";
import { createFeatureVersionSnapshot } from "@/lib/hook/server/feature/RollbackFlag/createVersionSnapShot";
import { logFeatureRollback } from "@/lib/hook/server/feature/RollbackFlag/featureRollbackaudit";
import { invalidateFeatureCache } from "@/lib/hook/server/feature/RollbackFlag/rollbackInvalidation";
import { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;
export async function POST(req: Request) {
  try {
    /* ---------------- AUTH ---------------- */
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------------- INPUT ---------------- */
    const body = await req.json();
    const validated = validateRollbackInput(body);

    const {
      featureFlagId,
      version,
      reason,
    } = validated;

    /* ---------------- LOCK ---------------- */
    const lockKey = `rollback:${featureFlagId}`;

    const result = await withRedisLock(lockKey, 10, async () => {

      /* ---------------- FETCH FEATURE ---------------- */
      const feature = await getFeatureFlagWithEnvironments(featureFlagId);

      /* ---------------- PERMISSION ---------------- */
     await requirePermission(
  session.id,
  feature.projectId,
  "flag:rollback"
);


      /* ---------------- FETCH VERSION ---------------- */
      const versionRecord = await getFeatureVersion({
        featureFlagId,
        version,
      });

      const snapshot = versionRecord.snapshot;

      /* ---------------- RESTORE STATE ---------------- */
      await prisma.$transaction(async (tx:Tx) => {

        await restoreFeatureEnvironmentConfig(
          tx,
          featureFlagId,
          snapshot
        );

        /* ---------------- CREATE NEW VERSION ---------------- */
        await createFeatureVersionSnapshot({
          tx,
          featureFlagId,
          snapshot,
          actorId: session.id,
          reason: reason || "Rollback",
        });
      });

      /* ---------------- CACHE INVALIDATION ---------------- */
          
   await invalidateFeatureCache(featureFlagId);

      /* ---------------- AUDIT ---------------- */
      await logFeatureRollback({
        actorId: session.id,
        featureFlagId,
        restoredVersion: version,
        projectId: feature.projectId,
        reason,
      });

      return {
        featureFlagId,
        restoredVersion: version,
      };
    });

    return NextResponse.json(
      {
        message: "Rollback successful",
        data: result,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Rollback error:", error);

    if (error.message === "OPERATION_IN_PROGRESS") {
      return NextResponse.json(
        { message: "Rollback already in progress" },
        { status: 409 }
      );
    }

    if (error.name === "PermissionError") {
      return NextResponse.json(
        { message: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Rollback failed" },
      { status: 500 }
    );
  }
}
