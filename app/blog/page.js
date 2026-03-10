import fs from "fs";
import path from "path";
import Link from "next/link";

export const metadata = {
  title: "Spanish TV Blog – Tips, Reviews & Language Learning | SpanishTVShows.com",
  description:
    "Reviews, language learning guides, and deep dives into the best Spanish-language TV shows. New articles daily.",
};

function loadPosts() {
  const dir = path.join(process.cwd(), "content/blog/posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const CATEGORIES = ["All", "Reviews", "Language Learning", "Recommendations", "Culture", "Streaming Guides"];

export default function BlogPage() {
  const posts = loadPosts();
  const featured = posts.slice(0, 3);
  const rest = posts.slice(3);

  return (
    <div className="bg-dark min-h-screen">
      {/* HERO */}
      <section
        className="relative border-b border-gray-900"
        style={{
          minHeight: "45vh",
          background: "radial-gradient(ellipse at top, #111827 0%, #020617 50%, #000 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #00f3ff 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #00f3ff 0px, transparent 1px, transparent 60px)" }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-neon mb-4 font-bold">
            SPANISHTVSHOWS.COM · BLOG
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Spanish TV <span className="text-neon">deep dives.</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Reviews, language-learning guides, and show recommendations. New articles every day.
          </p>
          <p className="text-gray-500 text-xs mt-3 font-mono">
            {posts.length} articles published
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-400 text-lg">Articles coming soon — check back daily.</p>
          <Link href="/" className="mt-6 inline-block text-neon hover:underline">
            ← Back to home
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* FEATURED — top 3 */}
          {featured.length > 0 && (
            <section className="mb-14">
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-6">
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-gray-800 bg-black/60 overflow-hidden hover:border-neon transition-colors"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-gray-900">
                      <img
                        src={`https://images.unsplash.com/photo-${post.heroImageId}?w=600&q=70&auto=format&fit=crop`}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-neon font-bold mb-2">
                        {post.date} · {post.author}
                      </p>
                      <h3 className="text-base font-black leading-snug group-hover:text-neon transition-colors line-clamp-3">
                        {post.h1 || post.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                        {post.metaDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* REST OF POSTS */}
          {rest.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-6">
                All Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-4 p-4 rounded-xl border border-gray-800 bg-black/40 hover:border-neon transition-colors items-start"
                  >
                    <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                      <img
                        src={`https://images.unsplash.com/photo-${post.heroImageId}?w=200&q=60&auto=format&fit=crop`}
                        alt=""
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.6rem] uppercase tracking-widest text-gray-500 mb-1">
                        {post.date}
                      </p>
                      <h3 className="text-sm font-bold leading-snug group-hover:text-neon transition-colors line-clamp-2">
                        {post.h1 || post.title}
                      </h3>
                      <p className="text-[0.65rem] text-gray-500 mt-1">{post.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
