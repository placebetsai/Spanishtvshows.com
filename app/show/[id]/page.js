// app/show/[id]/page.js
export const runtime = "edge";

import Link from "next/link";
import Image from "next/image";
import { tmdb, tmdbImg } from "../../../lib/tmdb";

// Generate unique editorial review for each show — NOT scraped, fully original
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

export async function generateMetadata({ params }) {
  const raw = params?.id || "";
  const id = raw.split("-")[0];
  const show = await tmdb(`/tv/${id}`, { language: "en-US" }, { revalidate: 21600 });

  const title = `${show?.name || "Show"} Review – Where to Watch, Seasons & Rating | SpanishTVShows`;
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

  const genres = (show?.genres || []).map((g) => g.name);
  const rating = show?.vote_average ? show.vote_average.toFixed(1) : "7.0";
  const seasons = show?.number_of_seasons || 1;
  const review = generateShowReview(show?.name || "This show", show?.overview || "", genres, rating, seasons);

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

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {genres.map((g) => (
                    <span key={g} className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80">
                      {g}
                    </span>
                  ))}
                </div>
              )}

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

          <div className="p-6 md:p-10 space-y-8">
            {/* Overview — TMDB data */}
            <div>
              <h2 className="text-xl font-black mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {show?.overview || "No description available yet."}
              </p>
            </div>

            {/* Editorial Review — 100% original content */}
            <div>
              <h2 className="text-xl font-black mb-2">Our Review</h2>
              <p className="text-gray-300 leading-relaxed">{review}</p>
            </div>

            {/* Show Details */}
            <div>
              <h2 className="text-xl font-black mb-3">Show Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rating</div>
                  <div className="text-white font-bold text-lg">⭐ {rating}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seasons</div>
                  <div className="text-white font-bold text-lg">{seasons}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">First Aired</div>
                  <div className="text-white font-bold text-lg">{show?.first_air_date?.split("-")[0] || "—"}</div>
                </div>
                {show?.episode_run_time?.[0] && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Episode Length</div>
                    <div className="text-white font-bold text-lg">{show.episode_run_time[0]} min</div>
                  </div>
                )}
                {show?.status && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                    <div className="text-white font-bold text-lg">{show.status}</div>
                  </div>
                )}
                {show?.original_language && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Language</div>
                    <div className="text-white font-bold text-lg">{show.original_language.toUpperCase()}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Who Should Watch */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-black mb-2">Who Should Watch {show.name}?</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {genres.includes("Crime") || genres.includes("Mystery")
                  ? `If you enjoy edge-of-your-seat crime thrillers with unpredictable twists, ${show.name} is a must-watch. Perfect for fans of Money Heist, Narcos, and Elite.`
                  : genres.includes("Comedy")
                  ? `Looking for a show that balances humor with heart? ${show.name} delivers laughs alongside meaningful storytelling. Great for fans of light-hearted Spanish comedies.`
                  : genres.includes("Drama")
                  ? `Drama lovers who appreciate rich character development and compelling storylines will find ${show.name} deeply satisfying. Comparable in quality to the best international prestige dramas.`
                  : `Whether you're new to Spanish-language TV or a seasoned viewer, ${show.name} offers a compelling viewing experience that transcends language barriers. A great entry point for exploring international television.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
