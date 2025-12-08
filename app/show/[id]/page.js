import { PlayCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getShowDetails(id) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=similar,videos`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ShowPage({ params }) {
  const show = await getShowDetails(params.id);

  if (!show) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-gray-300">
        Show not found.
      </div>
    );
  }

  const year = show.first_air_date
    ? show.first_air_date.split("-")[0]
    : "????";
  const rating = show.vote_average
    ? show.vote_average.toFixed(1)
    : "N/A";

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* HERO BANNER */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {show.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.name}
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full z-20 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-neon font-bold text-sm mb-6 hover:underline"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              BACK TO RANKING
            </Link>

            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
              {show.name}
            </h1>

            <div className="flex flex-wrap gap-3 text-xs font-mono font-bold">
              {show.number_of_seasons != null && (
                <span className="bg-white text-black px-3 py-1 rounded">
                  {show.number_of_seasons} SEASONS
                </span>
              )}
              {show.status && (
                <span className="bg-hot text-white px-3 py-1 rounded">
                  {show.status}
                </span>
              )}
              <span className="border border-gray-600 px-3 py-1 rounded text-gray-300">
                {year}
              </span>
              <span className="border border-gray-600 px-3 py-1 rounded text-yellow-400">
                ★ {rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-neon mb-4 uppercase">
              The Breakdown
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {show.overview || "No description available."}
            </p>
          </div>

          {/* MONEY BOX – STREAM + LEARN SPANISH */}
          <div className="bg-black border border-gray-800 p-8 rounded-xl box-glow relative overflow-hidden">
            <h3 className="text-xl font-bold mb-2">
              Watch it. Then use it to level up your Spanish.
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Step 1: Stream it on your usual platform.{" "}
              Step 2: Re-watch with interactive subtitles and instant
              translations. Same show, double value.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* JustWatch → affiliate later */}
              <a
                href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                  show.name
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 bg-white text-black font-black uppercase text-center rounded hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
              >
                <PlayCircleIcon className="h-5 w-5" />
                Where to stream
              </a>

              {/* Lingopie / language partner link */}
              <a
                href="https://lingopie.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 border border-neon text-neon font-black uppercase text-center rounded hover:bg-neon hover:text-black transition-colors"
              >
                Learn Spanish with TV
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Affiliate disclosure: some links on this page may earn
              us a commission. You pay the same. We use it to watch
              more trash TV.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN – SIDEBAR */}
        <aside className="space-y-8">
          <div>
            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">
              Show details
            </h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Original language</dt>
                <dd className="font-bold">
                  {show.original_language?.toUpperCase() || "ES"}
                </dd>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">User rating</dt>
                <dd className="font-bold text-yellow-400">★ {rating}</dd>
              </div>

              {show.number_of_episodes != null && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">Episodes</dt>
                  <dd className="font-bold">{show.number_of_episodes}</dd>
                </div>
              )}

              {show.genres?.length > 0 && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">Genres</dt>
                  <dd className="font-bold text-right">
                    {show.genres.map((g) => g.name).join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
            <h4 className="text-sm font-bold mb-2 text-neon uppercase">
              Learn Spanish faster
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Want more than subtitles? Check the{" "}
              <Link
                href="/learn-spanish"
                className="underline text-neon font-semibold"
              >
                Learn Spanish
              </Link>{" "}
              page for tools, apps, and TV-based study plans.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
        }
