export const runtime = "edge";

import Link from "next/link";
import { FireIcon, StarIcon } from "@heroicons/react/24/solid";
import NewsTicker from "../components/NewsTicker";
import AdUnit from "../components/AdUnit";
import NewsletterSignup from "../components/NewsletterSignup";
import ShopTheShowsCta from "../components/ShopTheShowsCta";

export const metadata = {
  alternates: {
    canonical: "https://spanishtvshows.com",
  },
};

async function getTopSpanish() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_original_language=es&vote_count.gte=50`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    return [];
  }
}

function getRatingClass(rating) {
  if (rating >= 7.5) return "rating-badge--high";
  if (rating >= 6.0) return "rating-badge--mid";
  return "rating-badge--low";
}

const CATEGORIES = [
  { label: "Crime & Thriller", href: "/best-spanish-crime-shows", emoji: "🔫" },
  { label: "Drama", href: "/trending", emoji: "🎭" },
  { label: "Comedy", href: "/trending", emoji: "😂" },
  { label: "Novelas", href: "/trending", emoji: "💔" },
  { label: "Like Money Heist", href: "/shows-like-money-heist", emoji: "🏦" },
  { label: "Best on Netflix", href: "/best-on-netflix", emoji: "📺" },
];

export default async function Home() {
  const shows = await getTopSpanish();
  const topShow = shows[0];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Most Popular Spanish TV Shows 2026",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: Math.min(shows.length, 12),
    itemListElement: shows.slice(0, 12).map((show, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TVSeries",
        name: show.name,
        url: `https://spanishtvshows.com/show/${show.id}`,
        image: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : undefined,
        aggregateRating: show.vote_average
          ? {
              "@type": "AggregateRating",
              ratingValue: show.vote_average.toFixed(1),
              bestRating: "10",
              ratingCount: show.vote_count || 0,
            }
          : undefined,
      },
    })),
  };

  return (
    <div className="bg-dark min-h-screen">
      {/* ItemList Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* NEWS TICKER */}
      <NewsTicker />

      {/* ===================== HERO ===================== */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "85vh",
          backgroundImage: topShow?.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${topShow.backdrop_path})`
            : "radial-gradient(circle at top, #111827, #020617 60%, #000000)",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
        }}
      >
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-36 text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-neon mb-5 font-bold">
            RANKED BY REAL AUDIENCE DATA &middot; UPDATED DAILY
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter mb-6">
            The Best Spanish TV
            <br />
            <span className="gradient-text">
              Shows of 2026
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover top-rated Spanish-language series from Spain, Mexico, Colombia, and
            Argentina. Crime dramas, novelas, thrillers, and comedies — all ranked by live
            TMDB audience data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#top-shows"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-neon text-black font-black text-sm md:text-base tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              <FireIcon className="h-5 w-5 mr-2" />
              See Top Shows
            </a>

            {topShow && (
              <Link
                href={`/show/${topShow.id}`}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-gray-600 text-gray-200 text-sm font-bold tracking-wide hover:border-amber-400 hover:text-amber-400 transition-all"
              >
                #{1} Trending: {topShow.name} &rarr;
              </Link>
            )}
          </div>

          {/* Quick stats */}
          {shows.length > 0 && (
            <div className="flex items-center justify-center gap-8 mt-12 text-gray-500 text-xs font-mono uppercase tracking-wider">
              <span>{shows.length}+ shows ranked</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>Source: TMDB</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>Updated daily</span>
            </div>
          )}
        </div>
      </section>

      {/* ===================== POPULAR CATEGORIES ===================== */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 mb-14">
        <div className="bg-black/80 border border-gray-800/60 rounded-2xl p-6 md:p-8 backdrop-blur-lg">
          <h2 className="text-white font-black text-xl md:text-2xl mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Find your next favorite show by genre.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href} className="category-chip">
                <span className="mr-2">{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPULAR GUIDES ===================== */}
      <section className="max-w-6xl mx-auto px-6 mb-14">
        <h2 className="text-white font-black text-xl md:text-2xl mb-2">
          Curated Guides
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Hand-picked collections for every kind of viewer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/shows-like-money-heist"
            className="show-card p-6 block group"
          >
            <div className="text-neon font-black text-lg group-hover:text-white transition-colors">
              Shows Like Money Heist
            </div>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              High-stakes heists, betrayals, and plot twists that keep you up at night.
            </div>
          </Link>

          <Link
            href="/best-spanish-crime-shows"
            className="show-card p-6 block group"
          >
            <div className="text-neon font-black text-lg group-hover:text-white transition-colors">
              Best Spanish Crime Shows
            </div>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              The top crime and thriller series, ranked by real audience ratings.
            </div>
          </Link>

          <Link
            href="/best-on-netflix"
            className="show-card p-6 block group"
          >
            <div className="text-neon font-black text-lg group-hover:text-white transition-colors">
              Best on Netflix
            </div>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              Spanish shows you can stream right now on Netflix in the US.
            </div>
          </Link>
        </div>
      </section>

      {/* ===================== AD UNIT ===================== */}
      <div className="max-w-6xl mx-auto px-6">
        <AdUnit className="my-6" />
      </div>

      <ShopTheShowsCta />

      {/* ===================== TOP SHOWS GRID ===================== */}
      <section id="top-shows" className="max-w-7xl mx-auto px-6 pb-20 pt-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            Most Popular Spanish Shows of{" "}
            <span className="text-neon">2026</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Live rankings powered by TMDB audience data. Click any show for full details, reviews, and where to watch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {shows.slice(0, 12).map((show, index) => (
            <Link key={show.id} href={`/show/${show.id}`} className="group block">
              <div className="show-card relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`}
                  alt={`${show.name} - Spanish TV show`}
                  className="w-full h-full object-cover opacity-80"
                  loading={index < 3 ? "eager" : "lazy"}
                />

                {/* Rank badge */}
                <div className="rank-badge">
                  {index + 1}
                </div>

                {/* Rating badge */}
                {show.vote_average > 0 && (
                  <div className={`rating-badge ${getRatingClass(show.vote_average)} absolute top-3 right-3`}>
                    <StarIcon className="h-3 w-3" />
                    {show.vote_average.toFixed(1)}
                  </div>
                )}

                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent" />

                {/* Year badge */}
                {show.first_air_date && (
                  <div className="absolute bottom-3 right-3 text-xs font-mono text-gray-400 font-bold">
                    {show.first_air_date.slice(0, 4)}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-black group-hover:text-neon transition-colors mb-1">
                {show.name}
              </h3>

              {show.overview && (
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {show.overview}
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* View more CTA */}
        <div className="text-center mt-12">
          <Link
            href="/trending"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-gray-700 text-gray-300 font-bold text-sm hover:border-amber-400 hover:text-amber-400 transition-all"
          >
            <FireIcon className="h-4 w-4" />
            View All Trending Shows
          </Link>
        </div>
      </section>

      {/* ===================== LATEST ARTICLES ===================== */}
      <section className="max-w-6xl mx-auto px-6 mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-black text-xl md:text-2xl mb-1">
              Latest Articles
            </h2>
            <p className="text-gray-500 text-sm">
              Reviews, guides, and recommendations for Spanish TV fans.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-neon text-sm font-bold hover:underline hidden sm:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/blog/best-spanish-shows-on-netflix-2026" className="show-card p-6 block group">
            <div className="text-neon font-black text-lg group-hover:text-white transition-colors">
              Best Spanish Shows on Netflix 2026
            </div>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              The top 15 Spanish-language series streaming on Netflix right now, ranked and reviewed.
            </div>
          </Link>
          <Link href="/blog/la-casa-de-papel-review" className="show-card p-6 block group">
            <div className="text-neon font-black text-lg group-hover:text-white transition-colors">
              Money Heist: Complete Review
            </div>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              Why La Casa de Papel became a global phenomenon and whether it lives up to the hype.
            </div>
          </Link>
          <Link href="/blog/how-to-learn-spanish-watching-tv" className="show-card p-6 block group">
            <div className="text-neon font-black text-lg group-hover:text-white transition-colors">
              Learn Spanish Through TV Shows
            </div>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              A complete guide to using Spanish TV as a language-learning tool, with show recommendations by level.
            </div>
          </Link>
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link href="/blog" className="text-neon text-sm font-bold hover:underline">
            View All Articles →
          </Link>
        </div>
      </section>

      {/* ===================== WHY SPANISH TV ===================== */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="section-divider" />
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
            Why Spanish TV is Taking Over
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            From Money Heist breaking Netflix records to Elite becoming a global phenomenon,
            Spanish-language television is having its biggest moment ever. Here is why millions
            of viewers worldwide are making the switch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="show-card p-6">
            <div className="text-2xl mb-3">🌍</div>
            <h3 className="font-black text-base mb-2">Global Audiences</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Spanish is the 4th most spoken language globally. These shows connect with 580+ million native speakers and millions more learners.
            </p>
          </div>
          <div className="show-card p-6">
            <div className="text-2xl mb-3">🏆</div>
            <h3 className="font-black text-base mb-2">Award-Winning Quality</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              International Emmy wins, record-breaking viewership on Netflix, HBO, and Amazon Prime. Production quality rivals Hollywood.
            </p>
          </div>
          <div className="show-card p-6">
            <div className="text-2xl mb-3">📚</div>
            <h3 className="font-black text-base mb-2">Learn While You Watch</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Research shows watching TV in a foreign language improves comprehension. Spanish TV is the most fun way to learn.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER SIGNUP ===================== */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <NewsletterSignup />
      </section>

      {/* ===================== BOTTOM AD UNIT ===================== */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <AdUnit className="my-6" />
      </div>
    </div>
  );
}
