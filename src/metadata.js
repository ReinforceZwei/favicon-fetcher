const sizeOf = require('image-size');
const { fetchResource } = require('./fetcher');

/**
 * Get image metadata from a URL
 * @param {string} imageUrl - URL of the image
 * @param {object} options - Request options
 * @returns {Promise<object|null>} Image metadata or null
 */
async function getImageMetadata(imageUrl, options = {}) {
  try {
    const buffer = await fetchResource(imageUrl, options);
    
    // Get image dimensions and format
    const dimensions = sizeOf(buffer);
    
    return {
      width: dimensions.width,
      height: dimensions.height,
      format: dimensions.type,
      size: buffer.length
    };
  } catch (error) {
    console.warn(`Failed to get metadata for ${imageUrl}:`, error.message);
    return null;
  }
}

/**
 * Add metadata to icon objects
 * @param {Array} icons - Array of icon objects
 * @param {object} options - Request options
 * @returns {Promise<Array>} Icons with metadata added
 */
async function addMetadataToIcons(icons, options = {}) {
  const iconsWithMetadata = await Promise.all(
    icons.map(async (icon) => {
      const metadata = await getImageMetadata(icon.url, options);
      
      if (metadata) {
        return {
          ...icon,
          metadata
        };
      }
      
      return icon;
    })
  );

  return iconsWithMetadata;
}

module.exports = {
  getImageMetadata,
  addMetadataToIcons
};

