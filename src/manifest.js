const { fetchResource } = require('./fetcher');
const { resolveUrl } = require('./parser');

/**
 * Fetch and parse manifest.json
 * @param {string} manifestUrl - URL of the manifest file
 * @param {object} options - Request options
 * @returns {Promise<object|null>} Parsed manifest object or null
 */
async function fetchManifest(manifestUrl, options = {}) {
  try {
    const buffer = await fetchResource(manifestUrl, options);
    const manifestText = buffer.toString('utf-8');
    const manifest = JSON.parse(manifestText);
    return manifest;
  } catch (error) {
    console.warn(`Failed to fetch manifest from ${manifestUrl}:`, error.message);
    return null;
  }
}

/**
 * Extract icons from manifest object
 * @param {object} manifest - Parsed manifest object
 * @param {string} baseUrl - Base URL for resolving relative URLs
 * @returns {Array} Array of icon objects
 */
function extractIconsFromManifest(manifest, baseUrl) {
  const icons = [];

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
  } catch (error) {
    console.warn('Failed to extract icons from manifest:', error.message);
  }

  return icons;
}

module.exports = {
  fetchManifest,
  extractIconsFromManifest
};

