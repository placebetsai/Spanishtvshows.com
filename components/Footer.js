export default function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-black py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
        <p className="text-xs text-gray-500">
          SpanishTVShows.com is an independent guide to Spanish-language TV.
          We may earn affiliate commissions from some links.
        </p>
        <p className="text-[11px] text-gray-700">
          © {new Date().getFullYear()} SpanishTVShows.com · All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
