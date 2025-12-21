// scripts/tmdb-fetch.cjs
const TMDB_BASE = "https://api.themoviedb.org/3";

async function tmdbFetch(path, params = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("Missing TMDB_API_KEY");

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function getTopSpanishShows(limit = 20) {
  const data = await tmdbFetch("/discover/tv", {
    language: "en-US",
    sort_by: "popularity.desc",
    with_original_language: "es",
    vote_count_gte: 50,
    page: 1,
  });

  return (data.results || []).slice(0, limit).map((s) => ({
    id: s.id,
    name: s.name,
  }));
}

async function getRecommendations(id) {
  const rec = await tmdbFetch(`/tv/${id}/recommendations`, { language: "en-US", page: 1 });
  const names = (rec.results || []).map((s) => s?.name).filter(Boolean);
  return names.slice(0, 12);
}

module.exports = { tmdbFetch, getTopSpanishShows, getRecommendations };
