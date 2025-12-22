import fs from "fs";
import path from "path";

const DATA_PATH = path.join(
  process.cwd(),
  "content",
  "generated",
  "spanish-pages.json"
);

export async function generateStaticParams() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const pages = JSON.parse(raw);

  return pages.map((p) => ({
    slug: p.slug,
  }));
}

export default function Page({ params }) {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const pages = JSON.parse(raw);

  const page = pages.find((p) => p.slug === params.slug);

  if (!page) return null;

  return (
    <main style={{ padding: 40 }}>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <article>{page.content}</article>
    </main>
  );
}
