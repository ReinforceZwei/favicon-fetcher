# Favicon Fetcher

A Node.js library to fetch website favicons and titles with optional image metadata extraction. The library uses browser-like headers to bypass basic bot detection.

## Features

- 🌐 Fetch website favicons and page titles
- 🔍 Parse multiple icon sources (HTML, manifest.json, default favicon.ico)
- 📊 Optional image metadata extraction (dimensions, format, file size)
- 🤖 Browser-like headers to bypass basic bot detection
- ⚡ Support for various icon types (favicon, apple-touch-icon, manifest icons)
- 🔗 Automatic URL resolution for relative paths

## Installation

```bash
npm install
```

## Dependencies

- `axios` - HTTP client for fetching URLs
- `cheerio` - Fast HTML parser
- `image-size` - Extract image dimensions and format

## Usage

### Basic Usage

```javascript
const { fetchFavicon } = require('./src/index.js');

(async () => {
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
})();
```

### With Image Metadata

```javascript
const { fetchFavicon } = require('./src/index.js');

(async () => {
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
})();
```

### Custom Options

```javascript
const { fetchFavicon } = require('./src/index.js');

const options = {
  includeMetadata: false,    // Enable/disable image metadata extraction
  timeout: 10000,            // Request timeout in milliseconds
  userAgent: 'CustomBot/1.0' // Custom user agent (optional)
};

const result = await fetchFavicon('https://example.com', options);
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

```
src/
├── index.js       # Main entry point & public API
├── fetcher.js     # HTTP client with browser-like headers
├── parser.js      # HTML parsing for icons and title
├── manifest.js    # Manifest.json handler
└── metadata.js    # Image metadata extractor
```

## License

ISC

