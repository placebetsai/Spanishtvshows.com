import fs from "fs";
import path from "path";
import Link from "next/link";

const OUT_DIR = path.join(process.cwd(), "content", "generated");

export async function generateStaticParams() {
  if (!fs.existsSync(OUT_DIR)) return [];
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => ({ slug: f.replace(".json", "") }));
}

export default async function GeneratedPage({ params }) {
  const file = path.join(OUT_DIR, `${params.slug}.json`);

  if (!fs.existsSync(file)) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black">Not found</h1>
        <Link className="text-neon font-black hover:underline" href="/">
          ← Home
        </Link>
      </div>
    );
  }

  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/" className="text-neon font-black hover:underline">
          ← Home
        </Link>

        <h1 className="text-3xl md:text-5xl font-black mt-6">{data.title}</h1>
        <p className="text-gray-400 text-sm font-mono mt-2">
          By {data.byline?.name} · {data.byline?.role}
        </p>

        <div
          className="prose prose-invert max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: data.html }}
        />

        <div className="mt-10 flex gap-4 text-sm font-mono">
          <a className="text-neon font-black hover:underline" href={data.justwatch} target="_blank" rel="noreferrer">
            Where to watch →
          </a>
          <Link className="text-neon font-black hover:underline" href="/trending">
            Trending →
          </Link>
        </div>
      </div>
    </div>
  );
          }
