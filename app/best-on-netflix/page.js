// app/best-on-netflix/page.js
import Link from "next/link";
import {
  FireIcon,
  StarIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";

const API_BASE = "https://api.themoviedb.org/3";

async function fetchJson(path) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const url = `${API_BASE}${path}${
    path.includes("?") ? "&" : "?"
  }api_key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  return res.json();
}

// Spanish shows on Netflix (network 213 = Netflix)
async function getNetflixSpanish() {
  const data = await fetchJson(
    "/discover/tv?language=en-US&sort_by=popularity.desc&with_original_language=es&with_networks=213&vote_count.gte=50"
  );
  return data?.results || [];
}

export const metadata = {
  title: "Best Spanish Shows on Netflix (2025) – Ranked by Heat",
  description:
    "Live-ranked list of the best Spanish-language TV shows on Netflix in 2025. No fluff, just what’s actually worth watching.",
};

export default async function BestOnNetflixPage() {
  const shows = await getNetflixSpanish();
  const topShow = shows[0];

  return (
    <div className="bg-dark min-h-screen">
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-gray-900"
        style={{
          minHeight: "60vh",
          backgroundImage: topShow?.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${topShow.backdrop_path})`
            : "radial-gradient(circle at top, #111827, #020617 60%, #000000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-24 text-center">
          <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.3em] text-neon mb-4">
            NETFLIX · SERIES · ESPAÑOL
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Best Spanish shows on{" "}
            <span className="text-hot">Netflix</span> right now
          </h1>

          <p className="text-gray-300 text-xs md:text-sm max-w-2xl mx-auto font-mono mb-6">
            No more scrolling for an hour. These are the Spanish series on
            Netflix that are actually worth your time in 2025.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 text-[0.7rem] md:text-xs uppercase tracking-[0.2em] text-gray-300 hover:border-neon hover:text-neon transition-colors"
            >
              See what’s hot on all platforms
            </Link>
            {topShow && (
              <a
                href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                  topShow.name
                )}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neon text-black text-xs md:text-sm font-bold uppercase tracking-wide hover:bg-white transition-colors"
              >
                <PlayCircleIcon className="h-4 w-4" />
                Watch #{topShow.name} now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Top Spanish Netflix series{" "}
              <span className="text-neon">you should start with</span>
            </h2>
            <p className="text-gray-400 text-[0.7rem] md:text-xs font-mono mt-1">
              Sorted by popularity + rating. All original language: Spanish.
            </p>
          </div>
          <p className="text-gray-500 text-[0.7rem] md:text-xs font-mono">
            Data: TMDB · Network 213 (Netflix)
          </p>
        </div>

        {shows.length === 0 && (
          <p className="text-gray-500 text-sm">
            Couldn&apos;t load Netflix data. Check TMDB_API_KEY or try again
            later.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {shows.slice(0, 18).map((show, index) => (
            <div key={show.id} className="group block">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-neon transition-colors box-glow">
                <img
                  src={`https://image.tmdb.org/t/p/w500${
                    show.backdrop_path || show.poster_path
                  }`}
                  alt={show.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-gray-700 text-[0.7rem] md:text-xs font-mono font-bold text-neon flex items-center gap-1">
                  <FireIcon className="h-3 w-3" />
                  #{index + 1}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 border border-gray-700 text-[0.7rem] md:text-xs font-mono text-yellow-400 flex items-center gap-1">
                  <StarIcon className="h-3 w-3" />
                  {show.vote_average
                    ? show.vote_average.toFixed(1)
                    : "N/A"}
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-black uppercase mb-1 group-hover:text-neon transition-colors">
                {show.name}
              </h3>

              <div className="flex items-center gap-3 text-[0.7rem] md:text-xs text-gray-400 mb-1">
                {show.first_air_date && (
                  <span>{show.first_air_date.slice(0, 4)}</span>
                )}
                <span className="uppercase tracking-[0.2em] text-gray-500">
                  Series
                </span>
              </div>

              <p className="text-gray-500 text-xs md:text-sm line-clamp-3">
                {show.overview || "No description available."}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <a
                  href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                    show.name
                  )}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[0.7rem] md:text-xs font-bold text-neon hover:underline"
                >
                  <PlayCircleIcon className="h-3 w-3" />
                  Where to watch
                </a>
                <Link
                  href={`/show/${show.id}`}
                  className="text-[0.7rem] md:text-xs text-gray-400 hover:text-gray-200"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <section className="border-t border-gray-900 mt-12 pt-8 md:pt-10">
          <p className="text-gray-400 text-[0.7rem] md:text-xs text-center max-w-2xl mx-auto leading-relaxed">
            This page only shows Spanish-language series that are available on
            Netflix (via TMDB network 213). Bookmark it before your next “What
            do we watch?” fight.
          </p>
        </section>
      </div>
    </div>
  );
                  }
