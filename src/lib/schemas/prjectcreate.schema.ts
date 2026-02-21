import { z } from "zod"

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name too long")
})

export type CreateProjectForm = z.infer<typeof createProjectSchema>
