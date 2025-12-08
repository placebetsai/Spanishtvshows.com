// app/page.js
import Link from "next/link";
import { FireIcon, StarIcon } from "@heroicons/react/24/solid";

async function getShows() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { results: [] };

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=es-ES&sort_by=popularity.desc&with_original_language=es&vote_count.gte=50`,
      { next: { revalidate: 3600 } }
    );
    return res.ok ? res.json() : { results: [] };
  } catch (e) {
    return { results: [] };
  }
}

export default async function Home() {
  const data = await getShows();
  const shows = data.results || [];

  return (
    <div className="bg-dark min-h-screen">
      {/* HERO */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-dark to-dark -z-10" />
        <p className="text-xs md:text-sm tracking-[0.3em] text-gray-400 uppercase mb-4 font-mono">
          SERIES EN ESPAÑOL • ACTUALIZADAS CADA HORA
        </p>
        <h1 className="text-4xl md:text-7xl font-black uppercase mb-6 leading-[0.9] tracking-tighter">
          Las mejores series
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-purple-500 to-hot">
            en español
          </span>
          <br />
          rankeadas por{" "}
          <span className="underline decoration-neon decoration-4">
            calor real
          </span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-mono mb-10">
          Datos en vivo de TMDB. Solo series originales en español.
          Nada de publicidad, solo lo que la gente realmente está viendo
          en España, Latinoamérica y el resto del mundo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a
            href="#ranking"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-neon text-black font-black text-sm md:text-base tracking-widest uppercase hover:bg-white transition-colors"
          >
            Ver ranking ahora
          </a>
          <Link
            href="/best-on-netflix"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-gray-700 text-xs md:text-sm font-mono tracking-[0.25em] uppercase text-gray-300 hover:text-neon hover:border-neon transition-colors"
          >
            Top 10 en Netflix →
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center text-[0.7rem] md:text-xs text-gray-500 font-mono uppercase tracking-[0.25em] mt-4">
          <span>Para hispanohablantes que quieren buenas series</span>
          <span className="hidden sm:inline">•</span>
          <span>
            También útil si quieres{" "}
            <Link
              href="/learn-english"
              className="text-neon hover:underline"
            >
              aprender inglés con series
            </Link>
          </span>
        </div>
      </section>

      {/* RANKING GRID */}
      <section
        id="ranking"
        className="max-w-7xl mx-auto px-6 pb-20 pt-4 border-t border-gray-900/60"
      >
        <h2 className="text-sm md:text-base tracking-[0.4em] text-gray-400 uppercase mb-4 font-mono">
          Top Spanish shows right now
        </h2>
        <h3 className="text-2xl md:text-3xl font-black mb-10">
          Lo que todo el mundo está binge-watching esta semana
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {shows.map((show, index) => (
            <Link
              key={show.id}
              href={`/show/${show.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-gray-800 group-hover:border-neon transition-colors box-glow">
                <img
                  src={`https://image.tmdb.org/t/p/w500${
                    show.backdrop_path || show.poster_path
                  }`}
                  alt={show.name}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-3 py-1 font-mono text-neon text-xs font-bold border border-gray-700 rounded">
                  #{index + 1}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[0.7rem] font-bold text-hot mb-2">
                <span className="flex items-center">
                  <FireIcon className="h-3 w-3 mr-1" />{" "}
                  {Math.round(show.popularity)} HEAT
                </span>
                <span className="flex items-center text-yellow-400">
                  <StarIcon className="h-3 w-3 mr-1" />{" "}
                  {show.vote_average.toFixed(1)}
                </span>
              </div>
              <h2 className="text-xl font-black uppercase leading-tight mb-1 group-hover:text-neon transition-colors">
                {show.name}
              </h2>
              <p className="text-gray-500 text-xs font-mono mb-2">
                {show.first_air_date?.slice(0, 4) || "????"} •{" "}
                {show.origin_country?.join(", ")}
              </p>
              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {show.overview}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
