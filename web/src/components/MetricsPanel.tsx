'use client';

import { useAppStore } from '@/store/useAppStore';

export function MetricsPanel() {
  const items = useAppStore((state) => state.items);
  const validationProgress = useAppStore((state) => state.validationProgress);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

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

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {([
          { label: 'Total items', value: metrics.total, tab: 'all' as const, color: 'bg-gray-50 border-gray-200' },
          { label: 'No images', value: metrics.noImages, tab: 'no_images' as const, color: 'bg-slate-50 border-slate-200' },
          { label: 'All images valid', value: metrics.allValid, tab: 'all_valid' as const, color: 'bg-green-50 border-green-200' },
          { label: 'At least 1 valid', value: metrics.anyValid, tab: 'any_valid' as const, color: 'bg-emerald-50 border-emerald-200' },
          { label: 'Has broken images', value: metrics.anyBroken, tab: 'some_broken' as const, color: 'bg-red-50 border-red-200' },
          { label: 'Selected', value: metrics.selected, tab: 'selected' as const, color: 'bg-teal-50 border-teal-200' },
        ]).map((card) => (
          <button
            key={card.label}
            onClick={() => setActiveTab(card.tab)}
            className={`${card.color} border rounded-lg p-3 text-left hover:shadow-sm transition-shadow`}
          >
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-600 mt-1">{card.label}</div>
          </button>
        ))}
      </div>

      {validationProgress.total > 0 && validationProgress.validated < validationProgress.total && (
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-teal-500 h-full transition-all duration-300"
            style={{
              width: `${(validationProgress.validated / validationProgress.total) * 100}%`,
            }}
          />
        </div>
      )}

      {validationProgress.total > 0 && (
        <p className="text-sm text-gray-500 text-center">
          {validationProgress.validated} / {validationProgress.total} images validated
        </p>
      )}
    </div>
  );
}
