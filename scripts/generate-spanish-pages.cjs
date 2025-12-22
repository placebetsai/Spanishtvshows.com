// scripts/generate-spanish-pages.cjs
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

const PAGES_PER_RUN = Math.max(
  1,
  Math.min(60, Number(process.env.PAGES_PER_RUN || 10) || 10)
);

const OUT_DIR = path.join(process.cwd(), "content", "generated");

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status} for ${url}\n${text.slice(0, 500)}`);
  }
  return res.json();
}

async function tmdb(pathname, params = {}) {
  if (!TMDB_API_KEY) throw new Error("Missing TMDB_API_KEY (set in GitHub Secrets).");
  const url = new URL(`https://api.themoviedb.org/3${pathname}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  return fetchJson(url.toString());
}

function templateHtml(showName, overview, similarNames) {
  const safeOverview = (overview || "No overview available yet.").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lis = similarNames.map((n) => `<li><strong>${n}</strong> — Similar vibe, solid binge potential.</li>`).join("");
  return `
<h2>Quick take</h2>
<p><strong>${showName}</strong> is a Spanish-language series people binge fast. If you want the same vibe, here are the closest matches.</p>

<h2>What it’s about</h2>
<p>${safeOverview}</p>

<h2>Shows like ${showName}</h2>
<ul>${lis}</ul>

<h2>Where to watch</h2>
<p>Streaming rights change by country. Search the title on JustWatch to see current options in your region.</p>

<h2>FAQ</h2>
<h3>Is ${showName} worth watching?</h3>
<p>If you like tight pacing, twists, and Spanish-language storytelling, yes.</p>
<h3>Is it on Netflix?</h3>
<p>Availability changes. Check JustWatch for your region.</p>
<h3>What should I watch after ${showName}?</h3>
<p>Start with the list above — those are the closest matches right now.</p>
`.trim();
}

async function openaiHtml({ title, showName, overview, similarNames }) {
  if (!OPENAI_API_KEY) return null;

  const prompt = `
Write an SEO article in VALID HTML only.

TITLE: ${title}
Audience: streaming viewers looking for what to watch next.
Tone: confident, helpful, not cringe.

Rules:
- 900–1200 words
- Use <h2> sections
- Include short intro (2–4 sentences)
- Include a list of the 6 similar shows below (use exactly these names)
- Include "Where to Watch" section (do NOT claim a specific service; say "Check JustWatch")
- Include FAQ with 3 questions
- Do NOT mention AI
- Output ONLY HTML (no markdown fences)

SHOW: ${showName}
OVERVIEW: ${overview || ""}

SIMILAR SHOWS:
${similarNames.map((s) => `- ${s}`).join("\n")}
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: "You write clean entertainment SEO articles in valid HTML." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${t.slice(0, 800)}`);
  }

  const data = await res.json();
  const html = data.choices?.[0]?.message?.content?.trim() || "";
  if (!html.startsWith("<")) throw new Error("OpenAI did not return HTML.");
  return html;
}

async function main() {
  console.log("✅ generator start");
  console.log("TMDB key present:", !!TMDB_API_KEY);
  console.log("OpenAI key present:", !!OPENAI_API_KEY);
  console.log("Pages per run:", PAGES_PER_RUN);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Pull a pool of Spanish shows (real)
  const pool = await tmdb("/discover/tv", {
    sort_by: "popularity.desc",
    with_original_language: "es",
    "vote_count.gte": 50,
    page: 1,
  });

  const shows = (pool.results || []).slice(0, PAGES_PER_RUN);

  for (const s of shows) {
    const showName = s?.name || "Spanish TV Show";
    const showId = s?.id;
    if (!showId) continue;

    const baseSlug = `${showId}-${slugify(showName)}`;
    const outFile = path.join(OUT_DIR, `shows-like-${baseSlug}.json`);

    if (fs.existsSync(outFile)) {
      console.log("Skip existing:", outFile);
      continue;
    }

    // recommendations (real titles)
    let recs = [];
    try {
      const rec = await tmdb(`/tv/${showId}/recommendations`, { page: 1 });
      recs = (rec.results || []).map((x) => x?.name).filter(Boolean);
    } catch (e) {
      console.warn("Recs failed:", showId, e.message);
    }

    const similarNames = recs.slice(0, 6);
    if (similarNames.length < 6) {
      // if too few recommendations, still generate using fallback names from discover list
      const fallback = (pool.results || [])
        .map((x) => x?.name)
        .filter(Boolean)
        .filter((n) => n !== showName)
        .slice(0, 12);

      const merged = [...similarNames, ...fallback].slice(0, 6);
      while (merged.length < 6) merged.push("Spanish TV Series");
      recs = merged;
    } else {
      recs = similarNames;
    }

    const title = `Shows Like ${showName} (Spanish Series You Should Watch Next)`;
    const jw = `https://www.justwatch.com/us/search?q=${encodeURIComponent(showName)}`;

    let html = null;
    try {
      html = await openaiHtml({
        title,
        showName,
        overview: s?.overview || "",
        similarNames: recs,
      });
    } catch (e) {
      console.warn("OpenAI failed; using template:", e.message);
      html = null;
    }

    if (!html) html = templateHtml(showName, s?.overview || "", recs);

    const page = {
      slug: `shows-like-${baseSlug}`,
      title,
      byline: { name: "SpanishTVShows Editorial", role: "Streaming Guides" },
      showId,
      showName,
      createdAt: new Date().toISOString(),
      justwatch: jw,
      html,
      similarShows: recs,
    };

    fs.writeFileSync(outFile, JSON.stringify(page, null, 2), "utf8");
    console.log("Wrote:", path.basename(outFile));
  }

  console.log("✅ generator done");
}

main().catch((e) => {
  console.error("FAILED ❌", e);
  process.exit(1);
});
