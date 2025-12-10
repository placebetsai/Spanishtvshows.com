// app/sitemap.js
export default function sitemap() {
  const baseUrl = "https://spanishtvshows.com";

  const routes = ["", "/about", "/terms", "/privacy"];

  const now = new Date().toISOString();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.6,
  }));
}
