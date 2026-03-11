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
    const cursor = searchParams.get("cursor") || undefined
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
       4️⃣ Fetch Flags
    -------------------------- */

    const data = await getProjectFlagsPaginated(
      projectId,
      limit,
      cursor
    )

    /* -------------------------
       5️⃣ Response
    -------------------------- */

    return NextResponse.json(data)

  } catch (error: any) {

    console.error("Feature flag fetch error:", error)

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}