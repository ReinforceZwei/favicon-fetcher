const { URL } = require('url');
const { fetchHTML } = require('./fetcher');
const { parseTitle, parseIconLinks, getManifestUrl } = require('./parser');
const { fetchManifest, extractIconsFromManifest } = require('./manifest');
const { addMetadataToIcons } = require('./metadata');

/**
 * Validate and normalize URL
 * @param {string} url - URL to validate
 * @returns {string} Normalized URL
 */
function validateUrl(url) {
  try {
    const parsedUrl = new URL(url);
    
    // Ensure protocol is http or https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('URL must use http or https protocol');
    }
    
    return parsedUrl.href;
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }
}

/**
 * Get default favicon URL
 * @param {string} baseUrl - Base URL
 * @returns {string} Default favicon URL
 */
function getDefaultFaviconUrl(baseUrl) {
  try {
    const parsedUrl = new URL(baseUrl);
    return `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch favicon and title from a URL
 * @param {string} url - The URL to fetch favicon from
 * @param {object} options - Options object
 * @param {boolean} options.includeMetadata - Include image metadata (default: false)
 * @param {number} options.timeout - Request timeout in ms (default: 10000)
 * @param {string} options.userAgent - Custom user agent string
 * @returns {Promise<object>} Result object with url, title, and icons
 */
async function fetchFavicon(url, options = {}) {
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
    let manifestIcons = [];

    if (manifestUrl) {
      // Step 5: Fetch and parse manifest
      const manifest = await fetchManifest(manifestUrl, requestOptions);
      
      if (manifest) {
        manifestIcons = extractIconsFromManifest(manifest, normalizedUrl);
      }
    }

    // Step 6: Merge icons (HTML icons take priority)
    let icons = [...htmlIcons, ...manifestIcons];

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

  } catch (error) {
    // Re-throw with more context
    throw new Error(`Failed to fetch favicon for ${url}: ${error.message}`);
  }
}

module.exports = {
  fetchFavicon
};

