// app/trending/page.js
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

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

// This week's global heat (filtered to Spanish)
async function getTrendingWeek() {
  const data = await fetchJson("/trending/tv/week?language=en-US");
  if (!data?.results) return [];
  return data.results
    .filter((s) => s.original_language === "es")
    .slice(0, 12);
}

// Newest Spanish shows
async function getNewReleases() {
  const data = await fetchJson(
    "/discover/tv?language=en-US&sort_by=first_air_date.desc&with_original_language=es&vote_count.gte=5"
  );
  return data?.results?.slice(0, 9) || [];
}

// High-rated but less-voted = hidden gems
async function getHiddenGems() {
  const data = await fetchJson(
    "/discover/tv?language=en-US&sort_by=vote_average.desc&with_original_language=es&vote_count.gte=50&vote_count.lte=500"
  );
  return data?.results?.slice(0, 9) || [];
}

export const metadata = {
  title: "Trending Spanish TV Shows 2025 – What’s Actually Hot",
  description:
    "Live updated list of trending Spanish-language TV shows in 2025 – this week’s heat, new releases and hidden gems.",
};

export default async function TrendingPage() {
  const [trending, newReleases, hiddenGems] = await Promise.all([
    getTrendingWeek(),
    getNewReleases(),
    getHiddenGems(),
  ]);

  const heroShow = trending[0] || newReleases[0] || hiddenGems[0];

  return (
    <div className="bg-dark min-h-screen">
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-gray-900"
        style={{
          minHeight: "60vh",
          backgroundImage: heroShow?.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${heroShow.backdrop_path})`
            : "radial-gradient(circle at top, #111827, #020617 60%, #000000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-24 text-center">
          <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.3em] text-neon mb-4">
            TRENDING · NEW RELEASES · HIDDEN GEMS
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            What Spanish TV is{" "}
            <span className="text-neon">actually popping</span> right now
          </h1>

          <p className="text-gray-300 text-xs md:text-sm max-w-2xl mx-auto font-mono mb-6">
            Live TMDB data. If it&apos;s here, people are actually watching it
            in 2025 – Spain, Mexico, Colombia, Argentina, US Latinos and more.
          </p>

          {heroShow && (
            <div className="inline-flex flex-col items-center gap-2 mt-2">
              <span className="text-[0.65rem] md:text-[0.7rem] text-gray-500 font-mono uppercase tracking-[0.25em]">
                Right now everyone is talking about:
              </span>
              <Link
                href={`/show/${heroShow.id}`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-neon text-neon text-xs md:text-sm font-bold tracking-wide hover:bg-neon hover:text-black transition-colors bg-black/60"
              >
                <PlayCircleIcon className="h-4 w-4" />
                {heroShow.name}
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-14 space-y-16 md:space-y-20">
        {/* THIS WEEK'S HEAT */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                This week&apos;s{" "}
                <span className="text-hot uppercase">heat</span>
              </h2>
              <p className="text-gray-400 text-[0.7rem] md:text-xs font-mono mt-1">
                Global popularity – Spanish shows people actually binge this
                week.
              </p>
            </div>
          </div>

          {trending.length === 0 && (
            <p className="text-gray-500 text-sm">
              Couldn&apos;t load live data. Try again later.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {trending.map((show, index) => (
              <Link
                key={show.id}
                href={`/show/${show.id}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-neon transition-colors box-glow">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${
                      show.backdrop_path || show.poster_path
                    }`}
                    alt={show.name}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-gray-700 text-[0.7rem] md:text-xs font-mono font-bold text-neon flex items-center gap-1">
                    <FireIcon className="h-3 w-3" />
                    #{index + 1} · {Math.round(show.popularity || 0)}
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-black uppercase mb-1 group-hover:text-neon transition-colors">
                  {show.name}
                </h3>
                <div className="flex items-center gap-3 text-[0.7rem] md:text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1">
                    <StarIcon className="h-3 w-3 text-yellow-400" />
                    {show.vote_average
                      ? show.vote_average.toFixed(1)
                      : "N/A"}
                  </span>
                  {show.first_air_date && (
                    <span>{show.first_air_date.slice(0, 4)}</span>
                  )}
                  <span className="uppercase tracking-[0.2em] text-gray-500">
                    Series
                  </span>
                </div>
                <p className="text-gray-500 text-xs md:text-sm line-clamp-2">
                  {show.overview || "No description available."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* NEW RELEASES */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                New Spanish releases{" "}
                <span className="text-neon">worth checking</span>
              </h2>
              <p className="text-gray-400 text-[0.7rem] md:text-xs font-mono mt-1">
                Recent Spanish-language series that just dropped.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {newReleases.map((show) => (
              <Link
                key={show.id}
                href={`/show/${show.id}`}
                className="group block"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-neon transition-colors">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${
                      show.poster_path || show.backdrop_path
                    }`}
                    alt={show.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <h3 className="text-lg font-black uppercase mb-1 group-hover:text-neon transition-colors">
                  {show.name}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm line-clamp-2">
                  {show.overview || "No description available."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* HIDDEN GEMS */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Hidden gems{" "}
                <span className="text-hot">real fans talk about</span>
              </h2>
              <p className="text-gray-400 text-[0.7rem] md:text-xs font-mono mt-1">
                High-rated but under-the-radar shows – the stuff your cousin
                puts you on to.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {hiddenGems.map((show) => (
              <Link
                key={show.id}
                href={`/show/${show.id}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-hot transition-colors">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${
                      show.backdrop_path || show.poster_path
                    }`}
                    alt={show.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 border border-gray-700 text-[0.7rem] md:text-xs font-mono text-yellow-400 flex items-center gap-1">
                    <StarIcon className="h-3 w-3" />
                    {show.vote_average
                      ? show.vote_average.toFixed(1)
                      : "N/A"}
                  </div>
                </div>
                <h3 className="text-lg font-black uppercase mb-1 group-hover:text-hot transition-colors">
                  {show.name}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm line-clamp-2">
                  {show.overview || "No description available."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FOOTNOTE */}
        <section className="border-t border-gray-900 pt-8 md:pt-10">
          <p className="text-gray-400 text-[0.7rem] md:text-xs text-center max-w-2xl mx-auto leading-relaxed">
            This page updates off live TMDB data. If a Spanish show starts
            blowing up in Spain, Mexico, Colombia, Argentina or with US
            Latinos, it shows up here. Bookmark it and send it to your friend
            who still thinks English TV is better.
          </p>
        </section>
      </div>
    </div>
  );
            }
