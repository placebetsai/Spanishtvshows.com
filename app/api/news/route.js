export const runtime = "edge";

import { NextResponse } from "next/server";

const FEEDS = [
  "https://news.google.com/rss/search?q=Spanish+TV+series+Netflix+Telemundo+Univision&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=Netflix+Spanish+series+2026&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=telenovela+HBO+Max+Latino&hl=en-US&gl=US&ceid=US:en",
];

function decodeEntities(str) {
  return String(str || "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'").replace(/&ldquo;/g, "\u201C").replace(/&rdquo;/g, "\u201D")
    .replace(/\s+/g, " ").trim();
}

function parseRSS(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const rawTitle = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] || "";
    const rawLink =
      block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ||
      block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] || "";
    const title = decodeEntities(rawTitle);
    const link = decodeEntities(rawLink).trim();
    if (title && link) items.push({ title, link });
  }
  return items;
}

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

const FALLBACK = [
  { title: "Money Heist creator's new show hits Netflix top 10 worldwide", link: "https://www.netflix.com/browse/genre/67673" },
  { title: "Best Spanish-language thrillers to watch right now on Netflix", link: "https://spanishtvshows.com/best-spanish-crime-shows" },
  { title: "Trending: Top Latin American series dominating streaming charts", link: "https://spanishtvshows.com/trending" },
  { title: "La Casa de Papel universe expands with Berlin Season 2", link: "https://spanishtvshows.com/shows-like-money-heist" },
  { title: "HBO Max Latino adds 12 new Spanish originals for 2026", link: "https://spanishtvshows.com/netflix" },
];

export async function GET() {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const items = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const item of parseRSS(r.value)) {
        if (items.length < 20) items.push(item);
      }
    }
  }

  return NextResponse.json(
    { items: items.length > 0 ? items : FALLBACK },
    { headers: { "cache-control": "s-maxage=900, stale-while-revalidate=3600" } }
  );
}
