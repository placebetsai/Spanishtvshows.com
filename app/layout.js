import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  metadataBase: new URL("https://spanishtvshows.com"),
  title: "SpanishTVShows.com – Best Spanish Shows Ranked (2025)",
  description:
    "Live rankings of the best Spanish-language TV shows in 2025. Trending series, where to watch, and how to learn Spanish using TV.",
  openGraph: {
    title: "SpanishTVShows.com – Best Spanish Shows Ranked (2025)",
    description:
      "Top Spanish-language TV shows ranked by popularity, quality, and cultural impact.",
    url: "https://spanishtvshows.com",
    siteName: "SpanishTVShows.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Screenshot_20251210_151420_Grok.jpg",
        width: 1200,
        height: 630,
        alt: "SpanishTVShows.com – Ranking the best Spanish-language shows.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpanishTVShows.com – Best Spanish Shows Ranked (2025)",
    description:
      "Explore 2025’s top Spanish-language shows with rankings, trailers, and streaming links.",
    images: ["/Screenshot_20251210_151420_Grok.jpg"],
  },
  alternates: {
    canonical: "https://spanishtvshows.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ---- FAVICON ---- */}
        <link
          rel="icon"
          href="/Screenshot_20251210_150918_Grok.jpg"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/Screenshot_20251210_150918_Grok.jpg"
          sizes="192x192"
        />

        {/* ---- Apple Touch Icon ---- */}
        <link
          rel="apple-touch-icon"
          href="/Screenshot_20251210_150918_Grok.jpg"
        />

        {/* ---- THE “HEAD THING” YOU KEPT SCREAMING ABOUT ---- */}
        <link rel="manifest" href="/manifest.json" />

        {/* ---- Theme Color ---- */}
        <meta name="theme-color" content="#020617" />

        {/* ---- OG + Twitter fallback (forces social previews to work) ---- */}
        <meta
          property="og:image"
          content="https://spanishtvshows.com/Screenshot_20251210_151420_Grok.jpg"
        />
        <meta
          name="twitter:image"
          content="https://spanishtvshows.com/Screenshot_20251210_151420_Grok.jpg"
        />
      </head>

      <body className="bg-dark text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
