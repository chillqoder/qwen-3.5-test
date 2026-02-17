'use client';

import { useAppStore } from '@/store/useAppStore';
import type { TabType } from '@/types';

interface TabConfig {
  id: TabType;
  label: string;
  count?: number;
  color: string;
}

export function TabsBar() {
  const items = useAppStore((state) => state.items);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const filteredItems = useAppStore((state) => state.filteredItems);

  const metrics = {
    total: items.length,
    noImages: items.filter((item) => item.status === 'no_images').length,
    allValid: items.filter((item) => item.status === 'all_valid').length,
    anyValid: items.filter(
      (item) =>
        item.status === 'any_valid' || item.status === 'all_valid'
    ).length,
    anyBroken: items.filter(
      (item) =>
        item.status === 'some_broken' || item.status === 'all_broken'
    ).length,
    selected: items.filter((item) => item.isSelected).length,
  };

  // Recalculate counts based on filtered items
  const someBrokenCount = filteredItems.filter(
    (item) => item.status === 'some_broken'
  ).length;
  const allBrokenCount = filteredItems.filter(
    (item) => item.status === 'all_broken'
  ).length;

  const tabs: TabConfig[] = [
    { id: 'all', label: 'All', count: metrics.total, color: 'gray' },
    { id: 'all_valid', label: 'All valid', count: metrics.allValid, color: 'green' },
    { id: 'any_valid', label: 'Any valid', count: metrics.anyValid, color: 'emerald' },
    { id: 'some_broken', label: 'Some broken', count: someBrokenCount, color: 'orange' },
    { id: 'all_broken', label: 'All broken', count: allBrokenCount, color: 'red' },
    { id: 'no_images', label: 'No images', count: metrics.noImages, color: 'slate' },
    { id: 'selected', label: 'Selected', count: metrics.selected, color: 'teal' },
  ];

  const getTabStyles = (tabId: TabType) => {
    const isActive = activeTab === tabId;
    const baseStyles = 'px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap';
    
    if (isActive) {
      return `${baseStyles} bg-teal-600 text-white`;
    }
    
    return `${baseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={getTabStyles(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
