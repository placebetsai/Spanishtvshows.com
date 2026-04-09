import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdUnit from "../components/AdUnit";

export const metadata = {
  metadataBase: new URL("https://spanishtvshows.com"),

  title: {
    default: "SpanishTVShows.com – Best Spanish Shows Ranked (2026)",
    template: "%s | SpanishTVShows.com",
  },

  description:
    "Top Spanish-language TV shows ranked from Spain to Latin America. Discover the best series, where to stream them, and how to learn Spanish using TV.",

  openGraph: {
    title: "SpanishTVShows.com – Top Ranked Spanish Shows (2026)",
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
        alt: "SpanishTVShows.com – Top Ranked Spanish Shows",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SpanishTVShows.com – Best Spanish Shows (2026)",
    description:
      "Ranked Spanish-language TV shows with reviews, streaming links, and learning tips.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
      logo: "https://spanishtvshows.com/favicon.png",
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
        <link
          rel="icon"
          href="/favicon.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/favicon.png"
        />
      </head>

      <body className="bg-dark text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <AdUnit className="my-0" style={{ minHeight: "50px" }} />
        </div>
        <div className="pb-16" />
      </body>
    </html>
  );
}
