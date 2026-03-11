"use client"

import { memo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const PRESETS = [0, 10, 25, 50, 75, 100]

export const RolloutSlider = memo(function RolloutSlider() {
  const [percentage, setPercentage] = useState<number>(30)

  const color =
    percentage < 25
      ? "text-blue-500"
      : percentage < 75
      ? "text-amber-500"
      : "text-red-500"

  return (
    <Card className="mb-6">

      <CardHeader>
        <CardTitle className="text-sm text-slate-600">
          Rollout Percentage
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <p className="font-semibold text-slate-900">
              Gradual Rollout
            </p>

            <p className="text-sm text-slate-500">
              Only this percentage of users will receive the feature.
            </p>
          </div>

          <div className={`text-3xl font-extrabold tabular-nums ${color}`}>
            {percentage}%
          </div>

        </div>

        {/* Slider */}
        <div className="space-y-2">

          <input
            type="range"
            min={0}
            max={100}
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">

          {PRESETS.map((value) => {

            const active = value === percentage

            return (
              <button
                key={value}
                onClick={() => setPercentage(value)}
                className={`rounded-md border px-3 py-1 text-xs font-semibold transition
                  ${
                    active
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }
                `}
              >
                {value}%
              </button>
            )
          })}

        </div>

      </CardContent>

    </Card>
  )
})