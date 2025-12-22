#!/usr/bin/env node
/**
 * scripts/generate-spanish-pages.cjs
 *
 * Generates SEO content pages daily into:
 *   content/generated/
 *
 * Uses:
 *  - TMDB_API_KEY (required)
 *  - OPENAI_API_KEY (optional but recommended)
 *
 * Outputs:
 *  - content/generated/<slug>.mdx
 *  - content/generated/_index.json (manifest)
 *
 * Env options:
 *  - PAGES_PER_RUN (default 12, max 60)
 *  - LANGUAGE (default "en-US")
 *  - REGION (default "US")
 */

const fs = require("fs");
const path = require("path");

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION ❌", err);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION ❌", err);
  process.exit(1);
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const LANGUAGE = process.env.LANGUAGE || "en-US";
const REGION = process.env.REGION || "US";

const PAGES_PER_RUN_RAW = Number(process.env.PAGES_PER_RUN || 12);
const PAGES_PER_RUN = Math.max(1, Math.min(60, Number.isFinite(PAGES_PER_RUN_RAW) ? PAGES_PER_RUN_RAW : 12));

const OUT_DIR = path.join(process.cwd(), "content", "generated");
const INDEX_FILE = path.join(OUT_DIR, "_index.json");

function nowISO() {
  return new Date().toISOString();
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}\n${text.slice(0, 500)}`);
  }
  return res.json();
}

async function tmdb(pathname, query = {}) {
  if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is missing (set it in GitHub Secrets).");

  const url = new URL(`https://api.themoviedb.org/3${pathname}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", LANGUAGE);

  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    url.searchParams.set(k, String(v));
  }
  return fetchJson(url.toString());
}

async function getSpanishShowsPool() {
  // We want REAL pages tied to REAL titles.
  // Use multiple endpoints to get a larger pool.
  const pools = [];

  // 1) Popular Spanish-language TV
  pools.push(
    tmdb("/discover/tv", {
      sort_by: "popularity.desc",
      with_original_language: "es",
      vote_count.gte: 50,
      include_adult: "false",
      page: 1,
    })
  );

  // 2) Top rated Spanish-language TV
  pools.push(
    tmdb("/discover/tv", {
      sort_by: "vote_average.desc",
      with_original_language: "es",
      vote_count.gte: 200,
      include_adult: "false",
      page: 1,
    })
  );

  // 3) Trending this week
  pools.push(tmdb("/trending/tv/week", {}));

  const results = await Promise.allSettled(pools);

  const all = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      const arr = r.value?.results || [];
      for (const item of arr) all.push(item);
    }
  }

  // De-dupe by id
  const seen = new Set();
  const deduped = [];
  for (const s of all) {
    if (!s || !s.id) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    deduped.push(s);
  }

  // Shuffle a bit so daily runs don’t always pick same first N
  for (let i = deduped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deduped[i], deduped[j]] = [deduped[j], deduped[i]];
  }

  return deduped;
}

function mdxEscape(str) {
  return String(str || "")
    .replace(/\r/g, "")
    .replace(/\u0000/g, "");
}

function frontmatter(obj) {
  // simple YAML
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - "${String(item).replace(/"/g, '\\"')}"`);
    } else if (typeof v === "number" || typeof v === "boolean") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: "${String(v).replace(/"/g, '\\"')}"`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

