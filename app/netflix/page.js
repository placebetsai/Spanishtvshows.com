// app/netflix/page.js
import Link from "next/link";
import { tmdb, slugify, tmdbImg } from "../../lib/tmdb";

export const metadata = {
  title: "Best Spanish Shows on Netflix (Popular Picks 2025)",
  description:
    "Popular Spanish-language TV shows people search for on Netflix. Click a show for rating, seasons, and where to watch.",
};

async function getPopularSpanishNetflixStyle() {
  // We’re NOT claiming official Netflix availability.
  // This is a “Netflix picks” discovery page using Spanish originals popularity + vote volume.
  const data = await tmdb(
    "/discover/tv",
    {
      with_original_language: "es",
      sort_by: "popularity.desc",
      "vote_count.gte": 100,
      page: 1,
      language: "en-US",
    },
    { revalidate: 21600 }
  );

  return (data?.results || []).slice(0, 24);
}

export default async function NetflixPage() {
  const shows = await getPopularSpanishNetflixStyle();

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/" className="text-neon font-black hover:underline">
          ← Home
        </Link>

        <h1 className="text-3xl md:text-5xl font-black mt-6 text-glow">
          Best Spanish Shows on Netflix (Popular Picks)
        </h1>

        <p className="text-gray-300 mt-3 max-w-3xl font-mono text-sm">
          Ranked using popularity + real vote volume. Streaming availability varies by country—open any show for a “Where to Watch” link.
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
                  <h2 className="font-black text-white group-hover:text-neon transition">
                    {s.name}
                  </h2>
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

        <div className="mt-12 bg-black/70 border border-gray-800 rounded-xl p-6 box-glow">
          <h2 className="text-white font-black">What this page means</h2>
          <p className="text-gray-300 mt-2 text-sm leading-relaxed">
            This is a discovery list of popular Spanish-language series people commonly watch and search for on Netflix.
            Availability changes by region. Click any show for a direct “Where to Watch” link.
          </p>
        </div>
      </div>
    </div>
  );
            }
