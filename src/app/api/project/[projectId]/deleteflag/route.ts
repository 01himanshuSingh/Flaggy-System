import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // unwrap params
    const { projectId } = await context.params;

    // 🔥 delete all flags for project
    const result = await prisma.featureFlag.deleteMany({
      where: {
        projectId,
      },
    });

    return NextResponse.json(
      {
        message: "All flags deleted successfully",
        deletedCount: result.count,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete all flags error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}