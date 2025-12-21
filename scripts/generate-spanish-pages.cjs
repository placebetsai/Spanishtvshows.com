// scripts/generate-spanish-pages.cjs
const fs = require("fs");
const path = require("path");
const { getTopSpanishShows, getRecommendations } = require("./tmdb-fetch.cjs");
const { generateHtml } = require("./openai-generate.cjs");

const OUT_DIR = path.join(process.cwd(), "content", "generated");

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function byline() {
  return { name: "SpanishTVShows Editorial", role: "Streaming Guides" };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const shows = await getTopSpanishShows(10); // START SMALL
  console.log(`Generating up to ${shows.length} pages...`);

  for (const show of shows) {
    const slug = `shows-like-${slugify(show.name)}`;
    const filePath = path.join(OUT_DIR, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      console.log(`Skip existing: ${slug}`);
      continue;
    }

    const recs = await getRecommendations(show.id);
    const similar = recs.filter(Boolean).slice(0, 6);

    // if TMDB recs are thin, skip (keeps quality up)
    if (similar.length < 6) {
      console.log(`Skip (not enough recs): ${show.name}`);
      continue;
    }

    const title = `Shows Like ${show.name}`;
    const html = await generateHtml({ title, showName: show.name, similarShows: similar });

    const page = {
      slug,
      title,
      byline: byline(),
      showId: show.id,
      showName: show.name,
      createdAt: new Date().toISOString(),
      html,
    };

    fs.writeFileSync(filePath, JSON.stringify(page, null, 2), "utf8");
    console.log(`Wrote: ${slug}`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
