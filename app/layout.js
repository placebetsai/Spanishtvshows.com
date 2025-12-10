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
    "Live rankings of the best Spanish-language TV shows in 2025. Discover what to watch, where to stream it, and use TV to level up your Spanish.",
  openGraph: {
    title: "SpanishTVShows.com – Best Spanish TV Shows Ranked (2025)",
    description:
      "Discover the top Spanish-language TV shows, where to stream them, and how to use binge-watching to improve your Spanish.",
    url: "https://spanishtvshows.com",
    siteName: "SpanishTVShows.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Screenshot_20251210_151420_Grok.jpg",
        width: 1365,
        height: 768,
        alt: "SpanishTVShows.com – Ranked Spanish TV shows with streaming and language-learning tips.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpanishTVShows.com – Best Spanish TV Shows Ranked (2025)",
    description:
      "Ranked Spanish TV shows, where to watch them, and how to learn Spanish faster using your favorite series.",
    images: ["/Screenshot_20251210_151420_Grok.jpg"],
  },
  alternates: {
    canonical: "https://spanishtvshows.com",
  },
  icons: {
    icon: "/Screenshot_20251210_150918_Grok.jpg",
    shortcut: "/Screenshot_20251210_150918_Grok.jpg",
    apple: "/Screenshot_20251210_150918_Grok.jpg",
  },
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
          "Ranked Spanish-language TV shows with streaming links and language-learning tips.",
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
        {/* JSON-LD for rich results */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
