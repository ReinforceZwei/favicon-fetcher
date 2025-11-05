/**
 * Image metadata extracted from an icon
 */
export interface ImageMetadata {
  /** Width of the image in pixels */
  width: number;
  /** Height of the image in pixels */
  height: number;
  /** Image format (e.g., 'png', 'ico', 'jpeg', 'svg') */
  format: string;
  /** File size in bytes */
  size: number;
  /** Raw image data buffer */
  buffer: Buffer;
}

/**
 * Icon object representing a favicon
 */
export interface Icon {
  /** Absolute URL of the icon */
  url: string;
  /** Type of icon (e.g., 'icon', 'apple-touch-icon', 'manifest-icon') */
  type: string;
  /** Size attribute (e.g., '192x192', 'any') */
  sizes: string;
  /** Source where the icon was found (e.g., 'html', 'manifest', 'default') */
  source: 'html' | 'manifest' | 'default';
  /** Optional metadata about the image (dimensions, format, size) */
  metadata?: ImageMetadata;
}

/**
 * Title object representing a page title from various sources
 */
export interface Title {
  /** The title text value */
  value: string;
  /** Source where the title was found */
  source: 'html' | 'opengraph' | 'twitter' | 'manifest';
  /** Property name (e.g., 'title', 'og:title', 'twitter:title', 'name', 'short_name') */
  property: string;
}

/**
 * Options for fetching favicons
 */
export interface FetchOptions {
  /** Whether to include image metadata (dimensions, format, size) */
  includeMetadata?: boolean;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom user agent string for requests */
  userAgent?: string;
}

/**
 * Error information for failed operations
 */
export interface FetchError {
  /** Step where the error occurred */
  step: string;
  /** Error message */
  message: string;
  /** Optional URL that caused the error */
  url?: string;
}

/**
 * Result returned by fetchFavicon
 */
export interface FetchResult {
  /** The normalized URL that was fetched */
  url: string;
  /** Page title extracted from HTML (for backward compatibility) */
  title: string;
  /** Array of titles from various sources with metadata */
  titles: Title[];
  /** Array of icons found */
  icons: Icon[];
  /** Optional array of errors that occurred during non-critical steps */
  errors?: FetchError[];
}

/**
 * Internal request options for HTTP requests
 */
export interface RequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom user agent string */
  userAgent?: string;
}

/**
 * Icon entry in a web app manifest
 */
export interface ManifestIcon {
  /** Icon source URL (relative or absolute) */
  src: string;
  /** MIME type of the icon */
  type?: string;
  /** Space-separated list of sizes (e.g., '192x192 512x512') */
  sizes?: string;
  /** Purpose of the icon (e.g., 'any', 'maskable', 'monochrome') */
  purpose?: string;
}

/**
 * Web app manifest structure
 */
export interface WebAppManifest {
  /** Application name */
  name?: string;
  /** Short application name */
  short_name?: string;
  /** Icons array */
  icons?: ManifestIcon[];
  /** Other manifest properties */
  [key: string]: any;
}

