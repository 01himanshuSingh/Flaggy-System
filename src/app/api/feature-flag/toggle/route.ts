import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { withRedisLock } from "@/lib/feature/togglefeatures/redislocktoggle";
import { invalidateFeatureCache } from "@/lib/feature/cacheInvalidation";
import { resetEvaluationMetrics } from "@/lib/feature/togglefeatures/resetEvaluationToggleMetrics";
import { logFeatureToggle } from "@/lib/feature/togglefeatures/auditlogtoggle";
import { toggleFeatureFlag } from "@/lib/feature/togglefeatures/togglefeatureFlag";

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      featureFlagId,
      projectId,
      flagKey,
      environmentType,
      enabled,
      rollout,
      reason,
    } = body;

    if (!featureFlagId || !environmentType) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    const lockKey = `feature:toggle:${featureFlagId}`;

    const result = await withRedisLock(lockKey, 10, async () => {

      // 1️⃣ Toggle flag
      const updated = await toggleFeatureFlag({
        featureFlagId,
        environmentType,
        enabled,
        rollout,
        actorId: session.id,
        reason,
      });

      // 2️⃣ Invalidate cache
      await invalidateFeatureCache(projectId, flagKey);

      // 3️⃣ Reset metrics (optional but real-world)
      await resetEvaluationMetrics(projectId, flagKey);

      // 4️⃣ Audit log
      await logFeatureToggle({
        actorId: session.id,
        featureFlagId,
        previousState: null, // optional enhancement
        newState: updated,
        reason,
      });

      return updated;
    });

    return NextResponse.json({
      message: "Feature updated successfully",
      data: result,
    });

  } catch (error: any) {
    console.error("Toggle error:", error);

    if (error.message === "OPERATION_IN_PROGRESS") {
      return NextResponse.json(
        { message: "Another update in progress" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
