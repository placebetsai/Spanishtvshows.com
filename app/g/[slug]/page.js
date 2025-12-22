// app/g/[slug]/page.js
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";

const DATA_FILE = path.join(process.cwd(), "content", "generated", "spanish-pages.json");

function readPages() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const json = JSON.parse(raw);
  return json.pages || [];
}

function getPageBySlug(slug) {
  const pages = readPages();
  return pages.find((p) => p.slug === slug) || null;
}

export async function generateStaticParams() {
  const pages = readPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const page = getPageBySlug(params.slug);
  if (!page) {
    return {
      title: "Spanish TV Shows – Page not found",
      robots: { index: false, follow: false },
    };
  }

  const pt =
    page.pageType === "watch"
      ? "Where to Watch"
      : page.pageType === "cast"
      ? "Cast"
      : "Overview";

  return {
    title: `${page.title} (${page.year || "TV"}) – ${pt} | SpanishTVShows.com`,
    description:
      (page.overview && page.overview.slice(0, 155)) ||
      `Learn English with TV using "${page.title}" and subtitles.`,
    alternates: { canonical: `https://spanishtvshows.com/g/${page.slug}` },
  };
}

export default function GeneratedShowPage({ params }) {
  const page = getPageBySlug(params.slug);

  if (!page) {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Page not found</h1>
        <p>This page wasn’t generated yet.</p>
        <Link href="/">Go home</Link>
      </div>
    );
  }

  const posterUrl = page.posterPath
    ? `https://image.tmdb.org/t/p/w500${page.posterPath}`
    : null;

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
        {posterUrl ? (
          <div style={{ width: 220, borderRadius: 14, overflow: "hidden" }}>
            <Image
              src={posterUrl}
              alt={page.title}
              width={440}
              height={660}
              priority={false}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        ) : null}

        <div style={{ flex: 1, minWidth: 280 }}>
          <p style={{ opacity: 0.8, margin: "0 0 6px 0" }}>
            <Link href="/" style={{ textDecoration: "underline" }}>Home</Link>{" "}
            / <span style={{ opacity: 0.9 }}>Generated</span>
          </p>

          <h1 style={{ fontSize: 34, margin: "8px 0 10px 0" }}>
            {page.content?.h1 || page.title}
          </h1>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            {page.year ? <span style={pill()}>{page.year}</span> : null}
            {page.pageType ? <span style={pill()}>{page.pageType}</span> : null}
            {page.genres?.slice(0, 4).map((g) => (
              <span key={g} style={pill()}>{g}</span>
            ))}
          </div>

          {page.content?.paragraphs?.map((t, idx) => (
            <p key={idx} style={{ lineHeight: 1.6, fontSize: 16, margin: "10px 0" }}>
              {t}
            </p>
          ))}

          {page.content?.bullets?.length ? (
            <ul style={{ marginTop: 14, paddingLeft: 18, lineHeight: 1.6 }}>
              {page.content.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          ) : null}

          <hr style={{ margin: "22px 0", opacity: 0.2 }} />

          <p style={{ opacity: 0.75, fontSize: 13, lineHeight: 1.5 }}>
            Disclaimer: Availability and cast info can change over time. Use official streaming platforms and
            verified sources for the latest details.
          </p>
        </div>
      </div>
    </main>
  );
}

function pill() {
  return {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    fontSize: 12,
    opacity: 0.9,
  };
}
