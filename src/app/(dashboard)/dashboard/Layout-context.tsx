'use client'

import { createContext, useContext, useState } from 'react'

type LayoutContextType = {
  isCollapsed: boolean
  toggleCollapse: () => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () =>
    setIsCollapsed((prev) => !prev)

  return (
    <LayoutContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayout must be used inside LayoutProvider')
  return ctx
}
