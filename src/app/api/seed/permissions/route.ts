import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const permissions = [
      // project
      { key: "project:update", description: "Update project settings" },
      { key: "project:invite", description: "Invite members" },
      { key: "project:delete", description: "Delete project" },

      // environment
      { key: "env:create", description: "Create environment" },
      { key: "env:delete", description: "Delete environment" },

      // flags
      { key: "flag:create", description: "Create feature flag" },
      { key: "flag:update", description: "Update feature flag" },
      { key: "flag:toggle", description: "Toggle feature flag" },
      { key: "flag:rollback", description: "Rollback feature flag" },
      { key: "flag:delete", description: "Delete feature flag" },
    ];

    for (const perm of permissions) {
      await prisma.permission.upsert({
        where: { key: perm.key },
        update: {},
        create: perm,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Permissions seeded successfully",
      count: permissions.length,
    });
  } catch (error) {
    console.error("Seed error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to seed permissions" },
      { status: 500 }
    );
  }
}
