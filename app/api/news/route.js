import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export const runtime = "nodejs";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  trimValues: true,
});

/* ===============================
   HARD HTML ENTITY DECODER
   Fixes &#8217; &amp; &ldquo; etc
================================ */
function decodeEntities(str) {
  if (!str) return "";

  // numeric entities: &#8217;
  str = str.replace(/&#(\d+);/g, (_, n) => {
    const code = parseInt(n, 10);
    return Number.isFinite(code) ? String.fromCharCode(code) : _;
  });

  // hex entities: &#x2019;
  str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    const code = parseInt(hex, 16);
    return Number.isFinite(code) ? String.fromCharCode(code) : _;
  });

  // common named entities
  const map = {
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
    "&ndash;": "–",
    "&mdash;": "—",
    "&hellip;": "…",
    "&lsquo;": "‘",
    "&rsquo;": "’",
    "&ldquo;": "“",
    "&rdquo;": "”",
  };

  return str.replace(
    /&amp;|&quot;|&apos;|&#39;|&lt;|&gt;|&nbsp;|&ndash;|&mdash;|&hellip;|&lsquo;|&rsquo;|&ldquo;|&rdquo;/g,
    (m) => map[m] || m
  );
}

function cleanText(t) {
  return decodeEntities(String(t || ""))
    .replace(/\s+/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

/* ===============================
   FEEDS (balanced, legit)
================================ */
const FEEDS = [
  {
    name: "Google News – Spanish TV",
    url: "https://news.google.com/rss/search?q=Spanish%20TV%20series%20Netflix%20Telemundo%20Univision%20ViX&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News – Netflix Latin",
    url: "https://news.google.com/rss/search?q=Netflix%20Latin%20series&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News – HBO Max Latino",
    url: "https://news.google.com/rss/search?q=HBO%20Max%20Latin%20series&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Variety TV",
    url: "https://variety.com/v/tv/feed/",
  },
  {
    name: "Deadline TV",
    url: "https://deadline.com/v/tv/feed/",
  },
];

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "spanishtvshows.com",
      accept: "application/rss+xml, application/xml, text/xml",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("feed failed");
  return res.text();
}

function parseFeed(xml, source) {
  let data;
  try {
    data = parser.parse(xml);
  } catch {
    return [];
  }

  // RSS
  const rssItems = data?.rss?.channel?.item;
  if (rssItems) {
    const arr = Array.isArray(rssItems) ? rssItems : [rssItems];
    return arr.map((i) => ({
      title: cleanText(i.title),
      link: cleanText(i.link || i.guid),
      source,
    }));
  }

  // Atom
  const atomItems = data?.feed?.entry;
  if (atomItems) {
    const arr = Array.isArray(atomItems) ? atomItems : [atomItems];
    return arr.map((i) => ({
      title: cleanText(i.title),
      link: cleanText(
        typeof i.link === "string"
          ? i.link
          : Array.isArray(i.link)
          ? i.link[0]?.href
          : i.link?.href
      ),
      source,
    }));
  }

  return [];
}

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map(async (f) => {
      const xml = await fetchFeed(f.url);
      return parseFeed(xml, f.name);
    })
  );

  const perSource = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  // round-robin merge to avoid one source dominating
  const merged = [];
  const max = Math.max(...perSource.map((a) => a.length));

  for (let i = 0; i < max && merged.length < 18; i++) {
    for (const src of perSource) {
      if (src[i] && src[i].title && src[i].link) {
        merged.push(src[i]);
        if (merged.length >= 18) break;
      }
    }
  }

  return NextResponse.json(
    { items: merged },
    {
      headers: {
        "cache-control": "s-maxage=900, stale-while-revalidate=3600",
      },
    }
  );
}
