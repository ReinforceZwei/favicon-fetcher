import { fetchHTML } from './fetcher.js';
import { parseTitle, parseIconLinks, getManifestUrl } from './parser.js';
import { fetchManifest, extractIconsFromManifest } from './manifest.js';
import { addMetadataToIcons } from './metadata.js';
import type { FetchOptions, FetchResult, FetchError, Icon } from './types.js';

/**
 * Validate and normalize URL
 * @param url - URL to validate
 * @returns Normalized URL
 */
function validateUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    
    // Ensure protocol is http or https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('URL must use http or https protocol');
    }
    
    return parsedUrl.href;
  } catch (error: any) {
    throw new Error(`Invalid URL: ${url}`);
  }
}

/**
 * Get default favicon URL
 * @param baseUrl - Base URL
 * @returns Default favicon URL
 */
function getDefaultFaviconUrl(baseUrl: string): string | null {
  try {
    const parsedUrl = new URL(baseUrl);
    return `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch favicon and title from a URL
 * @param url - The URL to fetch favicon from
 * @param options - Options object
 * @returns Result object with url, title, and icons
 */
export async function fetchFavicon(url: string, options: FetchOptions = {}): Promise<FetchResult> {
  // Validate options
  const {
    includeMetadata = false,
    timeout = 10000,
    userAgent
  } = options;

  // Validate and normalize URL
  const normalizedUrl = validateUrl(url);
  
  const requestOptions = {
    timeout,
    userAgent
  };

  // Track errors from non-critical steps
  const errors: FetchError[] = [];

  try {
    // Step 1: Fetch HTML (CRITICAL - must succeed)
    const html = await fetchHTML(normalizedUrl, requestOptions);

    // Step 2: Parse title (non-critical)
    let title = '';
    try {
      title = parseTitle(html);
    } catch (error: any) {
      errors.push({
        step: 'parse_title',
        message: error.message
      });
    }

    // Step 3: Parse icon links from HTML (non-critical)
    let htmlIcons: Icon[] = [];
    try {
      htmlIcons = parseIconLinks(html, normalizedUrl);
    } catch (error: any) {
      errors.push({
        step: 'parse_icon_links',
        message: error.message
      });
    }

    // Step 4: Check for manifest (non-critical)
    let manifestUrl: string | null = null;
    try {
      manifestUrl = getManifestUrl(html, normalizedUrl);
    } catch (error: any) {
      errors.push({
        step: 'get_manifest_url',
        message: error.message
      });
    }

    // Step 5: Fetch and parse manifest (non-critical)
    let manifestIcons: Icon[] = [];
    if (manifestUrl) {
      try {
        const manifest = await fetchManifest(manifestUrl, requestOptions);
        
        if (manifest) {
          manifestIcons = extractIconsFromManifest(manifest, normalizedUrl);
        }
      } catch (error: any) {
        errors.push({
          step: 'fetch_manifest',
          message: error.message,
          url: manifestUrl
        });
      }
    }

    // Step 6: Merge icons (HTML icons take priority)
    let icons: Icon[] = [...htmlIcons, ...manifestIcons];

    // Step 7: If no icons found, try default favicon.ico
    if (icons.length === 0) {
      const defaultFaviconUrl = getDefaultFaviconUrl(normalizedUrl);
      
      if (defaultFaviconUrl) {
        icons.push({
          url: defaultFaviconUrl,
          type: 'default',
          sizes: '',
          source: 'default'
        });
      }
    }

    // Step 8: Optionally add metadata (non-critical)
    if (includeMetadata && icons.length > 0) {
      try {
        icons = await addMetadataToIcons(icons, requestOptions);
      } catch (error: any) {
        errors.push({
          step: 'add_metadata',
          message: error.message
        });
      }
    }

    // Step 9: Return result with errors if any occurred
    const result: FetchResult = {
      url: normalizedUrl,
      title,
      icons
    };

    if (errors.length > 0) {
      result.errors = errors;
    }

    return result;

  } catch (error: any) {
    // Re-throw with more context (only for critical HTML fetch failure)
    throw new Error(`Failed to fetch favicon for ${url}: ${error.message}`);
  }
}

// Export types for TypeScript consumers
export type {
  Icon,
  ImageMetadata,
  FetchOptions,
  FetchResult,
  FetchError,
  RequestOptions,
  ManifestIcon,
  WebAppManifest
} from './types.js';

