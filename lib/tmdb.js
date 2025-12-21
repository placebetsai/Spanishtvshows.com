// lib/tmdb.js
const API_BASE = "https://api.themoviedb.org/3";

export function tmdbImg(path, size = "w1280") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function tmdb(path, params = {}, { revalidate = 21600 } = {}) {
  const apiKey = process.env.TMDB_API_KEY; // <-- matches your Vercel env name
  if (!apiKey) throw new Error("Missing TMDB_API_KEY");

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), { next: { revalidate } });
  if (!res.ok) throw new Error(`TMDB ${res.status} ${path}`);
  return res.json();
}
