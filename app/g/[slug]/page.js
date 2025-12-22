import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

// ✅ Load JSON in a way that works whether it's:
// - an array: [{...},{...}]
// - or wrapped: { pages: [{...},{...}] }
function loadPages() {
  const filePath = path.join(process.cwd(), "content", "generated", "spanish-pages.json");

  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf8");
  if (!raw || raw.trim().length === 0) return [];

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }

  // Normalize to array
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.pages)) return data.pages;

  return [];
}

export async function generateStaticParams() {
  const pages = loadPages();

  // ✅ Defensive: only keep valid slugs
  return pages
    .map((p) => p?.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export default function Page({ params }) {
  const pages = loadPages();
  const page = pages.find((p) => p.slug === params.slug);

  if (!page) return notFound();

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12 }}>{page.title}</h1>

      {page.description ? (
        <p style={{ opacity: 0.85, fontSize: 18, marginBottom: 18 }}>{page.description}</p>
      ) : null}

      <article style={{ lineHeight: 1.7, fontSize: 18, whiteSpace: "pre-wrap" }}>
        {page.content || page.body || ""}
      </article>
    </main>
  );
}
