import { fetchResource } from './fetcher.js';
import { resolveUrl } from './parser.js';
import type { Icon, RequestOptions, WebAppManifest } from './types.js';

/**
 * Fetch and parse manifest.json
 * @param manifestUrl - URL of the manifest file
 * @param options - Request options
 * @returns Parsed manifest object or null
 */
export async function fetchManifest(
  manifestUrl: string,
  options: RequestOptions = {}
): Promise<WebAppManifest | null> {
  try {
    const buffer = await fetchResource(manifestUrl, options);
    const manifestText = buffer.toString('utf-8');
    const manifest = JSON.parse(manifestText) as WebAppManifest;
    return manifest;
  } catch (error: any) {
    console.warn(`Failed to fetch manifest from ${manifestUrl}:`, error.message);
    return null;
  }
}

/**
 * Extract icons from manifest object
 * @param manifest - Parsed manifest object
 * @param baseUrl - Base URL for resolving relative URLs
 * @returns Array of icon objects
 */
export function extractIconsFromManifest(manifest: WebAppManifest, baseUrl: string): Icon[] {
  const icons: Icon[] = [];

  try {
    if (!manifest || !manifest.icons || !Array.isArray(manifest.icons)) {
      return icons;
    }

    manifest.icons.forEach(icon => {
      if (icon.src) {
        icons.push({
          url: resolveUrl(icon.src, baseUrl),
          type: icon.type || 'manifest-icon',
          sizes: icon.sizes || '',
          source: 'manifest'
        });
      }
    });
  } catch (error: any) {
    console.warn('Failed to extract icons from manifest:', error.message);
  }

  return icons;
}

