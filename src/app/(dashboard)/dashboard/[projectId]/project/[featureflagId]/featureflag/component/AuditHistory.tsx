"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AuditEvent } from "./types/AuditEvent"
import { AuditItem } from "./UI/AuditItem"


interface Props {
  history: AuditEvent[]
}

export function AuditHistory({ history }: Props) {

  return (
    <Card className="mb-6">

      <CardHeader>
        <CardTitle className="text-sm text-slate-600">
          Audit History
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">

        {/* timeline line */}
        <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-slate-200" />

        <div className="flex flex-col">

          {history.map((event) => (
            <AuditItem
              key={event.id}
              event={event}
            />
          ))}

        </div>

      </CardContent>

    </Card>
  )
}