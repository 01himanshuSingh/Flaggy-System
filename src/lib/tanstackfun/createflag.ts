// lib/api/createFlag.ts

import { toast } from "sonner"
import { api } from "./axioscreatefun/axioscreateclient"

export type CreateFlagPayload = {
  projectId: string
  key: string
  description?: string
  valueType: "BOOLEAN" | "STRING" | "NUMBER" | "JSON"
}

export async function createFlag({
  projectId,
  ...data
}: CreateFlagPayload) {
  try {

    const res = await api.post(
      `/project/${projectId}/createfeatureflag`,
      data
    )

    return res.data

  } catch (error: any) {

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong"

    toast.error(message)

    throw new Error(message)
  }
}