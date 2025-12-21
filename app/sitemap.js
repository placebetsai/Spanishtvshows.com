// app/sitemap.js
// app/sitemap.js
import fs from "fs";
import path from "path";

const SITE_URL = "https://spanishtvshows.com";
const GENERATED_DIR = path.join(process.cwd(), "content", "generated");

export default function sitemap() {
  const staticPages = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/best-on-netflix`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let generatedPages = [];

  if (fs.existsSync(GENERATED_DIR)) {
    const files = fs.readdirSync(GENERATED_DIR).filter((f) =>
      f.endsWith(".json")
    );

    generatedPages = files.map((file) => {
      const slug = file.replace(".json", "");
      return {
        url: `${SITE_URL}/g/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  }

  return [...staticPages, ...generatedPages];
}
