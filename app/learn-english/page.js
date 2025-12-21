// app/learn-english/page.js
import Link from "next/link";
import { amazonSearchUrl } from "@/lib/amazon";

function Card({ title, desc, href, note }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-3xl border border-gray-800 bg-gradient-to-b from-[#0b1220] to-black p-6 hover:border-neon transition"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
          {title}
        </h3>
        <span className="text-neon font-black group-hover:translate-x-1 transition">
          Open →
        </span>
      </div>
      <p className="mt-3 text-gray-300 leading-relaxed">{desc}</p>
      {note ? <p className="mt-4 text-xs text-gray-500">{note}</p> : null}
    </a>
  );
}

export default function LearnEnglishPage() {
  const links = [
    {
      title: "English learning books (TV + subtitles)",
      desc: "Same strategy: subtitles + phrase mining + real dialogue.",
      href: amazonSearchUrl("learn english with tv subtitles book"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "Pronunciation training (clear speaking)",
      desc: "Accent and pronunciation tools people buy when they actually want results.",
      href: amazonSearchUrl("english pronunciation training book"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "English frequency dictionary",
      desc: "Learn the words that show up constantly in TV, not random junk.",
      href: amazonSearchUrl("english frequency dictionary"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "ESL workbooks (fast drills)",
      desc: "Practice that sticks — short drills people complete.",
      href: amazonSearchUrl("ESL workbook adult"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
        Learn English with <span className="text-neon">TV + Subtitles</span>
      </h1>

      <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
        Same idea as Spanish: watch, repeat, steal phrases, and speak better.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
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

      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map((x) => (
          <Card key={x.title} {...x} />
        ))}
      </section>

      <div className="mt-10 text-xs text-gray-500">
        Disclosure: As an Amazon Associate, we earn from qualifying purchases.
      </div>
    </main>
  );
}
