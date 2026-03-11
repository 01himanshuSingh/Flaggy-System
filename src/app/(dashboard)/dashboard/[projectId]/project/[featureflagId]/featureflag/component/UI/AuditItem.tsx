"use client"

import { memo } from "react"
import { AuditEvent } from "../types/AuditEvent"

interface Props {
  event: AuditEvent
}

export const AuditItem = memo(function AuditItem({ event }: Props) {

  return (
    <div className="relative pl-12 pb-6 flex gap-4">

      {/* Avatar */}
      <div className="absolute left-0 top-0">
        <div
          className="flex items-center justify-center rounded-full text-white font-bold"
          style={{
            width: 30,
            height: 30,
            background: event.color
          }}
        >
          {event.avatar}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 rounded-md border bg-slate-50 p-3">

        <div className="flex items-center justify-between flex-wrap gap-1 mb-1">

          <span className="text-sm font-semibold text-slate-900">
            {event.user}
          </span>

          <span className="text-xs text-slate-400">
            {event.date} · {event.time}
          </span>

        </div>

        <p className="text-sm text-slate-600">
          {event.change}
        </p>

      </div>

    </div>
  )
})