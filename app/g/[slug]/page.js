import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

const DATA_PATH = path.join(
  process.cwd(),
  "content",
  "generated",
  "spanish-pages.json"
);

function loadPages() {
  if (!fs.existsSync(DATA_PATH)) return [];

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const json = JSON.parse(raw);

  // ✅ Supports BOTH:
  // 1) [ {slug: "..."} ]
  // 2) { pages: [ {slug: "..."} ] }
  const pages = Array.isArray(json) ? json : json.pages;

  if (!Array.isArray(pages)) return [];
  return pages;
}

export async function generateStaticParams() {
  const pages = loadPages();

  // return [{ slug: "..." }, ...]
  return pages
    .filter((p) => p && typeof p.slug === "string" && p.slug.length > 0)
    .map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }) {
  const pages = loadPages();
  const slug = params?.slug;

  const match = pages.find((p) => p.slug === slug);

  if (!match) return notFound();

  // ✅ Adjust these fields to match your generator output
  const title =
    match.title || match.h1 || match.name || slug.replace(/-/g, " ");
  const content =
    match.content ||
    match.html ||
    match.body ||
    match.text ||
    match.description ||
    "";

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>
        {title}
      </h1>

      <div style={{ height: 16 }} />

      {content ? (
        <article
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ fontSize: 18, lineHeight: 1.7 }}
        />
      ) : (
        <p style={{ fontSize: 18, lineHeight: 1.7 }}>
          (No content found for this page yet.)
        </p>
      )}
    </main>
  );
}
