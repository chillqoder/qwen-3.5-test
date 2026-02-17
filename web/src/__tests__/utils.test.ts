/**
 * Unit tests for utility functions
 * Run with: node --test src/__tests__/utils.test.ts
 */

import { findAllStrings, isLikelyImageUrl, extractImageUrls, calculateCardStatus } from '../lib/utils';

// Test findAllStrings
function testFindAllStrings() {
  console.log('Testing findAllStrings...');
  
  // Test with simple object
  const obj1 = { name: 'test', url: 'https://example.com/image.jpg' };
  const result1 = findAllStrings(obj1);
  console.assert(result1.length === 2, 'Should find 2 strings in simple object');
  console.assert(result1.some(r => r.value === 'test'), 'Should find name value');
  console.assert(result1.some(r => r.value === 'https://example.com/image.jpg'), 'Should find URL value');
  
  // Test with nested object
  const obj2 = {
    user: {
      name: 'John',
      images: ['img1.jpg', 'img2.png']
    }
  };
  const result2 = findAllStrings(obj2);
  console.assert(result2.length === 3, 'Should find 3 strings in nested object');
  
  // Test with array
  const arr = ['a', 'b', { nested: 'c' }];
  const result3 = findAllStrings(arr);
  console.assert(result3.length === 3, 'Should find 3 strings in array');
  
  // Test with empty object
  const emptyObj = {};
  const result4 = findAllStrings(emptyObj);
  console.assert(result4.length === 0, 'Should return empty array for empty object');
  
  // Test with null/undefined
  console.assert(findAllStrings(null).length === 0, 'Should handle null');
  console.assert(findAllStrings(undefined).length === 0, 'Should handle undefined');
  
  console.log('✓ findAllStrings tests passed');
}

// Test isLikelyImageUrl
function testIsLikelyImageUrl() {
  console.log('Testing isLikelyImageUrl...');
  
  // Valid image URLs
  console.assert(isLikelyImageUrl('https://example.com/image.jpg') === true, 'Should accept .jpg');
  console.assert(isLikelyImageUrl('https://example.com/image.jpeg') === true, 'Should accept .jpeg');
  console.assert(isLikelyImageUrl('https://example.com/image.png') === true, 'Should accept .png');
  console.assert(isLikelyImageUrl('https://example.com/image.gif') === true, 'Should accept .gif');
  console.assert(isLikelyImageUrl('https://example.com/image.webp') === true, 'Should accept .webp');
  console.assert(isLikelyImageUrl('https://example.com/image.avif') === true, 'Should accept .avif');
  console.assert(isLikelyImageUrl('https://example.com/image.bmp') === true, 'Should accept .bmp');
  
  // URLs with query params
  console.assert(isLikelyImageUrl('https://example.com/image.jpg?width=100') === true, 'Should accept URL with query params');
  
  // Short URLs without extension (should be accepted)
  console.assert(isLikelyImageUrl('https://picsum.photos/id/1/400/300') === true, 'Should accept short URLs');
  
  // Invalid URLs
  console.assert(isLikelyImageUrl('not-a-url') === false, 'Should reject non-URL');
  console.assert(isLikelyImageUrl('ftp://example.com/file.jpg') === false, 'Should reject FTP URLs');
  console.assert(isLikelyImageUrl('') === false, 'Should reject empty string');
  console.assert(isLikelyImageUrl('https://example.com/document.pdf') === false, 'Should reject non-image extensions');
  
  console.log('✓ isLikelyImageUrl tests passed');
}

// Test extractImageUrls
function testExtractImageUrls() {
  console.log('Testing extractImageUrls...');
  
  const obj = {
    title: 'Test',
    imageUrl: 'https://example.com/image.jpg',
    thumbnail: 'https://example.com/thumb.png',
    description: 'Not an image URL',
    nested: {
      avatar: 'https://example.com/avatar.gif'
    }
  };
  
  const urls = extractImageUrls(obj);
  console.assert(urls.length === 3, `Should find 3 image URLs, found ${urls.length}`);
  console.assert(urls.includes('https://example.com/image.jpg'), 'Should include imageUrl');
  console.assert(urls.includes('https://example.com/thumb.png'), 'Should include thumbnail');
  console.assert(urls.includes('https://example.com/avatar.gif'), 'Should include nested avatar');
  console.assert(!urls.includes('Not an image URL'), 'Should not include description');
  
  // Test deduplication
  const objWithDuplicates = {
    img1: 'https://example.com/same.jpg',
    img2: 'https://example.com/same.jpg',
    img3: 'https://example.com/same.jpg'
  };
  const urls2 = extractImageUrls(objWithDuplicates);
  console.assert(urls2.length === 1, 'Should deduplicate URLs');
  
  console.log('✓ extractImageUrls tests passed');
}

// Test calculateCardStatus
function testCalculateCardStatus() {
  console.log('Testing calculateCardStatus...');
  
  // All valid
  console.assert(
    calculateCardStatus(3, 3, 0) === 'all_valid',
    'Should return all_valid when all images are valid'
  );
  
  // Some broken
  console.assert(
    calculateCardStatus(3, 2, 1) === 'some_broken',
    'Should return some_broken when mix of valid and broken'
  );
  
  // All broken
  console.assert(
    calculateCardStatus(2, 0, 2) === 'all_broken',
    'Should return all_broken when all images are broken'
  );
  
  // No images
  console.assert(
    calculateCardStatus(0, 0, 0) === 'no_images',
    'Should return no_images when no images'
  );
  
  // Any valid (edge case - has valid but status indicates some issue)
  console.assert(
    calculateCardStatus(1, 1, 0) === 'all_valid',
    'Should return all_valid when single valid image'
  );
  
  console.log('✓ calculateCardStatus tests passed');
}

// Run all tests
try {
  testFindAllStrings();
  testIsLikelyImageUrl();
  testExtractImageUrls();
  testCalculateCardStatus();
  
  console.log('\n✅ All tests passed!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Tests failed:', error);
  process.exit(1);
}
