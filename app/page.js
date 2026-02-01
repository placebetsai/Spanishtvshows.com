import Link from "next/link";
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
      <NewsTicker />

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
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-neon mb-4">
            LATIN TV IS CARRYING 2025
          </p>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tighter mb-6">
            #1 Right Now:
            <br />
            <span className="bg-gradient-to-r from-neon via-hot to-orange-400 bg-clip-text text-transparent">
              {topShow?.name || "Spanish TV"}
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
            We rank Spanish-language series with clear recommendations, where-to-watch info,
            and beginner-friendly notes for learning Spanish through TV.
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

          <div className="max-w-3xl mx-auto mt-10 text-left bg-black/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-display text-2xl md:text-3xl text-white mb-2">
              What this site is (and why it exists)
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              SpanishTVShows.com is a recommendation site for people who want the best Spanish-language
              series without wasting hours scrolling. We highlight what’s worth watching, who it’s for,
              and where to stream it—plus practical notes for anyone learning Spanish and trying to
              train their ear with real dialogue.
            </p>
            <p className="text-gray-400 text-xs mt-3">
              Start with Trending, then click into a show page for details and streaming options.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-12 mb-12">
        <div className="bg-black/70 border border-gray-800 rounded-2xl p-6 box-glow">
          <h2 className="font-display text-3xl text-white mb-2">
            Popular Spanish TV Guides
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Start here. Find a show. Click “Where to Watch.”
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/shows-like-money-heist"
              className="bg-black/80 border border-gray-800 rounded-xl p-5 hover:border-neon transition block"
            >
              <div className="text-neon font-black text-lg">
                Shows Like Money Heist
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Heists, chaos, betrayals, big twists.
              </div>
            </Link>

            <Link
              href="/best-spanish-crime-shows"
              className="bg-black/80 border border-gray-800 rounded-xl p-5 hover:border-neon transition block"
            >
              <div className="text-neon font-black text-lg">
                Best Spanish Crime Shows
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Ranked by ratings + real vote count.
              </div>
            </Link>

            <Link
              href="/trending"
              className="bg-black/80 border border-gray-800 rounded-xl p-5 hover:border-neon transition block"
            >
              <div className="text-neon font-black text-lg">
                Trending Right Now
              </div>
              <div className="text-gray-400 text-xs mt-2">
                What’s exploding this week.
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="top10" className="max-w-7xl mx-auto px-6 pb-20 pt-12">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-center mb-4">
          Top 10 Spanish Shows Destroying <span className="text-neon">2026</span>
        </h2>

        {shows.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-6">
            Rankings update frequently. Check back shortly for the latest Top 10.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
          {shows.slice(0, 10).map((show, index) => (
            <Link key={show.id} href={`/show/${show.id}`} className="group block">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-gray-800 group-hover:border-neon transition-colors box-glow">
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`}
                  alt={show.name}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full font-black text-xs bg-neon text-black">
                  #{index + 1}
                </div>
              </div>

              <h3 className="text-xl font-black group-hover:text-neon transition-colors">
                {show.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
