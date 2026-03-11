"use client"

import { memo } from "react"
import { Variation } from "./types/variation"

interface Props {
  variation: Variation
  color: string
  types: string[]
  onUpdate: (id: number, field: string, value: any) => void
}

export const VariationRow = memo(function VariationRow({
  variation,
  color,
  types,
  onUpdate
}: Props) {

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border bg-slate-50 p-4"
      style={{
        borderLeft: `3px solid ${color}`
      }}
    >

      {/* Name + Type */}
      <div className="min-w-[120px] flex-1">
        <input
          value={variation.name}
          onChange={(e) =>
            onUpdate(variation.id, "name", e.target.value)
          }
          className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
        />

        <select
          value={variation.type}
          onChange={(e) =>
            onUpdate(variation.id, "type", e.target.value)
          }
          className="text-xs text-slate-500"
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Value */}
      <div className="min-w-[140px] flex-[2]">
        <p className="text-xs font-semibold text-slate-400">
          VALUE
        </p>

        <input
          value={variation.value}
          onChange={(e) =>
            onUpdate(variation.id, "value", e.target.value)
          }
          placeholder="Enter value..."
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      {/* Weight */}
      <div className="min-w-[90px]">
        <p className="text-xs font-semibold text-slate-400">
          WEIGHT
        </p>

        <div className="flex items-center gap-1">
          <input
            type="number"
            value={variation.weight}
            min={0}
            max={100}
            onChange={(e) =>
              onUpdate(
                variation.id,
                "weight",
                Number(e.target.value)
              )
            }
            className="w-14 rounded border px-1 py-1 text-sm font-bold"
          />
          %
        </div>
      </div>

      {/* Progress Bar */}
      <div className="min-w-[100px] flex-1">
        <div className="h-2 rounded bg-slate-200 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${variation.weight}%`,
              background: color
            }}
          />
        </div>
      </div>

    </div>
  )
})