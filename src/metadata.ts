import sizeOf from 'image-size';
import { fetchResource } from './fetcher.js';
import type { Icon, ImageMetadata, RequestOptions } from './types.js';

/**
 * Get image metadata from a URL
 * @param imageUrl - URL of the image
 * @param options - Request options
 * @returns Image metadata object (with buffer) or null if failed
 */
export async function getImageMetadata(
  imageUrl: string,
  options: RequestOptions = {}
): Promise<ImageMetadata | null> {
  try {
    const buffer = await fetchResource(imageUrl, options);

    // Get image dimensions and format
    const dimensions = sizeOf(buffer);

    if (!dimensions.width || !dimensions.height || !dimensions.type) {
      return null;
    }

    return {
      width: dimensions.width,
      height: dimensions.height,
      format: dimensions.type,
      size: buffer.length,
      buffer: buffer
    };
  } catch (error: any) {
    console.warn(`Failed to get metadata for ${imageUrl}:`, error.message);
    return null;
  }
}

/**
 * Add metadata to icon objects
 * @param icons - Array of icon objects
 * @param options - Request options
 * @returns Icons with metadata added
 */
export async function addMetadataToIcons(
  icons: Icon[],
  options: RequestOptions = {}
): Promise<Icon[]> {
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

