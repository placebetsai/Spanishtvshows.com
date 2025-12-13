// app/page.js
import Link from "next/link";
import { FireIcon, StarIcon } from "@heroicons/react/24/solid";
import NewsTicker from "../components/NewsTicker";

async function getTopSpanish() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_original_language=es&vote_count.gte=50`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const shows = await getTopSpanish();
  const topShow = shows[0];

  return (
    <div className="bg-dark min-h-screen">
      {/* NEWS TICKER (above hero, homepage only) */}
      <NewsTicker />

      {/* ===================== HERO – #1 SHOW FULL BACKGROUND ===================== */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "80vh",
          backgroundImage: topShow?.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${topShow.backdrop_path})`
            : "radial-gradient(circle at top, #111827, #020617 60%, #000000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-neon mb-4">
            LATIN TV IS CARRYING 2025
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter mb-6">
            #1 Right Now:
            <br />
            <span className="bg-gradient-to-r from-neon via-hot to-orange-400 bg-clip-text text-transparent">
              {topShow?.name || "Spanish TV"}
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-mono mb-8">
            Spanish-language TV is cooking your favorite English shows. Narcos,
            Elite, novelas, crime – 600M+ people know what’s really good. We
            just say it out loud.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#top10"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-neon text-black font-black text-sm md:text-base tracking-wide shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:bg-white transition-colors"
            >
              See the full Top 10 →
            </a>

            {topShow && (
              <Link
                href={`/show/${topShow.id}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-600 text-gray-200 text-xs md:text-sm font-bold tracking-wide hover:border-neon hover:text-neon transition-colors"
              >
                Why this is #1 →
              </Link>
            )}
          </div>

          {topShow && (
            <p className="text-gray-500 text-xs md:text-sm mt-6 font-mono">
              {topShow.first_air_date?.slice(0, 4) || "????"} •{" "}
              {topShow.vote_average
                ? `${topShow.vote_average.toFixed(1)}★`
                : "No rating"}{" "}
              • {Math.round(topShow.popularity || 0)} {" HEAT"}
            </p>
          )}
        </div>
      </section>

      {/* ===================== TOP 10 GRID ===================== */}
      <section id="top10" className="max-w-7xl mx-auto px-6 pb-20 pt-12 md:pt-16">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-4">
          Top 10 Spanish Shows Destroying <span className="text-neon">2025</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base text-center mb-10 max-w-2xl mx-auto font-mono">
          Data from TMDB · Sorted by global heat · Not sponsored. If it’s mid, it
          doesn’t make the list.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {shows.slice(0, 10).map((show, index) => (
            <Link key={show.id} href={`/show/${show.id}`} className="group block relative">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-gray-800 group-hover:border-neon transition-colors box-glow">
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`}
                  alt={show.name}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />

                {/* Rank badge */}
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full font-black text-xs md:text-sm font-mono ${
                    index < 3
                      ? "bg-neon text-black"
                      : "bg-black/80 text-gray-200 border border-gray-700"
                  }`}
                >
                  #{index + 1}{" "}
                  {index === 0 ? "🔥🔥🔥" : index === 1 ? "🔥🔥" : index === 2 ? "🔥" : ""}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[0.7rem] md:text-xs font-bold text-hot mb-2">
                <span className="flex items-center">
                  <FireIcon className="h-3 w-3 mr-1" /> {Math.round(show.popularity || 0)} HEAT
                </span>
                <span className="flex items-center text-yellow-400">
                  <StarIcon className="h-3 w-3 mr-1" />
                  {show.vote_average ? show.vote_average.toFixed(1) : "N/A"}
                </span>
                {show.first_air_date && (
                  <span className="text-gray-500">{show.first_air_date.slice(0, 4)}</span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-black uppercase leading-tight mb-2 group-hover:text-neon transition-colors">
                {show.name}
              </h3>

              <p className="text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed mb-2">
                {show.overview || "No description available yet."}
              </p>

              <p className="text-[0.7rem] md:text-xs text-gray-500 font-mono">
                Click for breakdown, streaming links & “is this worth my time?”
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== SEO + MONEY SECTION ===================== */}
      <section className="border-t border-gray-900 bg-black/70 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <h3 className="text-xl md:text-2xl font-black">
            Best Spanish TV Shows 2025 – Netflix, HBO Max, Prime Video, ViX
          </h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            We rank Spanish-language series from Spain, Mexico, Colombia, Argentina and across Latin America – crime, novelas, dystopian stuff, comedies and everything in between. If you’re tired of mid English shows, this is your watchlist.
          </p>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Most of these are available on{" "}
            <span className="text-gray-200 font-semibold">
              Netflix, HBO Max, Prime Video, Disney+, ViX, and other platforms
            </span>
            . We use live data from TMDB and real viewer scores – no studio marketing, no fake hype.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/learn-english"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-neon text-black font-black text-xs md:text-sm tracking-wide hover:bg-white transition-colors"
            >
              Use these shows to improve your English →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-700 text-gray-200 text-xs md:text-sm font-bold tracking-wide hover:border-neon hover:text-neon transition-colors"
            >
              Suggest a show · Complain · Partner →
            </Link>
          </div>

          <p className="text-[0.7rem] md:text-xs text-gray-500 font-mono pt-2">
            Spanishtvshows.com is for Spanish speakers & Latinos who know their TV is better. English-speakers are welcome to cry in the comments.
          </p>
        </div>
      </section>
    </div>
  );
}
