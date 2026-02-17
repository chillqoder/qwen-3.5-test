import { create } from 'zustand';
import type { ProcessedItem, TabType, Metrics, UploadState, CardStatus } from '@/types';
import {
  extractImageUrls,
  validateImagesWithConcurrency,
  calculateCardStatus,
} from '@/lib/utils';

interface AppState {
  // Data
  items: ProcessedItem[];
  filteredItems: ProcessedItem[];
  
  // Upload state
  upload: UploadState;
  
  // UI state
  activeTab: TabType;
  selectedJsonPath: string;
  validationProgress: { validated: number; total: number };
  isModalOpen: boolean;
  modalItem: ProcessedItem | null;
  
  // Actions
  setItems: (items: ProcessedItem[]) => void;
  setUploadState: (state: Partial<UploadState>) => void;
  setActiveTab: (tab: TabType) => void;
  setSelectedJsonPath: (path: string) => void;
  setIsModalOpen: (open: boolean) => void;
  setModalItem: (item: ProcessedItem | null) => void;
  filterItems: () => void;

  // Item actions
  toggleItemSelection: (id: string) => void;
  setItemSelection: (id: string, selected: boolean) => void;
  
  // Bulk actions
  selectAllOnTab: () => void;
  selectAllWithAnyValid: () => void;
  selectAllWithAllValid: () => void;
  deselectAll: () => void;
  invertSelection: () => void;
  
  // Validation
  validateAllImages: () => Promise<void>;
  rescanImages: () => Promise<void>;
  
  // Export
  downloadSelectedJson: () => void;
}

const createProcessedItem = (
  data: Record<string, unknown>,
  originalIndex: number
): ProcessedItem => {
  const imageCandidates = extractImageUrls(data);
  
  return {
    id: `${originalIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    originalIndex,
    data,
    imageCandidates,
    imageStatuses: new Map(),
    totalImages: imageCandidates.length,
    validCount: 0,
    brokenCount: 0,
    status: imageCandidates.length > 0 ? 'all_valid' : 'no_images',
    isSelected: false,
  };
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  items: [],
  filteredItems: [],
  upload: { status: 'idle' },
  activeTab: 'all',
  selectedJsonPath: '',
  validationProgress: { validated: 0, total: 0 },
  isModalOpen: false,
  modalItem: null,

  setItems: (items) => {
    set({ items });
    get().filterItems();
  },

  setUploadState: (state) => {
    set((prev) => ({ upload: { ...prev.upload, ...state } }));
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    get().filterItems();
  },

  setSelectedJsonPath: (path) => {
    set({ selectedJsonPath: path });
  },

  setIsModalOpen: (open) => {
    set({ isModalOpen: open });
    if (!open) {
      set({ modalItem: null });
    }
  },

  setModalItem: (item) => {
    set({ modalItem: item });
  },

  toggleItemSelection: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      ),
    }));
    get().filterItems();
  },

  setItemSelection: (id, selected) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isSelected: selected } : item
      ),
    }));
    get().filterItems();
  },

  selectAllOnTab: () => {
    set((state) => {
      const idsToSelect = new Set(state.filteredItems.map((item) => item.id));
      return {
        items: state.items.map((item) =>
          idsToSelect.has(item.id) ? { ...item, isSelected: true } : item
        ),
      };
    });
    get().filterItems();
  },

  selectAllWithAnyValid: () => {
    set((state) => {
      const updatedItems = state.items.map((item) => {
        const shouldBeSelected = item.status === 'all_valid' || item.status === 'any_valid' || item.status === 'some_broken';
        return {
          ...item,
          isSelected: shouldBeSelected,
        };
      });
      return { items: updatedItems };
    });
    get().filterItems();
  },

  selectAllWithAllValid: () => {
    set((state) => {
      const updatedItems = state.items.map((item) => ({
        ...item,
        isSelected: item.status === 'all_valid',
      }));
      return { items: updatedItems };
    });
    get().filterItems();
  },

  deselectAll: () => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, isSelected: false })),
    }));
    get().filterItems();
  },

  invertSelection: () => {
    set((state) => ({
      items: state.items.map((item) => ({
        ...item,
        isSelected: !item.isSelected,
      })),
    }));
    get().filterItems();
  },

  filterItems: () => {
    const { items, activeTab } = get();
    
    let filtered = items;
    
    switch (activeTab) {
      case 'all_valid':
        filtered = items.filter((item) => item.status === 'all_valid');
        break;
      case 'any_valid':
        filtered = items.filter(
          (item) => item.status === 'any_valid' || item.status === 'all_valid'
        );
        break;
      case 'some_broken':
        filtered = items.filter((item) => item.status === 'some_broken');
        break;
      case 'all_broken':
        filtered = items.filter((item) => item.status === 'all_broken');
        break;
      case 'no_images':
        filtered = items.filter((item) => item.status === 'no_images');
        break;
      case 'selected':
        filtered = items.filter((item) => item.isSelected);
        break;
      default:
        filtered = items;
    }
    
    set({ filteredItems: filtered });
  },

  validateAllImages: async () => {
    const initialItems = get().items;
    const allUrls = new Set<string>();

    initialItems.forEach((item) => {
      item.imageCandidates.forEach((url) => allUrls.add(url));
    });

    const urlsArray = Array.from(allUrls);
    const totalImages = urlsArray.length;

    set({ validationProgress: { validated: 0, total: totalImages } });

    const results = await validateImagesWithConcurrency(urlsArray, 8);

    // Update items with validation results
    set((state) => {
      const updatedItems = state.items.map((item) => {
        let validCount = 0;
        let brokenCount = 0;
        const imageStatuses = new Map<string, 'loading' | 'valid' | 'broken' | 'timeout'>();

        item.imageCandidates.forEach((url) => {
          const status = results.get(url) || 'broken';
          imageStatuses.set(url, status);
          if (status === 'valid') {
            validCount++;
          } else {
            brokenCount++;
          }
        });

        return {
          ...item,
          imageStatuses,
          validCount,
          brokenCount,
          status: calculateCardStatus(item.totalImages, validCount, brokenCount),
          isSelected: item.isSelected, // Explicitly preserve selection state
        };
      });

      return {
        items: updatedItems,
        validationProgress: { validated: totalImages, total: totalImages },
      };
    });
    get().filterItems();
  },

  rescanImages: async () => {
    // Reset all validation state
    set((state) => ({
      items: state.items.map((item) => ({
        ...item,
        imageStatuses: new Map(),
        validCount: 0,
        brokenCount: 0,
        status: (item.imageCandidates.length > 0 ? 'all_valid' : 'no_images') as CardStatus,
        isSelected: item.isSelected, // Explicitly preserve selection state
      })),
    }));
    get().filterItems();
    get().validateAllImages();
  },

  downloadSelectedJson: () => {
    const state = useAppStore.getState();
    const selectedItems = state.items.filter((item) => item.isSelected);

    if (selectedItems.length === 0) {
      alert('No items selected. Please select items using the bulk selection buttons or checkboxes.');
      return;
    }

    const data = selectedItems.map((item) => item.data);
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `json-image-cleaner-${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));

// Helper function to get current metrics
export function getMetrics() {
  const state = useAppStore.getState();
  const items = state.items;
  
  return {
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
}
