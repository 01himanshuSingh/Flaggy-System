import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/hook/server/useUser"
import { validateProjectAccess } from "@/lib/hook/server/getfeatureflagproject/validateProjectAcess"
import { getProjectFlagsPaginated } from "@/lib/hook/server/getfeatureflagproject/getProjectFlagsPaginated.service"

export async function GET(req: NextRequest) {
  try {
    /* -------------------------
       1️⃣ Auth Check
    -------------------------- */
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* -------------------------
       2️⃣ Read Query Params
    -------------------------- */
    const { searchParams } = new URL(req.url)

    const projectId = searchParams.get("projectId")
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId required" },
        { status: 400 }
      )
    }

    /* -------------------------
       3️⃣ Validate Access
    -------------------------- */
    await validateProjectAccess(user.id, projectId)

    /* -------------------------
       4️⃣ Get Flags (Redis + DB)
    -------------------------- */
    const data = await getProjectFlagsPaginated(
      projectId,
      page,
      limit
    )

    /* -------------------------
       5️⃣ Return Response
    -------------------------- */
    return NextResponse.json(data)

  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}