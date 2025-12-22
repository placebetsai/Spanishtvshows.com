import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

const DATA = path.join(process.cwd(), "content/generated/spanish-pages.json");

function loadPages() {
  if (!fs.existsSync(DATA)) return [];
  const json = JSON.parse(fs.readFileSync(DATA, "utf8"));
  return Array.isArray(json.pages) ? json.pages : [];
}

export async function generateStaticParams() {
  return loadPages().map(p => ({ slug: p.slug }));
}

export default function Page({ params }) {
  const page = loadPages().find(p => p.slug === params.slug);
  if (!page) notFound();

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>{page.title}</h1>
      <p>{page.content}</p>
    </main>
  );
}
