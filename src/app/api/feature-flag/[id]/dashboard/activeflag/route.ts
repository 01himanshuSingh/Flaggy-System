// /api/feature-flag/flag/[id]/dashboard/activeflag/route.ts
// fetching active flag data for a specific flag and environment

import { getActiveFlagService } from "@/lib/hook/server/getactivefeatureflagservice/services/getactiveflag.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ unwrap params
    const { id } = await context.params;

    const { searchParams } = new URL(req.url);
    const env = searchParams.get("env");

    console.log("ID:", id);
    console.log("ENV:", env);

    if (!env) {
      return Response.json(
        { error: "env is required" },
        { status: 400 }
      );
    }

    const data = await getActiveFlagService(id, env);

    return Response.json(
      { success: true, data },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Route Error:", error);

    return Response.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}