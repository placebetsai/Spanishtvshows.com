export default function sitemap() {
  const base = "https://spanishtvshows.com";

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/learn-spanish`, lastModified: new Date() },
    { url: `${base}/best-on-netflix`, lastModified: new Date() }
  ];
}
