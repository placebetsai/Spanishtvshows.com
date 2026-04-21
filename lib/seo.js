// Centralized SEO helpers for Next.js App Router metadata.
//
// Next.js inherits `alternates.canonical` from a parent layout into child
// routes unless the child overrides it. The root layout sets canonical to
// the homepage, so every route that does NOT call `canonicalFor(path)` ends
// up advertising the homepage as its canonical URL. That kills category/page
// rankings. Always use `canonicalFor('/some-path')` in per-route metadata.

export const SITE_ORIGIN = "https://spanishtvshows.com";

export function canonicalFor(path = "/") {
  if (!path.startsWith("/")) path = `/${path}`;
  // Strip trailing slash except for root.
  const clean = path === "/" ? "/" : path.replace(/\/+$/, "");
  return `${SITE_ORIGIN}${clean}`;
}

export function alternatesFor(path = "/") {
  return {
    canonical: canonicalFor(path),
  };
}
