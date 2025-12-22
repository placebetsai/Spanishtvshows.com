import fs from "fs";
import path from "path";
import Link from "next/link";

export const dynamic = "force-static";

const DATA_PATH = path.join(process.cwd(), "content", "generated", "spanish-pages.json");

function readPages() {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf8").trim();
  if (!raw) return [];

  const parsed = JSON.parse(raw);

  // Support BOTH formats:
  // 1) [ {slug,...}, ... ]
  // 2) { pages: [ {slug,...}, ... ] }
  const pages = Array.isArray(parsed) ? parsed : Array.isArray(parsed.pages) ? parsed.pages : [];

  return pages.filter((p) => p && typeof p.slug === "string" && p.slug.length > 0);
}

export function generateStaticParams() {
  const pages = readPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const pages = readPages();
  const page = pages.find((p) => p.slug === params.slug);

  if (!page) {
    return {
      title: "Spanish TV Shows – Page Not Found",
      description: "This page could not be found.",
    };
  }

  return {
    title: page.title || "Spanish TV Shows",
    description: page.description || "Learn Spanish with TV shows and subtitles.",
  };
}

export default function GeneratedPage({ params }) {
  const pages = readPages();
  const page = pages.find((p) => p.slug === params.slug);

  if (!page) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Page not found</h1>
        <p>
          That slug doesn’t exist yet. This means your generator hasn’t produced it in{" "}
          <code>content/generated/spanish-pages.json</code>.
        </p>
        <p>
          <Link href="/">Go home</Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>{page.title}</h1>
      {page.description ? <p style={{ opacity: 0.8 }}>{page.description}</p> : null}
      <hr style={{ margin: "24px 0" }} />
      <article style={{ lineHeight: 1.6, fontSize: 18 }}>
        {page.content ? <p>{page.content}</p> : <p>No content yet.</p>}
      </article>
    </main>
  );
}
