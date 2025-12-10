// app/about/page.js
export const metadata = {
  title: "About SpanishTVShows.com",
  description:
    "Why SpanishTVShows.com exists, who it's for, and how we rank Spanish-language TV shows.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/40">
            About SpanishTVShows.com
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            The cheat sheet for{" "}
            <span className="text-orange-400">Spanish-language TV addicts.</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
            Forget 20 open tabs and random Reddit threads. SpanishTVShows.com
            is your one hub for finding the best Spanish-language series,
            where they’re streaming, and how to use them to level up your
            Spanish in real life.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 shadow-xl shadow-orange-500/10">
              <h2 className="text-xl font-semibold mb-2">
                Built for real humans, not critics.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Our rankings focus on rewatch-ability, memorable characters,
                natural Spanish, and how easy it is to binge without subtitles
                after a few episodes. If a show feels like homework, it doesn’t
                stay at the top for long.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6">
              <h2 className="text-xl font-semibold mb-2">How we rank shows</h2>
              <ul className="mt-2 space-y-2 text-sm sm:text-base text-slate-300 list-disc list-inside">
                <li>
                  <span className="font-semibold text-orange-300">
                    Streaming access:
                  </span>{" "}
                  Is it actually easy to watch in the US and Latin America?
                </li>
                <li>
                  <span className="font-semibold text-orange-300">
                    Language level:
                  </span>{" "}
                  From beginner-friendly to rapid-fire street slang.
                </li>
                <li>
                  <span className="font-semibold text-orange-300">
                    Binge factor:
                  </span>{" "}
                  Does it hook you by episode 2 or does it drag?
                </li>
                <li>
                  <span className="font-semibold text-orange-300">
                    Rewatch value:
                  </span>{" "}
                  Shows that still slap on the third watch get a rankings boost.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-orange-500/20 via-pink-500/10 to-purple-500/20 border border-orange-500/40 p-6">
              <h2 className="text-xl font-semibold mb-2">
                Learn Spanish without boring classes.
              </h2>
              <p className="text-sm sm:text-base text-slate-50/90">
                Each show includes notes on accent, slang, and difficulty so you
                can pick series that actually match your level. No grammar
                drills, no apps yelling at you — just good TV and smarter
                choices.
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5">
              <h3 className="text-sm font-semibold text-slate-200">
                Who this site is for
              </h3>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-300">
                <li>• English speakers learning Spanish with subtitles</li>
                <li>• Heritage speakers reconnecting with Spanish TV</li>
                <li>• People who just love international series and want the good stuff</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-orange-500/60 p-5">
              <h3 className="text-sm font-semibold text-orange-300">
                Have a show we should add?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-200">
                Email{" "}
                <a
                  href="mailto:info@spanishtvshows.com"
                  className="underline decoration-dotted underline-offset-2 text-orange-300"
                >
                  info@spanishtvshows.com
                </a>{" "}
                with the title, where you watched it, and why it deserves a top
                spot.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
                  }
