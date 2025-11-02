# Favicon Fetcher

A Node.js library to fetch website favicons and titles with optional image metadata extraction. The library uses browser-like headers to bypass basic bot detection.

## Features

- 🌐 Fetch website favicons and page titles
- 🔍 Parse multiple icon sources (HTML, manifest.json, default favicon.ico)
- 📊 Optional image metadata extraction (dimensions, format, file size)
- 🤖 Browser-like headers to bypass basic bot detection
- ⚡ Support for various icon types (favicon, apple-touch-icon, manifest icons)
- 🔗 Automatic URL resolution for relative paths
- 📘 **Full TypeScript support** with comprehensive type definitions
- 🎯 ES Modules with modern JavaScript syntax

## Installation

```bash
npm install
```

## Dependencies

- `axios` - HTTP client for fetching URLs
- `cheerio` - Fast HTML parser
- `image-size` - Extract image dimensions and format

## Usage

### TypeScript

This library is written in TypeScript and provides full type definitions out of the box.

```typescript
import { fetchFavicon, type FetchResult, type Icon } from '@reinforcezwei/favicon-fetcher';

const result: FetchResult = await fetchFavicon('https://github.com');
console.log('Title:', result.title);
console.log('Icons:', result.icons);
```

### JavaScript (ES Modules)

```javascript
import { fetchFavicon } from '@reinforcezwei/favicon-fetcher';

const result = await fetchFavicon('https://github.com');
console.log('Title:', result.title);
console.log('Icons:', result.icons);
```

### Basic Usage

```javascript
import { fetchFavicon } from '@reinforcezwei/favicon-fetcher';

try {
  const result = await fetchFavicon('https://github.com');
  
  console.log('Title:', result.title);
  console.log('URL:', result.url);
  console.log('Icons found:', result.icons.length);
  
  result.icons.forEach(icon => {
    console.log(`- ${icon.type} (${icon.sizes || 'no size'}): ${icon.url}`);
  });
} catch (error) {
  console.error('Error:', error.message);
}
```

### With Image Metadata

```javascript
import { fetchFavicon } from '@reinforcezwei/favicon-fetcher';

try {
  const result = await fetchFavicon('https://example.com', {
    includeMetadata: true,
    timeout: 5000
  });
  
  console.log('Title:', result.title);
  
  result.icons.forEach(icon => {
    console.log(`\nIcon: ${icon.type}`);
    console.log(`URL: ${icon.url}`);
    
    if (icon.metadata) {
      console.log(`Dimensions: ${icon.metadata.width}x${icon.metadata.height}`);
      console.log(`Format: ${icon.metadata.format}`);
      console.log(`Size: ${icon.metadata.size} bytes`);
    }
  });
} catch (error) {
  console.error('Error:', error.message);
}
```

### Custom Options

```javascript
import { fetchFavicon } from '@reinforcezwei/favicon-fetcher';

const options = {
  includeMetadata: false,    // Enable/disable image metadata extraction
  timeout: 10000,            // Request timeout in milliseconds
  userAgent: 'CustomBot/1.0' // Custom user agent (optional)
};

const result = await fetchFavicon('https://example.com', options);
```

### TypeScript with Type Safety

```typescript
import { fetchFavicon, type FetchOptions, type FetchResult } from '@reinforcezwei/favicon-fetcher';

const options: FetchOptions = {
  includeMetadata: true,
  timeout: 10000,
  userAgent: 'MyBot/1.0'
};

const result: FetchResult = await fetchFavicon('https://example.com', options);

// TypeScript provides autocomplete and type checking
result.icons.forEach(icon => {
  console.log(icon.url);      // string
  console.log(icon.type);     // string
  console.log(icon.source);   // 'html' | 'manifest' | 'default'
  
  if (icon.metadata) {
    console.log(icon.metadata.width);   // number
    console.log(icon.metadata.height);  // number
    console.log(icon.metadata.format);  // string
  }
});
```

## API

### `fetchFavicon(url, options)`

Fetches favicon and title from a given URL.

#### Parameters

