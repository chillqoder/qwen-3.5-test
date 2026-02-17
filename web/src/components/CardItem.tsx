'use client';

import { useState, useMemo } from 'react';
import type { ProcessedItem, ImageStatus } from '@/types';
import { getItemTitle } from '@/lib/utils';

interface CardItemProps {
  item: ProcessedItem;
  onToggleSelect: (id: string) => void;
  onViewFullJson: (item: ProcessedItem) => void;
  onImageClick: (urls: string[], startIndex: number) => void;
}

const MAX_PREVIEW_IMAGES = 4;

export function CardItem({ item, onToggleSelect, onViewFullJson, onImageClick }: CardItemProps) {
  const [jsonExpanded, setJsonExpanded] = useState(false);

  const statusColors = {
    all_valid: 'bg-green-100 text-green-800 border-green-200',
    any_valid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    some_broken: 'bg-orange-100 text-orange-800 border-orange-200',
    all_broken: 'bg-red-100 text-red-800 border-red-200',
    no_images: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const statusLabels = {
    all_valid: 'All Valid',
    any_valid: 'Has Valid',
    some_broken: 'Some Broken',
    all_broken: 'All Broken',
    no_images: 'No Images',
  };

  const previewImages = item.imageCandidates.slice(0, MAX_PREVIEW_IMAGES);
  const remainingCount = item.imageCandidates.length - MAX_PREVIEW_IMAGES;

  const jsonPreview = useMemo(() => {
    const preview = JSON.stringify(item.data, null, 2);
    if (!jsonExpanded && preview.length > 200) {
      return preview.slice(0, 200) + '...';
    }
    return preview;
  }, [item.data, jsonExpanded]);

  const getImageStatusIcon = (status: ImageStatus) => {
    switch (status) {
      case 'loading':
        return (
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-teal-500 rounded-full" />
        );
      case 'valid':
        return (
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'broken':
        return (
          <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleImageClick = (index: number) => {
    onImageClick(item.imageCandidates, index);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-80">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="checkbox"
            checked={item.isSelected}
            onChange={() => onToggleSelect(item.id)}
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <span className="font-medium text-gray-900 truncate">
            {getItemTitle(item.data, item.originalIndex + 1)}
          </span>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[item.status]}`}
        >
          {statusLabels[item.status]}
        </span>
      </div>

      {/* Image Preview */}
      {item.imageCandidates.length > 0 ? (
        <div className="p-3 border-b border-gray-100">
          <div className="grid grid-cols-4 gap-2">
            {previewImages.map((url, index) => {
              const status = item.imageStatuses.get(url) || 'loading';
              return (
                <div
                  key={url}
                  className="relative aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer group"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 shadow-sm">
                    {getImageStatusIcon(status)}
                  </div>
                  {index === MAX_PREVIEW_IMAGES - 1 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                      +{remainingCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {item.validCount > 0 && (
              <span className="text-green-600">{item.validCount} valid</span>
            )}
            {item.brokenCount > 0 && (
              <span className="text-red-600 ml-2">{item.brokenCount} broken</span>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 border-b border-gray-100 text-center text-gray-400 text-sm">
          No images detected
        </div>
      )}

      {/* JSON Preview */}
      <div className="flex-1 p-3 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">JSON Preview</span>
          <button
            onClick={() => setJsonExpanded(!jsonExpanded)}
            className="text-xs text-teal-600 hover:text-teal-700"
          >
            {jsonExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
        <pre className="flex-1 bg-gray-50 rounded-md p-2 text-xs text-gray-700 overflow-auto font-mono">
          {jsonPreview}
        </pre>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <button
          onClick={() => onViewFullJson(item)}
          className="w-full px-3 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors font-medium"
        >
          View Full JSON
        </button>
      </div>
    </div>
  );
}
