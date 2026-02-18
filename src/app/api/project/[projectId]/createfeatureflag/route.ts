import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { withRedisLock } from "@/lib/hook/server/redislock";
import { createFeatureFlag } from "@/lib/hook/server/featureFlag-services/featureflagservicies";

export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ FIX: unwrap params properly
    const { projectId } = await context.params;

    const body = await req.json();
    const { key, description, valueType } = body;

    if (!key || !valueType) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    const redisKey = `feature:create:${projectId}:${key}`;

    const feature = await withRedisLock(redisKey, 10, () =>
      createFeatureFlag({
        projectId, // ✅ now correctly defined
        actorId: session.id,
        key,
        description,
        valueType,
      })
    );

    return NextResponse.json(
      {
        message: "Feature flag created",
        featureId: feature.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create feature flag error:", error);

    if (error.message === "FEATURE_EXISTS") {
      return NextResponse.json(
        { message: "Feature already exists" },
        { status: 409 }
      );
    }

    if (error.message === "OPERATION_IN_PROGRESS") {
      return NextResponse.json(
        { message: "Feature creation in progress" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
