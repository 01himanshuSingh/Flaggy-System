'use client';

import { useState, memo, useMemo } from 'react';
import { MoreVertical } from 'lucide-react';
import { FeatureFlag } from './lib/types';

interface FlagRowProps {
  flag: FeatureFlag;
}

/* ===============================
   STATIC CONFIG (no re-creation)
================================ */
const lifecycleConfig = {
  development: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    label: 'Dev',
  },
  staging: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    label: 'Staging',
  },
  production: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Prod',
  },
} as const;

/* ===============================
   MEMOIZED ROW (BIG PERFORMANCE)
================================ */
export const FlagRow = memo(function FlagRow({ flag }: FlagRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  /* ---------- derived value ---------- */
  // const lifecycle = useMemo(
  //   () =>
  //     lifecycleConfig[flag.lifecycle] ??
  //     lifecycleConfig.development,
  //   [flag.lifecycle]
  // );

//   const envMap = useMemo(
//   () =>
//     Object.fromEntries(
//       flag.environments.map((env) => [
//         env.environment.name,
//         env.enabled,
//       ])
//     ),
//   [flag.environments]
// );
  return (
    <tr className="border-slate-200 hover:bg-slate-50 transition-all duration-150 group">

      {/* Checkbox */}
      <td className="w-12 px-4 py-4">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
        />
      </td>

      {/* Name */}
      <td className="px-4 py-4">
        <div className="min-w-[200px]">
          <p className="font-semibold text-slate-900">
            { flag.key}
          </p>
          <p className="text-sm text-slate-500">
            {flag.description ?? 'No description'}
          </p>
        </div>
      </td>

      {/* Created */}
      <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
       {new Date(flag.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
      </td>

      {/* Created By */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {flag.createdBy.name.charAt(0)}
          </span>
          <span className="text-sm text-slate-600">
            {flag.createdBy?.name ?? 'Unknown'}
          </span>
        </div>
      </td>

      {/* Last Seen */}
      <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
        {  '-'}
      </td>

      {/* Lifecycle */}
     <td className="px-4 py-4">
  <span
    className="
      inline-flex items-center
      px-3 py-1.5
      rounded-full
      text-xs font-semibold
      text-slate-600
      bg-white/10
      border border-white/20
      backdrop-blur-md
      shadow-[0_4px_20px_rgba(0,0,0,0.25)]
      hover:scale-105
      hover:bg-white/20
      transition-all duration-200
      cursor-default
    "
  >
    {flag.lifecycle}
  </span>
</td>

      {/* Environments */}
 {/* <td className="px-4 py-4">
  <div className="flex items-center gap-1">
    {envMap.development && (
      <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">
        D
      </span>
    )}

    {envMap.staging && (
      <span className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
        S
      </span>
    )}

    {envMap.production && (
      <span className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold">
        P
      </span>
    )}
  </div>
</td> */}

      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <div className="relative">
          <button
            onClick={() => setShowMenu((p) => !p)}
            className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              {['Edit', 'Duplicate', 'Archive'].map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {item}
                </button>
              ))}

              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-200">
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});