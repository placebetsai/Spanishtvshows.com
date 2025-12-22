import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

const DATA_PATH = path.join(process.cwd(), "content", "generated", "spanish-pages.json");

function loadAllPages() {
  if (!fs.existsSync(DATA_PATH)) return [];

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const json = JSON.parse(raw);

  // Support multiple shapes
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.pages)) return json.pages;
  if (Array.isArray(json.items)) return json.items;
  if (Array.isArray(json.data)) return json.data;

  return [];
}

export async function generateStaticParams() {
  const pages = loadAllPages();

  // If we can't find any pages, generate nothing (but don't crash build)
  return pages
    .filter((p) => p && typeof p.slug === "string" && p.slug.length > 0)
    .map((p) => ({ slug: p.slug }));
}

export default function GeneratedPage({ params }) {
  const pages = loadAllPages();
  const page = pages.find((p) => p && p.slug === params.slug);

  if (!page) return notFound();

  const title = page.title || page.h1 || params.slug.replace(/-/g, " ");
  const description = page.description || page.metaDescription || "";

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 34, lineHeight: 1.15, marginBottom: 10 }}>{title}</h1>

      {description ? (
        <p style={{ opacity: 0.85, fontSize: 18, marginBottom: 18 }}>{description}</p>
      ) : null}

      {/* Render content if present */}
      {page.content ? (
        <div style={{ fontSize: 18, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
          {page.content}
        </div>
      ) : null}

      {/* Debug section (helps you confirm it's working) */}
      <hr style={{ margin: "28px 0", opacity: 0.2 }} />
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        <div><b>slug:</b> {params.slug}</div>
        <div><b>keys:</b> {Object.keys(page).join(", ")}</div>
      </div>
    </main>
  );
}
