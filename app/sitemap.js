import fs from "fs";
import path from "path";

const SITE_URL = "https://spanishtvshows.com";
const DATA_PATH = path.join(process.cwd(), "content", "generated", "spanish-pages.json");

function readSlugs() {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf8").trim();
  if (!raw) return [];

  const parsed = JSON.parse(raw);
  const pages = Array.isArray(parsed) ? parsed : Array.isArray(parsed.pages) ? parsed.pages : [];

  return pages
    .map((p) => (p && typeof p.slug === "string" ? p.slug : null))
    .filter(Boolean);
}

export default function sitemap() {
  const staticPages = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/best-on-netflix`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const slugs = readSlugs();

  const generatedPages = slugs.map((slug) => ({
    url: `${SITE_URL}/g/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...generatedPages];
}
