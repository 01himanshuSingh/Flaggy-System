import { prisma } from "@/lib/prisma"

export async function findProjectFlags(
  projectId: string,
  limit: number,
  cursor?: string
) {

  const flags = await prisma.featureFlag.findMany({
    where: {
      projectId,
    },

    orderBy: {
      createdAt: "desc",
    },

    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // skip the cursor itself
    }),

    take: limit + 1,

    select: {
      id: true,
      key: true,
      valueType: true,
      lifecycle: true,
      description: true,
      createdAt: true,
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  })

  const hasMore = flags.length > limit

  const data = hasMore ? flags.slice(0, limit) : flags

  const nextCursor = hasMore ? data[data.length - 1].id : null

  return {
    flags: data,
    hasMore,
    nextCursor,
  }
}