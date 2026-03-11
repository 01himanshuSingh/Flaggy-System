"use client"

import { useState, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RuleRow } from "./TargetingRuleRow"
import { TargetingRule } from "./types/targetingrule"

interface Props {
  initialRules?: TargetingRule[]
  attributes: string[]
  operators: string[]
}

export function TargetingRules({
  initialRules = [],
  attributes,
  operators
}: Props) {

  const [rules, setRules] = useState<TargetingRule[]>(initialRules)

  const addRule = useCallback(() => {
    setRules((prev) => [
      ...prev,
      {
        id: Date.now(),
        attribute: attributes[0],
        operator: operators[0],
        value: "",
        variation: "enabled"
      }
    ])
  }, [attributes, operators])

  const removeRule = useCallback((id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const updateRule = useCallback(
    (id: number, field: string, value: string) => {
      setRules((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        )
      )
    },
    []
  )

  return (
    <Card className="mb-6">

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle className="text-sm text-slate-600">
          Targeting Rules
        </CardTitle>

        <button
          onClick={addRule}
          className="flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600"
        >
          + Add Rule
        </button>

      </CardHeader>

      <CardContent className="space-y-2">

        {rules.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400">
            No targeting rules. All users match by default.
          </p>
        )}

        {rules.map((rule) => (
          <RuleRow
            key={rule.id}
            rule={rule}
            attributes={attributes}
            operators={operators}
            onUpdate={updateRule}
            onRemove={removeRule}
          />
        ))}

        {rules.length > 0 && (
          <div className="mt-3 rounded-md border border-dashed border-indigo-200 bg-indigo-50 p-3 text-xs font-semibold text-indigo-600">
            ↳ All other users → serve default variation
          </div>
        )}

      </CardContent>

    </Card>
  )
}