import * as cheerio from 'cheerio';
import type { Icon, Title } from './types.js';

/**
 * Parse the page title from HTML
 * @param html - HTML content
 * @returns Page title
 */
export function parseTitle(html: string): string {
  try {
    const $ = cheerio.load(html);
    const title = $('title').first().text().trim();
    return title || '';
  } catch (error: any) {
    console.warn('Failed to parse title:', error.message);
    return '';
  }
}

/**
 * Parse all title sources from HTML
 * @param html - HTML content
 * @returns Array of title objects with metadata
 */
export function parseTitles(html: string): Title[] {
  const titles: Title[] = [];

  try {
    const $ = cheerio.load(html);

    // 1. HTML title tag
    const htmlTitle = $('title').first().text().trim();
    if (htmlTitle) {
      titles.push({
        value: htmlTitle,
        source: 'html',
        property: 'title'
      });
    }

    // 2. OpenGraph title
    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (ogTitle && ogTitle.trim()) {
      titles.push({
        value: ogTitle.trim(),
        source: 'opengraph',
        property: 'og:title'
      });
    }

    // 3. Twitter title
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');
    if (twitterTitle && twitterTitle.trim()) {
      titles.push({
        value: twitterTitle.trim(),
        source: 'twitter',
        property: 'twitter:title'
      });
    }
  } catch (error: any) {
    console.warn('Failed to parse titles:', error.message);
  }

  return titles;
}

/**
 * Convert a relative URL to absolute URL
 * @param relativeUrl - Relative or absolute URL
 * @param baseUrl - Base URL for resolution
 * @returns Absolute URL
 */
export function resolveUrl(relativeUrl: string, baseUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch (error: any) {
    console.warn(`Failed to resolve URL ${relativeUrl}:`, error.message);
    return relativeUrl;
  }
}

/**
 * Parse icon links from HTML
 * @param html - HTML content
 * @param baseUrl - Base URL for resolving relative URLs
 * @returns Array of icon objects
 */
export function parseIconLinks(html: string, baseUrl: string): Icon[] {
  const icons: Icon[] = [];

  try {
    const $ = cheerio.load(html);

    // Icon rel types to search for
    const iconRelTypes = [
      'icon',
      'shortcut icon',
      'apple-touch-icon',
      'apple-touch-icon-precomposed',
      'mask-icon'
    ];

    // Search for link tags with icon rel attributes
    $('link').each((_i, elem) => {
      const $elem = $(elem);
      const rel = $elem.attr('rel');
      const href = $elem.attr('href');

      if (rel && href) {
        const relLower = rel.toLowerCase();
        
        // Check if this is an icon link
        const isIconLink = iconRelTypes.some(type => relLower.includes(type));
        
        if (isIconLink) {
          icons.push({
            url: resolveUrl(href, baseUrl),
            type: rel,
            sizes: $elem.attr('sizes') || '',
            source: 'html'
          });
        }
      }
    });

    // Fallback: Check for og:image as a last resort
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && icons.length === 0) {
      icons.push({
        url: resolveUrl(ogImage, baseUrl),
        type: 'og:image',
        sizes: '',
        source: 'html'
      });
    }
  } catch (error: any) {
    console.warn('Failed to parse icon links:', error.message);
  }

  return icons;
}

/**
 * Get manifest URL from HTML
 * @param html - HTML content
 * @param baseUrl - Base URL for resolving relative URLs
 * @returns Manifest URL or null if not found
 */
export function getManifestUrl(html: string, baseUrl: string): string | null {
  try {
    const $ = cheerio.load(html);
    const manifestLink = $('link[rel="manifest"]').attr('href');
    
    if (manifestLink) {
      return resolveUrl(manifestLink, baseUrl);
    }
  } catch (error: any) {
    console.warn('Failed to get manifest URL:', error.message);
  }

  return null;
}

