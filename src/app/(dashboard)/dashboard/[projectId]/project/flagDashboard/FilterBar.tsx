'use client';

import { useState } from 'react';
import { Search, Settings2 } from 'lucide-react';
import { FilterTab } from './lib/types';

interface FilterBarProps {
  tabs: FilterTab[];
  onFilterChange?: (tabId: string) => void;
}

export function FilterBar({ tabs, onFilterChange }: FilterBarProps) {
  const [activeFilter, setActiveFilter] = useState(tabs[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterClick = (tabId: string) => {
    setActiveFilter(tabId);
    onFilterChange?.(tabId);
  };

  return (
  <div className="mb-6 space-y-4">

  {/* ONE ROW LAYOUT */}
  <div className="flex items-center justify-between gap-4 flex-wrap">

    {/* LEFT — FILTER TABS */}
    <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;

        return (
         <button
  key={tab.id}
  onClick={() => handleFilterClick(tab.id)}
  className={`relative px-4 py-1.5 text-sm font-medium rounded-xl
    transition-all duration-300 whitespace-nowrap
    ${
      isActive
        ? `
          bg-white/60
          backdrop-blur-md
          text-slate-900
          border border-white/40
          shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          ring-1 ring-white/30
        `
        : `
          text-slate-600
          hover:text-slate-900
          hover:bg-white/40
        `
    }`}
>
  {tab.label}
  <span className="ml-1 text-slate-400">({tab.count})</span>
</button>
        );
      })}
    </div>

    {/* RIGHT — SEARCH + SETTINGS */}
    <div className="flex items-center gap-3 ml-auto">

      <div className="relative w-[280px] md:w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search flags.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white
            text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-slate-300
            transition-all duration-200"
        />
      </div>

      <button
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white
          text-slate-600 hover:bg-slate-50 transition-all duration-200"
      >
        <Settings2 className="w-4 h-4" />
      </button>

    </div>
  </div>

</div>
  );
}