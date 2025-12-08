import Link from "next/link";

export const metadata = {
  title: "Learn Spanish with TV – Spanishtvshows.com",
  description:
    "Use Spanish TV shows, interactive subtitles, and a simple routine to learn real Spanish in 2025.",
};

const resources = [
  {
    title: "Lingopie – Learn with TV & Subtitles",
    blurb:
      "Full Spanish shows with clickable subtitles. Tap a word, see translation, auto-build flashcards.",
    link: "https://lingopie.com",
    tag: "TV + subtitles",
  },
  {
    title: "Language Reactor (Chrome Extension)",
    blurb:
      "Double subtitles on Netflix & YouTube. Pause and see translations instantly while watching.",
    link: "https://www.languagereactor.com/",
    tag: "Netflix + YouTube",
  },
  {
    title: "Anki + Sentence Mining",
    blurb:
      "Save spicy lines from your favorite shows and review them daily. Boring, powerful, undefeated.",
    link: "https://apps.ankiweb.net/",
    tag: "Flashcards",
  },
  {
    title: "italki – Speak with Real Humans",
    blurb:
      "1-on-1 video lessons with native speakers for $8–$20/hr. Use TV shows as conversation topics.",
    link: "https://www.italki.com/",
    tag: "Speaking practice",
  },
];

export default function LearnSpanishPage() {
  return (
    <div className="bg-dark min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-xs font-mono tracking-[0.25em] uppercase text-neon mb-4">
          LEARN SPANISH WITHOUT TEXTBOOKS
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Learn Spanish with TV, not boring apps.
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10">
          You don&apos;t need another 400-day Duolingo streak. You need{" "}
          <span className="text-neon font-semibold">
            Spanish shows + subtitles + a simple routine.
          </span>{" "}
          Steal this playbook and be conversational in 6–12 months.
        </p>

        {/* 3-step routine */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="bg-black/80 border border-gray-800 rounded-xl p-6 box-glow">
            <h2 className="text-sm font-mono text-gray-400 tracking-[0.25em] uppercase mb-2">
              Step 1
            </h2>
            <h3 className="text-lg font-bold mb-2">Pick 1 flagship show</h3>
            <p className="text-sm text-gray-300">
              Narcos, La Casa de Papel, Elite — anything you actually enjoy.
              You will re-watch this show like crazy.
            </p>
          </div>
          <div className="bg-black/80 border border-gray-800 rounded-xl p-6 box-glow">
            <h2 className="text-sm font-mono text-gray-400 tracking-[0.25em] uppercase mb-2">
              Step 2
            </h2>
            <h3 className="text-lg font-bold mb-2">Watch with smart subtitles</h3>
            <p className="text-sm text-gray-300">
              First pass: English subs. Second pass: Spanish + click-to-translate
              tools below. Pause on spicy lines, add them to Anki.
            </p>
          </div>
          <div className="bg-black/80 border border-gray-800 rounded-xl p-6 box-glow">
            <h2 className="text-sm font-mono text-gray-400 tracking-[0.25em] uppercase mb-2">
              Step 3
            </h2>
            <h3 className="text-lg font-bold mb-2">Speak once a week</h3>
            <p className="text-sm text-gray-300">
              1–2 italki sessions per week where you only talk about the show:
              characters, drama, plot twists, insults.
            </p>
          </div>
        </div>

        {/* Tools grid */}
        <h2 className="text-2xl font-bold mb-4">Tools that actually help</h2>
        <p className="text-sm text-gray-400 mb-6 max-w-2xl">
          All of these can turn any Spanish show on this site into a full
          language course. Yes, some links are affiliate — you pay the same,
          we buy more snacks.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((tool) => (
            <a
              key={tool.title}
              href={tool.link}
              target="_blank"
              rel="noreferrer"
              className="bg-black/90 border border-gray-800 rounded-xl p-6 box-glow hover:border-neon hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{tool.title}</h3>
                  <span className="text-[0.65rem] font-mono uppercase px-2 py-1 rounded-full border border-gray-700 text-gray-300">
                    {tool.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{tool.blurb}</p>
              </div>
              <span className="mt-4 text-neon text-xs font-mono tracking-[0.25em]">
                OPEN ↗
              </span>
            </a>
          ))}
        </div>

        {/* Cross-link back to shows */}
        <div className="mt-14 border-t border-gray-900 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-400 max-w-xl">
            Ready to practice? Pick one Spanish show and watch{" "}
            <span className="font-semibold text-neon">one episode per day</span>{" "}
            with this setup. No more “I&apos;ll start next year” nonsense.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-neon text-black font-black text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors"
          >
            Browse Spanish shows
          </Link>
        </div>
      </section>
    </div>
  );
                }