- **url** (string, required): The URL to fetch favicon from
- **options** (object, optional): Configuration options
  - `includeMetadata` (boolean, default: `false`): Include image metadata
  - `timeout` (number, default: `10000`): Request timeout in milliseconds
  - `userAgent` (string, optional): Custom user agent string

#### Returns

Promise that resolves to an object with the following structure:

```javascript
{
  url: string,              // Original/normalized URL
  title: string,            // Page title
  icons: [
    {
      url: string,          // Absolute icon URL
      type: string,         // Icon type (favicon, apple-touch-icon, etc.)
      sizes: string,        // Size attribute (e.g., "192x192")
      source: string,       // Where found (html, manifest, default)
      metadata: {           // Optional (if includeMetadata: true)
        width: number,      // Image width in pixels
        height: number,     // Image height in pixels
        format: string,     // Image format (png, ico, svg, etc.)
        size: number        // File size in bytes
      }
    }
  ]
}
```

#### Throws

- Error if URL is invalid
- Error if network request fails
- Error for other critical failures

## TypeScript Types

The library exports the following TypeScript types for your convenience:

### `FetchOptions`

Configuration options for favicon fetching:

```typescript
interface FetchOptions {
  includeMetadata?: boolean;  // Include image metadata
  timeout?: number;           // Request timeout in ms
  userAgent?: string;         // Custom user agent
}
```

### `FetchResult`

Result returned by `fetchFavicon()`:

```typescript
interface FetchResult {
  url: string;      // Normalized URL
  title: string;    // Page title
  icons: Icon[];    // Array of found icons
}
```

### `Icon`

Icon object structure:

```typescript
interface Icon {
  url: string;                    // Absolute icon URL
  type: string;                   // Icon type
  sizes: string;                  // Size attribute
  source: 'html' | 'manifest' | 'default';  // Source
  metadata?: {                    // Optional metadata
    width: number;
    height: number;
    format: string;
    size: number;
    buffer: Buffer;
  };
}
```

### `ImageMetadata`

Image metadata structure (when `includeMetadata: true`):

```typescript
interface ImageMetadata {
  width: number;    // Width in pixels
  height: number;   // Height in pixels
  format: string;   // Image format (png, ico, jpeg, etc.)
  size: number;     // File size in bytes
  buffer: Buffer;   // Raw image data
}
```

## Icon Detection

The library searches for icons in the following order:

1. **HTML `<link>` tags**: 
   - `<link rel="icon">`
   - `<link rel="shortcut icon">`
   - `<link rel="apple-touch-icon">`
   - `<link rel="apple-touch-icon-precomposed">`
   - `<link rel="mask-icon">`

2. **Web App Manifest** (`manifest.json`):
   - Fetches and parses icons from manifest file

3. **Default Favicon**:
   - Falls back to `/favicon.ico` if no icons found

4. **OpenGraph Image** (fallback):
   - `<meta property="og:image">` if no other icons found

## Browser-Like Headers

The library uses the following headers to mimic browser behavior:

```javascript
{
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  'Accept': 'text/html,application/xhtml+xml,...',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none'
}
```

## Error Handling

The library implements basic error handling:

- Network errors are caught and re-thrown with descriptive messages
- Non-critical errors (e.g., manifest fetch failure) are logged as warnings
- Partial results are returned when possible (e.g., HTML icons even if manifest fails)

## Architecture

The project is structured as follows:

```
src/
├── index.ts       # Main entry point & public API
├── types.ts       # TypeScript type definitions
├── fetcher.ts     # HTTP client with browser-like headers
├── parser.ts      # HTML parsing for icons and title
├── manifest.ts    # Manifest.json handler
└── metadata.ts    # Image metadata extractor
```

Compiled JavaScript and type definitions are output to the `dist/` directory.

## Development

### Building from Source

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

This compiles TypeScript files from `src/` to JavaScript in `dist/`, generating:
- `.js` files (compiled JavaScript)
- `.d.ts` files (TypeScript type definitions)
- `.js.map` and `.d.ts.map` files (source maps)

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm test` - Run tests
- `npm run example` - Run example scripts

## License

ISC

