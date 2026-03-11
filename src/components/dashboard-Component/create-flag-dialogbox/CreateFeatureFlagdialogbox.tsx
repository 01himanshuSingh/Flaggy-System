'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useFlagDialog } from "@/app/store/zustand-flagdialogbox-state/createflagstate.store"
import { CreateFlagForm, createFlagSchema } from "@/lib/schemas/createflagschema"
import { createFlag } from "@/lib/tanstackfun/createflag"

import { useParams } from "next/navigation"
export default function CreateFlagDialog() {

  const { open, closeDialog } = useFlagDialog()
  const queryClient = useQueryClient()

  const form = useForm<CreateFlagForm>({
    resolver: zodResolver(createFlagSchema),
    defaultValues: {
      key: "",
      description: "",
      valueType: "BOOLEAN",
    }
  })


const { projectId } = useParams()

const mutation = useMutation({
  mutationFn: (data: CreateFlagForm) =>
    createFlag({
      projectId: projectId as string,
      ...data,
    }),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["project-flags", projectId],
    })

    toast.success("Feature flag created successfully")

    form.reset()
    closeDialog()
  },

  onError: (error: any) => {
    toast.error(error?.message || "Failed to create flag")
  },
})

const onSubmit = (data: CreateFlagForm) => {
  mutation.mutate(data)
}

  return (
    <Dialog open={open} onOpenChange={closeDialog}>

      <DialogContent className="sm:max-w-md rounded-xl shadow-xl">

        <DialogHeader>
          <DialogTitle>Create Feature Flag</DialogTitle>

          <p className="text-sm text-muted-foreground">
            Feature flags allow you to control functionality without redeploying.
          </p>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 mt-4"
        >

          {/* Flag Key */}
          <div>
            <Input
              placeholder="checkout.new_ui"
              {...form.register("key")}
            />

            {form.formState.errors.key && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.key.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Input
              placeholder="Description (optional)"
              {...form.register("description")}
            />
          </div>

          {/* Value Type */}
          <div>
            <select
              {...form.register("valueType")}
              className="w-full border rounded-md h-10 px-3"
            >
              <option value="BOOLEAN">Boolean</option>
              <option value="STRING">String</option>
              <option value="NUMBER">Number</option>
              <option value="JSON">JSON</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-3 pt-4">

            <Button
              type="button"
              variant="ghost"
              onClick={closeDialog}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex gap-0.5 bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 text-white shadow-sm  text-[15px] hover:brightness-110 hover:cursor-pointer rounded-sm transition"
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              )}
              Create Flag
            </Button>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  )
}