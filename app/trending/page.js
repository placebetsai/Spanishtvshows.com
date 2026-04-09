// app/trending/page.js
export const runtime = "edge";

import Link from "next/link";
import AdUnit from "../../components/AdUnit";
import {
  FireIcon,
  StarIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";

const API_BASE = "https://api.themoviedb.org/3";

async function fetchJson(path) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const url = `${API_BASE}${path}${
    path.includes("?") ? "&" : "?"
  }api_key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

async function getTrendingWeek() {
  const data = await fetchJson("/trending/tv/week?language=en-US");
  if (!data?.results) return [];
  return data.results
    .filter((s) => s.original_language === "es")
    .slice(0, 12);
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

function getRatingClass(rating) {
  const r = parseFloat(rating);
  if (r >= 7.5) return "rating-badge--high";
  if (r >= 6.0) return "rating-badge--mid";
  return "rating-badge--low";
}

export const metadata = {
  title: "Trending Spanish TV Shows 2026 - What People Are Actually Watching",
  description:
    "Live updated rankings of trending Spanish-language TV shows in 2026. This week's most popular series, new releases, and hidden gems from Spain, Mexico, Colombia, and Argentina.",
  alternates: {
    canonical: "https://spanishtvshows.com/trending",
  },
};

export default async function TrendingPage() {
  const [trending, newReleases, hiddenGems] = await Promise.all([
    getTrendingWeek(),
    getNewReleases(),
    getHiddenGems(),
  ]);

  const heroShow = trending[0] || newReleases[0] || hiddenGems[0];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://spanishtvshows.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Trending",
        item: "https://spanishtvshows.com/trending",
      },
    ],
  };

  return (
    <div className="bg-dark min-h-screen">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-gray-900/50"
        style={{
          minHeight: "60vh",
          backgroundImage: heroShow?.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${heroShow.backdrop_path})`
            : "radial-gradient(circle at top, #111827, #020617 60%, #000000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-neon transition-colors">
              Home
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-300 font-semibold">Trending</span>
          </nav>

          <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.3em] text-neon mb-4 font-bold">
            TRENDING &middot; NEW RELEASES &middot; HIDDEN GEMS
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            What Spanish TV is{" "}
            <span className="gradient-text">actually trending</span> right now
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Live TMDB data. If it&apos;s here, people are actually watching it
            in 2026 -- Spain, Mexico, Colombia, Argentina, US Latinos and more.
          </p>

          {heroShow && (
            <div className="inline-flex flex-col items-center gap-2">
              <span className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-[0.2em]">
                Everyone is talking about:
              </span>
              <Link
                href={`/show/${heroShow.id}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-neon text-neon text-sm font-bold tracking-wide hover:bg-neon hover:text-black transition-all bg-black/60 backdrop-blur-sm"
              >
                <PlayCircleIcon className="h-4 w-4" />
                {heroShow.name}
                {heroShow.vote_average > 0 && (
                  <span className="text-xs opacity-70">
                    &middot; {heroShow.vote_average.toFixed(1)}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-14 space-y-16 md:space-y-20">
        {/* THIS WEEK'S HEAT */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              This week&apos;s{" "}
              <span className="text-hot">heat</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Global popularity -- Spanish shows people are actually binge-watching this week.
            </p>
          </div>

          {trending.length === 0 && (
            <p className="text-gray-500 text-sm">
              Could not load live data. Try again later.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {trending.map((show, index) => (
              <Link
                key={show.id}
                href={`/show/${show.id}`}
                className="group block"
              >
                <div className="show-card relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${
                      show.backdrop_path || show.poster_path
                    }`}
                    alt={`${show.name} - Trending Spanish TV show`}
                    className="w-full h-full object-cover opacity-80"
                    loading={index < 3 ? "eager" : "lazy"}
                  />

                  {/* Rank badge */}
                  <div className="rank-badge">
                    {index + 1}
                  </div>

                  {/* Rating badge */}
                  {show.vote_average > 0 && (
                    <div className={`rating-badge ${getRatingClass(show.vote_average)} absolute top-3 right-3`}>
                      <StarIcon className="h-3 w-3" />
                      {show.vote_average.toFixed(1)}
                    </div>
                  )}

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Popularity */}
                  <div className="absolute bottom-2 right-3 text-[0.65rem] font-mono text-gray-400 font-bold flex items-center gap-1">
                    <FireIcon className="h-3 w-3 text-hot" />
                    {Math.round(show.popularity || 0)}
                  </div>
                </div>

                <h3 className="text-lg font-black mb-1 group-hover:text-neon transition-colors">
                  {show.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-1.5">
                  {show.first_air_date && (
                    <span>{show.first_air_date.slice(0, 4)}</span>
                  )}
                  <span className="uppercase tracking-[0.15em] text-gray-600">
                    Series
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {show.overview || "No description available."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit className="my-6" />

        {/* NEW RELEASES */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              New Spanish releases{" "}
              <span className="text-neon">worth checking</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Recently dropped Spanish-language series that are gaining traction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
            {newReleases.map((show) => (
              <Link
                key={show.id}
                href={`/show/${show.id}`}
                className="group block"
              >
                <div className="show-card relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${
                      show.poster_path || show.backdrop_path
                    }`}
                    alt={`${show.name} - New Spanish TV show`}
                    className="w-full h-full object-cover opacity-80"
                    loading="lazy"
                  />

                  {/* Rating badge */}
                  {show.vote_average > 0 && (
                    <div className={`rating-badge ${getRatingClass(show.vote_average)} absolute top-3 right-3`}>
                      <StarIcon className="h-3 w-3" />
                      {show.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-black mb-1 group-hover:text-neon transition-colors">
                  {show.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {show.overview || "No description available."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit className="my-6" />

        {/* HIDDEN GEMS */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              Hidden gems{" "}
              <span className="text-hot">real fans talk about</span>
            </h2>
            <p className="text-gray-500 text-sm">
              High-rated but under-the-radar shows -- the ones your friends put you on to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
            {hiddenGems.map((show) => (
              <Link
                key={show.id}
                href={`/show/${show.id}`}
                className="group block"
              >
                <div className="show-card relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${
                      show.backdrop_path || show.poster_path
                    }`}
                    alt={`${show.name} - Hidden gem Spanish TV show`}
                    className="w-full h-full object-cover opacity-80"
                    loading="lazy"
                  />

                  {/* Rating badge */}
                  {show.vote_average > 0 && (
                    <div className={`rating-badge ${getRatingClass(show.vote_average)} absolute top-3 right-3`}>
                      <StarIcon className="h-3 w-3" />
                      {show.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-black mb-1 group-hover:text-hot transition-colors">
                  {show.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {show.overview || "No description available."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* BROWSE MORE */}
        <section className="border-t border-gray-800/50 pt-10">
          <h2 className="text-xl font-black mb-6 text-center">
            Explore More
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Link href="/best-on-netflix" className="category-chip">
              Best on Netflix
            </Link>
            <Link href="/best-spanish-crime-shows" className="category-chip">
              Crime Shows
            </Link>
            <Link href="/shows-like-money-heist" className="category-chip">
              Like Money Heist
            </Link>
            <Link href="/learn-spanish" className="category-chip">
              Learn Spanish
            </Link>
          </div>
        </section>

        {/* FOOTNOTE */}
        <section className="border-t border-gray-800/50 pt-8">
          <p className="text-gray-500 text-xs text-center max-w-2xl mx-auto leading-relaxed">
            This page updates from live TMDB data. If a Spanish show starts
            trending in Spain, Mexico, Colombia, Argentina, or with US
            Latinos, it shows up here. Bookmark it.
          </p>
        </section>
      </div>
    </div>
  );
}
