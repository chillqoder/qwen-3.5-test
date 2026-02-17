/**
 * Unit tests for utility functions
 * Run with: node src/__tests__/utils.test.js
 */

// Inline the utility functions for testing without TypeScript compilation

function findAllStrings(obj, path = '') {
  const results = [];

  if (obj === null || obj === undefined) {
    return results;
  }

  if (typeof obj === 'string') {
    results.push({ value: obj, path: path || 'root' });
    return results;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const newPath = path ? `${path}[${index}]` : `[${index}]`;
      results.push(...findAllStrings(item, newPath));
    });
    return results;
  }

  if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      results.push(...findAllStrings(value, newPath));
    });
    return results;
  }

  return results;
}

function isLikelyImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const hasHttp = /^https?:\/\//i.test(url);
  const hasImageExt = /\.(jpe?g|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
  return hasHttp && (hasImageExt || url.length < 200);
}

function extractImageUrls(obj) {
  const allStrings = findAllStrings(obj);
  const urls = allStrings
    .map(({ value }) => value)
    .filter(isLikelyImageUrl);
  return [...new Set(urls)];
}

function calculateCardStatus(totalImages, validCount, brokenCount) {
  if (totalImages === 0) {
    return 'no_images';
  }
  if (brokenCount === 0 && validCount > 0) {
    return 'all_valid';
  }
  if (validCount > 0 && brokenCount > 0) {
    return 'some_broken';
  }
  if (validCount > 0) {
    return 'any_valid';
  }
  if (brokenCount > 0) {
    return 'all_broken';
  }
  return 'no_images';
}

// Test runner
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

console.log('Testing findAllStrings...');
{
  const obj1 = { name: 'test', url: 'https://example.com/image.jpg' };
  const result1 = findAllStrings(obj1);
  assert(result1.length === 2, 'Should find 2 strings in simple object');
  assert(result1.some(r => r.value === 'test'), 'Should find name value');
  assert(result1.some(r => r.value === 'https://example.com/image.jpg'), 'Should find URL value');

  const obj2 = { user: { name: 'John', images: ['img1.jpg', 'img2.png'] } };
  const result2 = findAllStrings(obj2);
  assert(result2.length === 3, 'Should find 3 strings in nested object');

  const arr = ['a', 'b', { nested: 'c' }];
  const result3 = findAllStrings(arr);
  assert(result3.length === 3, 'Should find 3 strings in array');

  assert(findAllStrings(null).length === 0, 'Should handle null');
  assert(findAllStrings(undefined).length === 0, 'Should handle undefined');
}

console.log('\nTesting isLikelyImageUrl...');
{
  assert(isLikelyImageUrl('https://example.com/image.jpg') === true, 'Should accept .jpg');
  assert(isLikelyImageUrl('https://example.com/image.png') === true, 'Should accept .png');
  assert(isLikelyImageUrl('https://example.com/image.gif') === true, 'Should accept .gif');
  assert(isLikelyImageUrl('https://example.com/image.webp') === true, 'Should accept .webp');
  assert(isLikelyImageUrl('https://example.com/image.jpg?width=100') === true, 'Should accept URL with query params');
  assert(isLikelyImageUrl('https://picsum.photos/id/1/400/300') === true, 'Should accept short URLs');
  assert(isLikelyImageUrl('not-a-url') === false, 'Should reject non-URL');
  assert(isLikelyImageUrl('ftp://example.com/file.jpg') === false, 'Should reject FTP URLs');
  assert(isLikelyImageUrl('') === false, 'Should reject empty string');
}

console.log('\nTesting extractImageUrls...');
{
  const obj = {
    title: 'Test',
    imageUrl: 'https://example.com/image.jpg',
    thumbnail: 'https://example.com/thumb.png',
    description: 'Not an image URL',
    nested: { avatar: 'https://example.com/avatar.gif' }
  };
  const urls = extractImageUrls(obj);
  assert(urls.length === 3, `Should find 3 image URLs, found ${urls.length}`);
  assert(urls.includes('https://example.com/image.jpg'), 'Should include imageUrl');
  assert(urls.includes('https://example.com/thumb.png'), 'Should include thumbnail');
  assert(urls.includes('https://example.com/avatar.gif'), 'Should include nested avatar');

  const objWithDuplicates = {
    img1: 'https://example.com/same.jpg',
    img2: 'https://example.com/same.jpg',
    img3: 'https://example.com/same.jpg'
  };
  const urls2 = extractImageUrls(objWithDuplicates);
  assert(urls2.length === 1, 'Should deduplicate URLs');
}

console.log('\nTesting calculateCardStatus...');
{
  assert(calculateCardStatus(3, 3, 0) === 'all_valid', 'Should return all_valid when all images are valid');
  assert(calculateCardStatus(3, 2, 1) === 'some_broken', 'Should return some_broken when mix of valid and broken');
  assert(calculateCardStatus(2, 0, 2) === 'all_broken', 'Should return all_broken when all images are broken');
  assert(calculateCardStatus(0, 0, 0) === 'no_images', 'Should return no_images when no images');
}

console.log(`\n${failed === 0 ? '✅' : '❌'} All tests: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
