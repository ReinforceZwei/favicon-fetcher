const cheerio = require('cheerio');
const { URL } = require('url');

/**
 * Parse the page title from HTML
 * @param {string} html - HTML content
 * @returns {string} Page title
 */
function parseTitle(html) {
  try {
    const $ = cheerio.load(html);
    const title = $('title').first().text().trim();
    return title || '';
  } catch (error) {
    console.warn('Failed to parse title:', error.message);
    return '';
  }
}

/**
 * Convert a relative URL to absolute URL
 * @param {string} relativeUrl - Relative or absolute URL
 * @param {string} baseUrl - Base URL for resolution
 * @returns {string} Absolute URL
 */
function resolveUrl(relativeUrl, baseUrl) {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch (error) {
    console.warn(`Failed to resolve URL ${relativeUrl}:`, error.message);
    return relativeUrl;
  }
}

/**
 * Parse icon links from HTML
 * @param {string} html - HTML content
 * @param {string} baseUrl - Base URL for resolving relative URLs
 * @returns {Array} Array of icon objects
 */
function parseIconLinks(html, baseUrl) {
  const icons = [];

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
    $('link').each((i, elem) => {
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
  } catch (error) {
    console.warn('Failed to parse icon links:', error.message);
  }

  return icons;
}

/**
 * Get manifest URL from HTML
 * @param {string} html - HTML content
 * @param {string} baseUrl - Base URL for resolving relative URLs
 * @returns {string|null} Manifest URL or null if not found
 */
function getManifestUrl(html, baseUrl) {
  try {
    const $ = cheerio.load(html);
    const manifestLink = $('link[rel="manifest"]').attr('href');
    
    if (manifestLink) {
      return resolveUrl(manifestLink, baseUrl);
    }
  } catch (error) {
    console.warn('Failed to get manifest URL:', error.message);
  }

  return null;
}

module.exports = {
  parseTitle,
  parseIconLinks,
  getManifestUrl,
  resolveUrl
};

