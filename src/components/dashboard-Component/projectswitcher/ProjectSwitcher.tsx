'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { useProjects } from '@/lib/hook/useproject'
import { useProjectContext } from './ProjectProvider'
 import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Folder } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { openDialog } from '@/app/store/dialogSlice'
import CreateProjectDialog from '../create-project-dialogbox/CreateProjectDialog'
export default function ProjectSwitcher() {
  const { projects, loading, error } = useProjects()
  const dispatch = useDispatch()
  const { selectedProject, setSelectedProject } = useProjectContext()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectList = useMemo(() => projects, [projects])
  if (!mounted) return null
  return (
    <div className="px-3 py-2 border-b">

      <DropdownMenu>
        {/* Trigger */}
        <DropdownMenuTrigger asChild>
  <Button variant="ghost" className="w-full justify-between">

            <span className="text-sm">
              {selectedProject?.name || "Select Project"}
            </span>
            <ChevronDown size={16} />
  </Button>
        </DropdownMenuTrigger>

        {/* Dropdown */}
   

<DropdownMenuContent className="w-60" align="start">

  {/* Scrollable project list */}
  <div className="max-h-64 overflow-y-auto">
    
    {loading && (
      <DropdownMenuItem disabled>
        Loading projects...
      </DropdownMenuItem>
    )}

    {error && (
      <DropdownMenuItem disabled>
        Failed to load projects
      </DropdownMenuItem>
    )}

    {!loading && projectList.length === 0 && (
      <DropdownMenuItem disabled>
        No projects found
      </DropdownMenuItem>
    )}

    {projectList.map((project) => (
      <DropdownMenuItem
        key={project.id}
        onClick={() => {
          setSelectedProject(project)
          router.push(`/dashboard/${project.id}/project`)
        }}
      >
        {project.name}
      </DropdownMenuItem>
    ))}

  </div>

  <DropdownMenuSeparator />

  {/* Actions (not scrollable) */}
  <div className="p-2 space-y-2">
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => router.push('/dashboard/projects')}
    >
      <Folder size={16} className="mr-2" />
      See All Projects
    </Button>

   <Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => dispatch(openDialog())}
>
  <Plus size={16} className="mr-2" />
  Create Project
</Button>
<CreateProjectDialog/>
  </div>

</DropdownMenuContent>

      </DropdownMenu>

    </div>
  )
}
