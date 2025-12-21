import Link from "next/link";
import { amazonSearchUrl, amazonDisclosure } from "@/lib/amazon";

export const metadata = {
  title: "Learn Spanish with TV – SpanishTVShows.com",
  description:
    "Learn Spanish faster using TV shows, subtitles, and a simple routine. Tools + resources that actually help.",
};

const tools = [
  {
    title: "Language Reactor (Netflix/YouTube)",
    desc: "Double subtitles + click-to-translate while watching. Great for phrase mining.",
    href: "https://www.languagereactor.com/",
    tag: "Subtitles",
  },
  {
    title: "Lingopie (Learn with shows)",
    desc: "Clickable subtitles with shows built for learning. Good if you want everything in one place.",
    href: "https://lingopie.com",
    tag: "Shows",
  },
  {
    title: "Anki (Flashcards)",
    desc: "Save lines from shows, review daily. Boring. Works.",
    href: "https://apps.ankiweb.net/",
    tag: "Flashcards",
  },
  {
    title: "italki (Speak 1-on-1)",
    desc: "Weekly speaking practice with native speakers. Use your show as the conversation topic.",
    href: "https://www.italki.com/",
    tag: "Speaking",
  },
];

const amazonLinks = [
  {
    title: "Learn Spanish with TV + subtitles (books)",
    desc: "Books tailored to learning via dialogue/subtitles. High intent = higher conversion.",
    href: amazonSearchUrl("learn spanish with tv subtitles book"),
  },
  {
    title: "Spanish frequency dictionary",
    desc: "Learn the words that show up constantly in real dialogue.",
    href: amazonSearchUrl("spanish frequency dictionary"),
  },
  {
    title: "Spanish slang (Spain + LATAM)",
    desc: "Understand what characters actually mean, not textbook Spanish.",
    href: amazonSearchUrl("spanish slang dictionary"),
  },
  {
    title: "Spanish listening comprehension workbook",
    desc: "Train your ear so subtitles become optional over time.",
    href: amazonSearchUrl("spanish listening comprehension workbook"),
  },
];

export default function LearnSpanishPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      <p className="text-xs font-mono tracking-[0.25em] uppercase text-neon mb-4">
        LEARN SPANISH
      </p>

      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
        Learn Spanish with <span className="text-neon">TV + Subtitles</span>
      </h1>

      <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
        Stop wasting time on random app streaks. Pick one show, use smart subtitles,
        steal phrases, and speak once a week. That’s the whole game.
      </p>

      {/* Routine */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { n: "Step 1", t: "Pick one show", d: "Choose a show you actually like. Rewatching is the cheat code." },
          { n: "Step 2", t: "Watch smart", d: "Use double subtitles + click-to-translate. Save lines you love." },
          { n: "Step 3", t: "Speak weekly", d: "One italki session per week. Talk ONLY about the show." },
        ].map((x) => (
          <div
            key={x.n}
            className="rounded-3xl border border-gray-800 bg-black/60 p-6"
          >
            <div className="text-xs font-mono tracking-[0.25em] uppercase text-gray-400">
              {x.n}
            </div>
            <div className="mt-2 text-xl font-black">{x.t}</div>
            <div className="mt-2 text-gray-300 text-sm leading-relaxed">{x.d}</div>
          </div>
        ))}
      </section>

      {/* Tools */}
      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Tools that help
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((x) => (
            <a
              key={x.title}
              href={x.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl border border-gray-800 bg-black/60 p-6 hover:border-neon transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-xl font-black">{x.title}</div>
                <span className="text-xs font-mono uppercase text-gray-400 border border-gray-800 rounded-full px-3 py-1">
                  {x.tag}
                </span>
              </div>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">{x.desc}</p>
              <div className="mt-4 text-neon font-black group-hover:translate-x-1 transition">
                Open →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Amazon Money Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Recommended Books (Amazon)
        </h2>
        <p className="mt-2 text-gray-300 max-w-2xl">
          These are high-intent clicks. People already want to learn — this just gives them the right tools.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {amazonLinks.map((x) => (
            <a
              key={x.title}
              href={x.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group rounded-3xl border border-gray-800 bg-black/60 p-6 hover:border-neon transition"
            >
              <div className="text-xl font-black">{x.title}</div>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">{x.desc}</p>
              <div className="mt-4 text-neon font-black group-hover:translate-x-1 transition">
                Shop →
              </div>
            </a>
          ))}
        </div>

        <p className="mt-6 text-xs text-gray-500">{amazonDisclosure()}</p>
      </section>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="rounded-full border border-gray-700 px-8 py-4 font-black uppercase text-gray-200 hover:border-neon hover:text-neon transition text-center"
        >
          Back to Home →
        </Link>
        <Link
          href="/trending"
          className="rounded-full bg-neon text-black px-8 py-4 font-black uppercase hover:bg-white transition text-center"
        >
          Find a show →
        </Link>
      </div>
    </main>
  );
                                                      }
