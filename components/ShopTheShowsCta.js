const PICKS = [
  {
    title: "Heist Energy",
    desc: "Sharp jackets, black basics, and accessories that fit the sleek crime-drama look.",
    href: "https://fashionistas.ai/spanish-style",
    tag: "Crime & Thriller",
  },
  {
    title: "Netflix Night Looks",
    desc: "Casual pieces, layered jewelry, and low-cost accessories inspired by binge-worthy favorites.",
    href: "https://fashionistas.ai/spanish-style",
    tag: "Streaming Style",
  },
  {
    title: "Vacation & Novela Vibes",
    desc: "Sandals, wedges, and statement pieces for the warmer, more dramatic side of Spanish TV.",
    href: "https://fashionistas.ai/spanish-style",
    tag: "Editorial Picks",
  },
];

export default function ShopTheShowsCta() {
  return (
    <section className="max-w-6xl mx-auto px-6 mb-14">
      <div className="rounded-2xl border border-gray-800/70 bg-black/80 p-6 md:p-8">
        <div className="max-w-2xl mb-6">
          <p className="text-neon text-xs font-black uppercase tracking-[0.3em] mb-3">
            Shop The Vibe
          </p>
          <h2 className="text-white font-black text-2xl md:text-3xl mb-3">
            Spanish TV style, without fake “featured products” spam.
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            These are editorial style picks for viewers who want the look and mood of their
            favorite shows. We only link categories that actually fit the aesthetic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PICKS.map((pick) => (
            <a
              key={pick.title}
              href={pick.href}
              target="_blank"
              rel="noopener noreferrer"
              className="show-card p-6 block group"
            >
              <div className="text-neon text-[11px] font-black uppercase tracking-[0.18em] mb-3">
                {pick.tag}
              </div>
              <div className="text-white font-black text-lg mb-2 group-hover:text-neon transition-colors">
                {pick.title}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {pick.desc}
              </p>
              <span className="text-neon text-sm font-bold">Browse Fashionistas.ai →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
