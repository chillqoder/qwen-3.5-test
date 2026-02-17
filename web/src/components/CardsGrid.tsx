'use client';

import type { ProcessedItem } from '@/types';
import { CardItem } from './CardItem';

interface CardsGridProps {
  items: ProcessedItem[];
  onToggleSelect: (id: string) => void;
  onViewFullJson: (item: ProcessedItem) => void;
  onImageClick: (urls: string[], startIndex: number) => void;
}

export function CardsGrid({ items, onToggleSelect, onViewFullJson, onImageClick }: CardsGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-2">No items to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop/Tablet: CSS Grid */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <CardItem
            key={item.id}
            item={item}
            onToggleSelect={onToggleSelect}
            onViewFullJson={onViewFullJson}
            onImageClick={onImageClick}
          />
        ))}
      </div>

      {/* Mobile: Simple list */}
      <div className="sm:hidden space-y-4">
        {items.map((item) => (
          <CardItem
            key={item.id}
            item={item}
            onToggleSelect={onToggleSelect}
            onViewFullJson={onViewFullJson}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
}
