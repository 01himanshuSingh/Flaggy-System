import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";


// default environments
const DEFAULT_ENVIRONMENTS = ["dev", "staging", "prod"];

export async function POST(req: Request) {
  try {
    // 1️⃣ Auth
    const cookieStore =  await cookies();
    const userId = cookieStore.get("auth_user")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Input
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    // 3️⃣ Transaction: project + environments
    const result = await prisma.$transaction(async (tx) => {
      // create project
      const project = await tx.project.create({
        data: {
          name,
          createdBy: userId,
        },
      });

      // create environments
      await tx.environment.createMany({
        data: DEFAULT_ENVIRONMENTS.map((env) => ({
          name: env,
          projectId: project.id,
        })),
      });

      return project;
    });

    return NextResponse.json(
      {
        message: "Project created with environments",
        project: {
          id: result.id,
          name: result.name,
        },
        environments: DEFAULT_ENVIRONMENTS,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Project creation error:", error);

    // handle unique constraint violation nicely
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Environment already exists for this project" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
