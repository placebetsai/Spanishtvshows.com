// app/layout.js
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  metadataBase: new URL("https://spanishtvshows.com"),
  title: {
    default: "SpanishTVShows.com – Best Spanish TV Shows Ranked (2025)",
    template: "%s | SpanishTVShows.com",
  },
  description:
    "Live rankings of the best Spanish-language TV shows in 2025. Trending series, where to watch them, and how to level up your Spanish using TV.",
  openGraph: {
    title: "SpanishTVShows.com – Best Spanish TV Shows Ranked (2025)",
    description:
      "Discover the best Spanish-language TV shows, streaming links, and language-learning tips updated for 2025.",
    url: "https://spanishtvshows.com",
    siteName: "SpanishTVShows.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Screenshot_20251210_151420_Grok.jpg",
        width: 1365,
        height: 768,
        alt: "SpanishTVShows.com – Ranked Spanish TV shows with streaming links and language-learning tips.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpanishTVShows.com – Best Spanish TV Shows Ranked (2025)",
    description:
      "Ranked Spanish-language series, streaming links, and Spanish-learning hacks powered by TV.",
    images: ["/Screenshot_20251210_151420_Grok.jpg"],
  },
  alternates: {
    canonical: "https://spanishtvshows.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://spanishtvshows.com/#website",
        url: "https://spanishtvshows.com",
        name: "SpanishTVShows.com",
        description:
          "Ranked list of the best Spanish-language TV shows with streaming links and language-learning tips.",
        inLanguage: "en-US",
        publisher: {
          "@id": "https://spanishtvshows.com/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://spanishtvshows.com/#organization",
        name: "SpanishTVShows.com",
        url: "https://spanishtvshows.com",
        logo: "https://spanishtvshows.com/Screenshot_20251210_150918_Grok.jpg",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Structured data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Favicon / browser icon */}
        <link
          rel="icon"
          href="/Screenshot_20251210_150918_Grok.jpg"
          type="image/jpeg"
        />
      </head>
      <body className="bg-slate-950 text-slate-50">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
