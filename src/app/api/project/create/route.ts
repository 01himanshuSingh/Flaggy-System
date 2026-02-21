import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { auditLog } from "@/lib/audit";
import { invalidateUserProjectsCache } from "@/lib/hook/server/createprojectcacheInvalidation";

type CreateProjectBody = {
  name: string;
};
const DEFAULT_ENVIRONMENTS = [  "PRODUCTION",
  "STAGING",
  "DEVELOPMENT"];

export async function POST(req: Request) {
  try {
    /* ---------------- AUTH ---------------- */
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session?.id;

    /* ---------------- BODY ---------------- */
    const body = (await req.json()) as CreateProjectBody;

    if (!body.name || body.name.trim().length < 3) {
      return NextResponse.json(
        { message: "Project name must be at least 3 characters" },
        { status: 400 }
      );
    }

    const projectName = body.name.trim();

    /* ---------------- REDIS DUPLICATE GUARD ---------------- */
    const redisKey = `project:create:${userId}:${projectName}`;

    const alreadyCreating = await redis.get(redisKey);
    if (alreadyCreating) {
      return NextResponse.json(
        { message: "Project creation already in progress" },
        { status: 409 }
      );
    }

    // lock for 10 seconds
    await redis.set(redisKey, "1",  "EX", 10 );

    /* ---------------- DB TRANSACTION ---------------- */
    const result = await prisma.$transaction(async (tx) => {
      /* 1️⃣ Check project name uniqueness per user */
      const existingProject = await tx.project.findFirst({
        where: {
          name: projectName,
          ownerId: userId,
        },
      });

      if (existingProject) {
        throw new Error("PROJECT_EXISTS");
      }

      /* 2️⃣ Create project */
      const project = await tx.project.create({
        data: {
          name: projectName,
          ownerId: userId,
        },
      });

      /* 3️⃣ Create ADMIN role */
      const adminRole = await tx.projectRole.create({
        data: {
          name: "ADMIN",
          projectId: project.id,
        },
      });

      /* 4️⃣ Fetch all permissions */
      const permissions = await tx.permission.findMany();

      if (permissions.length === 0) {
        throw new Error("NO_PERMISSIONS_FOUND");
      }

      /* 5️⃣ Map ADMIN role → ALL permissions */
      await tx.projectRolePermission.createMany({
        data: permissions.map((p) => ({
          roleId: adminRole.id,
          permissionId: p.id,
        })),
      });


      await tx.environment.createMany({
        data: DEFAULT_ENVIRONMENTS.map((env:any) => ({
          name: env.toLowerCase(),
          type: env,
          projectId: project.id,
        })),
        skipDuplicates: true,
      });

      /* 6️⃣ Add creator as Project Member (ADMIN) */
      await tx.projectMember.create({
        data: {
          userId,
          projectId: project.id,
          roleId: adminRole.id,
        },
      });
      
      await invalidateUserProjectsCache(userId)
      return {
        projectId: project.id,
        projectName: project.name,
        role: adminRole.name,
        environments: DEFAULT_ENVIRONMENTS
      };
    });

    await auditLog({
      event: "PROJECT_CREATED",
      actorId:userId,
      entity:"Project",
      entityId:result.projectId,
      metadata:{
        projectName:result.projectName,
        roel:result.role,
        environments:result.environments
        
      }
    })

    /* ---------------- CLEAN REDIS ---------------- */
    await redis.del(redisKey);

    return NextResponse.json(
      {
        message: "Project created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create project error:", error);

    if (error.message === "PROJECT_EXISTS") {
      return NextResponse.json(
        { message: "Project with this name already exists" },
        { status: 409 }
      );
    }

    if (error.message === "NO_PERMISSIONS_FOUND") {
      return NextResponse.json(
        { message: "Permissions not seeded" },
        { status: 500 } 
      );
    }

    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}

