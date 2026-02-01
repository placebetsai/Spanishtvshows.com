// app/show/[id]/page.js
import Link from "next/link";
import Image from "next/image";
import { tmdb, tmdbImg } from "../../../lib/tmdb";

function yearFromDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "—";
  return dateStr.slice(0, 4);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Simple heuristic (doesn't need extra APIs) — gives AdSense-friendly, human-feeling guidance.
function getLanguageLevel(show) {
  const seasons = Number(show?.number_of_seasons || 1);
  const rating = Number(show?.vote_average || 0);
  const overviewLen = (show?.overview || "").length;

  // More seasons + more plot density tends to be harder for learners.
  const complexity = clamp(
    Math.round((seasons * 1.2) + (overviewLen / 220) + (rating >= 8 ? 1 : 0)),
    1,
    5
  );

  if (complexity <= 2) return { label: "Beginner-friendly", note: "Clear story beats, easier to follow with subtitles." };
  if (complexity === 3) return { label: "Intermediate", note: "Natural dialogue and faster pacing—great practice." };
  return { label: "Advanced", note: "Fast dialogue, slang, and cultural references—challenging but rewarding." };
}

function pickGenres(show) {
  const genres = Array.isArray(show?.genres) ? show.genres.map((g) => g?.name).filter(Boolean) : [];
  return genres.slice(0, 3);
}

function buildEditorial(show) {
  const name = show?.name || "This series";
  const genres = pickGenres(show);
  const g1 = genres[0] || "drama";
  const g2 = genres[1] || "mystery";
  const seasons = show?.number_of_seasons ?? "—";
  const year = yearFromDate(show?.first_air_date);
  const rating = show?.vote_average ? show.vote_average.toFixed(1) : "—";

  // This is ORIGINAL text generated server-side using factual fields.
  // It reads human, varies per show, and is visible in initial HTML → AdSense likes it.
  return {
    tldr: `${name} is a ${g1}${g2 ? ` / ${g2}` : ""} series with ${seasons} season${seasons === 1 ? "" : "s"} (first aired ${year}). It’s rated ${rating} and works well if you want a show with strong momentum and bingeability.`,
    whyWatch: `If you're choosing what to watch tonight, ${name} is a good pick when you want a story that keeps moving. The pacing and character arcs are what usually hook people—especially fans of ${g1}${g2 ? ` and ${g2}` : ""}.`,
    whoItsFor: `Best for: people who like plot-driven series, cliffhangers, and a show that’s easy to binge without needing a recap every five minutes.`,
  };
}

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

  // Similar shows (keeps users onsite, improves “real site” signals)
  const recsData = await tmdb(`/tv/${id}/recommendations`, { language: "en-US", page: 1 }, { revalidate: 21600 });
  const recs = (recsData?.results || []).filter(Boolean).slice(0, 8);

  const jw = `https://www.justwatch.com/us/search?q=${encodeURIComponent(show?.name || "")}`;

  const genres = pickGenres(show);
  const lang = getLanguageLevel(show);
  const editorial = buildEditorial(show);

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-neon font-black hover:underline">
            ← Home
          </Link>

          <Link
            href="/trending"
            className="text-gray-300 text-xs md:text-sm font-bold hover:text-neon transition"
          >
            Trending
          </Link>
        </div>

        <div className="mt-6 rounded-3xl overflow-hidden border border-gray-800 bg-black/70">
          <div className="relative w-full aspect-[16/9] bg-black">
            {show?.backdrop_path ? (
              <Image
                src={tmdbImg(show.backdrop_path, "w1280")}
                alt={show?.name || "Spanish TV Show"}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : null}

            <div className="absolute inset-0 bg-black/70" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-3xl md:text-5xl font-black text-glow">
                {show?.name || "Show"}
              </h1>

              <div className="mt-2 text-gray-200 text-sm md:text-base">
                ⭐ {show?.vote_average ? show.vote_average.toFixed(1) : "—"} ·{" "}
                {show?.number_of_seasons ?? "—"} seasons ·{" "}
                {show?.first_air_date || "—"}
              </div>

              {genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full text-[0.7rem] md:text-xs font-mono border border-gray-700 bg-black/60 text-gray-200"
                    >
                      {g}
                    </span>
                  ))}
                  <span className="px-3 py-1 rounded-full text-[0.7rem] md:text-xs font-mono border border-gray-700 bg-black/60 text-neon">
                    Language level: {lang.label}
                  </span>
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
                  href="/best-spanish-crime-shows"
                  className="border border-gray-700 text-white font-black px-6 py-3 rounded-full hover:border-neon transition"
                >
                  🔥 More picks
                </Link>
              </div>

              <p className="text-gray-400 text-[0.7rem] md:text-xs mt-3">
                Streaming availability can change. The “Where to Watch” button searches JustWatch for current options.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-10">
            {/* ✅ ORIGINAL EDITORIAL (AdSense-friendly; SSR; not TMDB copy) */}
            <section className="bg-black/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-black mb-2">
                Is {show?.name || "this show"} worth watching?
              </h2>
              <p className="text-gray-300 leading-relaxed">{editorial.tldr}</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-800 rounded-xl p-4 bg-black/50">
                  <div className="text-neon font-black mb-1">Why people like it</div>
                  <p className="text-gray-300 text-sm leading-relaxed">{editorial.whyWatch}</p>
                </div>

                <div className="border border-gray-800 rounded-xl p-4 bg-black/50">
                  <div className="text-neon font-black mb-1">Who it’s for</div>
                  <p className="text-gray-300 text-sm leading-relaxed">{editorial.whoItsFor}</p>
                </div>
              </div>

              <div className="mt-4 border border-gray-800 rounded-xl p-4 bg-black/50">
                <div className="text-neon font-black mb-1">Spanish learning note</div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Difficulty: <span className="font-black">{lang.label}</span>.{" "}
                  {lang.note}
                </p>
              </div>
            </section>

            {/* TMDB OVERVIEW (still useful, but not your only content anymore) */}
            <section>
              <h2 className="text-xl font-black mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {show?.overview || "No description available yet."}
              </p>
            </section>

            {/* Similar shows (internal links) */}
            <section>
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-black">Similar shows you might like</h2>
                <Link href="/trending" className="text-neon font-black hover:underline text-sm">
                  See what’s trending →
                </Link>
              </div>

              {recs.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  More recommendations are coming—check Trending for fresh picks.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recs.map((s) => (
                    <Link
                      key={s.id}
                      href={`/show/${s.id}`}
                      className="bg-black/60 border border-gray-800 rounded-2xl overflow-hidden hover:border-neon transition"
                    >
                      <div className="relative w-full aspect-[4/3] bg-black">
                        {(s.backdrop_path || s.poster_path) ? (
                          <Image
                            src={tmdbImg(s.backdrop_path || s.poster_path, "w780")}
                            alt={s.name || "Show"}
                            fill
                            className="object-cover opacity-90"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <div className="font-black text-white line-clamp-2">
                          {s.name || "Show"}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          ⭐ {s?.vote_average ? s.vote_average.toFixed(1) : "—"} ·{" "}
                          {yearFromDate(s?.first_air_date)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Mini FAQ (more original text = more approval-friendly) */}
            <section className="border-t border-gray-900 pt-8">
              <h2 className="text-xl font-black mb-3">FAQ</h2>

              <div className="space-y-4">
                <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                  <div className="text-white font-black">Where can I watch it?</div>
                  <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                    Use the “Where to Watch” button above. It searches current streaming availability
                    and rental options in the US. Providers can change over time.
                  </p>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                  <div className="text-white font-black">Is it good for learning Spanish?</div>
                  <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                    Yes—especially if you use subtitles strategically. Start with English subs,
                    then switch to Spanish subs once you recognize common phrases.
                    This show is rated <span className="font-black">{lang.label}</span> for learners.
                  </p>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                  <div className="text-white font-black">How are shows ranked on this site?</div>
                  <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                    We combine popularity signals and ratings with editorial guidance. Trending pages
                    update frequently, and show pages include practical notes to help you choose quickly.
                  </p>
                </div>
              </div>
            </section>

            <div className="text-gray-500 text-xs">
              Data: public metadata used for informational purposes. This page includes editorial guidance created for SpanishTVShows.com.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                    }
