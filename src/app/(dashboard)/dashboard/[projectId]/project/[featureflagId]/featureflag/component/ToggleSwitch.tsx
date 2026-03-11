"use client"

import { memo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Environment } from "./constant/environment"
import { ProductionConfirm } from "./AlertDialogboxToggle"


interface Props {
  env: Environment
}

export const ToggleSwitch = memo(function ToggleSwitch({ env }: Props) {

  const [enabled, setEnabled] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isProduction = env === "DEVELOPMENT"

  function handleToggle() {
    if (isProduction) {
      setConfirmOpen(true)
      return
    }

    setEnabled(prev => !prev)
  }

  function confirmToggle() {
    setEnabled(prev => !prev)
    setConfirmOpen(false)
  }

  return (
    <Card className="mb-6">

      <CardHeader>
        <CardTitle className="text-sm text-slate-600">
          Flag Status
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center justify-between gap-4">

        {/* Left info */}
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">
            Feature Enabled
          </p>

          <p className="text-sm text-slate-500 max-w-md">
            {enabled
              ? "This flag is currently serving variations to users."
              : "This flag is disabled. No users will see changes."}
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">

          <span
            className={`text-sm font-semibold ${
              enabled ? "text-green-600" : "text-slate-400"
            }`}
          >
            {enabled ? "● Enabled" : "○ Disabled"}
          </span>

          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
          />

        </div>

      </CardContent>

      <ProductionConfirm
        open={confirmOpen}
        onConfirm={confirmToggle}
        onCancel={() => setConfirmOpen(false)}
      />

    </Card>
  )
})