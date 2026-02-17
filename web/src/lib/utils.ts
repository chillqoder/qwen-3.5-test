import type { StringMatch } from '@/types';

/**
 * Recursively finds all string values in an object/array
 */
export function findAllStrings(obj: unknown, path = ''): StringMatch[] {
  const results: StringMatch[] = [];

  if (obj === null || obj === undefined) {
    return results;
  }

  if (typeof obj === 'string') {
    results.push({ value: obj, path: path || 'root' });
    return results;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const newPath = path ? `${path}[${index}]` : `[${index}]`;
      results.push(...findAllStrings(item, newPath));
    });
    return results;
  }

  if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      results.push(...findAllStrings(value, newPath));
    });
    return results;
  }

  return results;
}

/**
 * Checks if a string is likely an image URL
 */
export function isLikelyImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const hasHttp = /^https?:\/\//i.test(url);
  const hasImageExt = /\.(jpe?g|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
  
  // Accept URLs with image extensions or short URLs (might be CDN links)
  return hasHttp && (hasImageExt || url.length < 200);
}

/**
 * Extracts image URL candidates from an object
 */
export function extractImageUrls(obj: unknown): string[] {
  const allStrings = findAllStrings(obj);
  const urls = allStrings
    .map(({ value }) => value)
    .filter(isLikelyImageUrl);
  
  // Remove duplicates while preserving order
  return [...new Set(urls)];
}

/**
 * Validates a single image URL
 */
export async function validateImage(
  url: string,
  timeoutMs = 8000
): Promise<'valid' | 'broken'> {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;

    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        resolve('broken');
      }
    }, timeoutMs);

    img.onload = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('valid');
      }
    };

    img.onerror = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('broken');
      }
    };

    img.src = url;
  });
}

/**
 * Validates multiple images with concurrency limit
 */
export async function validateImagesWithConcurrency(
  urls: string[],
  concurrencyLimit = 6
): Promise<Map<string, 'valid' | 'broken'>> {
  const results = new Map<string, 'valid' | 'broken'>();
  const cache = new Map<string, Promise<'valid' | 'broken'>>();

  const validateWithCache = async (url: string): Promise<'valid' | 'broken'> => {
    if (cache.has(url)) {
      return cache.get(url)!;
    }
    const promise = validateImage(url);
    cache.set(url, promise);
    return promise;
  };

  // Process in batches
  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += concurrencyLimit) {
    batches.push(urls.slice(i, i + concurrencyLimit));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (url) => {
        const result = await validateWithCache(url);
        results.set(url, result);
      })
    );
  }

  return results;
}

/**
 * Determines card status based on image validation results
 */
export function calculateCardStatus(
  totalImages: number,
  validCount: number,
  brokenCount: number
): 'all_valid' | 'any_valid' | 'all_broken' | 'some_broken' | 'no_images' {
  if (totalImages === 0) {
    return 'no_images';
  }
  
  if (brokenCount === 0 && validCount > 0) {
    return 'all_valid';
  }
  
  if (validCount > 0 && brokenCount > 0) {
    return 'some_broken';
  }
  
  if (validCount > 0) {
    return 'any_valid';
  }
  
  if (brokenCount > 0) {
    return 'all_broken';
  }
  
  return 'no_images';
}

/**
 * Formats date as YYYYMMDD
 */
export function formatDateForFilename(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Gets a display title for a JSON object
 */
export function getItemTitle(data: Record<string, unknown>, index: number): string {
  return (
    (data.title as string) ||
    (data.name as string) ||
    String(data.id) ||
    `#${index}`
  );
}

/**
 * Finds the first array in a JSON structure
 */
export function findFirstArray(obj: unknown): unknown[] | null {
  if (Array.isArray(obj)) {
    return obj;
  }

  if (obj !== null && typeof obj === 'object') {
    for (const value of Object.values(obj)) {
      const result = findFirstArray(value);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}

/**
 * Gets a value at a specific path in an object
 */
export function getValueAtPath(obj: unknown, path: string): unknown {
  if (!path) return obj;

  const parts = path.replace(/^\./, '').split(/\.|\[(\d+)\]/).filter(Boolean);
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    const indexMatch = part.match(/^(\d+)$/);
    if (indexMatch && Array.isArray(current)) {
      current = current[parseInt(indexMatch[1], 10)];
    } else if (typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}
