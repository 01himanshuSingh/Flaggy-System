"use client"

import { useState, useCallback, useMemo } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Variation } from "./types/variation"
import { VariationRow } from "./VariationRow"


const TYPES = ["Boolean", "String", "Number", "JSON"]

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#3b82f6"
]

interface Props {
  initialVariations?: Variation[]
}

export function VariationsEditor({
  initialVariations = []
}: Props) {

  const [variations, setVariations] =
    useState<Variation[]>(initialVariations)

  const totalWeight = useMemo(
    () =>
      variations.reduce(
        (sum, v) => sum + v.weight,
        0
      ),
    [variations]
  )

  const updateVariation = useCallback(
    (id: number, field: string, value: any) => {

      setVariations((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, [field]: value }
            : v
        )
      )
    },
    []
  )

  const addVariation = useCallback(() => {

    setVariations((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: `Variation ${String.fromCharCode(
          65 + prev.length
        )}`,
        value: "",
        type: "Boolean",
        weight: 0
      }
    ])

  }, [])

  return (
    <Card className="mb-6">

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle className="text-sm text-slate-600">
          Variations
        </CardTitle>

        <button
          onClick={addVariation}
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600"
        >
          + Add Variation
        </button>

      </CardHeader>

      <CardContent className="space-y-3">

        {variations.map((variation, index) => (

          <VariationRow
            key={variation.id}
            variation={variation}
            color={COLORS[index % COLORS.length]}
            types={TYPES}
            onUpdate={updateVariation}
          />

        ))}

        {Math.abs(totalWeight - 100) > 0.01 && (
          <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-xs font-semibold text-orange-700">
            ⚠ Total weight: {totalWeight}% (must equal 100%)
          </div>
        )}

      </CardContent>

    </Card>
  )
}