import { toast } from "sonner"

export async function createProject(data: { name: string }) {
  const res = await fetch("/api/project/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    toast.error("Failed to create project: " + (error.message || res.statusText))
    throw new Error(error.message || "Failed to create project")
  }

  return res.json()
}
