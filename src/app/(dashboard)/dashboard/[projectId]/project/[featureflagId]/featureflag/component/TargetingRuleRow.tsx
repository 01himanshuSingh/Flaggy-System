"use client"

import { memo } from "react"
import { TargetingRule } from "./types/targetingrule"
interface Props {
  rule: TargetingRule
  attributes: string[]
  operators: string[]
  onUpdate: (id: number, field: string, value: string) => void
  onRemove: (id: number) => void
}

export const RuleRow = memo(function RuleRow({
  rule,
  attributes,
  operators,
  onUpdate,
  onRemove
}: Props) {

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-slate-50 p-3">

      <span className="w-6 text-xs font-bold text-slate-400">
        IF
      </span>

      <select
        value={rule.attribute}
        onChange={(e) => onUpdate(rule.id, "attribute", e.target.value)}
        className="rounded-md border px-2 py-1 text-sm"
      >
        {attributes.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>

      <select
        value={rule.operator}
        onChange={(e) => onUpdate(rule.id, "operator", e.target.value)}
        className="rounded-md border px-2 py-1 text-sm"
      >
        {operators.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>

      <input
        value={rule.value}
        onChange={(e) => onUpdate(rule.id, "value", e.target.value)}
        placeholder="value"
        className="flex-1 rounded-md border px-2 py-1 text-sm"
      />

      <span className="text-xs font-bold text-slate-400">
        THEN
      </span>

      <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
        serve: {rule.variation}
      </span>

      <button
        onClick={() => onRemove(rule.id)}
        className="ml-auto text-slate-400 hover:text-red-500"
      >
        ✕
      </button>

    </div>
  )
})