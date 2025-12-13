// app/api/news/route.js
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export const runtime = "nodejs"; // RSS parsing is easier in node runtime

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  trimValues: true,
});

function pickText(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return pickText(v[0]);
  if (typeof v === "object") {
    // common atom/rdf patterns
    if (v["#text"]) return String(v["#text"]);
    if (v.text) return String(v.text);
    if (v.content) return String(v.content);
  }
  return "";
}

function normalizeLink(item) {
  // RSS: link is string
  // Atom: link can be { href: "" } or array of those
  const link = item?.link;
  if (!link) return "";
  if (typeof link === "string") return link.trim();
  if (Array.isArray(link)) {
    const hrefObj = link.find((x) => x?.href) || link[0];
    return (hrefObj?.href || "").trim();
  }
  if (typeof link === "object") return (link.href || "").trim();
  return "";
}

function toUnixTime(dateStr) {
  if (!dateStr) return 0;
  const t = Date.parse(dateStr);
  return Number.isFinite(t) ? t : 0;
}

function looksMostlySpanish(text) {
  // lightweight heuristic (NOT real translation): just decides whether to keep title as-is.
  // If you want real EN summaries, you'd need a translation API.
  const s = (text || "").toLowerCase();
  const hits = [" el ", " la ", " los ", " las ", " de ", " del ", " y ", " en ", " con ", " por ", "para "]
    .reduce((acc, w) => acc + (s.includes(w) ? 1 : 0), 0);
  return hits >= 3;
}

function cleanTitle(t) {
  return (t || "")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

// SAFE, RELIABLE SOURCES: mostly Google News RSS queries + a couple TV/streaming industry feeds
// This avoids “one domain dominates” and gives constant fresh headlines.
const FEEDS = [
  {
    name: "Google News: Spanish TV shows",
    url: "https://news.google.com/rss/search?q=Spanish%20TV%20series%20Netflix%20OR%20Telemundo%20OR%20Univision%20OR%20ViX&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News: Telemundo",
    url: "https://news.google.com/rss/search?q=Telemundo%20series%20OR%20telenovela%20OR%20reality%20show&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News: Univision + ViX",
    url: "https://news.google.com/rss/search?q=Univision%20OR%20ViX%20series%20OR%20telenovela&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News: Netflix Spain / Latin",
    url: "https://news.google.com/rss/search?q=Netflix%20Spain%20series%20OR%20Latin%20American%20series&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News: HBO Max Latino",
    url: "https://news.google.com/rss/search?q=HBO%20Max%20Latin%20American%20series%20OR%20Spanish-language%20series&hl=en-US&gl=US&ceid=US:en",
  },
  // These two are optional “industry” feeds — if they ever go stale, the Google ones still carry the ticker.
  {
    name: "Deadline TV",
    url: "https://deadline.com/v/tv/feed/",
  },
  {
    name: "Variety TV",
    url: "https://variety.com/v/tv/feed/",
  },
];

async function fetchWithTimeout(url, ms = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "user-agent": "spanishtvshows.com/1.0 (+vercel)",
        accept: "application/rss+xml, application/atom+xml, text/xml, application/xml, */*",
      },
      cache: "no-store",
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

function parseFeed(xml, sourceName) {
  let obj;
  try {
    obj = parser.parse(xml);
  } catch {
    return [];
  }

  // RSS
  const rssItems = obj?.rss?.channel?.item;
  if (rssItems) {
    const arr = Array.isArray(rssItems) ? rssItems : [rssItems];
    return arr
      .map((it) => {
        const title = cleanTitle(pickText(it.title));
        const link = cleanTitle(pickText(it.link)) || cleanTitle(pickText(it.guid));
        const pubDate = pickText(it.pubDate) || pickText(it.published) || pickText(it.updated);
        return { title, link, pubDate, source: sourceName };
      })
      .filter((x) => x.title && x.link);
  }

  // Atom
  const atomEntries = obj?.feed?.entry;
  if (atomEntries) {
    const arr = Array.isArray(atomEntries) ? atomEntries : [atomEntries];
    return arr
      .map((it) => {
        const title = cleanTitle(pickText(it.title));
        const link = normalizeLink(it);
        const pubDate = pickText(it.published) || pickText(it.updated);
        return { title, link, pubDate, source: sourceName };
      })
      .filter((x) => x.title && x.link);
  }

  return [];
}

function roundRobinMerge(perSource, limit = 18) {
  const sources = Object.keys(perSource);
  const idx = Object.fromEntries(sources.map((s) => [s, 0]));
  const out = [];
  const seen = new Set();

  while (out.length < limit) {
    let progressed = false;

    for (const s of sources) {
      const list = perSource[s] || [];
      let i = idx[s] || 0;

      while (i < list.length && out.length < limit) {
        const item = list[i++];
        const key = (item.link || "").trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push(item);
        progressed = true;
        break; // move to next source (balance!)
      }

      idx[s] = i;
      if (out.length >= limit) break;
    }

    if (!progressed) break;
  }

  return out;
}

export async function GET() {
  const now = Date.now();
  const maxAgeMs = 14 * 24 * 60 * 60 * 1000; // 14 days

  const results = await Promise.allSettled(
    FEEDS.map(async (f) => {
      const res = await fetchWithTimeout(f.url, 9000);
      if (!res.ok) return { source: f.name, items: [] };
      const xml = await res.text();
      const items = parseFeed(xml, f.name);
      return { source: f.name, items };
    })
  );

  const perSource = {};
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const { source, items } = r.value;

    const cleaned = (items || [])
      .map((it) => {
        const title = cleanTitle(it.title);
        const link = cleanTitle(it.link);
        const t = toUnixTime(it.pubDate);
        return { title, link, time: t, source };
      })
      .filter((x) => x.title && x.link)
      .filter((x) => !x.time || now - x.time < maxAgeMs) // if no time, keep it
      .slice(0, 10)
      .map((x) => {
        // “English summaries” without paid APIs is NOT real translation.
        // We keep the title as-is; most Google News headlines are already English.
        // If it looks Spanish-heavy, we still keep it rather than lying with fake translation.
        const title = x.title;
        return {
          title: looksMostlySpanish(title) ? title : title,
          link: x.link,
          source: x.source,
        };
      });

    perSource[source] = cleaned;
  }

  const items = roundRobinMerge(perSource, 18);

  // Vercel-friendly caching:
  // - Cache at the edge for 15 min
  // - Allow stale while revalidating for 60 min
  return NextResponse.json(
    { items },
    {
      headers: {
        "cache-control": "s-maxage=900, stale-while-revalidate=3600",
      },
    }
  );
}

