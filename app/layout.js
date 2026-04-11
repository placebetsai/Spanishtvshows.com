import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdUnit from "../components/AdUnit";

export const metadata = {
  metadataBase: new URL("https://spanishtvshows.com"),

  title: {
    default: "SpanishTVShows.com - Best Spanish TV Shows Ranked (2026)",
    template: "%s | SpanishTVShows.com",
  },

  description:
    "Discover the best Spanish-language TV shows ranked by real audience data. Crime, drama, novelas, thrillers from Spain, Mexico, Colombia and Argentina. Updated daily with TMDB data.",

  alternates: {
    canonical: "https://spanishtvshows.com",
  },

  openGraph: {
    title: "SpanishTVShows.com - Top Ranked Spanish Shows (2026)",
    description:
      "Top Spanish TV shows from Spain to Latin America. Rankings, reviews, streaming links, and language-learning tips.",
    url: "https://spanishtvshows.com",
    siteName: "SpanishTVShows.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpanishTVShows.com - Top Ranked Spanish Shows",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SpanishTVShows.com - Best Spanish Shows (2026)",
    description:
      "Ranked Spanish-language TV shows with reviews, streaming links, and learning tips.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },

  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://spanishtvshows.com",
    name: "SpanishTVShows.com",
    description:
      "Ranked Spanish-language TV shows with reviews, streaming platforms, and Spanish-learning info.",
    publisher: {
      "@type": "Organization",
      name: "SpanishTVShows.com",
      logo: "https://spanishtvshows.com/favicon.svg",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7215975042937417"
          crossOrigin="anonymous"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Link the manifest so favicons actually work */}
        <link rel="manifest" href="/manifest.json" />

        {/* Extra favicons for browsers */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        {/* Preconnect for perf */}
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
      </head>

      <body className="bg-dark text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/* Sticky anchor ad at bottom — only visible when ad loads */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <AdUnit className="my-0" style={{ minHeight: "0" }} />
        </div>
        <div className="pb-16" />
      </body>
    </html>
  );
}
