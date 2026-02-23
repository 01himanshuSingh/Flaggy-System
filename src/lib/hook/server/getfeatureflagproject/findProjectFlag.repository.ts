import { prisma } from "@/lib/prisma"

export async function findProjectFlags(
  projectId: string,
  skip: number,
  limit: number
) {
  const [flags, totalCount] = await Promise.all([

    prisma.featureFlag.findMany({
      where: {
        projectId,
        archived: false,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,

      // 🔥 ONLY REQUIRED FIELDS
      select: {
        id: true,
        key: true,
        valueType: true,
        

        environments: {
          select: {
            enabled: true,

            environment: {
              select: {
                name: true,   // dev / prod / staging
              },
            },
          },
        },
      },
    }),

    prisma.featureFlag.count({
      where: {
        projectId,
        archived: false,
      },
    }),
  ])

  return {
    flags,
    totalCount,
  }
}