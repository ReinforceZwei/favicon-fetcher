import { fetchResource } from './fetcher.js';
import { resolveUrl } from './parser.js';
import type { Icon, Title, Description, RequestOptions, WebAppManifest } from './types.js';

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

/**
 * Extract titles from manifest object
 * @param manifest - Parsed manifest object
 * @returns Array of title objects
 */
export function extractTitlesFromManifest(manifest: WebAppManifest): Title[] {
  const titles: Title[] = [];

  try {
    if (!manifest) {
      return titles;
    }

    // Extract 'name' field
    if (manifest.name && typeof manifest.name === 'string' && manifest.name.trim()) {
      titles.push({
        value: manifest.name.trim(),
        source: 'manifest',
        property: 'name'
      });
    }

    // Extract 'short_name' field
    if (manifest.short_name && typeof manifest.short_name === 'string' && manifest.short_name.trim()) {
      titles.push({
        value: manifest.short_name.trim(),
        source: 'manifest',
        property: 'short_name'
      });
    }
  } catch (error: any) {
    console.warn('Failed to extract titles from manifest:', error.message);
  }

  return titles;
}

/**
 * Extract descriptions from manifest object
 * @param manifest - Parsed manifest object
 * @returns Array of description objects
 */
export function extractDescriptionsFromManifest(manifest: WebAppManifest): Description[] {
  const descriptions: Description[] = [];

  try {
    if (!manifest) {
      return descriptions;
    }

    // Extract 'description' field
    if (manifest.description && typeof manifest.description === 'string' && manifest.description.trim()) {
      descriptions.push({
        value: manifest.description.trim(),
        source: 'manifest',
        property: 'description'
      });
    }
  } catch (error: any) {
    console.warn('Failed to extract descriptions from manifest:', error.message);
  }

  return descriptions;
}

