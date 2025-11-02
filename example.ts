import { fetchFavicon } from './dist/index.js';

/**
 * Example usage of the favicon-fetcher library
 */

async function example1(): Promise<void> {
  console.log('=== Example 1: Basic Usage ===\n');
  
  try {
    const result = await fetchFavicon('https://github.com', {
      includeMetadata: true
    });
    
    console.log('Title:', result.title);
    console.log('URL:', result.url);
    console.log('Icons found:', result.icons.length);
    console.log('\nIcons:');
    
    result.icons.forEach((icon, index) => {
      console.log(`${index + 1}. Type: ${icon.type}`);
      console.log(`   Source: ${icon.source}`);
      console.log(`   Sizes: ${icon.sizes || 'N/A'}`);
      console.log(`   URL: ${icon.url}`);
      if (icon.metadata) {
        console.log(`   Dimensions: ${icon.metadata.width}x${icon.metadata.height}px`);
        console.log(`   Format: ${icon.metadata.format}`);
        console.log(`   Size: ${(icon.metadata.size / 1024).toFixed(2)} KB`);
      } else {
        console.log('   Metadata: Not available');
      }
      console.log('');
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

async function example2(): Promise<void> {
  console.log('\n=== Example 2: With Image Metadata ===\n');
  
  try {
    const result = await fetchFavicon('https://www.wikipedia.org', {
      includeMetadata: true
    });
    
    console.log('Title:', result.title);
    console.log('Icons found:', result.icons.length);
    console.log('\nIcons with metadata:');
    
    result.icons.forEach((icon, index) => {
      console.log(`${index + 1}. Type: ${icon.type}`);
      console.log(`   URL: ${icon.url}`);
      
      if (icon.metadata) {
        console.log(`   Dimensions: ${icon.metadata.width}x${icon.metadata.height}px`);
        console.log(`   Format: ${icon.metadata.format}`);
        console.log(`   Size: ${(icon.metadata.size / 1024).toFixed(2)} KB`);
      } else {
        console.log('   Metadata: Not available');
      }
      console.log('');
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

async function example3(): Promise<void> {
  console.log('\n=== Example 3: Custom Options ===\n');
  
  try {
    const result = await fetchFavicon('https://www.npmjs.com', {
      timeout: 5000,
      includeMetadata: false
    });
    
    console.log('Title:', result.title);
    console.log('Total icons:', result.icons.length);
    console.log('\nIcon sources breakdown:');
    
    const sources = result.icons.reduce((acc, icon) => {
      acc[icon.source] = (acc[icon.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(sources).forEach(([source, count]) => {
      console.log(`- ${source}: ${count} icon(s)`);
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

// Run examples
(async () => {
  console.log('Favicon Fetcher - Examples\n');
  console.log('Note: These examples fetch real websites and may take a few seconds.\n');
  console.log('='.repeat(60));
  
  await example1();
  await example2();
  await example3();
  
  console.log('\n' + '='.repeat(60));
  console.log('\nExamples completed!');
})();

