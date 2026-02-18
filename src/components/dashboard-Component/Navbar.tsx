'use client'

import { ChevronRight, Settings, Bell, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface NavbarProps {
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  userName?: string
  userImage?: string
}

export function Navbar({
  breadcrumbs = [{ label: 'Dashboard' }],
  userName = 'Mohammad Shakib',
  userImage = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammad',
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 w-full bg-white border-b border-gray-200">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
                <a
                  href={crumb.href || '#'}
                  className={`text-sm ${
                    index === breadcrumbs.length - 1
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {crumb.label}
                </a>
              </div>
            ))}
          </nav>
        </div>

        {/* Right Section - User Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Premium</p>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback>{userName.split(' ')[0][0]}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings size={16} className="mr-2" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <LogOut size={16} className="mr-2" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
