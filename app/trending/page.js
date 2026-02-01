// app/trending/page.js
import Link from "next/link";
import { FireIcon, StarIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

const API_BASE = "https://api.themoviedb.org/3";

// Static fallback so the page is NEVER empty/broken to crawlers/AdSense reviewers
const FALLBACK_SHOWS = [
  {
    id: 71446,
    name: "Money Heist (La Casa de Papel)",
    overview:
      "A criminal mastermind recruits a crew for the biggest heist in Spanish TV history.",
    first_air_date: "2017-05-02",
    vote_average: 8.2,
    popularity: 999,
    poster_path: "/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    backdrop_path: "/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg",
  },
  {
    id: 66732,
    name: "Narcos",
    overview:
      "A gritty, high-stakes story of power, money, and chaos across Latin America.",
    first_air_date: "2015-08-28",
    vote_average: 8.1,
    popularity: 888,
    poster_path: "/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
    backdrop_path: "/qV7QaSf7f7yC2lc985zfyOJIAIN.jpg",
  },
  {
    id: 86984,
    name: "Elite",
    overview:
      "Three working-class teens enter an exclusive school—then everything explodes.",
    first_air_date: "2018-10-05",
    vote_average: 7.6,
    popularity: 777,
    poster_path: "/8xS7X5wHjJAK3G6y4uQY1ZtC8cG.jpg",
    backdrop_path: "/oKxq6Y1s7oHAXY9IY4mJm1x1u2l.jpg",
  },
];

async function fetchJson(path) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const url = `${API_BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

async function getTrendingWeek() {
  const data = await fetchJson("/trending/tv/week?language=en-US");
  if (!data?.results) return [];
  return data.results.filter((s) => s.original_language === "es").slice(0, 12);
}

async function getNewReleases() {
  const data = await fetchJson(
    "/discover/tv?language=en-US&sort_by=first_air_date.desc&with_original_language=es&vote_count.gte=5"
  );
  return data?.results?.slice(0, 9) || [];
}

async function getHiddenGems() {
  const data = await fetchJson(
    "/discover/tv?language=en-US&sort_by=vote_average.desc&with_original_language=es&vote_count.gte=50&vote_count.lte=500"
  );
  return data?.results?.slice(0, 9) || [];
}

export const metadata = {
  title: "Trending Spanish TV Shows 2026 – What’s Actually Hot",
  description:
    "Updated list of trending Spanish-language TV shows in 2026 – this week’s heat, new releases, and hidden gems.",
};

export default async function TrendingPage() {
  const [trendingRaw, newReleasesRaw, hiddenGemsRaw] = await Promise.all([
    getTrendingWeek(),
    getNewReleases(),
    getHiddenGems(),
  ]);

  const trending = trendingRaw.length ? trendingRaw : FALLBACK_SHOWS.slice(0, 3);
  const newReleases = newReleasesRaw.length ? newReleasesRaw : FALLBACK_SHOWS.slice(0, 3);
  const hiddenGems = hiddenGemsRaw.length ? hiddenGemsRaw : FALLBACK_SHOWS.slice(0, 3);

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

          <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-4">
            What Spanish TV is <span className="text-neon">actually popping</span> right now
          </h1>

          <p className="text-gray-300 text-xs md:text-sm max-w-2xl mx-auto mb-6">
            Updated frequently in 2026. Bookmark this page for quick picks without digging through ten apps.
          </p>

          {heroShow && (
            <div className="inline-flex flex-col items-center gap-2 mt-2">
              <span className="text-[0.65rem] md:text-[0.7rem] text-gray-500 uppercase tracking-[0.25em]">
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
          <div className="mb-6">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              This week&apos;s <span className="text-hot uppercase">heat</span>
            </h2>
            <p className="text-gray-400 text-[0.7rem] md:text-xs mt-1">
              Spanish-language shows people are actually bingeing right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {trending.map((show, index) => (
              <Link key={show.id} href={`/show/${show.id}`} className="group block">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-neon transition-colors box-glow">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`}
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
                    {show.vote_average ? show.vote_average.toFixed(1) : "N/A"}
                  </span>
                  {show.first_air_date && <span>{show.first_air_date.slice(0, 4)}</span>}
                  <span className="uppercase tracking-[0.2em] text-gray-500">Series</span>
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
          <div className="mb-6">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              New Spanish releases <span className="text-neon">worth checking</span>
            </h2>
            <p className="text-gray-400 text-[0.7rem] md:text-xs mt-1">
              Recent Spanish-language series that just dropped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {newReleases.map((show) => (
              <Link key={show.id} href={`/show/${show.id}`} className="group block">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-neon transition-colors">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path || show.backdrop_path}`}
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
          <div className="mb-6">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Hidden gems <span className="text-hot">real fans talk about</span>
            </h2>
            <p className="text-gray-400 text-[0.7rem] md:text-xs mt-1">
              High-rated but under-the-radar shows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {hiddenGems.map((show) => (
              <Link key={show.id} href={`/show/${show.id}`} className="group block">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-hot transition-colors">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`}
                    alt={show.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 border border-gray-700 text-[0.7rem] md:text-xs font-mono text-yellow-400 flex items-center gap-1">
                    <StarIcon className="h-3 w-3" />
                    {show.vote_average ? show.vote_average.toFixed(1) : "N/A"}
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

        <section className="border-t border-gray-900 pt-8 md:pt-10">
          <p className="text-gray-400 text-[0.7rem] md:text-xs text-center max-w-2xl mx-auto leading-relaxed">
            Rankings update frequently. If a page ever looks light on content, refresh later—we keep improving the editorial and recommendations.
          </p>
        </section>
      </div>
    </div>
  );
          }
