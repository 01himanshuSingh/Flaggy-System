'use client'

import { Search } from 'lucide-react'

export default function SidebarSearch({ value, onChange }:{
    value: string
    onChange: (value: string) => void
}) {
  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  )
}
