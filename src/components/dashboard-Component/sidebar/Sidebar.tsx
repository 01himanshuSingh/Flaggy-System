'use client'

import { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronLeft, Settings, LogOut } from 'lucide-react'

import SidebarSection from './SidebarSection'
import SidebarSearch from './SidebarSearch'
import { cn } from '@/lib/utils'
import { menuItems } from './MenuData'
import dynamic from 'next/dynamic'
import ProjectSwitcher from '@/components/dashboard-Component/projectswitcher/ProjectSwitcher'

export default function Sidebar() {
  const pathname = usePathname()
   dynamic(
  () => import("@/components/dashboard-Component/projectswitcher/ProjectSwitcher"),
  {
    loading: () => (
      <div className="px-3 py-2 text-sm text-gray-400">
        Loading projects...
      </div>
    ),
    ssr: false,
  }
)

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // optimized filtering
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery) return menuItems

    return menuItems.map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
  }, [searchQuery])

  const handleNavigate = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white border"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 z-40",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">

          {/* Desktop Collapse Toggle */}
          <div className="flex justify-end p-2">
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              <ChevronLeft
                size={20}
                className={cn(isCollapsed && "rotate-180")}
              />
            </button>
          </div>

          {/* Search */}
          {!isCollapsed && (
            <SidebarSearch
              value={searchQuery}
              onChange={setSearchQuery}
            />
          )}
           <ProjectSwitcher/>
          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
            {filteredMenuItems.map((section) => (
              <SidebarSection
                key={section.label}
                section={section}
                pathname={pathname}
                isCollapsed={isCollapsed}
                handleNavigate={handleNavigate}
              />
            ))}
          </nav>

          {/* Bottom */}
          <div className="border-t p-3 space-y-2">
            <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
              <Settings size={20} /> {!isCollapsed && "Settings"}
            </button>

            <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
              <LogOut size={20} /> {!isCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

