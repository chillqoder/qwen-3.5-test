````md
# JSON Image Cleaner — Technical Specification (Next.js, Client-Only)

## Overview

A single-page **Next.js** application that runs entirely in the browser (client-side only, no backend, no external APIs).

Input: Any JSON file.  
The application automatically detects image URLs, validates them locally via the browser, renders cards with previews and statuses, provides filtering tabs and bulk selection actions, and allows downloading a new JSON file containing selected objects.

The goal is to deliver a clean, production-ready MVP.

---

# Required Functionality

## 1. JSON Upload

- Drag & drop support
- File input (`.json` only)
- Read via `FileReader`
- Validate JSON structure:
  - If root is an array → use it
  - If root is an object → auto-detect first array node
  - If multiple arrays or ambiguous → allow user to specify path (input with auto-detection suggestion)
- Display error message if JSON is invalid

---

## 2. Automatic Image URL Detection

For each object:

- Recursively traverse all nested fields
- Collect all string values
- Apply heuristics:

A string is considered a candidate if:

- It starts with `http://` or `https://` AND contains image extension  
  (`.jpg | .jpeg | .png | .gif | .webp | .avif | .bmp`)
- OR it is any HTTP(S) URL (even without extension — attempt loading)

Each object stores:
- `imageCandidates: string[]` (0..n items)

---

## 3. Image Validation (Client-Side)

For each URL:

- Use `new Image()`:
  - `onload` → `valid`
  - `onerror` → `broken`
- Timeout: 8 seconds
- Parallel loading limit: 6–10 concurrent images
- Cache duplicate URLs in a `Map` to avoid re-validation

Each card calculates:

- `totalImages`
- `validCount`
- `brokenCount`

Derived statuses:

- `all_valid` → all images valid AND total > 0
- `any_valid` → at least one valid
- `all_broken` → all broken AND total > 0
- `some_broken` → mix of valid and broken
- `no_images` → totalImages === 0

---

## 4. Card Rendering

Each JSON object = one card.

### Card layout includes:

- Header:
  - `title` OR `name` OR `id` OR fallback `#index`
  - Checkbox
- Image preview gallery:
  - Show up to 3–4 thumbnails
  - Extra images accessible via modal/carousel
- Per-image status indicator:
  - Loading
  - Valid (green check)
  - Broken (red cross)
  - Timeout
- JSON preview:
  - Collapsed view
  - `line-clamp`
  - "Show more" toggle
- Button: `View Full JSON` → modal with formatted JSON
- Card-level status label

### Layout constraints:

- Fixed card height (220–320px)
- No overflow outside card boundaries
- Long content truncated with ellipsis or internal scroll
- Images use `object-fit: cover` or `contain`

---

## 5. Tabs / Filters

Top tab bar:

- `All`
- `All valid`
- `Any valid`
- `Some broken`
- `All broken`
- `No images`
- `Selected`

Tabs dynamically filter visible cards and update counters.

---

## 6. Bulk Selection Actions

Buttons (bottom bar or action panel):

- `Select all on current tab`
- `Select all with any valid image`
- `Select all with only valid images`
- `Deselect all`
- `Invert selection` (optional)

### Export Actions

**Create & Download JSON**

- Generates new JSON array
- Contains full original objects
- Filename format:  
  `json-image-cleaner-YYYYMMDD.json`
- Use:
  - `Blob`
  - `URL.createObjectURL`

Optional:
- `Copy to clipboard`

---

## 7. Metrics Panel (Live Counters)

Displayed near tabs:

- Total items
- Items with no images
- Items with at least one valid image
- Items with all images valid
- Items with any broken image
- Selected count

All values update dynamically.

---

# UI / UX Requirements

### Theme

- Light theme
- Neutral background tones
- Single accent color (teal / blue-green)
- Soft shadows
- 8px border radius

### Grid

Responsive:

- 3 columns (desktop)
- 2 columns (tablet)
- 1 column (mobile)
- 16px spacing between cards

### Modal

- Large JSON viewer
- Copy button
- Close button

### UX Details

- Validation progress indicator:  
  `X / Y images validated`
- Card-level progress bar
- Clicking counters opens related tab
- Optional confirmation for large bulk actions
- Optional localStorage session restore
- `Re-scan images` button

---

# Technical Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS (preferred) OR CSS Modules
- No backend
- No external APIs

Allowed libraries:

- lodash (deep traversal)
- react-dropzone (optional)
- date-fns (filename formatting)
- react-window (for virtualization)

Recommended:

- Web Worker for image validation (large datasets)
- Concurrency limiter (semaphore/queue)

---

# Algorithms

## Recursive String Extraction

```ts
function findAllStrings(obj: unknown, path = ''): Array<{ value: string; path: string }> {
  // recursively traverse object/array
}
````

## Image URL Heuristic

```ts
function isLikelyImageUrl(url: string) {
  const hasHttp = /^https?:\/\//i.test(url);
  const hasImageExt = /\.(jpe?g|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
  return hasHttp && (hasImageExt || url.length < 200);
}
```

## Image Validation

```ts
async function validateImage(url: string, timeoutMs = 8000): Promise<'valid' | 'broken'> {
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
```

Concurrency must be controlled via queue or semaphore.

---

# Edge Cases & Reliability

* 500+ items → enable virtualization
* Batch validation
* Duplicate URLs → cache results
* URLs without extension → attempt load anyway
* CORS safe (we only use `<img>` loading)
* Large JSON → avoid blocking UI

---

# Core Components

* `UploadPanel`
* `TabsBar`
* `MetricsPanel`
* `CardsGrid`
* `CardItem`
* `ImageValidator` (or Worker)
* `ActionBar`
* `ModalViewer`
* Global store (Zustand or React Context)

---

# Repository Deliverables

* Next.js (TypeScript) project
* README (dev/build instructions)
* `samples/` folder with example JSON
* Unit tests:

  * `findAllStrings`
  * `isLikelyImageUrl`
* Optional basic e2e test
* Simple design tokens (colors, spacing)

---

# Test Scenarios

1. 100 items, half valid images → test `any_valid` bulk select
2. All URLs broken → `All broken` tab
3. No images → `No images`
4. URL without extension but valid image → should be `valid`
5. Many duplicate URLs → caching works

---

# Optional Enhancements

* CSV export
* Search filter (title / id)
* Support multiple JSON files (merge or select one)
* Persist last session in localStorage

---

# Final Constraint

* Fully client-side
* No backend
* No API calls
* Must be production-clean MVP

```
```
