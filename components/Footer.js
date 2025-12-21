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

        {/* REQUIRED AMAZON DISCLOSURE — keep it small + clean */}
        <div className="mt-6 text-xs text-gray-500 leading-relaxed">
          Disclosure: As an Amazon Associate, we earn from qualifying purchases.
        </div>
      </div>
    </footer>
  );
            }
