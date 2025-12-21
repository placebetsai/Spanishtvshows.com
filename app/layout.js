import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  metadataBase: new URL("https://spanishtvshows.com"),

  title: {
    default: "SpanishTVShows.com – Best Spanish Shows Ranked (2025)",
    template: "%s | SpanishTVShows.com",
  },

  description:
    "Top Spanish-language TV shows ranked from Spain to Latin America. Discover the best series, where to stream them, and how to learn Spanish using TV.",

  openGraph: {
    title: "SpanishTVShows.com – Top Ranked Spanish Shows (2025)",
    description:
      "Top Spanish TV shows from Spain to Latin America. Rankings, reviews, streaming links, and language-learning tips.",
    url: "https://spanishtvshows.com",
    siteName: "SpanishTVShows.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Screenshot_20251210_154428_Grok.jpg",
        width: 1200,
        height: 630,
        alt: "SpanishTVShows.com – Top Ranked Spanish Shows",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SpanishTVShows.com – Best Spanish Shows (2025)",
    description:
      "Ranked Spanish-language TV shows with reviews, streaming links, and learning tips.",
    images: ["/Screenshot_20251210_154428_Grok.jpg"],
  },

  icons: {
    icon: "/Screenshot_20251210_150918_Grok.jpg",
    shortcut: "/Screenshot_20251210_150918_Grok.jpg",
    apple: "/Screenshot_20251210_150918_Grok.jpg",
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
      logo: "https://spanishtvshows.com/Screenshot_20251210_150918_Grok.jpg",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* ✅ AdSense ownership / loader (NEW ACCOUNT) */}
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
        <link
          rel="icon"
          href="/Screenshot_20251210_150918_Grok.jpg"
          type="image/jpeg"
        />
        <link
          rel="apple-touch-icon"
          href="/Screenshot_20251210_150918_Grok.jpg"
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
