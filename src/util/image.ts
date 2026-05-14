/**
 * Image utility functions for handling and normalizing image URLs
 */

/**
 * Normalizes image URLs to ensure they work with Next.js Image component
 * @param imageUrl - The image URL from the API (can be filename, relative path, or full URL)
 * @returns A normalized image URL that starts with / or http(s)://
 */
export const normalizeImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/cars/Image_not_available.webp';

  // If it's already a full URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it already starts with /, return as is (already a valid relative path)
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // Otherwise, construct the full URL using the uploads path
  // This handles filenames like "1767002660546.avif" from the API
  return `https://viganium.co/uploads/${imageUrl}`;
};

/**
 * Normalizes an array of image URLs
 * @param images - Array of image URLs
 * @returns Array of normalized image URLs
 */
export const normalizeImageUrls = (images: (string | null | undefined)[]): string[] => {
  return images
    .filter((img): img is string => !!img)
    .map(img => normalizeImageUrl(img));
};

