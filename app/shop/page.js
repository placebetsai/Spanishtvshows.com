export const revalidate = 3600;

const SHOP = "https://fashionistas.ai";
const COLLECTION = "spanishtvshows-merch";

const SUBSECTIONS = [
  { tag: "money-heist", title: "Money Heist Merch", blurb: "Red jumpsuits, Dali-mask energy, and products tied directly to the site's biggest entertainment intent cluster." },
  { tag: "flamenco", title: "Flamenco Style", blurb: "Fans, skirts, and accessories with stronger Spanish-style visual language." },
  { tag: "learn-spanish", title: "Learn Spanish Gear", blurb: "Language-learning products and study aids that fit the site's education lane." },
];

async function getProducts() {
  try {
    const res = await fetch(`${SHOP}/collections/${COLLECTION}/products.json?limit=250`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || []).filter((p) => Array.isArray(p.variants) && p.variants.some((v) => v.available));
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Shop | SpanishTVShows.com",
  description: "Money Heist merch, flamenco accessories, and language-learning products routed through the Fashionistas.ai catalog.",
};

function ProductCard({ p }) {
  const variant = p.variants[0] || {};
  const image = (p.images || [])[0]?.src;
  return (
    <a
      href={`${SHOP}/products/${p.handle}?ref=spanishtvshows`}
      target="_blank"
      rel="noopener nofollow"
      className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-neon/60 transition-all"
    >
      <div className="aspect-[4/5] bg-black overflow-hidden">
        {image ? (
          <img src={image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-[0.18em] text-gray-500">No image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-white leading-snug min-h-[2.8rem]">{p.title}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-neon font-black">${variant.price || "?"}</span>
          <span className="ml-auto text-[10px] uppercase tracking-[0.18em] text-gray-400">Shop →</span>
        </div>
      </div>
    </a>
  );
}

export default async function ShopPage() {
  const products = await getProducts();
  const sections = SUBSECTIONS.map((section) => ({
    ...section,
    products: products.filter((p) => (p.tags || []).includes(section.tag)),
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="max-w-4xl">
        <p className="text-neon text-xs uppercase tracking-[0.3em] mb-4">Shop</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
          Merch tied to the shows, style, and language-learning lane.
        </h1>
        <p className="mt-5 max-w-3xl text-gray-300 text-base md:text-lg leading-8">
          SpanishTVShows.com now has a dedicated commerce lane for viewers who want Money Heist energy,
          Spanish-style accessories, and learning-Spanish items without dumping them into a random generic store.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {sections.filter((s) => s.products.length > 0).map((s) => (
          <a key={s.tag} href={`#${s.tag}`} className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gray-300 hover:border-neon/60 hover:text-white transition-all">
            {s.title} ({s.products.length})
          </a>
        ))}
      </div>

      <div className="mt-12 space-y-14">
        {sections.map((section) => section.products.length === 0 ? null : (
          <section key={section.tag} id={section.tag} className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4 mb-3">
              <h2 className="text-2xl md:text-3xl font-black text-white">{section.title}</h2>
              <span className="text-xs uppercase tracking-[0.18em] text-gray-500">{section.products.length} items</span>
            </div>
            <p className="text-gray-400 max-w-3xl leading-7 mb-6">{section.blurb}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {section.products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
