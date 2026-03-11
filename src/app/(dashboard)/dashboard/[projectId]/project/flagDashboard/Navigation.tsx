'use client';

import { useState } from 'react';
import { TabType } from './lib/types';

interface NavigationTabsProps {
  onTabChange?: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'applications', label: 'Applications' },
  { id: 'event-log', label: 'Event log' },
  { id: 'settings', label: 'Settings' },
];

export function NavigationTabs({ onTabChange }: NavigationTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="w-full mb-8">
      {/* Segmented container */}
      <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? `bg-white/60       backdrop-blur-md
        text-slate-900
          border border-white/40
          shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          ring-1 ring-white/30`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}