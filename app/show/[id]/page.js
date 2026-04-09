// app/show/[id]/page.js
export const runtime = "edge";

import Link from "next/link";
import Image from "next/image";
import { tmdb, tmdbImg } from "../../../lib/tmdb";
import AdUnit from "../../../components/AdUnit";

// Generate unique editorial review for each show
function generateShowReview(showName, overview, genres, rating, seasons) {
  const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const hash = getHash(showName);
  const mainGenre = Array.isArray(genres) && genres.length > 0 ? genres[0] : "drama";
  const genreList = Array.isArray(genres) ? genres.join(", ") : genres;

  const openers = [
    `${showName} has solidified its place as a cornerstone of modern ${mainGenre} storytelling. Unlike many of its contemporaries, it manages to balance high-stakes tension with profound character development over its ${seasons} seasons.`,
    `In the crowded landscape of ${mainGenre} television, ${showName} emerges as a distinct and refreshing voice. It doesn't just tell a story; it builds an immersive world that lingers in the mind long after the credits roll.`,
    `With a solid ${rating}/10 rating, ${showName} is more than just a trending title; it is a masterclass in narrative pacing. The show masterfully expands upon its initial premise to deliver something truly unexpected.`,
  ];

  const whyLove = [
    `Viewers are captivated by the raw authenticity and the emotional stakes that define the series. The show excels at subverting expectations, turning standard tropes on their head to keep the audience guessing. Its success lies in the meticulous attention to detail and the stellar performances that bring every nuance to life.`,
    `The magnetic pull of ${showName} comes from its ability to weave complex, multi-layered plotlines into a cohesive and gripping experience. Fans often cite the show's uncompromising vision and its willingness to tackle difficult themes with grace and intensity as the primary reasons for their devotion.`,
    `What truly resonates with the global audience is the visceral connection between the characters and their environment. The cinematography and soundtrack work in perfect harmony to amplify the tension, making every episode feel like a cinematic event that demands full attention.`,
  ];

  const bestFor = [
    `This series is tailor-made for those who appreciate slow-burn narratives that prioritize depth over cheap thrills. If you enjoy dissecting character motivations and uncovering hidden layers within a story, this is your next obsession.`,
    `It's the perfect recommendation for viewers who crave intellectual stimulation alongside their entertainment. If you find yourself drawn to ${genreList} that challenges your perspective, ${showName} will not disappoint.`,
    `Best suited for the binge-watcher who values consistency and world-building, this show rewards careful viewing. It caters to an audience that wants to be challenged, offering a sophisticated blend of ${mainGenre} and narrative complexity.`,
  ];

  const comparisons = [
    `When compared to giants of the genre like Money Heist or Elite, ${showName} offers a more grounded and psychologically driven approach. It trades flashiness for a haunting realism that feels both timely and timeless.`,
    `While it shares the stylistic DNA of prestige dramas, it carves out its own identity through its unique cultural lens and pacing. It feels like a spiritual successor to classic ${mainGenre} hits, yet remains fiercely original.`,
    `Think of it as a blend of atmospheric tension and intricate plotting. However, ${showName} distinguishes itself by focusing heavily on the internal journeys of its protagonists, setting a new standard for the genre.`,
  ];

  return [
    openers[hash % openers.length],
    whyLove[(hash + 1) % whyLove.length],
    bestFor[(hash + 2) % bestFor.length],
    comparisons[(hash + 3) % comparisons.length],
  ].join(" ");
}

function getRatingClass(rating) {
  const r = parseFloat(rating);
  if (r >= 7.5) return "rating-badge--high";
  if (r >= 6.0) return "rating-badge--mid";
  return "rating-badge--low";
}

export async function generateMetadata({ params }) {
  const raw = params?.id || "";
  const id = raw.split("-")[0];
  const show = await tmdb(`/tv/${id}`, { language: "en-US" }, { revalidate: 21600 });

  const title = `${show?.name || "Show"} Review - Where to Watch, Seasons & Rating`;
  const description =
    show?.overview
      ? `${show.name}: ${show.overview.slice(0, 140)}... Read our review, see ratings, seasons, and find where to stream.`
      : `${show?.name || "Show"} - Full review, rating, seasons, and where to watch.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://spanishtvshows.com/show/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://spanishtvshows.com/show/${id}`,
      images: show?.backdrop_path ? [{ url: tmdbImg(show.backdrop_path, "w1280") }] : [],
    },
  };
}