async function openaiWrite({ title, showName, overview, year, genres }) {
  // If OpenAI key is missing, return null and we’ll fall back to template content.
  if (!OPENAI_API_KEY) return null;

  // Use the Responses API (new-style). Node 20 has fetch built in.
  const prompt = `
You are writing an SEO page for SpanishTVShows.com.

Goal:
- Rank for long-tail searches about Spanish TV shows.
- Be factual and safe: do NOT invent platform availability. Say "Check JustWatch" instead.
- Tone: punchy, helpful, not cringe.

Page title: ${title}
Show: ${showName}
Year: ${year || "Unknown"}
Genres: ${(genres || []).join(", ") || "Unknown"}
Overview: ${overview || "No overview provided"}

Write:
1) A short hook (2–3 sentences).
2) "What it’s about" section (4–6 bullets).
3) "Why people love it" section (4–6 bullets).
4) "If you liked this, try these" section (5 related Spanish-language shows) — only suggest real titles? If unsure, give generic category suggestions (crime, thriller, novela) without naming titles.
5) A "Where to watch" paragraph that tells the reader to use JustWatch and their local Netflix/Prime/Max/etc search. Do not claim it's on a specific service.

Keep it under 900 words. Use clean headings. No markdown tables.
`;

  const body = {
    model: "gpt-5-nano",
    input: prompt,
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI API failed ${res.status} ${res.statusText}\n${text.slice(0, 1000)}`);
  }

  const data = await res.json();

  // Try common shapes:
  // data.output_text (often present), else search output array.
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const out = data.output || [];
  const chunks = [];
  for (const item of out) {
    if (item?.type === "message") {
      const content = item?.content || [];
      for (const c of content) {
        if (c?.type === "output_text" && c.text) chunks.push(c.text);
      }
    }
  }

  const joined = chunks.join("\n").trim();
  return joined || null;
}

function templateWrite({ title, showName, overview }) {
  // fallback content if OPENAI not set
  const safeOverview = overview ? mdxEscape(overview) : "No overview available yet.";
  return mdxEscape(`
## Quick take

**${showName}** is one of those Spanish-language shows people binge fast. If you’re hunting for the vibe—story, tone, and what to watch next—this page is the shortcut.

## What it’s about

- ${safeOverview.slice(0, 180)}${safeOverview.length > 180 ? "…" : ""}
- Strong cast chemistry and momentum
- Easy to binge in short bursts
- Often recommended in thriller/crime/novela circles

## Why people love it

- Pacing that keeps moving
- Big twists and cliffhangers
- Spanish-language storytelling hits different
- Great for subtitles + listening practice (optional)

## If you liked this, try these vibes

- More Spanish crime thrillers
- Political dramas from Spain / LATAM
- Dark mysteries and suspense
- Character-driven novelas
- Limited series with tight seasons

## Where to watch

Streaming rights change constantly by country. Use **JustWatch** (or your local Netflix/Prime/Max search) and type the show name to see the latest “where to watch” options in your region.
`.trim());
}

function buildPageSlug(show) {
  const name = show?.name || show?.original_name || `show-${show?.id}`;
  const base = slugify(name);
  return `${show.id}-${base}`;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFileIfChanged(filePath, content) {
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, "utf8");
    if (current === content) return false;
  }
  fs.writeFileSync(filePath, content, "utf8");
  return true;
}

async function main() {
  console.log("=== Generate Spanish Pages ===");
  console.log("Time:", nowISO());
  console.log("Node:", process.version);
  console.log("TMDB key present:", !!TMDB_API_KEY);
  console.log("OpenAI key present:", !!OPENAI_API_KEY);
  console.log("Pages per run:", PAGES_PER_RUN);
  console.log("Language:", LANGUAGE, "Region:", REGION);

  ensureDir(OUT_DIR);

  const pool = await getSpanishShowsPool();
  if (!pool.length) {
    throw new Error("TMDB returned no shows. Check TMDB_API_KEY or API limits.");
  }

  const selected = pool.slice(0, PAGES_PER_RUN);

  const manifest = {
    generatedAt: nowISO(),
    count: selected.length,
    pages: [],
  };

  let wroteAny = false;

  for (let i = 0; i < selected.length; i++) {
    const s = selected[i];
    const slug = buildPageSlug(s);

    // Get richer details
    let details = null;
    try {
      details = await tmdb(`/tv/${s.id}`, { region: REGION });
    } catch (e) {
      console.warn("TMDB details failed for", s.id, e.message);
    }

    const showName = details?.name || s?.name || "Spanish TV Show";
    const overview = details?.overview || s?.overview || "";
    const year = (details?.first_air_date || "").slice(0, 4);
    const genres = (details?.genres || []).map((g) => g.name).filter(Boolean);

    const title = `${showName} – What It’s About, Why It’s Popular, Where to Watch`;
    const description = (overview || `Guide to ${showName}: what it’s about, why people love it, and where to watch.`)
      .replace(/\s+/g, " ")
      .slice(0, 155);

    let body = null;

    // Try OpenAI content (optional)
    try {
      body = await openaiWrite({ title, showName, overview, year, genres });
    } catch (e) {
      console.warn("OpenAI generation failed (falling back to template):", e.message);
      body = null;
    }

    if (!body) body = templateWrite({ title, showName, overview });

    const jw = `https://www.justwatch.com/${REGION.toLowerCase()}/search?q=${encodeURIComponent(showName)}`;
    const poster = details?.poster_path || s?.poster_path || "";
    const backdrop = details?.backdrop_path || s?.backdrop_path || "";

    const fm = frontmatter({
      type: "generated",
      slug,
      tmdb_id: s.id,
      title,
      description,
      showName,
      year: year || "",
      genres,
      justwatch: jw,
      poster_path: poster,
      backdrop_path: backdrop,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    });

    const mdx = `${fm}

# ${mdxEscape(showName)}

${mdxEscape(body)}

---

### Quick links
- **Where to watch (JustWatch):** ${jw}
- **More guides:** /best-on-netflix • /best-spanish-crime-shows • /shows-like-money-heist
`;

    const outPath = path.join(OUT_DIR, `${slug}.mdx`);
    const changed = writeFileIfChanged(outPath, mdx);
    if (changed) wroteAny = true;

    manifest.pages.push({
      slug,
      tmdb_id: s.id,
      title,
      showName,
      year: year || null,
      updatedAt: nowISO(),
    });

    // Tiny delay so you don’t hammer APIs
    await sleep(250);
  }

  // Write manifest
  const manifestChanged = writeFileIfChanged(INDEX_FILE, JSON.stringify(manifest, null, 2) + "\n");
  if (manifestChanged) wroteAny = true;

  console.log("Done. Files updated:", wroteAny ? "YES" : "NO changes");
}

main().catch((e) => {
  console.error("FAILED ❌", e);
  process.exit(1);
});
