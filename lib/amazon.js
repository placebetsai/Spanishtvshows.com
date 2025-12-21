// lib/amazon.js
const DEFAULT_TAG = "spanishtvshow-20"; // your Associate ID

function withTag(url, tag = DEFAULT_TAG) {
  try {
    const u = new URL(url);
    if (!u.searchParams.get("tag")) u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

export function amazonSearchUrl(query, tag = DEFAULT_TAG) {
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  return withTag(base, tag);
}

export function amazonProductUrl(asin, tag = DEFAULT_TAG) {
  const base = `https://www.amazon.com/dp/${encodeURIComponent(asin)}`;
  return withTag(base, tag);
}

export function affiliateDisclosureShort() {
  return "As an Amazon Associate, we earn from qualifying purchases.";
}
