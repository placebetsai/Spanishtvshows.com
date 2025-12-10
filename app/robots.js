// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://spanishtvshows.com/sitemap.xml",
    host: "https://spanishtvshows.com",
  };
}
