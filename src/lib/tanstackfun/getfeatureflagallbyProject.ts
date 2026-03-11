import { FeatureFlag } from "@/app/(dashboard)/dashboard/[projectId]/project/flagDashboard/lib/types"
import { toast } from "sonner"

export interface GetProjectFlagsParams {
  projectId: string
  limit?: number
  cursor?: string
}

export interface ProjectFlagsResponse {
  data: FeatureFlag[]
  nextCursor: string | null
  hasMore: boolean
}

export async function getProjectFlags({
  projectId,
  limit = 10,
  cursor,
}: {
  projectId: string
  limit?: number
  cursor?: string
}): Promise<ProjectFlagsResponse> {

  const params = new URLSearchParams({
    projectId,
    limit: limit.toString(),
  })

  if (cursor) {
    params.append("cursor", cursor)
  }

  const res = await fetch(
    `/api/feature-flag/getallflagbyprojectId?${params.toString()}`,
    {
      credentials: "include",
    }
  )

  if (!res.ok) {
    const message = await res.text()
    toast.error(message)
    throw new Error(message)
  }

  return res.json()
}