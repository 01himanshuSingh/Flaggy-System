'use client'

import Sidebar from '@/components/dashboard-Component/sidebar/Sidebar'
import { Navbar } from '@/components/dashboard-Component/Navbar'
import { cn } from '@/lib/utils'
import { useLayout } from './Layout-context'

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const { isCollapsed } = useLayout()

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          isCollapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        <Navbar />

        <main className="flex-1 overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  )
}
