import { prisma } from "@/lib/prisma"

export async function findUserFirstProject(userId: string) {
  return prisma.project.findFirst({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
    },
  })
}