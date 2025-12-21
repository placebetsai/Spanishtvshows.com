// lib/amazon.js
export const AMAZON_TAG = "spanishtvshow-20";

/**
 * Builds an Amazon search URL with your affiliate tag.
 * We use Amazon search pages because they’re stable and you don’t need individual product URLs yet.
 */
export function amazonSearchUrl(query) {
  const q = encodeURIComponent(query);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG}`;
}
