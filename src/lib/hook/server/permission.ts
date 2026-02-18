import { prisma } from "@/lib/prisma";

/**
 * Ensures a user has a specific permission in a project.
 * Throws an error if permission is missing.
 */
export async function requirePermission(
  userId: string,
  projectId: string,
  permissionKey: string
) {
  const hasPermission = await prisma.projectMember.findFirst({
    where: {
      userId,
      projectId,
      role: {
        permissions: {
          some: {
            permission: {
              key: permissionKey,
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!hasPermission) {
    throw new PermissionError(
      `Missing permission: ${permissionKey}`
    );
  }
}

/**
 * Custom error to distinguish permission failures
 */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}
