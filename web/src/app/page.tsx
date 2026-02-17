'use client';

import {
  UploadPanel,
  TabsBar,
  MetricsPanel,
  CardsGrid,
  ActionBar,
  ModalViewer,
} from '@/components';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const items = useAppStore((state) => state.items);
  const filteredItems = useAppStore((state) => state.filteredItems);
  const toggleItemSelection = useAppStore((state) => state.toggleItemSelection);
  const setModalItem = useAppStore((state) => state.setModalItem);
  const setIsModalOpen = useAppStore((state) => state.setIsModalOpen);

  const handleViewFullJson = (item: typeof items[0]) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleImageClick = (urls: string[], startIndex: number) => {
    // Open gallery modal via custom event
    const event = new CustomEvent('open-gallery', { detail: { urls, startIndex } });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            JSON Image Cleaner
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Validate and filter JSON objects by image URLs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Upload Section - Show only if no items */}
        {items.length === 0 ? (
          <UploadPanel />
        ) : (
          <>
            {/* Metrics */}
            <MetricsPanel />

            {/* Tabs */}
            <TabsBar />

            {/* Cards Grid */}
            <CardsGrid
              items={filteredItems}
              onToggleSelect={toggleItemSelection}
              onViewFullJson={handleViewFullJson}
              onImageClick={handleImageClick}
            />

            {/* Action Bar */}
            <ActionBar />
          </>
        )}
      </main>

      {/* Modals */}
      <ModalViewer />

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500">
        Client-side only • No backend • No API calls
      </footer>
    </div>
  );
}
