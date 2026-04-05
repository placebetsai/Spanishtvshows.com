// app/netflix/page.js
export const runtime = "edge";

import Link from "next/link";
import { tmdb, slugify, tmdbImg } from "../../lib/tmdb";

export const metadata = {
  title: "Spanish Shows on Netflix (2026) – Sorted by Audience Rating",
  description:
    "Spanish-language TV series available on Netflix, sorted by TMDB audience rating and vote count. Data source: The Movie Database (TMDB).",
};

async function getNetflixSpanish() {
  // Network 213 = Netflix. This only surfaces shows TMDB has tagged as Netflix originals/exclusives.
  const data = await tmdb(
    "/discover/tv",
    {
      with_original_language: "es",
      sort_by: "popularity.desc",
      with_networks: "213",
      "vote_count.gte": 30,
      page: 1,
      language: "en-US",
    },
    { revalidate: 21600 }
  );
  return (data?.results || []).slice(0, 24);
}

export default async function NetflixPage() {
  const shows = await getNetflixSpanish();

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/" className="text-neon font-black hover:underline">
          ← Home
        </Link>

        <h1 className="text-3xl md:text-5xl font-black mt-6 text-glow">
          Spanish Shows on Netflix
        </h1>

        <p className="text-gray-300 mt-3 max-w-3xl font-mono text-sm">
          Spanish-language series tagged as Netflix originals or exclusives in the TMDB database,
          sorted by audience popularity. Availability may vary by region.
          Data: <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-neon underline">TMDB</a>.
          Not affiliated with Netflix.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {shows.length === 0 && (
            <p className="text-gray-500 col-span-3">No data available. Check back soon.</p>
          )}
          {shows.map((s) => (
            <Link
              key={s.id}
              href={`/show/${s.id}-${slugify(s.name)}`}
              className="group block bg-black/80 border border-gray-800 rounded-xl overflow-hidden hover:border-neon transition box-glow"
            >
              <div
                className="aspect-[16/9] bg-black"
                style={{
                  backgroundImage: s.backdrop_path
                    ? `url(${tmdbImg(s.backdrop_path, "w780")})`
                    : "radial-gradient(circle at top, #111827, #000000 60%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full bg-black/55 group-hover:bg-black/35 transition" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-black text-white group-hover:text-neon transition">
                    {s.name}
                  </h2>
                  <div className="text-xs text-gray-300 whitespace-nowrap">
                    ⭐ {s.vote_average ? s.vote_average.toFixed(1) : "—"}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                  {s.overview || "No description available."}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-gray-600">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
          Netflix availability data may not be complete or current.
        </p>
      </div>
    </div>
  );
}
