import fs from "fs";
import path from "path";

const SITE = "https://spanishtvshows.com";
const DATA = path.join(process.cwd(), "content/generated/spanish-pages.json");

export default function sitemap() {
  let pages = [];
  if (fs.existsSync(DATA)) {
    const json = JSON.parse(fs.readFileSync(DATA, "utf8"));
    pages = Array.isArray(json.pages) ? json.pages : [];
  }

  return [
    { url: `${SITE}/` },
    ...pages.map(p => ({ url: `${SITE}/g/${p.slug}` }))
  ];
}
