import { fetchHTML } from './fetcher.js';
import { parseTitle, parseIconLinks, getManifestUrl } from './parser.js';
import { fetchManifest, extractIconsFromManifest } from './manifest.js';
import { addMetadataToIcons } from './metadata.js';
import type { FetchOptions, FetchResult, Icon } from './types.js';

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

  try {
    // Step 1: Fetch HTML
    const html = await fetchHTML(normalizedUrl, requestOptions);

    // Step 2: Parse title
    const title = parseTitle(html);

    // Step 3: Parse icon links from HTML
    const htmlIcons = parseIconLinks(html, normalizedUrl);

    // Step 4: Check for manifest
    const manifestUrl = getManifestUrl(html, normalizedUrl);
    let manifestIcons: Icon[] = [];

    if (manifestUrl) {
      // Step 5: Fetch and parse manifest
      const manifest = await fetchManifest(manifestUrl, requestOptions);
      
      if (manifest) {
        manifestIcons = extractIconsFromManifest(manifest, normalizedUrl);
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

    // Step 8: Optionally add metadata
    if (includeMetadata && icons.length > 0) {
      icons = await addMetadataToIcons(icons, requestOptions);
    }

    // Step 9: Return result
    return {
      url: normalizedUrl,
      title,
      icons
    };

  } catch (error: any) {
    // Re-throw with more context
    throw new Error(`Failed to fetch favicon for ${url}: ${error.message}`);
  }
}

// Export types for TypeScript consumers
export type {
  Icon,
  ImageMetadata,
  FetchOptions,
  FetchResult,
  RequestOptions,
  ManifestIcon,
  WebAppManifest
} from './types.js';

