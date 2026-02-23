import { ProjectProvider } from "@/components/dashboard-Component/projectswitcher/ProjectProvider"
import DashboardShell from "./DashboardShell"
import { LayoutProvider } from "./Layout-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProjectProvider>
      <LayoutProvider>
        <DashboardShell>{children}</DashboardShell>
      </LayoutProvider>
    </ProjectProvider>
  )
}
