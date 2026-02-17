'use client';

import { useAppStore } from '@/store/useAppStore';

export function ActionBar() {
  const items = useAppStore((state) => state.items);
  const selectAllOnTab = useAppStore((state) => state.selectAllOnTab);
  const selectAllWithAnyValid = useAppStore((state) => state.selectAllWithAnyValid);
  const selectAllWithAllValid = useAppStore((state) => state.selectAllWithAllValid);
  const deselectAll = useAppStore((state) => state.deselectAll);
  const invertSelection = useAppStore((state) => state.invertSelection);
  const downloadSelectedJson = useAppStore((state) => state.downloadSelectedJson);
  const rescanImages = useAppStore((state) => state.rescanImages);

  const selectedCount = items.filter((item) => item.isSelected).length;
  const hasSelection = selectedCount > 0;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
      {/* Selection Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Bulk Selection</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={selectAllOnTab}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Select all on current tab
          </button>
          <button
            onClick={selectAllWithAnyValid}
            className="px-3 py-2 text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
          >
            Select all with any valid image
          </button>
          <button
            onClick={selectAllWithAllValid}
            className="px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
          >
            Select all with only valid images
          </button>
          <button
            onClick={deselectAll}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Deselect all
          </button>
          <button
            onClick={invertSelection}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Invert selection
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={rescanImages}
            className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors font-medium"
          >
            Re-scan Images
          </button>
          <button
            onClick={downloadSelectedJson}
            disabled={!hasSelection}
            className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download Selected JSON
          </button>
        </div>

        {hasSelection && (
          <div className="text-sm text-gray-600">
            <span className="font-medium text-teal-600">{selectedCount}</span> items selected
          </div>
        )}
      </div>
    </div>
  );
}
