'use client'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'


type Project = {
  id: string
  name: string
}

type ProjectResponse = {
  data: Project[]
  page: number
  totalPages: number
  totalCount: number
}

async function fetchProjects(page = 1, limit = 20): Promise<ProjectResponse> {
  const res = await fetch(`/api/project/getallprojects?page=${page}&limit=${limit}`)

  if (!res.ok) {
    const message = await res.text()
    toast.error("Failed to fetch projects: " + (message || res.statusText))
    throw new Error(message || "Failed to fetch projects")
  }

  return res.json()
}

export function useProjects(page = 1, limit = 20) {
  const query = useQuery<ProjectResponse>({
    queryKey: ['projects', page, limit],
    queryFn: () => fetchProjects(page, limit),
     staleTime: 1000 * 60 * 5,              // Data fresh for 5 minutes
    gcTime: 1000 * 60 * 10,                // Cache kept for 10 minutes
    refetchOnWindowFocus: false,           // Do not auto-refetch on tab focus
    refetchOnReconnect: true,              // Refetch when internet reconnects
    refetchOnMount: false,   
    
  })

  return {
    projects: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
   
  }
}

