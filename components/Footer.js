// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black/90">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BRAND */}
          <div>
            <div className="text-white font-black text-lg tracking-tight">
              SpanishTVShows.com
            </div>
            <p className="text-gray-400 text-sm mt-2 max-w-sm">
              Discover the best Spanish-language TV shows from Spain and Latin
              America. Rankings, trends, and show guides updated regularly.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <div className="text-white font-black mb-3">Explore</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/trending" className="text-gray-400 hover:text-neon">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/shows-like-money-heist" className="text-gray-400 hover:text-neon">
                  Shows Like Money Heist
                </Link>
              </li>
              <li>
                <Link href="/best-spanish-crime-shows" className="text-gray-400 hover:text-neon">
                  Best Spanish Crime Shows
                </Link>
              </li>
              <li>
                <Link href="/netflix" className="text-gray-400 hover:text-neon">
                  Netflix Picks
                </Link>
              </li>
            </ul>
          </div>

          {/* META */}
          <div>
            <div className="text-white font-black mb-3">About</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-neon">
                  Contact
                </Link>
              </li>
              <li className="text-gray-500 text-xs">
                © {new Date().getFullYear()} SpanishTVShows.com
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
            }
