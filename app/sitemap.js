import fs from "fs";
import path from "path";

function loadPages() {
  const filePath = path.join(process.cwd(), "content", "generated", "spanish-pages.json");

  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf8");
  if (!raw || raw.trim().length === 0) return [];

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }

  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.pages)) return data.pages;

  return [];
}

export default function sitemap() {
  const baseUrl = "https://spanishtvshows.com";

  const staticUrls = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/best-on-netflix`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const pages = loadPages();

  const generatedUrls = pages
    .map((p) => p?.slug)
    .filter(Boolean)
    .map((slug) => ({
      url: `${baseUrl}/g/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticUrls, ...generatedUrls];
}
