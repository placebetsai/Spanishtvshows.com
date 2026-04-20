import pagesData from "../content/generated/spanish-pages.json";
import blogIndex from "../content/blog/_index.json";

const TMDB_API_BASE = "https://api.themoviedb.org/3";

/**
 * Fetch top Spanish TV show IDs from TMDB for sitemap inclusion.
 * Fetches 5 pages (100 shows) of the most popular Spanish-language shows.
 */
async function getTopShowIds() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  const showIds = [];
  const totalPages = 5; // 20 per page = 100 shows

  for (let page = 1; page <= totalPages; page++) {
    try {
      const url = `${TMDB_API_BASE}/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_original_language=es&vote_count.gte=10&page=${page}`;
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) break;
      const data = await res.json();
      const results = data.results || [];
      for (const show of results) {
        if (show.id) {
          showIds.push(show.id);
        }
      }
    } catch {
      break;
    }
  }

  return showIds;
}

export default async function sitemap() {
  const baseUrl = "https://spanishtvshows.com";

  const staticUrls = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/best-on-netflix`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/best-spanish-crime-shows`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/shows-like-money-heist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/learn-spanish`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/learn-english`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/israel-joffe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Generated /g/ pages from JSON
  const pages = pagesData?.pages || [];
  const generatedUrls = pages
    .map((p) => p?.slug)
    .filter(Boolean)
    .map((slug) => ({
      url: `${baseUrl}/g/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // Dynamic /show/ pages from TMDB (top 100 Spanish shows)
  const showIds = await getTopShowIds();
  const showUrls = showIds.map((id) => ({
    url: `${baseUrl}/show/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Blog articles
  const blogArticles = (blogIndex?.articles || []).map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Blog index page
  const blogIndexUrl = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  };

  return [...staticUrls, blogIndexUrl, ...blogArticles, ...generatedUrls, ...showUrls];
}
