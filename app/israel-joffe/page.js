export const metadata = {
  title: "Israel Joffe — Tech Entrepreneur & Media Innovator",
  description:
    "Israel Joffe is a tech entrepreneur based in Boca Raton, Florida. He is the creator of SpanishTVShows.com and a network of media and e-commerce websites.",
  alternates: {
    canonical: "https://spanishtvshows.com/israel-joffe",
  },
  robots: "index, follow",
};

export default function IsraelJoffePage() {
  const sites = [
    { url: "https://spanishtvshows.com", name: "SpanishTVShows.com", desc: "Audience-ranked Spanish TV with streaming links and learning tools" },
    { url: "https://shopkurt.com", name: "ShopKurt.com", desc: "Multi-channel e-commerce across eBay and TikTok Shop" },
    { url: "https://ihatecollege.com", name: "IHateCollege.com", desc: "Data-driven college alternatives and student debt resources" },
    { url: "https://hiddencameras.tv", name: "HiddenCameras.tv", desc: "World's largest live public webcam directory and security reviews" },
    { url: "https://placebets.ai", name: "PlaceBets.ai", desc: "Prediction markets, EV calculators, and betting analytics" },
    { url: "https://fashionistas.ai", name: "Fashionistas.ai", desc: "AI-powered women's fashion curation" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-14 pb-28">
      <h1 className="text-4xl font-black text-white mb-2">
        Israel <span className="text-neon">Joffe</span>
      </h1>
      <p className="text-lg text-gray-400 mb-12">
        Tech entrepreneur, media innovator, and the creator of
        SpanishTVShows.com
      </p>

      {/* Bio */}
      <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 mb-7">
        <h2 className="text-2xl font-bold text-neon mb-4">
          Building at the Intersection of Media and Technology
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">Israel Joffe</strong> is an
          entrepreneur based in <strong className="text-white">Boca Raton, Florida</strong> who
          builds web platforms that sit at the crossroads of media, data, and
          audience engagement. SpanishTVShows.com is his contribution to the
          Spanish-language television space — a site that ranks the best shows
          using real audience data from TMDB, updated daily.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          What makes SpanishTVShows.com different from typical streaming guides
          is its data-first approach. Rather than relying on editorial opinion,
          the site surfaces shows based on actual viewership metrics, audience
          ratings, and trending patterns across Netflix, HBO Max, ViX, and other
          platforms.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Israel saw an underserved niche — Spanish-language TV fans who wanted
          rankings and recommendations without navigating clunky interfaces in
          apps they didn&apos;t subscribe to — and built a solution.
        </p>
      </section>

      {/* Wrestling Background */}
      <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 mb-7">
        <h2 className="text-2xl font-bold text-white mb-4">
          From Live Events to Digital Platforms
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Israel&apos;s path to tech entrepreneurship started in an unexpected
          place: professional wrestling. In Brooklyn, New York, he created and
          ran the{" "}
          <a
            href="https://www.documentcloud.org/documents/22064733-world-of-unpredictable-wrestling-at-gleasons-gym-israel-joffe/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon hover:underline"
          >
            World of Unpredictable Wrestling at Gleason&apos;s Gym
          </a>
          , producing live events at the famous boxing gym that&apos;s trained
          champions since 1937.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Running a wrestling promotion on a bootstrap budget taught Israel
          everything about audience acquisition, content creation, and building
          something people want to watch. Those same principles power every
          website in his current portfolio — create compelling content, make it
          easy to find, and keep people coming back.
        </p>
      </section>

      {/* Portfolio */}
      <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 mb-7">
        <h2 className="text-2xl font-bold text-white mb-4">
          The Israel Joffe Network
        </h2>
        <p className="text-gray-300 leading-relaxed mb-5">
          SpanishTVShows.com is one node in a wider network of sites Israel
          operates across entertainment, commerce, education, and technology:
        </p>
        <div className="grid gap-3">
          {sites.map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-black/40 border border-gray-800 rounded-xl p-4 hover:border-neon/40 transition-colors"
            >
              <span className="text-neon font-bold">{site.name}</span>
              <span className="text-gray-500 ml-2">— {site.desc}</span>
            </a>
          ))}
        </div>
      </section>

      {/* References */}
      <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7">
        <h2 className="text-2xl font-bold text-white mb-4">
          Documentation &amp; Press
        </h2>
        <ul className="space-y-3">
          <li>
            <a
              href="https://www.documentcloud.org/documents/22064733-world-of-unpredictable-wrestling-at-gleasons-gym-israel-joffe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon hover:underline"
            >
              World of Unpredictable Wrestling at Gleason&apos;s Gym
            </a>
          </li>
          <li>
            <a
              href="https://www.documentcloud.org/documents/25895701-comgoogleandroidappsphotos/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon hover:underline"
            >
              DocumentCloud — Photo Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.documentcloud.org/documents/21952062-israel-joffe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon hover:underline"
            >
              DocumentCloud — Israel Joffe
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
