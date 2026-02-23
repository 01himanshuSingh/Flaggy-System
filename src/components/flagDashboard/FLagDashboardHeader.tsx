import { Star, Heart } from "lucide-react"

interface DashboardHeaderProps {
  flagCount: number
}

export default function FlagDashboardHeader({
  flagCount,
}: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* LEFT SECTION */}
      <div>
        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg  text-slate-600">
            <Star className="h-4 w-4" />
          </div>

          <h1 className="text-2xl lg:text-[20px] font-semibold tracking-tight text-slate-900">
            Feature flags
          </h1>

          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-slate-500  px-2 text-xs font-semibold text-slate-900">
            {flagCount}
          </span>
        </div>

        <p className="mt-1 text-[15px] text-slate-500">
          Manage feature flags across your application
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex flex-wrap items-center gap-2">

        <button
          className="rounded-lg px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          View archived
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
        >
          New feature flag
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <Heart className="h-4 w-4 text-purple-500" />
          Project status
        </button>

      </div>
    </header>
  )
}
