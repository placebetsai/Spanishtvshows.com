import Link from "next/link";

async function getShows() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { results: [] };

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_original_language=es&vote_count.gte=50`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return { results: [] };
    return res.json();
  } catch {
    return { results: [] };
  }
}

export default async function Home() {
  const data = await getShows();
  const shows = data.results || [];

  return (
    <div className="bg-dark min-h-screen">
      {/* HERO */}
      <section className="relative py-24 md:py-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-dark to-dark -z-10"></div>
        <h1 className="text-4xl md:text-7xl font-black uppercase mb-6 leading-[0.9] tracking-tight">
          Spanish TV{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-hot">
            Ranked
          </span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-mono">
          Live data from TMDB · Only Spanish-language originals · Updated hourly.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/learn-spanish"
            className="px-6 py-3 rounded-full bg-neon text-black font-bold text-sm tracking-wide hover:bg-white transition-colors"
          >
            Learn Spanish with TV
          </Link>
          <Link
            href="/best-on-netflix"
            className="px-6 py-3 rounded-full border border-gray-700 text-xs font-mono tracking-widest text-gray-300 hover:border-neon hover:text-neon transition-colors"
          >
            BEST ON NETFLIX →
          </Link>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-lg font-mono text-gray-500 uppercase tracking-[0.3em] mb-4">
          TOP SPANISH SHOWS RIGHT NOW
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {shows.map((show, index) => (
            <Link
              key={show.id}
              href={`/show/${show.id}`}
              className="group block box-glow border border-gray-800 rounded-2xl overflow-hidden bg-black/60"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${
                    show.backdrop_path || show.poster_path
                  }`}
                  alt={show.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-3 py-1 font-mono text-neon text-xs font-bold border border-gray-700 rounded">
                  #{index + 1}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">
                  {show.first_air_date?.slice(0, 4) || "????"} · ★{" "}
                  {show.vote_average?.toFixed(1) || "N/A"}
                </p>
                <h3 className="text-lg font-black uppercase mb-1 group-hover:text-neon transition-colors">
                  {show.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {show.overview}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
