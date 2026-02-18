import { evaluateBulkFlags } from "@/lib/hook/server/featureFlag-services/evaluationFlagBulk";
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { NextResponse } from "next/server";
const DEFAULT_ENV =
  (process.env.APP_ENV as
    | "PRODUCTION"
    | "STAGING"
    | "DEVELOPMENT") || "DEVELOPMENT";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { projectId, keys } = body;

    if (!projectId || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const session = await getCurrentUser();

    const results = await evaluateBulkFlags({
      projectId,
      environmentType: DEFAULT_ENV,
      keys,
      context: {
        userId: session?.id,
      },
    });

    return NextResponse.json({ results });

  } catch (error) {
    console.error("Bulk evaluation error:", error);

    return NextResponse.json(
      { results: {} },
      { status: 200 }
    );
  }
}
