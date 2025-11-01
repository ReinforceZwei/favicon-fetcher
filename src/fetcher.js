const axios = require('axios');

/**
 * Browser-like headers to bypass basic bot detection
 */
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Cache-Control': 'max-age=0'
};

/**
 * Fetch HTML content from a URL with browser-like headers
 * @param {string} url - The URL to fetch
 * @param {object} options - Request options
 * @returns {Promise<string>} HTML content
 */
async function fetchHTML(url, options = {}) {
  const { timeout = 10000, userAgent } = options;

  try {
    const headers = { ...DEFAULT_HEADERS };
    if (userAgent) {
      headers['User-Agent'] = userAgent;
    }

    const response = await axios.get(url, {
      headers,
      timeout,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText} for ${url}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error(`Request timeout after ${timeout}ms for ${url}`);
    } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      throw new Error(`Domain not found: ${url}`);
    } else {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
  }
}

/**
 * Fetch a resource (image, manifest, etc.) as a buffer
 * @param {string} url - The URL to fetch
 * @param {object} options - Request options
 * @returns {Promise<Buffer>} Resource buffer
 */
async function fetchResource(url, options = {}) {
  const { timeout = 10000, userAgent } = options;

  try {
    const headers = { ...DEFAULT_HEADERS };
    if (userAgent) {
      headers['User-Agent'] = userAgent;
    }

    const response = await axios.get(url, {
      headers,
      timeout,
      maxRedirects: 5,
      responseType: 'arraybuffer',
      validateStatus: (status) => status >= 200 && status < 400
    });

    return Buffer.from(response.data);
  } catch (error) {
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText} for ${url}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error(`Request timeout after ${timeout}ms for ${url}`);
    } else {
      throw new Error(`Failed to fetch resource ${url}: ${error.message}`);
    }
  }
}

module.exports = {
  fetchHTML,
  fetchResource
};

