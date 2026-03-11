import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { withRedisLock } from "@/lib/hook/server/feature/togglefeatures/redislocktoggle";
import { toggleFeatureFlag } from "@/lib/hook/server/feature/togglefeatures/togglefeatureFlag";
import { invalidateFeatureCache } from "@/lib/hook/server/feature/cacheInvalidation";
import { resetEvaluationMetrics } from "@/lib/hook/server/feature/togglefeatures/resetEvaluationToggleMetrics";
import { logFeatureToggle } from "@/lib/hook/server/feature/togglefeatures/auditlogtoggle";

import { z } from "zod";

const toggleSchema = z.object({
  featureFlagId: z.string().uuid(),
  projectId: z.string(),
  flagKey: z.string(),
  environmentType: z.enum(["PRODUCTION"
  ,"STAGING",
  "DEVELOPMENT"]),
  enabled: z.boolean(),
  rollout: z.number().min(0).max(100).nullable(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
const body = await req.json();

const parsed = toggleSchema.safeParse(body);

if (!parsed.success) {
  return NextResponse.json(
    { message: "Invalid payload", errors: parsed.error.flatten() },
    { status: 400 }
  );
}

const {
  featureFlagId,
  projectId,
  flagKey,
  environmentType,
  enabled,
  rollout,
  reason,
} = parsed.data;

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
