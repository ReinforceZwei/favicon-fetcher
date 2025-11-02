import { fetchFavicon } from './dist/index.js';

/**
 * Basic test to verify the library works
 */

async function testBasicFunctionality(): Promise<boolean> {
  console.log('Testing basic functionality...\n');
  
  // Test with a simple, reliable URL
  const testUrl = 'https://example.com';
  
  console.log(`Fetching favicon from: ${testUrl}`);
  
  try {
    const result = await fetchFavicon(testUrl);
    
    console.log('\n✓ Success!');
    console.log('\nResults:');
    console.log('- URL:', result.url);
    console.log('- Title:', result.title);
    console.log('- Icons found:', result.icons.length);
    
    if (result.icons.length > 0) {
      console.log('\nFirst icon:');
      const icon = result.icons[0];
      console.log('- Type:', icon.type);
      console.log('- Source:', icon.source);
      console.log('- URL:', icon.url);
    }
    
    console.log('\n✓ Test passed!');
    return true;
  } catch (error: any) {
    console.error('\n✗ Test failed!');
    console.error('Error:', error.message);
    return false;
  }
}

async function testWithMetadata(): Promise<boolean> {
  console.log('\n' + '='.repeat(60));
  console.log('\nTesting with metadata extraction...\n');
  
  const testUrl = 'https://example.com';
  
  console.log(`Fetching favicon with metadata from: ${testUrl}`);
  
  try {
    const result = await fetchFavicon(testUrl, {
      includeMetadata: true,
      timeout: 8000
    });
    
    console.log('\n✓ Success!');
    console.log('\nResults:');
    console.log('- Title:', result.title);
    console.log('- Icons found:', result.icons.length);
    
    if (result.icons.length > 0 && result.icons[0].metadata) {
      console.log('\nFirst icon metadata:');
      const meta = result.icons[0].metadata;
      console.log('- Dimensions:', `${meta.width}x${meta.height}px`);
      console.log('- Format:', meta.format);
      console.log('- Size:', `${(meta.size / 1024).toFixed(2)} KB`);
    }
    
    console.log('\n✓ Test passed!');
    return true;
  } catch (error: any) {
    console.error('\n✗ Test failed!');
    console.error('Error:', error.message);
    return false;
  }
}

async function testErrorHandling(): Promise<boolean> {
  console.log('\n' + '='.repeat(60));
  console.log('\nTesting error handling...\n');
  
  const invalidUrl = 'not-a-valid-url';
  
  console.log(`Testing with invalid URL: ${invalidUrl}`);
  
  try {
    await fetchFavicon(invalidUrl);
    console.error('\n✗ Test failed! Should have thrown an error.');
    return false;
  } catch (error: any) {
    console.log('\n✓ Success! Error was properly caught:');
    console.log('Error message:', error.message);
    console.log('\n✓ Test passed!');
    return true;
  }
}

// Run all tests
(async () => {
  console.log('='.repeat(60));
  console.log('Favicon Fetcher Library - Basic Tests');
  console.log('='.repeat(60));
  
  const test1 = await testBasicFunctionality();
  const test2 = await testWithMetadata();
  const test3 = await testErrorHandling();
  
  console.log('\n' + '='.repeat(60));
  console.log('\nTest Summary:');
  console.log('- Basic functionality:', test1 ? '✓ PASSED' : '✗ FAILED');
  console.log('- Metadata extraction:', test2 ? '✓ PASSED' : '✗ FAILED');
  console.log('- Error handling:', test3 ? '✓ PASSED' : '✗ FAILED');
  console.log('\n' + '='.repeat(60));
})();

