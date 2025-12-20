// app/show/[id]/page.js
import Link from "next/link";
import Image from "next/image";
import { tmdb, tmdbImg } from "../../../lib/tmdb";

export async function generateMetadata({ params }) {
  const raw = params?.id || "";
  const id = raw.split("-")[0];
  const show = await tmdb(`/tv/${id}`, { language: "en-US" }, { revalidate: 21600 });

  const title = `${show?.name || "Show"} – Where to Watch, Seasons, Rating`;
  const description =
    (show?.overview || "").slice(0, 155) ||
    "Show details, rating, seasons, and where to watch.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: show?.backdrop_path ? [{ url: tmdbImg(show.backdrop_path, "w1280") }] : [],
    },
  };
}

export default async function ShowPage({ params }) {
  const raw = params?.id || "";
  const id = raw.split("-")[0];

  const show = await tmdb(`/tv/${id}`, { language: "en-US" }, { revalidate: 21600 });
  const jw = `https://www.justwatch.com/us/search?q=${encodeURIComponent(show?.name || "")}`;

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link href="/" className="text-neon font-black hover:underline">
          ← Home
        </Link>

        <div className="mt-6 rounded-3xl overflow-hidden border border-gray-800 bg-black/70">
          <div className="relative w-full aspect-[16/9] bg-black">
            {show?.backdrop_path ? (
              <Image
                src={tmdbImg(show.backdrop_path, "w1280")}
                alt={show.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : null}
            <div className="absolute inset-0 bg-black/70" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-3xl md:text-5xl font-black text-glow">{show.name}</h1>
              <div className="mt-2 text-gray-200 text-sm md:text-base">
                ⭐ {show?.vote_average ? show.vote_average.toFixed(1) : "—"} ·{" "}
                {show?.number_of_seasons ?? "—"} seasons ·{" "}
                {show?.first_air_date || "—"}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <a
                  href={jw}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neon text-black font-black px-6 py-3 rounded-full hover:bg-white transition"
                >
                  ▶ Where to Watch
                </a>
                <Link
                  href="/shows-like-money-heist"
                  className="border border-gray-700 text-white font-black px-6 py-3 rounded-full hover:border-neon transition"
                >
                  🔥 More picks
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <h2 className="text-xl font-black mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed">
              {show?.overview || "No description available yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