export default async function ShowPage({ params }) {
  const raw = params?.id || "";
  const id = raw.split("-")[0];

  // Fetch show details, watch providers, and recommendations in parallel
  let show, watchProviders, recommendations;
  try {
    [show, watchProviders, recommendations] = await Promise.all([
      tmdb(`/tv/${id}`, { language: "en-US" }, { revalidate: 21600 }),
      tmdb(`/tv/${id}/watch/providers`, {}, { revalidate: 21600 }).catch(() => null),
      tmdb(`/tv/${id}/recommendations`, { language: "en-US" }, { revalidate: 21600 }).catch(() => null),
    ]);
  } catch (e) {
    show = await tmdb(`/tv/${id}`, { language: "en-US" }, { revalidate: 21600 });
    watchProviders = null;
    recommendations = null;
  }

  const jw = `https://www.justwatch.com/us/search?q=${encodeURIComponent(show?.name || "")}`;

  const genres = (show?.genres || []).map((g) => g.name);
  const rating = show?.vote_average ? show.vote_average.toFixed(1) : "7.0";
  const seasons = show?.number_of_seasons || 1;
  const review = generateShowReview(show?.name || "This show", show?.overview || "", genres, rating, seasons);

  // Extract US watch providers
  const usProviders = watchProviders?.results?.US;
  const flatrateProviders = usProviders?.flatrate || [];
  const rentProviders = usProviders?.rent || [];
  const allProviders = [...flatrateProviders, ...rentProviders].slice(0, 6);

  // Filter related shows
  const relatedShows = (recommendations?.results || [])
    .filter((s) => s.poster_path || s.backdrop_path)
    .slice(0, 6);

  // Network names
  const networks = (show?.networks || [])
    .map((n) => n.name)
    .filter(Boolean)
    .slice(0, 4);

  // JSON-LD: TVSeries
  const tvSeriesJsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show?.name || "Spanish TV Show",
    description: show?.overview || "",
    image: show?.poster_path ? tmdbImg(show.poster_path, "w500") : undefined,
    genre: genres,
    numberOfSeasons: seasons,
    aggregateRating: show?.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: show.vote_average.toFixed(1),
          bestRating: "10",
          ratingCount: show.vote_count || 0,
        }
      : undefined,
    datePublished: show?.first_air_date || undefined,
    inLanguage: show?.original_language || "es",
    url: `https://spanishtvshows.com/show/${show?.id}`,
  };

  // JSON-LD: BreadcrumbList
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
      {
        "@type": "ListItem",
        position: 3,
        name: show?.name || "Show",
        item: `https://spanishtvshows.com/show/${show?.id}`,
      },
    ],
  };

  return (
    <div className="bg-dark min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvSeriesJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb Nav */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-neon transition-colors font-medium">
            Home
          </Link>
          <span className="text-gray-700">/</span>
          <Link href="/trending" className="hover:text-neon transition-colors font-medium">
            Trending
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300 font-semibold truncate max-w-[200px]">
            {show?.name || "Show"}
          </span>
        </nav>

        {/* MAIN CARD */}
        <div className="rounded-2xl overflow-hidden border border-gray-800/60 bg-black/70">
          {/* Hero Image */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-black">
            {show?.backdrop_path ? (
              <Image
                src={tmdbImg(show.backdrop_path, "w1280")}
                alt={`${show.name} - Spanish TV show backdrop`}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-3xl md:text-5xl font-black text-glow mb-3">
                {show.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Rating */}
                {show?.vote_average > 0 && (
                  <span className={`rating-badge ${getRatingClass(rating)}`}>
                    <span>&#9733;</span>
                    {rating}/10
                    {show.vote_count > 0 && (
                      <span className="text-[0.6rem] opacity-70 ml-1">
                        ({show.vote_count.toLocaleString()} votes)
                      </span>
                    )}
                  </span>
                )}

                <span className="text-gray-400 text-sm font-medium">
                  {show?.number_of_seasons ?? "?"} {seasons === 1 ? "season" : "seasons"}
                </span>

                {show?.first_air_date && (
                  <span className="text-gray-400 text-sm font-medium">
                    {show.first_air_date.slice(0, 4)}
                  </span>
                )}

                {show?.status && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    show.status === "Returning Series"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : show.status === "Ended"
                      ? "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {show.status}
                  </span>
                )}
              </div>

              {/* Genre Tags */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/5"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Networks */}
              {networks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {networks.map((n) => (
                    <span key={n} className="provider-pill">
                      {n}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={jw}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neon text-black font-black px-6 py-3 rounded-lg hover:bg-white transition-colors inline-flex items-center gap-2"
                >
                  &#9654; Where to Watch
                </a>
                <Link
                  href="/trending"
                  className="border border-gray-700 text-white font-bold px-6 py-3 rounded-lg hover:border-neon hover:text-neon transition-all inline-flex items-center gap-2"
                >
                  Browse More Shows
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-10">
            {/* Where to Watch Section */}
            {allProviders.length > 0 && (
              <div>
                <h2 className="text-xl font-black mb-4">Where to Watch</h2>
                <div className="flex flex-wrap gap-3">
                  {allProviders.map((p) => (
                    <a
                      key={p.provider_id}
                      href={usProviders?.link || jw}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="show-card flex items-center gap-3 px-4 py-3 hover:border-neon"
                    >
                      {p.logo_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          className="w-8 h-8 rounded-lg"
                          loading="lazy"
                        />
                      )}
                      <span className="text-sm font-bold text-gray-300">
                        {p.provider_name}
                      </span>
                    </a>
                  ))}
                </div>
                <p className="text-gray-600 text-xs mt-3">
                  Streaming availability data from TMDB/JustWatch. Availability may vary by region.
                </p>
              </div>
            )}

            {/* Overview */}
            <div>
              <h2 className="text-xl font-black mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-base">
                {show?.overview || "No description available yet."}
              </p>
            </div>

            {/* Ad Unit */}
            <AdUnit className="my-4" />

            {/* Editorial Review */}
            <div>
              <h2 className="text-xl font-black mb-3">Our Review</h2>
              <p className="text-gray-300 leading-relaxed text-base">{review}</p>
            </div>

            {/* Show Details Grid */}
            <div>
              <h2 className="text-xl font-black mb-4">Show Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="show-card p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">
                    Rating
                  </div>
                  <div className="text-white font-black text-lg">&#9733; {rating}</div>
                </div>
                <div className="show-card p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">
                    Seasons
                  </div>
                  <div className="text-white font-black text-lg">{seasons}</div>
                </div>
                <div className="show-card p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">
                    First Aired
                  </div>
                  <div className="text-white font-black text-lg">
                    {show?.first_air_date?.split("-")[0] || "--"}
                  </div>
                </div>
                {show?.episode_run_time?.[0] && (
                  <div className="show-card p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">
                      Episode Length
                    </div>
                    <div className="text-white font-black text-lg">
                      {show.episode_run_time[0]} min
                    </div>
                  </div>
                )}
                {show?.status && (
                  <div className="show-card p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">
                      Status
                    </div>
                    <div className="text-white font-black text-lg">{show.status}</div>
                  </div>
                )}
                {show?.original_language && (
                  <div className="show-card p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">
                      Language
                    </div>
                    <div className="text-white font-black text-lg">
                      {show.original_language.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Who Should Watch */}
            <div className="show-card p-6 md:p-8">
              <h2 className="text-lg font-black mb-3">
                Who Should Watch {show.name}?
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {genres.includes("Crime") || genres.includes("Mystery")
                  ? `If you enjoy edge-of-your-seat crime thrillers with unpredictable twists, ${show.name} is a must-watch. Perfect for fans of Money Heist, Narcos, and Elite.`
                  : genres.includes("Comedy")
                  ? `Looking for a show that balances humor with heart? ${show.name} delivers laughs alongside meaningful storytelling. Great for fans of light-hearted Spanish comedies.`
                  : genres.includes("Drama")
                  ? `Drama lovers who appreciate rich character development and compelling storylines will find ${show.name} deeply satisfying. Comparable in quality to the best international prestige dramas.`
                  : `Whether you're new to Spanish-language TV or a seasoned viewer, ${show.name} offers a compelling viewing experience that transcends language barriers. A great entry point for exploring international television.`}
              </p>
            </div>

            {/* Ad Unit */}
            <AdUnit className="my-4" />

            {/* Related Shows */}
            {relatedShows.length > 0 && (
              <div>
                <h2 className="text-xl font-black mb-2">
                  If You Like {show.name}, Watch These
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Similar shows recommended based on genre, audience, and viewing patterns.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {relatedShows.map((rec) => (
                    <Link
                      key={rec.id}
                      href={`/show/${rec.id}`}
                      className="group block"
                    >
                      <div className="show-card relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
                        <img
                          src={`https://image.tmdb.org/t/p/w342${rec.poster_path || rec.backdrop_path}`}
                          alt={`${rec.name} - Related Spanish TV show`}
                          className="w-full h-full object-cover opacity-80"
                          loading="lazy"
                        />

                        {rec.vote_average > 0 && (
                          <div className={`rating-badge ${getRatingClass(rec.vote_average.toFixed(1))} absolute top-2 right-2`}>
                            <span>&#9733;</span>
                            {rec.vote_average.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-bold group-hover:text-neon transition-colors line-clamp-1">
                        {rec.name}
                      </h3>
                      {rec.first_air_date && (
                        <p className="text-gray-600 text-xs">
                          {rec.first_air_date.slice(0, 4)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Links */}
            <div className="section-divider" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/trending"
                className="show-card p-5 block group text-center"
              >
                <div className="text-neon font-black text-sm group-hover:text-white transition-colors">
                  Trending Now
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  See what is popular this week
                </div>
              </Link>
              <Link
                href="/best-spanish-crime-shows"
                className="show-card p-5 block group text-center"
              >
                <div className="text-neon font-black text-sm group-hover:text-white transition-colors">
                  Best Crime Shows
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Top-rated thrillers and mysteries
                </div>
              </Link>
              <Link
                href="/best-on-netflix"
                className="show-card p-5 block group text-center"
              >
                <div className="text-neon font-black text-sm group-hover:text-white transition-colors">
                  Best on Netflix
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Stream these right now
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
