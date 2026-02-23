'use client'

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { FolderPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { openDialog } from "@/app/store/dialogSlice"
import CreateProjectDialog from "../dashboard-Component/create-project-dialogbox/CreateProjectDialog"


export default function NoProjectPage() {
  const dispatch = useDispatch()

  // ⭐ auto open dialog on first render
  useEffect(() => {
    dispatch(openDialog())
  }, [dispatch])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-6">

      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        <FolderPlus className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold tracking-tight">
        No Project Found
      </h1>

      {/* Subtitle */}
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Create your first project to start managing feature flags.
      </p>

      {/* Manual open button */}
      <Button
        className="mt-6"
        onClick={() => dispatch(openDialog())}
      >
        Create Project
      </Button>

      {/* Dialog */}
      <CreateProjectDialog />

    </div>
  )
}