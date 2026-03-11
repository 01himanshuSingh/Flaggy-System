"use client"

import { memo } from "react"
import { RollbackVersion } from "../types/RollbackVersion"

interface Props {
  version: RollbackVersion
  isLatest: boolean
  isRestoring: boolean
  isRestored: boolean
  color: string
  onRestore: (id: number) => void
  onCancel: () => void
}

export const RollbackItem = memo(function RollbackItem({
  version,
  isLatest,
  isRestoring,
  isRestored,
  color,
  onRestore,
  onCancel
}: Props) {

  const initials = version.user
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 ${
        isLatest
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >

      {/* Left section */}
      <div className="flex items-center gap-4">

        {/* Version badge */}
        <div className="rounded border px-3 py-2 text-center bg-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            v{version.id}
          </p>
          <p className="text-lg font-bold tabular-nums">
            {version.rollout}%
          </p>
        </div>

        {/* Info */}
        <div>

          <p className="text-sm font-semibold">
            Rollout: {version.rollout}%
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <div
              className="flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px]"
              style={{ background: color }}
            >
              {initials}
            </div>

            {version.user} · {version.date}

          </div>

        </div>

      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {isRestoring && (
          <span className="text-xs text-orange-600 font-semibold">
            Confirm restore?
          </span>
        )}

        {isRestoring && (
          <button
            onClick={onCancel}
            className="rounded border px-3 py-1 text-xs"
          >
            Cancel
          </button>
        )}

        <button
          onClick={() => onRestore(version.id)}
          className={`rounded px-3 py-1 text-sm font-semibold ${
            isRestored
              ? "bg-green-100 text-green-700"
              : isRestoring
              ? "bg-red-500 text-white"
              : "border"
          }`}
        >
          {isRestored
            ? "✓ Restored"
            : isRestoring
            ? "Yes, restore"
            : "Restore"}
        </button>

      </div>

    </div>
  )
})