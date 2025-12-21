// app/resources/page.js
import Link from "next/link";
import { FireIcon } from "@heroicons/react/24/solid";

export const metadata = {
  title: "Resources – Learn Spanish with TV",
  description:
    "Tools and resources to learn Spanish faster using Spanish-language TV: books, workbooks, flashcards, and more.",
};

export default function ResourcesPage() {
  const tag = "spanishtvshow-20";

  const resources = [
    {
      title: "Learn Spanish with TV (Books)",
      desc: "Books that teach Spanish through shows, subtitles, and real dialogue.",
      url: `https://www.amazon.com/s?k=learn+spanish+with+tv&tag=${tag}`,
    },
    {
      title: "Spanish Workbooks (Beginner → Intermediate)",
      desc: "Structured practice so you actually remember what you hear.",
      url: `https://www.amazon.com/s?k=spanish+workbook&tag=${tag}`,
    },
    {
      title: "Spanish Dictionaries + Phrasebooks",
      desc: "Quick lookups and practical phrases while you watch.",
      url: `https://www.amazon.com/s?k=spanish+dictionary+phrasebook&tag=${tag}`,
    },
    {
      title: "Spanish Flashcards",
      desc: "Fast reps between episodes. Cheap and effective.",
      url: `https://www.amazon.com/s?k=spanish+flashcards&tag=${tag}`,
    },
  ];

  return (
    <div className="bg-dark min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gray-900">
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.3em] text-neon mb-4">
            RESOURCES · LEARN FASTER · NO BS
          </p>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Learn Spanish faster with{" "}
            <span className="text-neon">TV + subtitles</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto font-mono">
            This page has simple tools people actually use while bingeing Spanish
            shows. Clicking these may earn us a commission (you pay the same).
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn-spanish"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-neon text-black font-black text-xs md:text-sm tracking-wide hover:bg-white transition-colors"
            >
              <FireIcon className="h-4 w-4 mr-2" />
              Study plan (free) →
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-700 text-gray-200 text-xs md:text-sm font-bold tracking-wide hover:border-neon hover:text-neon transition-colors"
            >
              Back to Home →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-black/70 py-10 md:py-14 border-t border-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          {/* Disclosure (Amazon compliant) */}
          <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <p className="text-sm text-gray-300 font-mono">
              <span className="text-gray-200 font-bold">Disclosure:</span>{" "}
              As an Amazon Associate, we earn from qualifying purchases.
            </p>
          </div>

          <div className="grid gap-4">
            {resources.map((r) => (
              <a
                key={r.title}
                href={r.url}
                target="_blank"
                rel="nofollow noopener"
                className="group block rounded-2xl border border-gray-800 bg-black/60 p-6 hover:border-neon transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight group-hover:text-neon transition-colors">
                      {r.title}
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>

                  <div className="text-neon font-black text-xs md:text-sm whitespace-nowrap">
                    Open →
                  </div>
                </div>

                <p className="mt-4 text-[0.7rem] md:text-xs text-gray-500 font-mono">
                  Goes to Amazon search results (tagged: {tag})
                </p>
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/learn-spanish"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-neon text-black font-black text-xs md:text-sm tracking-wide hover:bg-white transition-colors"
            >
              Learn Spanish with TV (free plan) →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
                }
