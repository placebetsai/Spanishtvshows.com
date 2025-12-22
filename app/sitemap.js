// app/sitemap.js
import fs from "fs";
import path from "path";

const SITE_URL = "https://spanishtvshows.com";
const DATA_FILE = path.join(
  process.cwd(),
  "content",
  "generated",
  "spanish-pages.json"
);

export default function sitemap() {
  const staticPages = [
    { url: `${SITE_URL}/`, priority: 1.0 },
    { url: `${SITE_URL}/trending`, priority: 0.9 },
    { url: `${SITE_URL}/netflix`, priority: 0.9 },
    { url: `${SITE_URL}/learn-spanish`, priority: 0.8 },
    { url: `${SITE_URL}/learn-english`, priority: 0.8 },
    { url: `${SITE_URL}/news`, priority: 0.7 },
    { url: `${SITE_URL}/resources`, priority: 0.7 },
    { url: `${SITE_URL}/privacy`, priority: 0.3 },
    { url: `${SITE_URL}/terms`, priority: 0.3 },
  ].map(p => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: "daily",
  }));

  let generatedPages = [];

  if (fs.existsSync(DATA_FILE)) {
    const pages = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    generatedPages = pages.map((p) => ({
      url: `${SITE_URL}/g/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  return [...staticPages, ...generatedPages];
}
