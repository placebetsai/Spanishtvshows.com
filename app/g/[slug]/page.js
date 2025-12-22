import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

export const dynamicParams = true; // allow slugs not in params (safe)
export const revalidate = 86400;   // 1 day

const DATA_PATH = path.join(process.cwd(), "content", "generated", "spanish-pages.json");

function loadPages() {
  try {
    if (!fs.existsSync(DATA_PATH)) return [];
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const json = JSON.parse(raw);

    // IMPORTANT: your file is an OBJECT like { generatedAt, pageCount, pages: [...] }
    const pages = Array.isArray(json) ? json : (Array.isArray(json?.pages) ? json.pages : []);
    return pages;
  } catch (e) {
    return [];
  }
}

export async function generateStaticParams() {
  const pages = loadPages();
  // never crash build
  return pages.map((p) => ({ slug: p.slug }));
}

export default function GeneratedPage({ params }) {
  const pages = loadPages();
  const page = pages.find((p) => p.slug === params.slug);

  if (!page) notFound();

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: 34, marginBottom: 12 }}>{page.title}</h1>
      <p style={{ fontSize: 18, lineHeight: 1.6 }}>{page.content}</p>
    </main>
  );
}
