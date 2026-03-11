import { z } from "zod"

export const createFlagSchema = z.object({
key: z
  .string()
  .min(3, "Key must be at least 3 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Key can only contain letters and numbers (no spaces)"),
  description: z.string().optional(),

  valueType: z.enum(["BOOLEAN", "STRING", "NUMBER", "JSON"]),
})

export type CreateFlagForm = z.infer<typeof createFlagSchema>