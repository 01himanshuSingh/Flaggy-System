"use client"

import { memo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Environment } from "./constant/environment"
import { ProductionConfirm } from "./AlertDialogboxToggle"


interface Props {
  env: Environment
  flag: any
}

export const ToggleSwitch = memo(function ToggleSwitch({ env, flag }: Props) {

  const [confirmOpen, setConfirmOpen] = useState(false)


  const enabled = flag?.enabled ?? false

  const isProduction = env === "DEVELOPMENT"

  function handleToggle() {
    if (isProduction) {
      setConfirmOpen(true)
      return
    }

    // 🔥 No mutation yet (read-only for now)
    console.log("Toggle clicked")
  }

  function confirmToggle() {
    console.log("Confirmed toggle")
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