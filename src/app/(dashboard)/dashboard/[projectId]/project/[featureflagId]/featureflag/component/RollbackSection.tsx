"use client"

import { useState, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RollbackVersion } from "./types/RollbackVersion"
import { RollbackItem } from "./UI/RollbackItem"


interface Props {
  versions: RollbackVersion[]
}

const avatarColors = [
  "#2563EB",
  "#16A34A",
  "#D97706"
]

export function RollbackSection({ versions }: Props) {

  const [restoring, setRestoring] = useState<number | null>(null)
  const [restored, setRestored] = useState<number | null>(null)

  const handleRestore = useCallback((id: number) => {

    if (restoring === id) {
      setRestored(id)
      setRestoring(null)

      setTimeout(() => setRestored(null), 2200)

    } else {
      setRestoring(id)
    }

  }, [restoring])

  return (
    <Card className="mb-6">

      <CardHeader>
        <CardTitle className="text-sm text-slate-600">
          Rollback Versions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">

        {versions.map((v, i) => (

          <RollbackItem
            key={v.id}
            version={v}
            isLatest={i === 0}
            isRestoring={restoring === v.id}
            isRestored={restored === v.id}
            color={avatarColors[i % avatarColors.length]}
            onRestore={handleRestore}
            onCancel={() => setRestoring(null)}
          />

        ))}

        <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-xs text-orange-700">

          ⚠ Restoring a version immediately updates the flag configuration
          for all users in the selected environment. This action cannot
          be undone.

        </div>

      </CardContent>

    </Card>
  )
}