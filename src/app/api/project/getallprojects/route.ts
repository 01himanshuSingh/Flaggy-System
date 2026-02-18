import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/hook/server/useUser";
import { getUserProjectsPaginated } from "@/lib/hook/server/projectswitcherApiFun/project.service";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)

    const data = await getUserProjectsPaginated(
      user.id,
      page,
      limit
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
