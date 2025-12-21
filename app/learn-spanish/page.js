// app/learn-spanish/page.js
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

export default function LearnSpanishPage() {
  // THESE ARE THE “LIST LIST LIST” LINKS — already tagged with spanishtvshow-20
  const links = [
    {
      title: "Spanish learning books (TV + subtitles)",
      desc: "Starter books people actually buy when they want Spanish fast — subtitles, phrase mining, real dialogue.",
      href: amazonSearchUrl("learn spanish with tv subtitles book"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "Spanish frequency dictionary",
      desc: "This is how you stop wasting time on rare words and learn the ones that show up constantly in TV dialogue.",
      href: amazonSearchUrl("spanish frequency dictionary"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "Spanish grammar (simple, not painful)",
      desc: "A clean grammar reference to stop guessing and start speaking correctly.",
      href: amazonSearchUrl("spanish grammar made easy"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "Kindle Unlimited (Spanish readers)",
      desc: "Cheap way to get tons of Spanish reading material. Reading + TV = fastest combo.",
      href: amazonSearchUrl("kindle unlimited spanish graded readers"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "Headphones for subtitles + dialogue clarity",
      desc: "People buy this. Clear dialogue = faster comprehension.",
      href: amazonSearchUrl("best headphones for watching tv clear dialogue"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
    {
      title: "Notebook / vocab system (phrase mining)",
      desc: "The boring part that makes you rich: write the phrases you hear and reuse them.",
      href: amazonSearchUrl("language learning notebook phrase mining"),
      note: "Amazon search results (tagged: spanishtvshow-20)",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Learn Spanish Faster with{" "}
            <span className="text-neon">TV + Subtitles</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
            This page is the “buy once, use forever” toolkit — books + gear that
            helps people learn Spanish while binge-watching.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
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
          Find a show first →
        </Link>
      </div>

      {/* GRID OF MONEY LINKS */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map((x) => (
          <Card key={x.title} {...x} />
        ))}
      </section>

      {/* Small disclosure (already in footer too — extra safe) */}
      <div className="mt-10 text-xs text-gray-500">
        Disclosure: As an Amazon Associate, we earn from qualifying purchases.
      </div>
    </main>
  );
        }
