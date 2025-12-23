// scripts/generate-spanish-pages.cjs
// Generates content/generated/spanish-pages.json from TMDB.
// No OpenAI required. Uses TMDB show data + templates.
// Runs on Vercel via "prebuild".

const fs = require("fs");
const path = require("path");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// OUTPUT (PROJECT ROOT)
const OUT_DIR = path.join(process.cwd(), "content", "generated");
const OUT_FILE = path.join(OUT_DIR, "spanish-pages.json");

// Scale knobs (start safe, then increase)
const SHOW_LIMIT = Number(process.env.SHOW_LIMIT || 200);      // 200 → 500 → 1000
const PAGES_PER_SHOW = Number(process.env.PAGES_PER_SHOW || 3); // 3 or 4

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return res.json();
}

// Pull trending + discovery lists, then dedupe.
// Goal: Spanish/LatAm shows in Spanish language (not perfect but good enough).
async function fetchShows() {
  const base = "https://api.themoviedb.org/3";

  // Trending (mix)
  const trending = await fetchJson(
    `${base}/trending/tv/week?api_key=${TMDB_API_KEY}`
  );

  // Discover Spanish original language
  // Sort by popularity so we get “real” shows first.
  const discover = await fetchJson(
    `${base}/discover/tv?api_key=${TMDB_API_KEY}` +
      `&with_original_language=es&sort_by=popularity.desc&page=1`
  );

  const combined = [
    ...(trending?.results || []),
    ...(discover?.results || []),
  ];

  // Dedupe by id, filter basic quality
  const map = new Map();
  for (const s of combined) {
    if (!s?.id) continue;
    if (!s?.name) continue;
    if ((s?.vote_count || 0) < 10) continue; // remove super-noisy junk
    map.set(s.id, s);
  }

  // Take top SHOW_LIMIT by popularity
  const shows = Array.from(map.values())
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, SHOW_LIMIT);

  return shows;
}

// For each show, pull richer details (overview, networks, seasons, genres)
async function fetchShowDetails(id) {
  const base = "https://api.themoviedb.org/3";
  return fetchJson(
    `${base}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`
  );
}

// Simple, Google-safe templated content (unique per show via facts).
function buildPageContent(show, details, pageType) {
  const title = show.name || details.name || "Spanish TV Show";
  const year = (details.first_air_date || show.first_air_date || "").slice(0, 4);
  const overview = details.overview || show.overview || "";
  const genres = (details.genres || []).map(g => g.name).filter(Boolean);
  const networks = (details.networks || []).map(n => n.name).filter(Boolean);
  const seasons = details.number_of_seasons || 0;
  const episodes = details.number_of_episodes || 0;

  const baseIntro =
    overview && overview.length > 30
      ? overview.trim()
      : `This is a Spanish-language TV series titled "${title}".`;

  if (pageType === "watch") {
    return {
      h1: `Where to watch ${title}${year ? ` (${year})` : ""}`,
      paragraphs: [
        `If you're looking for where to watch "${title}"${year ? ` (${year})` : ""}, start by checking the major streaming platforms available in your region.`,
        `Because streaming rights change, the best approach is to search the show title directly inside your streaming apps (Netflix, Prime Video, Hulu, Max, etc.) and compare availability.`,
        `Quick facts: ${seasons ? `${seasons} season(s)` : "multiple seasons"}${episodes ? `, ${episodes} episode(s)` : ""}${genres.length ? `, genres: ${genres.join(", ")}` : ""}.`,
        baseIntro,
        `Tip: If you’re learning English, try watching with English subtitles first, then rewatch key scenes with Spanish subtitles to reinforce vocabulary and pronunciation.`,
      ],
      bullets: [
        `Search in-app for: "${title}"`,
        `Try both English + Spanish title variants`,
        `Use subtitles + pause/replay for language learning`,
      ],
    };
  }

  if (pageType === "cast") {
    return {
      h1: `${title}${year ? ` (${year})` : ""} cast & key characters`,
      paragraphs: [
        `This page covers the cast overview for "${title}"${year ? ` (${year})` : ""} and how to explore actor credits.`,
        `For the most accurate cast list, use official sources (TMDB/IMDb) and the show's platform page, since credits can differ by season.`,
        `Quick facts: ${seasons ? `${seasons} season(s)` : "multiple seasons"}${episodes ? `, ${episodes} episode(s)` : ""}${networks.length ? `, networks: ${networks.join(", ")}` : ""}.`,
        baseIntro,
        `If you're using this show to learn English: focus on 5–10 recurring phrases per episode, and repeat them out loud until you can say them without reading.`,
      ],
      bullets: [
        `Look up the show on TMDB or IMDb for verified cast`,
        `Check season-by-season credits (casts change)`,
        `Save actor names you like → discover similar shows`,
      ],
    };
  }

  // default: summary
  return {
    h1: `${title}${year ? ` (${year})` : ""} overview`,
    paragraphs: [
      baseIntro,
      `${genres.length ? `Genres: ${genres.join(", ")}.` : ""} ${networks.length ? `Networks: ${networks.join(", ")}.` : ""}`.trim(),
      `If you're exploring Spanish-language TV and want to learn English with subtitles, "${title}" can work well if you build a simple routine: watch → pause → repeat → rewatch.`,
      `Quick structure: pick one episode, write down 10 phrases, say them out loud, then rewatch the same scene until you can follow it without pausing.`,
    ].filter(Boolean),
    bullets: [
      `Best for: subtitle-based language practice`,
      `Rewatch strategy beats binge-watching`,
      `Save unknown words → review after the episode`,
    ],
  };
}

function makeSlug(show, details, pageType) {
  const title = show.name || details.name || "show";
  const base = slugify(title);
  const id = show.id || details.id;
  // slug includes id + type to keep it unique forever
  return `${base}-${id}-${pageType}`;
}

async function main() {
  if (!TMDB_API_KEY) {
    die("Missing TMDB_API_KEY env var. Add it to Vercel Environment Variables.");
  }

  console.log(`[generate] fetching shows... (limit=${SHOW_LIMIT})`);
  const shows = await fetchShows();

  const pageTypes = ["summary", "watch", "cast"].slice(0, PAGES_PER_SHOW);

  const pages = [];
  let i = 0;

  for (const show of shows) {
    i++;
    try {
      const details = await fetchShowDetails(show.id);

      for (const pageType of pageTypes) {
        const slug = makeSlug(show, details, pageType);
        const content = buildPageContent(show, details, pageType);

        pages.push({
          slug,
          pageType,
          showId: show.id,
          title: show.name || details.name || "",
          year: (details.first_air_date || show.first_air_date || "").slice(0, 4),
          posterPath: details.poster_path || show.poster_path || null,
          backdropPath: details.backdrop_path || show.backdrop_path || null,
          overview: details.overview || show.overview || "",
          genres: (details.genres || []).map(g => g.name).filter(Boolean),
          networks: (details.networks || []).map(n => n.name).filter(Boolean),
          numberOfSeasons: details.number_of_seasons || 0,
          numberOfEpisodes: details.number_of_episodes || 0,
          lastUpdated: new Date().toISOString(),
          content,
        });
      }

      if (i % 25 === 0) console.log(`[generate] processed ${i}/${shows.length}`);
    } catch (e) {
      console.warn(`[generate] skipping show ${show?.id} due to error:`, e?.message || e);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), pages }, null, 2));
  console.log(`[generate] wrote ${pages.length} pages → ${OUT_FILE}`);
}

main().catch((e) => {
  console.error("[generate] fatal:", e);
  process.exit(1);
});
