export const metadata = {
  title: "Learn Spanish with TV – SpanishTVShows.com",
  description:
    "Turn Spanish TV shows into a daily language lesson. Tools, tips, and show recommendations for learning Spanish in 2025.",
};

export default function LearnSpanishPage() {
  return (
    <div className="bg-dark min-h-screen">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs font-mono text-gray-500 tracking-[0.3em] uppercase mb-3">
          ZERO TEXTBOOKS. ZERO DUOLINGO OWLS.
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-4">
          Learn Spanish using TV shows in 2025
        </h1>
        <p className="text-gray-300 text-base md:text-lg mb-8">
          The fastest way to actually understand real Spanish is not apps. It’s
          binge-watching with the right setup: subtitles, pausing, rewinding,
          and a tool that lets you click words on screen.
        </p>

        {/* TOOLS SECTION */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="box-glow border border-gray-800 rounded-2xl p-5 bg-black/60">
            <h2 className="text-xl font-bold mb-2 text-neon">
              1. Choose a “learning” platform
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              These platforms overlay shows with instant translations, slow
              playback, and vocab tracking.
            </p>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>
                <a
                  href="https://lingopie.com"
                  target="_blank"
                  className="text-neon underline"
                >
                  Lingopie
                </a>{" "}
                – TV + click-to-translate, built for Spanish learners
              </li>
              <li>
                <a
                  href="https://www.fluentu.com"
                  target="_blank"
                  className="text-neon underline"
                >
                  FluentU
                </a>{" "}
                – Clips with vocab decks & quizzes
              </li>
            </ul>
          </div>

          <div className="box-glow border border-gray-800 rounded-2xl p-5 bg-black/60">
            <h2 className="text-xl font-bold mb-2 text-neon">
              2. Or use normal streaming cleverly
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Netflix, Disney+, Prime Video, and Max all have Spanish dubs and
              originals.
            </p>
            <p className="text-sm text-gray-300">
              Use{" "}
              <a
                href="https://www.justwatch.com"
                target="_blank"
                className="text-neon underline"
              >
                JustWatch
              </a>{" "}
              to find where a show is streaming in your country, then:
            </p>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside mt-2">
              <li>Start with Spanish audio + English subtitles</li>
              <li>Move to Spanish audio + Spanish subtitles</li>
              <li>Finally: Spanish audio only</li>
            </ul>
          </div>
        </div>

        {/* SHOW SUGGESTIONS */}
        <div className="box-glow border border-gray-800 rounded-2xl p-5 bg-black/60 mb-10">
          <h2 className="text-xl font-bold mb-3 text-neon">
            Recommended shows by level
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-300">
            <div>
              <h3 className="font-bold mb-1">Beginner</h3>
              <ul className="space-y-1">
                <li>• Light comedies</li>
                <li>• Teen dramas</li>
                <li>• Kids shows / cartoons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-1">Intermediate</h3>
              <ul className="space-y-1">
                <li>• Narcos-style crime</li>
                <li>• Workplace dramas</li>
                <li>• Telenovelas with clear diction</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-1">Advanced</h3>
              <ul className="space-y-1">
                <li>• Fast-paced comedies</li>
                <li>• Regional accents (Spain, Mexico, Argentina)</li>
                <li>• Panel shows & podcasts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-300 mb-4">
            Step 1: Pick a show from the homepage. Step 2: Find where it’s
            streaming. Step 3: Commit to 1 episode a day.
          </p>
          <a
            href="https://lingopie.com"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-neon text-black font-black text-sm tracking-wide hover:bg-white transition-colors"
          >
            Start learning Spanish with TV →
          </a>
        </div>
      </section>
    </div>
  );
                  }
