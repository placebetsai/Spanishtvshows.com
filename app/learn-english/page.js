import Link from "next/link";
import { amazonSearchUrl, amazonDisclosure } from "@/lib/amazon";

export const metadata = {
  title: "Learn English with TV – SpanishTVShows.com",
  description:
    "For Spanish speakers learning English: use TV + subtitles + a weekly speaking routine.",
};

const amazonLinks = [
  {
    title: "Learn English with TV + subtitles (books)",
    desc: "Same method: subtitles + phrase mining + repeat.",
    href: amazonSearchUrl("learn english with tv subtitles book"),
  },
  {
    title: "English pronunciation training",
    desc: "Clearer speaking, less guessing.",
    href: amazonSearchUrl("english pronunciation training book"),
  },
  {
    title: "English frequency dictionary",
    desc: "Words you actually hear all the time.",
    href: amazonSearchUrl("english frequency dictionary"),
  },
  {
    title: "ESL workbook (adult)",
    desc: "Short drills people actually finish.",
    href: amazonSearchUrl("ESL workbook adult"),
  },
];

export default function LearnEnglishPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      <p className="text-xs font-mono tracking-[0.25em] uppercase text-neon mb-4">
        LEARN ENGLISH
      </p>

      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
        Learn English with <span className="text-neon">TV + Subtitles</span>
      </h1>

      <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
        If you speak Spanish and want English fast: watch daily, steal phrases, and speak weekly.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Recommended Books (Amazon)
        </h2>

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
          href="/best-on-netflix"
          className="rounded-full bg-neon text-black px-8 py-4 font-black uppercase hover:bg-white transition text-center"
        >
          Best on Netflix →
        </Link>
      </div>
    </main>
  );
}
