# JSON Image Cleaner

A single-page Next.js application that runs entirely in the browser (client-side only, no backend, no external APIs).

## Features

- **JSON Upload**: Drag & drop or file input support
- **Automatic Image URL Detection**: Recursively finds all image URLs in JSON objects
- **Client-Side Image Validation**: Validates images via browser with 8-second timeout
- **Card-Based UI**: Preview cards with thumbnails, status indicators, and JSON preview
- **Filtering Tabs**: Filter by validation status (All, All Valid, Any Valid, Some Broken, All Broken, No Images, Selected)
- **Bulk Selection**: Select/deselect items based on various criteria
- **Export**: Download filtered JSON with selected items

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Utilities**: lodash, date-fns, react-window, react-dropzone

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Tests

```bash
node --test src/__tests__/utils.test.ts
```

## Usage

1. **Upload JSON**: Drag & drop a `.json` file or click to select
2. **Automatic Processing**: The app detects image URLs and validates them
3. **Filter & Select**: Use tabs to filter items by status
4. **Bulk Actions**: Select items using the action bar buttons
5. **Export**: Download selected items as a new JSON file

## Sample Files

Sample JSON files are provided in the `samples/` directory:

- `mixed-images.json` - Mix of valid, broken, and no-image items
- `all-valid.json` - All items with valid images
- `all-broken.json` - All items with broken images
- `nested-array.json` - JSON with nested array structure

## Image Detection

The app detects image URLs using these heuristics:

- URLs starting with `http://` or `https://`
- URLs with image extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.bmp`
- Short HTTP(S) URLs (under 200 characters) even without extensions

## Card Statuses

| Status | Description |
|--------|-------------|
| All Valid | All images loaded successfully |
| Any Valid | At least one valid image |
| Some Broken | Mix of valid and broken images |
| All Broken | All images failed to load |
| No Images | No image URLs detected |

## Bulk Selection Options

- Select all on current tab
- Select all with any valid image
- Select all with only valid images
- Deselect all
- Invert selection

## Export Format

Downloaded JSON filename: `json-image-cleaner-YYYYMMDD.json`

Contains the original objects (unchanged) for selected items.

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

## Limitations

- Client-side only (no server-side processing)
- Image validation uses browser's `<img>` element (CORS-safe)
- Concurrent image loading limited to 8 images at a time
- 8-second timeout per image

## License

MIT
