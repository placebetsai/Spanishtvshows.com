// components/LanguageLearningCta.js
import Link from "next/link";
import AffiliateDisclosure from "./AffiliateDisclosure";

const PLATFORMS = [
  {
    name: "Babbel",
    href: "https://www.babbel.com/learn-spanish?utm_source=spanishtvshows",
    tagline: "Conversation-focused lessons",
  },
  {
    name: "Rosetta Stone",
    href: "https://www.rosettastone.com/learn-spanish?utm_source=spanishtvshows",
    tagline: "Immersive method, no translations",
  },
];

export default function LanguageLearningCta({ showLearnLink = true }) {
  return (
    <div className="rounded-2xl border border-gray-800/60 bg-black/70 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">📖</span>
        <h3 className="text-lg font-black">Learn Spanish While You Watch</h3>
      </div>
      <p className="text-gray-400 text-sm mb-5 leading-relaxed">
        Start with a free trial. Pair lessons with the shows you love for faster
        progress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLATFORMS.map((platform) => (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            data-affiliate="pending"
            className="show-card flex items-center justify-between gap-3 px-5 py-4 hover:border-neon group"
          >
            <div>
              <div className="font-black text-sm group-hover:text-neon transition-colors">
                {platform.name}
              </div>
              <div className="text-gray-500 text-xs mt-0.5">
                {platform.tagline}
              </div>
            </div>
            <span className="text-neon font-black text-sm group-hover:translate-x-1 transition-transform">
              Try Free →
            </span>
          </a>
        ))}
      </div>

      {showLearnLink && (
        <Link
          href="/learn-spanish"
          className="inline-block mt-4 text-neon text-sm font-bold hover:text-white transition-colors"
        >
          More learning resources →
        </Link>
      )}

      <AffiliateDisclosure className="mt-4" />
    </div>
  );
}
