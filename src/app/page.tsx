import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/hook/server/useUser"
import { getUserFirstProject } from "@/lib/hook/server/FindFirstProject/projectFindFirst.service"
import NoProjectPage from "@/components/NoDataFound/NoProjectFound"


export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) redirect("/signin")

  const project = await getUserFirstProject(user.id)

  if (project) {
    redirect(`/dashboard/${project.id}/project`)
  }

  return redirect("/dashboard/createproject")
}