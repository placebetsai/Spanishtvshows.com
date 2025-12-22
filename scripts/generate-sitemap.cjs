// scripts/generate-sitemap.cjs
// Generates public/sitemap.xml (+ chunks if needed) and public/robots.txt
// from content/generated/*.json

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://spanishtvshows.com";
const ROOT = process.cwd();
const GENERATED_DIR = path.join(ROOT, "content", "generated");
const PUBLIC_DIR = path.join(ROOT, "public");

// Google limits: 50,000 URLs per sitemap, 50MB uncompressed.
// We'll chunk at 45,000 to be safe.
const CHUNK_SIZE = 45000;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlset(urls) {
  const lastmod = new Date().toISOString();
  const body = urls
    .map((u) => {
      return `  <url>
    <loc>${xmlEscape(u)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function buildSitemapIndex(sitemapUrls) {
  const lastmod = new Date().toISOString();
  const body = sitemapUrls
    .map((u) => {
      return `  <sitemap>
    <loc>${xmlEscape(u)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

function main() {
  ensureDir(PUBLIC_DIR);

  const staticPages = [
    `${SITE_URL}/`,
    `${SITE_URL}/trending`,
    `${SITE_URL}/best-on-netflix`,
    `${SITE_URL}/about`,
    `${SITE_URL}/privacy`,
    `${SITE_URL}/terms`,
  ];

  let generated = [];
  if (fs.existsSync(GENERATED_DIR)) {
    const files = fs
      .readdirSync(GENERATED_DIR)
      .filter((f) => f.endsWith(".json"));

    generated = files.map((file) => {
      const slug = file.replace(/\.json$/i, "");
      return `${SITE_URL}/g/${slug}`;
    });
  }

  const allUrls = [...staticPages, ...generated];

  // Remove old chunk files if they exist
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  for (const f of publicFiles) {
    if (/^sitemap-\d+\.xml$/i.test(f)) {
      fs.unlinkSync(path.join(PUBLIC_DIR, f));
    }
  }

  if (allUrls.length <= 50000) {
    // Single sitemap
    fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), buildUrlset(allUrls));
  } else {
    // Chunked sitemaps + index
    const chunks = [];
    for (let i = 0; i < allUrls.length; i += CHUNK_SIZE) {
      chunks.push(allUrls.slice(i, i + CHUNK_SIZE));
    }

    const sitemapUrls = [];
    chunks.forEach((chunk, idx) => {
      const name = `sitemap-${idx + 1}.xml`;
      fs.writeFileSync(path.join(PUBLIC_DIR, name), buildUrlset(chunk));
      sitemapUrls.push(`${SITE_URL}/${name}`);
    });

    // sitemap.xml becomes the INDEX file
    fs.writeFileSync(
      path.join(PUBLIC_DIR, "sitemap.xml"),
      buildSitemapIndex(sitemapUrls)
    );
  }

  // robots.txt (this is your "txt file" you keep asking about)
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robots);

  console.log(`✅ Generated sitemap for ${allUrls.length} URLs`);
}

main();
