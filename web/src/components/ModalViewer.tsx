'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { ProcessedItem } from '@/types';

interface ImageGalleryModalProps {
  urls: string[];
  startIndex: number;
  onClose: () => void;
}

function ImageGalleryModal({ urls, startIndex, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : urls.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < urls.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation */}
        {urls.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:text-gray-300 p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:text-gray-300 p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image */}
        <img
          src={urls[currentIndex]}
          alt={`Image ${currentIndex + 1} of ${urls.length}`}
          className="max-w-full max-h-[80vh] object-contain mx-auto"
        />

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
          {currentIndex + 1} / {urls.length}
        </div>
      </div>
    </div>
  );
}

interface JsonViewerModalProps {
  item: ProcessedItem;
  onClose: () => void;
}

function JsonViewerModal({ item, onClose }: JsonViewerModalProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(item.data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            JSON Preview - Item #{item.originalIndex + 1}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <pre className="bg-gray-50 rounded-md p-4 text-sm text-gray-800 overflow-auto font-mono">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {item.imageCandidates.length} image(s) detected
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors font-medium"
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ModalViewer() {
  const isModalOpen = useAppStore((state) => state.isModalOpen);
  const modalItem = useAppStore((state) => state.modalItem);
  const setIsModalOpen = useAppStore((state) => state.setIsModalOpen);
  const setModalItem = useAppStore((state) => state.setModalItem);

  const [galleryImages, setGalleryImages] = useState<{ urls: string[]; startIndex: number } | null>(null);

  const handleImageClick = (urls: string[], startIndex: number) => {
    setGalleryImages({ urls, startIndex });
  };

  const closeGallery = () => {
    setGalleryImages(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalItem(null);
  };

  if (!isModalOpen && !galleryImages) {
    return null;
  }

  return (
    <>
      {modalItem && isModalOpen && (
        <JsonViewerModal item={modalItem} onClose={closeModal} />
      )}
      {galleryImages && (
        <ImageGalleryModal
          urls={galleryImages.urls}
          startIndex={galleryImages.startIndex}
          onClose={closeGallery}
        />
      )}
    </>
  );
}
