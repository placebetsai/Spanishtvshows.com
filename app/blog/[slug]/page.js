import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";

const POSTS_DIR = path.join(process.cwd(), "content/blog/posts");

function getPost(slug) {
  try {
    const file = path.join(POSTS_DIR, `${slug}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function getAllSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

function getRelatedPosts(currentSlug, count = 3) {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json") && f !== `${currentSlug}.json`)
    .slice(0, count)
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      images: [`https://images.unsplash.com/photo-${post.heroImageId}?w=1200&q=80`],
    },
  };
}

export default function BlogPost({ params }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(params.slug);
  const initials = post.author.split(" ").map((n) => n[0]).join("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    image: `https://images.unsplash.com/photo-${post.heroImageId}?w=1200&q=80`,
    publisher: {
      "@type": "Organization",
      name: "SpanishTVShows.com",
      url: "https://spanishtvshows.com",
    },
    mainEntityOfPage: `https://spanishtvshows.com/blog/${post.slug}`,
  };

  return (
    <div className="bg-dark min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section
        className="relative border-b border-gray-900"
        style={{
          minHeight: "50vh",
          backgroundImage: `url(https://images.unsplash.com/photo-${post.heroImageId}?w=1400&q=80&auto=format&fit=crop)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
          <Link href="/blog" className="text-[0.65rem] uppercase tracking-widest text-neon hover:underline mb-6 inline-block">
            ← Blog
          </Link>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            {post.h1 || post.title}
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm bg-gradient-to-br ${post.authorGradient || "from-neon to-blue-500"}`}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{post.author}</p>
              <p className="text-[0.65rem] text-gray-400">{post.date}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Author bio */}
        <div className="flex gap-3 p-4 rounded-xl border border-gray-800 bg-black/40 mb-10">
          <div
            className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white font-black bg-gradient-to-br ${post.authorGradient || "from-neon to-blue-500"}`}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold">{post.author}</p>
            <p className="text-xs text-gray-400 mt-0.5">{post.authorBio}</p>
          </div>
        </div>

        {/* Article sections */}
        <article className="prose-custom">
          {(post.sections || []).map((section, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-xl md:text-2xl font-black mb-4 text-white border-l-2 border-neon pl-4">
                {section.h2}
              </h2>
              <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
                {section.body.split("\n\n").map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>

              {/* Ad after section 2 */}
              {i === 1 && (
                <div className="my-8 p-4 border border-gray-800 rounded-xl bg-black/30 text-center">
                  <p className="text-[0.6rem] uppercase tracking-widest text-gray-600 mb-2">Advertisement</p>
                  <div className="min-h-[90px] flex items-center justify-center">
                    <ins
                      className="adsbygoogle"
                      style={{ display: "block" }}
                      data-ad-client="ca-pub-7215975042937417"
                      data-ad-slot="6600722153"
                      data-ad-format="auto"
                      data-full-width-responsive="true"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Conclusion */}
          {post.conclusion && (
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-neon/10 to-blue-500/10 border border-neon/20">
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">{post.conclusion}</p>
            </div>
          )}
        </article>

        {/* Internal CTAs */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/trending", label: "🔥 What's Trending" },
            { href: "/learn-spanish", label: "📚 Learn Spanish" },
            { href: "/best-on-netflix", label: "🎬 Best on Netflix" },
          ].map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className="block text-center py-3 px-4 rounded-xl border border-gray-700 text-gray-300 hover:border-neon hover:text-neon text-sm font-bold transition-colors"
            >
              {cta.label}
            </Link>
          ))}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-lg font-black uppercase tracking-wider mb-6 border-b border-gray-800 pb-3">
              Keep Reading
            </h2>
            <div className="space-y-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex gap-4 p-4 rounded-xl border border-gray-800 hover:border-neon transition-colors items-center"
                >
                  <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                    <img
                      src={`https://images.unsplash.com/photo-${p.heroImageId}?w=200&q=60&auto=format&fit=crop`}
                      alt=""
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold group-hover:text-neon transition-colors line-clamp-2">
                      {p.h1 || p.title}
                    </h3>
                    <p className="text-[0.65rem] text-gray-500 mt-1">{p.author} · {p.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
