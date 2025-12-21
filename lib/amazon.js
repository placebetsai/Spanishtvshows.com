// lib/amazon.js
export const AMAZON_TAG = "spanishtvshow-20";

export function amazonSearchUrl(query) {
  const q = encodeURIComponent(String(query || "").trim());
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG}`;
}

export function amazonAsinUrl(asin) {
  const a = encodeURIComponent(String(asin || "").trim());
  return `https://www.amazon.com/dp/${a}?tag=${AMAZON_TAG}`;
}
