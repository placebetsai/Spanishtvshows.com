// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SpanishTVShows.com
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-semibold">
            <Link className="text-gray-300 hover:text-neon" href="/contact">
              Contact
            </Link>
            <Link className="text-gray-300 hover:text-neon" href="/privacy">
              Privacy
            </Link>
            <Link className="text-gray-300 hover:text-neon" href="/terms">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-800 pt-6 text-xs text-gray-600">
          <p className="text-gray-500 font-semibold mb-2 uppercase tracking-wider text-[10px]">Partner Sites</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4">
            <a href="https://hiddencameras.tv" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">HiddenCameras.tv — Live World Cams &amp; Security Camera Reviews</a>
            <a href="https://ihatecollege.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">IHateCollege.com — Real College Data &amp; Alternatives</a>
          </div>
        </div>
        <div className="mt-0 text-xs text-gray-500 leading-relaxed space-y-1">
          <p>Disclosure: As an Amazon Associate, we earn from qualifying purchases.</p>
          <p>
            Show data provided by{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
              The Movie Database (TMDB)
            </a>
            . This site is not endorsed or certified by TMDB and is not affiliated with Netflix,
            HBO, Telemundo, Univision, ViX, or any streaming platform.
          </p>
          <p>SpanishTVShows.com is an independent fan resource. All trademarks belong to their respective owners.</p>
        </div>
      </div>
    </footer>
  );
            }
