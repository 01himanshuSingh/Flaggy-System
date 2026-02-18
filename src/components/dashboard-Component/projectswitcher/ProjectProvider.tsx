'use client'

import { createContext, useContext, useState, useEffect } from "react"

type Project = {
  id: string
  name: string
}

type ProjectContextType = {
  selectedProject: Project | null
  setSelectedProject: (project: Project) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null)

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("selectedProject")
    if (saved) setSelectedProjectState(JSON.parse(saved))
  }, [])

  const setSelectedProject = (project: Project) => {
    setSelectedProjectState(project)
    localStorage.setItem("selectedProject", JSON.stringify(project))
  }

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error("useProjectContext must be used inside ProjectProvider")
  return ctx
}
