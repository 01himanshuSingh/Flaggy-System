'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"

import { Loader2 } from "lucide-react"
import { CreateProjectForm, createProjectSchema } from "@/lib/schemas/prjectcreate.schema"
import { createProject } from "@/lib/hook/useprojectcreate"
import { closeDialog } from "@/app/store/dialogSlice"
import { useProjectContext } from "../projectswitcher/ProjectProvider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CreateProjectDialog() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const open = useSelector((state: any) => state.dialog.open)
const router = useRouter()
  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "" }
  })
const {setSelectedProject} = useProjectContext()
  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
        setSelectedProject({
      id: data.id,
      name: data.name,
    })
    toast.success("Project created successfully!")
      dispatch(closeDialog())
      form.reset()
    }
  })

  const onSubmit = (data: CreateProjectForm) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={() => dispatch(closeDialog())}>
      <DialogContent className="sm:max-w-md rounded-xl shadow-2xl">

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter a unique name for your project
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">

          <div>
            <Input
              placeholder="Project name"
              {...form.register("name")}
              className="h-11"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => dispatch(closeDialog())}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-green-500 hover:bg-green-600"
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </div>

        </form>

      </DialogContent>
    </Dialog>
  )
}
