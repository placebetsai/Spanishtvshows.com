// app/shows-like-money-heist/page.js
import Link from "next/link";
import { tmdb, slugify, tmdbImg } from "../../lib/tmdb";

export const metadata = {
  title: "Shows Like Money Heist (Spanish Crime & Thriller Picks)",
  description: "Spanish-language crime and thriller picks with similar vibes to Money Heist.",
};

async function getCrimeThrillers() {
  const data = await tmdb(
    "/discover/tv",
    {
      with_original_language: "es",
      sort_by: "popularity.desc",
      with_genres: "80,9648,18,10759",
      "vote_count.gte": 50,
      page: 1,
    },
    { revalidate: 21600 }
  );
  return (data.results || []).slice(0, 24);
}

export default async function Page() {
  const shows = await getCrimeThrillers();

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/" className="text-neon font-black hover:underline">← Home</Link>

        <h1 className="text-3xl md:text-5xl font-black mt-6 text-glow">
          Shows Like Money Heist
        </h1>
        <p className="text-gray-300 mt-3 max-w-3xl font-mono text-sm">
          Spanish crime + thriller picks with twists, chaos, and big moves.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {shows.map((s) => (
            <Link
              key={s.id}
              href={`/show/${s.id}-${slugify(s.name)}`}
              className="group block bg-black/80 border border-gray-800 rounded-xl overflow-hidden hover:border-neon transition box-glow"
            >
              <div
                className="aspect-[16/9] bg-black"
                style={{
                  backgroundImage: s.backdrop_path
                    ? `url(${tmdbImg(s.backdrop_path, "w780")})`
                    : "radial-gradient(circle at top, #111827, #000000 60%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full bg-black/55 group-hover:bg-black/35 transition" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-black text-white group-hover:text-neon transition">{s.name}</h2>
                  <div className="text-xs text-gray-300 whitespace-nowrap">
                    ⭐ {s.vote_average ? s.vote_average.toFixed(1) : "—"}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                  {s.overview || "No description available."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
