import fs from "fs";
import path from "path";

const SITE = "https://spanishtvshows.com";
const DATA = path.join(
  process.cwd(),
  "content",
  "generated",
  "spanish-pages.json"
);

export default function sitemap() {
  const staticPages = [
    { url: `${SITE}/`, priority: 1 },
    { url: `${SITE}/trending`, priority: 0.9 },
    { url: `${SITE}/best-on-netflix`, priority: 0.9 },
    { url: `${SITE}/about`, priority: 0.6 },
    { url: `${SITE}/privacy`, priority: 0.3 },
    { url: `${SITE}/terms`, priority: 0.3 },
  ];

  if (!fs.existsSync(DATA)) {
    return staticPages;
  }

  const raw = fs.readFileSync(DATA, "utf-8");
  const json = JSON.parse(raw);

  // 🔥 THIS IS THE FIX
  const pages = Array.isArray(json) ? json : json.pages;

  const generated = pages.map((p) => ({
    url: `${SITE}/g/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...generated];
}
