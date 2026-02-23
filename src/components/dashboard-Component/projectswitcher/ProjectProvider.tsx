'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react"

import { useParams } from "next/navigation"
import { useProjects } from "@/lib/hook/useproject"

type Project = {
  id: string
  name: string
}

type ProjectContextType = {
  selectedProject: Project | null
  setSelectedProject: (project: Project) => void
}

const ProjectContext =
  createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { projects = [] } = useProjects()
  const params = useParams()

  const projectIdFromUrl = params?.projectId as string

  const [selectedProject, setSelectedProjectState] =
    useState<Project | null>(null)

  /* ----------------------------------------
     MAIN LOGIC (SYSTEM DESIGN LEVEL)
  ----------------------------------------- */
  useEffect(() => {
    if (!projects.length) return

    // ⭐ PRIORITY 1 → URL (source of truth)
    if (projectIdFromUrl) {
      const fromUrl = projects.find(
        p => p.id === projectIdFromUrl
      )

      if (fromUrl) {
        setSelectedProjectState(fromUrl)
        localStorage.setItem(
          "selectedProjectId",
          fromUrl.id
        )
        return
      }
    }

    // ⭐ PRIORITY 2 → localStorage
    const savedId =
      localStorage.getItem("selectedProjectId")

    const existing = projects.find(
      p => p.id === savedId
    )

    if (existing) {
      setSelectedProjectState(existing)
      return
    }

    // ⭐ PRIORITY 3 → fallback first project
    setSelectedProjectState(projects[0])
    localStorage.setItem(
      "selectedProjectId",
      projects[0].id
    )

  }, [projects, projectIdFromUrl])

  /* ----------------------------------------
     UPDATE PROJECT
  ----------------------------------------- */
  const setSelectedProject = (project: Project) => {
    setSelectedProjectState(project)
    localStorage.setItem(
      "selectedProjectId",
      project.id
    )
  }

  const value = useMemo(
    () => ({
      selectedProject,
      setSelectedProject,
    }),
    [selectedProject]
  )

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext)

  if (!ctx) {
    throw new Error(
      "useProjectContext must be used inside ProjectProvider"
    )
  }

  return ctx
}