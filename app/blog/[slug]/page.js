export const runtime = "edge";

import Link from "next/link";
import AdUnit from "../../../components/AdUnit";
import VpnCta from "../../../components/VpnCta";
import NewsletterSignup from "../../../components/NewsletterSignup";
import blogIndex from "../../../content/blog/_index.json";
import allArticles from "../../../content/blog-articles";

const allSlugs = (blogIndex?.articles || []).map((a) => a.slug);

function loadArticle(slug) {
  return allArticles[slug] || null;
}

export async function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const article = loadArticle(params.slug);
  if (!article) {
    return {
      title: "Article Not Found | SpanishTVShows.com",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${article.title} | SpanishTVShows.com`,
    description: article.metaDescription,
    alternates: {
      canonical: `https://spanishtvshows.com/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `https://spanishtvshows.com/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author || "SpanishTVShows Editorial"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
    },
  };
}

export default function BlogArticle({ params }) {
  const article = loadArticle(params.slug);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-black mb-4">Article Not Found</h1>
        <p className="text-gray-400 mb-6">
          This article doesn't exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="text-neon font-bold hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    url: `https://spanishtvshows.com/blog/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author || "SpanishTVShows Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "SpanishTVShows.com",
      logo: {
        "@type": "ImageObject",
        url: "https://spanishtvshows.com/favicon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://spanishtvshows.com/blog/${article.slug}`,
    },
  };

  return (
    <div className="bg-dark min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-neon transition-colors">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:text-neon transition-colors">
            Blog
          </Link>{" "}
          / <span className="text-gray-400">{article.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-800">
          <span>{article.author || "SpanishTVShows Editorial"}</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <time dateTime={article.publishedAt}>{article.publishedAt}</time>
          {article.keyword && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="text-neon/60 font-mono text-xs">
                {article.keyword}
              </span>
            </>
          )}
        </div>

        {/* Top Ad */}
        <AdUnit className="my-6" />

        {/* Article Content */}
        <div
          className="blog-content prose prose-invert prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-white
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-200
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-gray-300 prose-li:leading-relaxed
            prose-strong:text-white prose-em:text-gray-200
            prose-a:text-neon prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Mid-article Ad */}
        <AdUnit className="my-8" />

        {/* VPN CTA */}
        <div className="my-10">
          <VpnCta />
        </div>

        {/* Newsletter */}
        <div className="my-10">
          <NewsletterSignup />
        </div>

        {/* Bottom Ad */}
        <AdUnit className="my-8" />

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neon font-bold hover:underline"
          >
            ← Browse More Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
