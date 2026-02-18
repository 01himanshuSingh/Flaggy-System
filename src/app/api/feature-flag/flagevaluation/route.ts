import { evaluateFeatureFlag } from "@/lib/hook/server/featureFlag-services/evaluateFeatureFlag";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/hook/server/useUser";

const DEFAULT_ENV =
  (process.env.APP_ENV as
    | "PRODUCTION"
    | "STAGING"
    | "DEVELOPMENT") || "DEVELOPMENT";

async function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("EVAL_TIMEOUT")), ms)
    ),
  ]);
}

export async function GET(req: Request) {
  try {
    const start = Date.now();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const flagKey = searchParams.get("flagKey");

    if (!projectId || projectId.length < 3) {
      return NextResponse.json(
        { enabled: false, error: "Invalid projectId" },
        { status: 400 }
      );
    }

    if (!flagKey || flagKey.length < 2) {
      return NextResponse.json(
        { enabled: false, error: "Invalid flagKey" },
        { status: 400 }
      );
    }

    const session = await getCurrentUser();

    const enabled = await withTimeout(
      evaluateFeatureFlag({
        projectId,
        environmentType: DEFAULT_ENV,
        flagKey,
        context: {
          userId: session?.id,
        },
      }),
      1500
    );

    console.log("Evaluation took:", Date.now() - start, "ms");

    return NextResponse.json(
      {
        enabled,
        environment: DEFAULT_ENV,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Feature evaluation error:", error?.message || error);

    return NextResponse.json(
      {
        enabled: false,
        error:
          error?.message === "EVAL_TIMEOUT"
            ? "Evaluation timed out"
            : "Evaluation failed",
      },
      { status: 200 }
    );
  }
}
