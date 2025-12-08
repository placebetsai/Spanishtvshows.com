import Link from "next/link";

async function getShowDetails(id) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ShowPage({ params }) {
  const show = await getShowDetails(params.id);
  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Show not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* HERO BANNER */}
      <div className="relative h-[55vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent z-10" />
        {show.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute bottom-0 left-0 w-full z-20 px-6 pb-10">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-neon font-bold text-xs mb-4 hover:underline"
            >
              ← BACK TO RANKING
            </Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-2">
              {show.name}
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-xl">
              {show.first_air_date?.slice(0, 4) || "????"} ·{" "}
              {show.number_of_seasons} season
              {show.number_of_seasons !== 1 ? "s" : ""} · ★{" "}
              {show.vote_average?.toFixed(1) || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-neon text-sm font-mono uppercase tracking-[0.25em]">
            The breakdown
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            {show.overview || "No description available."}
          </p>

          <div className="bg-black/60 border border-gray-800 rounded-2xl p-6 space-y-4 box-glow">
            <h3 className="text-xl font-bold">
              Watch it or use it to level up your Spanish.
            </h3>
            <p className="text-sm text-gray-400">
              Stream it wherever you already pay, or use a language platform
              that turns every line into a lesson.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                  show.name
                )}`}
                target="_blank"
                className="flex-1 py-3 bg-white text-black font-black uppercase text-center rounded-full hover:bg-gray-200 transition-colors text-sm"
              >
                Where to watch →
              </a>
              <a
                href="https://lingopie.com"
                target="_blank"
                className="flex-1 py-3 border border-neon text-neon font-black uppercase text-center rounded-full hover:bg-neon hover:text-black transition-colors text-sm"
              >
                Learn with this show →
              </a>
            </div>
          </div>
        </div>

        {/* SIDE DETAILS */}
        <aside className="space-y-4 text-sm">
          <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500">
            Details
          </h3>
          <div className="bg-black/60 border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Original language</span>
              <span className="font-bold">
                {show.original_language?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Episodes</span>
              <span className="font-bold">{show.number_of_episodes}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Status</span>
              <span className="font-bold">{show.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">First aired</span>
              <span className="font-bold">
                {show.first_air_date || "Unknown"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div>
            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">Details</h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Original Language</dt>
                <dd className="font-bold">Spanish</dd>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Rating</dt>
                <dd className="font-bold text-yellow-500">★ {show.vote_average.toFixed(1)}</dd>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Episodes</dt>
                <dd className="font-bold">{show.number_of_episodes}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
            }
