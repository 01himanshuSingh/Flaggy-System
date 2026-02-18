'use client'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  item: any
  isActive: boolean
  isCollapsed: boolean
  onClick?: () => void
}

const SidebarItem = React.memo(function SidebarItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: Props) {
  const Icon = item.icon

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center rounded-lg transition-colors",
          isCollapsed ? "justify-center py-2" : "px-3 py-2 gap-3",
          isActive
            ? "bg-teal-50 text-teal-600"
            : "text-gray-700 hover:bg-gray-50"
        )}
      >
        <Icon size={20} />
        {!isCollapsed && (
          <span className="text-sm flex-1">{item.label}</span>
        )}
      </Link>
    </li>
  )
})

export default SidebarItem
