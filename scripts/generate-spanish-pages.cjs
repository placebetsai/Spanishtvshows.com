const fs = require("fs");
const path = require("path");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const OUT_DIR = path.join(process.cwd(), "content", "generated");
const OUT_FILE = path.join(OUT_DIR, "spanish-pages.json");

// Google-safe rollout
const SHOW_LIMIT = 200;        // ~200 shows
const PAGES_PER_SHOW = 3;      // = ~600 pages initial

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

async function getSpanishShows(page) {
  const url =
    `https://api.themoviedb.org/3/discover/tv` +
    `?api_key=${TMDB_API_KEY}` +
    `&with_original_language=es` +
    `&sort_by=popularity.desc` +
    `&vote_count.gte=50` +
    `&page=${page}`;
  return fetchJson(url);
}

function buildPages(show) {
  const name = show.name;
  const slugBase = slugify(name);

  return [
    {
      slug: `where-to-watch-${slugBase}-${show.id}`,
      title: `Where to Watch ${name}`,
      content: `${name} is a Spanish-language TV series. This page explains where you can stream it and what kind of show it is.`,
    },
    {
      slug: `shows-like-${slugBase}-${show.id}`,
      title: `Shows Like ${name}`,
      content: `If you enjoyed ${name}, you may like other Spanish series with similar tone, pacing, and themes.`,
    },
    {
      slug: `is-${slugBase}-worth-watching-${show.id}`,
      title: `Is ${name} Worth Watching?`,
      content: `${name} is worth watching if you enjoy serialized storytelling, strong characters, and long-form drama.`,
    }
  ];
}

async function main() {
  if (!TMDB_API_KEY) {
    console.error("❌ TMDB_API_KEY missing");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let shows = [];
  let page = 1;

  while (shows.length < SHOW_LIMIT) {
    const data = await getSpanishShows(page++);
    if (!data.results?.length) break;
    shows.push(...data.results);
  }

  let pages = [];
  shows.slice(0, SHOW_LIMIT).forEach(show => {
    pages.push(...buildPages(show));
  });

  const output = {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    pages
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✅ Generated ${pages.length} pages`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
