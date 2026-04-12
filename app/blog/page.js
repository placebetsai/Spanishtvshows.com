export const runtime = "edge";

import Link from "next/link";
import AdUnit from "../../components/AdUnit";

// Dynamic import of blog index at build time
import blogIndex from "../../content/blog/_index.json";

export const metadata = {
  title: "Blog - Spanish TV Show Guides, Reviews & Recommendations",
  description:
    "Expert articles on the best Spanish TV shows, telenovelas, and series. Reviews, recommendations, comparisons, and tips for learning Spanish through TV.",
  alternates: {
    canonical: "https://spanishtvshows.com/blog",
  },
  openGraph: {
    title: "Blog - Spanish TV Show Guides & Reviews | SpanishTVShows.com",
    description:
      "Expert articles on the best Spanish TV shows, telenovelas, and series. Reviews, recommendations, and language-learning tips.",
    url: "https://spanishtvshows.com/blog",
    type: "website",
  },
};

export default function BlogIndex() {
  const articles = blogIndex?.articles || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SpanishTVShows.com Blog",
    url: "https://spanishtvshows.com/blog",
    description:
      "Expert articles on the best Spanish TV shows, telenovelas, and series.",
    publisher: {
      "@type": "Organization",
      name: "SpanishTVShows.com",
      logo: "https://spanishtvshows.com/favicon.svg",
    },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `https://spanishtvshows.com/blog/${a.slug}`,
      datePublished: a.publishedAt,
      author: {
        "@type": "Person",
        name: a.author || "SpanishTVShows Editorial",
      },
    })),
  };

  return (
    <div className="bg-dark min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neon mb-4 font-bold">
          THE BLOG
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Spanish TV{" "}
          <span className="gradient-text">Guides & Reviews</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          In-depth articles, reviews, recommendations, and tips for discovering the
          best Spanish-language television. Written for English-speaking audiences.
        </p>
      </section>

      {/* AD */}
      <div className="max-w-5xl mx-auto px-6">
        <AdUnit className="my-6" />
      </div>

      {/* ARTICLES GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="show-card p-6 block group hover:border-neon transition-all"
            >
              <div className="text-xs uppercase tracking-wider text-neon/70 mb-2 font-bold">
                {article.publishedAt}
              </div>
              <h2 className="text-lg font-black group-hover:text-neon transition-colors mb-3 leading-snug">
                {article.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {article.metaDescription}
              </p>
              <div className="mt-4 text-neon text-sm font-bold group-hover:translate-x-1 transition-transform inline-block">
                Read Article →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BOTTOM AD */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <AdUnit className="my-6" />
      </div>
    </div>
  );
}
