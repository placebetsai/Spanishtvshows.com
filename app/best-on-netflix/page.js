import Link from "next/link";

export const metadata = {
  title: "Best Spanish Shows on Netflix (2025) – SpanishTVShows.com",
  description:
    "Curated list of the best Spanish-language series on Netflix in 2025, from crime thrillers to telenovelas.",
};

export default function BestOnNetflixPage() {
  return (
    <div className="bg-dark min-h-screen">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20 space-y-6">
        <p className="text-xs font-mono text-gray-500 tracking-[0.3em] uppercase">
          NETFLIX · PRIME · MAX · DISNEY+
        </p>
        <h1 className="text-3xl md:text-5xl font-black">
          Best Spanish shows on Netflix in 2025
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          This page is for one thing: helping you find a Spanish show worth
          binging tonight without scrolling for 45 minutes. No fluff, just
          straight picks.
        </p>

        <div className="space-y-6 text-sm text-gray-200">
          <div className="border border-gray-800 rounded-2xl p-5 bg-black/70 box-glow">
            <h2 className="text-xl font-bold mb-1 text-neon">
              1. The classic crime hit
            </h2>
            <p className="mb-2">
              The big, obvious mainstream hit. Corruption, violence,
              cliffhangers.
            </p>
            <p className="text-gray-400">
              Search it on{" "}
              <a
                href="https://www.justwatch.com/us"
                target="_blank"
                className="text-neon underline"
              >
                JustWatch
              </a>{" "}
              to see if it’s still on Netflix in your country.
            </p>
          </div>

          <div className="border border-gray-800 rounded-2xl p-5 bg-black/70 box-glow">
            <h2 className="text-xl font-bold mb-1 text-neon">
              2. Easy to follow, great for learners
            </h2>
            <p className="mb-2">
              Slower dialog, clear accents, real life situations. Perfect if
              you’re learning Spanish.
            </p>
            <p className="text-gray-400">
              Pair with{" "}
              <a
                href="/learn-spanish"
                className="text-neon underline"
              >
                our Learn Spanish with TV guide
              </a>{" "}
              for max gains.
            </p>
          </div>

          <div className="border border-gray-800 rounded-2xl p-5 bg-black/70 box-glow">
            <h2 className="text-xl font-bold mb-1 text-neon">
              3. When you just want chaos
            </h2>
            <p className="mb-2">
              Elite schools, rich kids, drama, fights, and terrible decisions.
              You’re not here for realism, you’re here for chaos.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-900 mt-6">
          <p className="text-gray-400 text-sm mb-4">
            Want live rankings instead of static lists?
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-neon text-black font-black text-xs tracking-wide hover:bg-white transition-colors"
          >
            Go back to live ranking →
          </Link>
        </div>
      </section>
    </div>
  );
                }
