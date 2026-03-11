import { getProjectFlags, ProjectFlagsResponse } from "@/lib/tanstackfun/getfeatureflagallbyProject"
import { useInfiniteQuery } from "@tanstack/react-query"



export function useProjectFlags({
  projectId,
  limit = 10,
}: {
  projectId?: string
  limit?: number
}) {

  return useInfiniteQuery<ProjectFlagsResponse>({
    queryKey: ["project-flags", projectId, limit],

    queryFn: ({ pageParam }) =>
      getProjectFlags({
        projectId: projectId!,
        limit,
        cursor: pageParam as string | undefined,
      }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,

    enabled: !!projectId,

    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    retry:1,
    refetchOnWindowFocus:false
  })
}