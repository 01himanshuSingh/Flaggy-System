'use client'
import SidebarItem from './SidebarItem'

export default function SidebarSection({
  section,
  pathname,
  isCollapsed,
  handleNavigate,
}:{
    section: any
    pathname: string
    isCollapsed: boolean
    handleNavigate: () => void
}) {
  return (
    <div>
      {!isCollapsed && (
        <p className="text-xs text-gray-500 uppercase mb-2 px-2">
          {section.label}
        </p>
      )}

      <ul className="space-y-1">
        {section.items.map((item:any) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href)

          return (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={isActive}
              isCollapsed={isCollapsed}
              onClick={handleNavigate}
            />
          )
        })}
      </ul>
    </div>
  )
}
