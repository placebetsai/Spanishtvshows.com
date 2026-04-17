// components/Footer.js
import Link from "next/link";

const DISCOVER_LINKS = [
  { href: "/trending", label: "Trending Now" },
  { href: "/best-on-netflix", label: "Best on Netflix" },
  { href: "/best-spanish-crime-shows", label: "Best Crime Shows" },
  { href: "/shows-like-money-heist", label: "Shows Like Money Heist" },
  { href: "/learn-spanish", label: "Learn Spanish with TV" },
  { href: "/learn-english", label: "Learn English with TV" },
  { href: "/news", label: "Spanish TV News" },
];

const GENRE_LINKS = [
  { href: "/trending", label: "Drama" },
  { href: "/best-spanish-crime-shows", label: "Crime & Thriller" },
  { href: "/trending", label: "Comedy" },
  { href: "/trending", label: "Novelas" },
  { href: "/trending", label: "Mystery" },
  { href: "/trending", label: "Action" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/resources", label: "Resources" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/60 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* MAIN GRID */}
        <div className="footer-grid mb-10">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="text-xl font-black italic tracking-tighter text-white">
              SPANISHTVSHOWS<span className="text-neon">.COM</span>
            </Link>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-xs">
              The best Spanish-language TV shows ranked by real audience data. Updated daily.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
              Discover
            </h3>
            <ul className="space-y-2.5">
              {DISCOVER_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-neon text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
              Genres
            </h3>
            <ul className="space-y-2.5">
              {GENRE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-neon text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-neon text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* LEGAL + ATTRIBUTION */}
        <div className="border-t border-gray-800/50 pt-6 space-y-3 text-xs text-gray-600 leading-relaxed">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} SpanishTVShows.com. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-400 transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-gray-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <p>
            Show data provided by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-400"
            >
              The Movie Database (TMDB)
            </a>
            . This site is not endorsed or certified by TMDB and is not affiliated with Netflix,
            HBO, Telemundo, Univision, ViX, or any streaming platform.
          </p>
          <p>
            SpanishTVShows.com is an independent fan resource. All trademarks belong to their
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
