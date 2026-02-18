import { prisma } from "@/lib/prisma"

export async function findUserProjects(
  userId: string,
  skip: number,
  take: number
) {
  const [projects, totalCount] = await Promise.all([
   prisma.project.findMany({
  where: {
    OR: [
      { ownerId: userId },   // owner
      {
        members: {
          some: {
            userId: userId   // member
          }
        }
      }
    ]
  },
  orderBy: { createdAt: "desc" },
  skip,
  take
}),
    prisma.project.count({
   where: {
    OR: [
      { ownerId: userId },   // owner
      {
        members: {
          some: {
            userId: userId   // member
          }
        }
      }
    ]
  },
    }),
  ])

  return { projects, totalCount }
}
