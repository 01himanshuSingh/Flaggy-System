'use client';

import { useMemo, useState, useCallback } from 'react';
import { filterTabs } from './lib/mock-data';
import { TabType } from './lib/types';

import FlagDashboardHeader from './FLagDashboardHeader';
import { NavigationTabs } from './Navigation';
import { FilterBar } from './FilterBar';
import { FlagsTable } from './FlagTable';
import { useProjectFlags } from '@/lib/hook/getfeatureflaghook/useProjectFlag';

interface Props {
  projectId: any;
}

export function FlagsDashboard({ projectId }: Props) {
  /* -------------------------
     UI STATE (LOCAL ONLY)
  -------------------------- */
  const [activeTab, setActiveTab] =
    useState<TabType>('overview');

  const [activeFilter, setActiveFilter] =
    useState('all');

  /* -------------------------
     SERVER STATE (TANSTACK)
  -------------------------- *//* -------------------------
   SERVER STATE (TANSTACK)
-------------------------- */
const {
  data,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useProjectFlags({ projectId, limit: 20 })

const flags =
  data?.pages.flatMap((page) => page.data) ?? []; 
  /* -------------------------
     MEMOIZED FILTERING
     (NO EXTRA RE-RENDER COST)
  -------------------------- */
const filteredFlags = useMemo(() => {
  if (!flags.length) return []

  switch (activeFilter) {
    case "draft":
      return flags.filter(f => f.lifecycle === "draft")

    case "active":
      return flags.filter(f => f.lifecycle === "active")

    case "deprecated":
      return flags.filter(f => f.lifecycle === "deprecated")

    case "archived":
      return flags.filter(f => f.lifecycle === "archived")

    default:
      return flags
  }
}, [flags, activeFilter])
  /* -------------------------
     STABLE CALLBACKS
     (PREVENT CHILD RE-RENDER)
  -------------------------- */
  const handleTabChange = useCallback(
    (tab: TabType) => setActiveTab(tab),
    []
  );

  const handleFilterChange = useCallback(
    (filter: string) => setActiveFilter(filter),
    []
  );

  /* -------------------------
     LOADING / ERROR STATES
  -------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-slate-500">Loading flags...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-red-500">
          Failed to load flags
        </p>
      </div>
    );
  }

  /* -------------------------
     MAIN UI
  -------------------------- */
  return (
    <div className="min-h-screen rounded-xl p-6 bg-gradient-to-br from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-7">

        <FlagDashboardHeader flagCount={flags.length} />

        <NavigationTabs onTabChange={handleTabChange} />

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <FilterBar
              tabs={filterTabs}
              onFilterChange={handleFilterChange}
            />

          <FlagsTable
  flags={filteredFlags}
  hasNextPage={hasNextPage}
  fetchNextPage={fetchNextPage}
  isFetchingNextPage={isFetchingNextPage}
/>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">
              Section coming soon
            </p>
          </div>
        )}

      </div>
    </div>
  );
}