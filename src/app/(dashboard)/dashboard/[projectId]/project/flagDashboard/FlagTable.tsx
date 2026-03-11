'use client';

import { FeatureFlag } from './lib/types';
import { FlagRow } from './FlagRow';

interface FlagsTableProps {
  flags: FeatureFlag[]
  hasNextPage?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
}

export function FlagsTable({
  flags,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
}: FlagsTableProps) {

  return (
    <div className="rounded-lg border border-slate-200 p-3 bg-white overflow-hidden shadow-sm">

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="bg-slate-50">
              <th className="w-12 px-4 py-4">
                <input className="w-4 h-4" type="checkbox"/>
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                Name
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                Created
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                By
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                Last seen
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                Lifecycle
              </th>

              <th className="w-12 px-4 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {flags.map((flag) => (
              <FlagRow key={flag.id} flag={flag} />
            ))}
          </tbody>

        </table>
      </div>

      {/* Empty state */}
      {flags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">
            No feature flags found
          </p>
        </div>
      )}

      {/* Cursor pagination */}
      {hasNextPage && (
        <div className="flex justify-center py-6">
          <button
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
            className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition"
          >
            {isFetchingNextPage
              ? "Loading..."
              : "Load More"}
          </button>
        </div>
      )}

    </div>
  )
}