import { useFlagDialog } from "@/app/store/zustand-flagdialogbox-state/createflagstate.store"
import CreateFlagDialog from "@/components/dashboard-Component/create-flag-dialogbox/CreateFeatureFlagdialogbox"
import { Star, Heart, Plus } from "lucide-react"
import React from "react"

interface DashboardHeaderProps {
  flagCount: number
}

/* --------------------------
   STATIC CLASSES (no recreate)
--------------------------- */

const HEADER_CLASS =
  "mb-9 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"

const ACTION_BTN =
  "rounded-lg px-3 py-1 text-sm lg:text-[14px] font-medium text-slate-600 transition hover:bg-blue-50"

const PRIMARY_BTN =
  "flex gap-0.5 bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 text-white shadow-sm p-1.5 text-[15px] hover:brightness-110 hover:cursor-pointer rounded-sm transition"

const STATUS_BTN =
  "inline-flex items-center gap-2 rounded-lg border border-violet-600 px-2 py-2 text-[15px] font-medium text-slate-600 transition hover:bg-slate-100"

/* --------------------------
   COMPONENT
--------------------------- */

function FlagDashboardHeader({ flagCount }: DashboardHeaderProps) {

  const openDialog = useFlagDialog((state) => state.openDialog)
  return (
    <header className={HEADER_CLASS}>
      {/* LEFT SECTION */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600">
            <Star className="h-4 w-4" />
          </div>

          <h1 className="text-2xl lg:text-[20px] font-semibold tracking-tight text-slate-900">
            Feature flags
          </h1>

          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-slate-500 px-2 text-xs font-semibold text-slate-900">
            {flagCount}
          </span>
        </div>

        <p className="mt-1 text-[15px] text-slate-500">
          Manage feature flags across your application
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex flex-wrap items-center gap-2">
        <button className={ACTION_BTN}>
          View archived
        </button>

        <button className={PRIMARY_BTN}
        onClick={openDialog}
        >
          
          <Plus size={18} />
          New feature flag
        </button>

        <button className={STATUS_BTN}>
          <Heart className="h-4 w-4 text-purple-500" />
          Project status
        </button>
        <CreateFlagDialog/>
      </div>
    </header>
  )
}

/* --------------------------
   MEMOIZATION
--------------------------- */

export default React.memo(FlagDashboardHeader)