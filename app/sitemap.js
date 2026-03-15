import fs from "fs";
import path from "path";

function loadBlogPosts() {
  const dir = path.join(process.cwd(), "content", "blog", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const post = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
        return { slug: post.slug, date: post.date };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

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

  // Show pages — extract unique TMDB show IDs
  const showIds = [...new Set(pages.map((p) => p?.showId).filter(Boolean))];
  const showUrls = showIds.map((id) => ({
    url: `${baseUrl}/show/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const generatedUrls = pages
    .map((p) => p?.slug)
    .filter(Boolean)
    .map((slug) => ({
      url: `${baseUrl}/g/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticUrls, ...showUrls, ...generatedUrls];
}
