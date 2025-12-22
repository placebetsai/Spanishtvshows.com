/* scripts/generate-spanish-pages.cjs
   Dependency-free generator (Node 20+).
   - Pulls Spanish TV shows from TMDB
   - Writes content/generated/spanish-pages.json
   - Optionally enriches blurbs with OpenAI if OPENAI_API_KEY exists
*/

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "content", "generated");
const OUT_FILE = path.join(OUT_DIR, "spanish-pages.json");

function log(...args) {
  console.log("[generate-spanish-pages]", ...args);
}

function safeSlug(s) {
  return (s || "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "accept": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status} ${res.statusText}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function tmdbDiscoverSpanish(tmdbKey) {
  // Spanish originals, sorted by popularity; require some vote count to avoid junk
  const url =
    "https://api.themoviedb.org/3/discover/tv" +
    `?api_key=${encodeURIComponent(tmdbKey)}` +
    "&language=en-US" +
    "&sort_by=popularity.desc" +
    "&with_original_language=es" +
    "&vote_count.gte=50";

  const data = await fetchJson(url);
  return Array.isArray(data.results) ? data.results : [];
}

async function openaiBlurb(openaiKey, prompt) {
  // Uses the Responses API with a small model.
  // If this fails, we return null and continue (no crashing the workflow).
  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        input: prompt,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      log("OpenAI call failed:", res.status, res.statusText, t.slice(0, 140));
      return null;
    }

    const json = await res.json();
    // Responses API usually returns text in output[0].content[0].text
    const text =
      json?.output?.[0]?.content?.map((c) => c?.text).filter(Boolean).join("\n") ||
      null;

    return text ? text.trim() : null;
  } catch (e) {
    log("OpenAI call exception:", e?.message || e);
    return null;
  }
}

async function main() {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!TMDB_API_KEY) {
    // Don’t fail the workflow—just log and exit cleanly.
    log("TMDB_API_KEY is missing. Add it in GitHub Secrets as TMDB_API_KEY.");
    // Still ensure folder exists so later steps don't freak out
    fs.mkdirSync(OUT_DIR, { recursive: true });
    if (!fs.existsSync(OUT_FILE)) {
      fs.writeFileSync(
        OUT_FILE,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            note: "TMDB_API_KEY missing; no data generated.",
            pages: [],
          },
          null,
          2
        )
      );
    }
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  log("Fetching Spanish shows from TMDB...");
  const shows = await tmdbDiscoverSpanish(TMDB_API_KEY);

  const top = shows.slice(0, 20).map((s) => ({
    id: s.id,
    name: s.name,
    slug: safeSlug(s.name),
    popularity: s.popularity,
    voteAverage: s.vote_average,
    voteCount: s.vote_count,
    firstAirDate: s.first_air_date,
    overview: s.overview || "",
    backdropPath: s.backdrop_path || null,
    posterPath: s.poster_path || null,
  }));

  // Build “pages” you can wire into routes.
  // This keeps it real: "Where to watch", "Shows like X", "Best Spanish crime shows", etc.
  const basePages = [];

  // Always include a trending page and a “best crime” page (these match your app routes)
  basePages.push({
    type: "collection",
    route: "/trending",
    title: "Trending Spanish TV Right Now",
    slug: "trending-spanish-tv-right-now",
    blurb:
      "Updated daily. The Spanish-language shows everyone is actually watching this week.",
  });

  basePages.push({
    type: "collection",
    route: "/best-spanish-crime-shows",
    title: "Best Spanish Crime Shows",
    slug: "best-spanish-crime-shows",
    blurb:
      "Ranked by popularity + real vote count. No fluff, just bangers.",
  });

  // Generate “shows like {top show}” pages for the first few shows
  for (const s of top.slice(0, 8)) {
    basePages.push({
      type: "cluster",
      route: `/shows-like-${s.slug}`,
      title: `Shows Like ${s.name}`,
      slug: `shows-like-${s.slug}`,
      seedShowId: s.id,
      blurb: `If you liked ${s.name}, here are similar Spanish-language shows worth watching next.`,
    });
  }

  // Optional: ask OpenAI to rewrite blurbs (short + SEO friendly)
  if (OPENAI_API_KEY) {
    log("OPENAI_API_KEY found. Enriching blurbs with OpenAI...");
    for (let i = 0; i < basePages.length; i++) {
      const p = basePages[i];
      const prompt =
        `Write a punchy 1–2 sentence blurb for an SEO page.\n` +
        `Title: ${p.title}\n` +
        `Audience: people searching for Spanish TV show recommendations.\n` +
        `Tone: confident, clean, not cringe, not spam.\n` +
        `Return ONLY the blurb text.`;

      const ai = await openaiBlurb(OPENAI_API_KEY, prompt);
      if (ai) basePages[i].blurb = ai;
    }
  } else {
    log("No OPENAI_API_KEY. Using built-in blurbs (still works).");
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    countShows: top.length,
    countPages: basePages.length,
    shows: top,
    pages: basePages,
  };

  // Only write if different (prevents useless commits)
  const nextText = JSON.stringify(payload, null, 2) + "\n";
  const prevText = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf8") : null;

  if (prevText === nextText) {
    log("No changes in generated output.");
    return;
  }

  fs.writeFileSync(OUT_FILE, nextText);
  log("Wrote:", path.relative(process.cwd(), OUT_FILE));
}

main().catch((e) => {
  console.error("[generate-spanish-pages] FATAL:", e?.stack || e);
  process.exit(1);
});
