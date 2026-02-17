export type ImageStatus = 'loading' | 'valid' | 'broken' | 'timeout';

export type CardStatus = 'all_valid' | 'any_valid' | 'all_broken' | 'some_broken' | 'no_images';

export interface StringMatch {
  value: string;
  path: string;
}

export interface ProcessedItem {
  id: string;
  originalIndex: number;
  data: Record<string, unknown>;
  imageCandidates: string[];
  imageStatuses: Map<string, ImageStatus>;
  totalImages: number;
  validCount: number;
  brokenCount: number;
  status: CardStatus;
  isSelected: boolean;
}

export type TabType = 
  | 'all'
  | 'all_valid'
  | 'any_valid'
  | 'some_broken'
  | 'all_broken'
  | 'no_images'
  | 'selected';

export interface Metrics {
  total: number;
  noImages: number;
  allValid: number;
  anyValid: number;
  anyBroken: number;
  selected: number;
}

export interface UploadState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  detectedPath?: string;
}
