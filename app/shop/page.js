import { alternatesFor } from "@/lib/seo";
export const revalidate = 3600;

const SHOP = "https://fashionistas.ai";
const CATALOG = "https://js0hy0-ux.myshopify.com";
const COLLECTION = "spanishtvshows-merch";
const REF = "spanishtvshows";
const THIN_SECTION_COUNT = 2;
const VERIFY_CHUNK = 5;
const VERIFY_TIMEOUT_MS = 7000;

async function verifyFashionistasHandles(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return { live: [], dropped: [] };
  }

  async function checkOne(handle) {
    const url = `${SHOP}/products/${handle}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
    try {
      let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
      // Some edge runtimes return 405 on HEAD; fall back to a lightweight GET.
      if (res.status === 405 || res.status === 501) {
        res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
      }
      return { handle, status: res.status, ok: res.status === 200 };
    } catch (err) {
      return { handle, status: 0, ok: false, error: err?.name || "fetch_error" };
    } finally {
      clearTimeout(timer);
    }
  }

  const results = [];
  for (let i = 0; i < products.length; i += VERIFY_CHUNK) {
    const slice = products.slice(i, i + VERIFY_CHUNK);
    const settled = await Promise.all(slice.map((p) => checkOne(p.handle)));
    results.push(...settled);
  }

  const byHandle = new Map(results.map((r) => [r.handle, r]));
  const live = [];
  const dropped = [];
  for (const p of products) {
    const r = byHandle.get(p.handle);
    if (r && r.ok) {
      live.push(p);
    } else {
      dropped.push({ handle: p.handle, status: r?.status ?? 0, error: r?.error });
    }
  }

  if (dropped.length > 0) {
    // Build-time audit log so CF Pages build output shows which handles were filtered.
    // Intentional console.warn — this is a server component running at build/revalidate time.
    console.warn(
      `[shop] dropped ${dropped.length} product(s) with non-200 Fashionistas pages:`,
      dropped.map((d) => `${d.handle}=${d.status}${d.error ? `(${d.error})` : ""}`).join(", "),
    );
  } else {
    console.log(`[shop] verified ${live.length} product handle(s), 0 dropped.`);
  }

  return { live, dropped };
}

const SUBSECTIONS = [
  { tag: "money-heist", title: "Money Heist Merch", blurb: "Red jumpsuits, Dali-mask energy, and products tied directly to the site's biggest entertainment intent cluster." },
  { tag: "flamenco", title: "Flamenco Style", blurb: "Fans, skirts, and accessories with stronger Spanish-style visual language." },
  { tag: "learn-spanish", title: "Learn Spanish Gear", blurb: "Language-learning products and study aids that fit the site's education lane." },
];

function productText(product) {
  return [
    product?.title,
    ...(product?.tags || []),
    product?.product_type,
    product?.body_html,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getSectionTag(product) {
  const text = productText(product);

  if (/(money heist|dali|jumpsuit|costume|hoodie|graphic t-shirt|paper money)/.test(text)) {
    return "money-heist";
  }
  if (/(flamenco|fan|skirt|rose hair|lace earring|choker)/.test(text)) {
    return "flamenco";
  }
  if (/(spanish|bilingual|language|word game|educational tablet|learn)/.test(text)) {
    return "learn-spanish";
  }

  return null;
}

async function getProducts() {
  try {
    const res = await fetch(`${CATALOG}/collections/${COLLECTION}/products.json?limit=250`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        products: [],
        state: "error",
        message: `Catalog request failed with HTTP ${res.status}.`,
        dropped: [],
      };
    }
    const data = await res.json();
    const available = (data.products || []).filter((p) => Array.isArray(p.variants) && p.variants.some((v) => v.available));

    if (available.length === 0) {
      return {
        products: [],
        state: "empty",
        message: "The live merch feed is up, but none of the tagged products in this collection are available right now.",
        dropped: [],
      };
    }

    const { live, dropped } = await verifyFashionistasHandles(available);

    if (live.length === 0) {
      return {
        products: [],
        state: "empty",
        message: `All ${available.length} tagged products are missing on Fashionistas.ai right now (dropped to avoid dead links).`,
        dropped,
      };
    }

    return {
      products: live,
      state: "ready",
      message: dropped.length > 0
        ? `Filtered ${dropped.length} product(s) whose Fashionistas.ai pages are not live.`
        : null,
      dropped,
    };
  } catch {
    return {
      products: [],
      state: "error",
      message: "The live merch feed is unavailable right now.",
      dropped: [],
    };
  }
}

export const metadata = {
  alternates: alternatesFor("/shop"),
  title: "Shop",
  description: "Money Heist merch, flamenco accessories, and language-learning products routed through the Fashionistas.ai catalog.",
};

function ProductCard({ p }) {
  const variant = p.variants[0] || {};
  const image = (p.images || [])[0]?.src;
  return (
    <a
      href={`${SHOP}/products/${p.handle}?ref=${REF}`}
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

function getProductHref(handle) {
  return `${SHOP}/products/${handle}?ref=${REF}`;
}

function getCollectionHref() {
  return `${CATALOG}/collections/${COLLECTION}`;
}

function getFullCatalogHref() {
  return `${SHOP}/products?ref=${REF}`;
}

export default async function ShopPage() {
  const { products, state, message, dropped = [] } = await getProducts();
  void dropped; // referenced for future UI surfacing; kept in closure for build-log trace.
  const sections = SUBSECTIONS.map((section) => ({
    ...section,
    products: products.filter((p) => getSectionTag(p) === section.tag),
  }));
  const populatedSections = sections.filter((section) => section.products.length > 0);
  const featuredFallbacks = products.slice(0, 4);
  const hasProducts = populatedSections.length > 0;
  const showCatalogNotice = state !== "ready";

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

      {showCatalogNotice && (
        <div className="mt-8 max-w-4xl rounded-2xl border border-amber-400/25 bg-amber-300/[0.08] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">
            {state === "error" ? "Catalog connection issue" : state === "empty" ? "No tagged merch live" : "Lean merch snapshot"}
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            {state === "error"
              ? "The merch feed did not load cleanly."
              : state === "empty"
                ? "There are no live tagged items to show right now."
                : "Some categories only have one live item right now."}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
            {state !== "ready"
              ? `${message} We are only linking to working Fashionistas product pages and the live storefront until the feed recovers.`
              : "This page hides empty categories and only shows the items that are actually live. If a category looks light, that is the current live inventory rather than a padded placeholder grid."}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {populatedSections.map((s) => (
          <a key={s.tag} href={`#${s.tag}`} className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gray-300 hover:border-neon/60 hover:text-white transition-all">
            {s.title} ({s.products.length})
          </a>
        ))}
        {showCatalogNotice && (
          <a
            href={getCollectionHref()}
            target="_blank"
            rel="noopener nofollow"
            className="rounded-full border border-neon/50 bg-neon/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition-all hover:border-neon hover:bg-neon/20"
          >
            Open live collection
          </a>
        )}
        {!hasProducts && (
          <a
            href={getFullCatalogHref()}
            target="_blank"
            rel="noopener nofollow"
            className="rounded-full border border-neon/50 bg-neon/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition-all hover:border-neon hover:bg-neon/20"
          >
            Browse full catalog
          </a>
        )}
      </div>

      <div className="mt-12 space-y-14">
        {populatedSections.map((section) => (
          <section key={section.tag} id={section.tag} className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4 mb-3">
              <h2 className="text-2xl md:text-3xl font-black text-white">{section.title}</h2>
              <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                {section.products.length === 1 ? "1 live item" : `${section.products.length} live items`}
              </span>
            </div>
            <p className="text-gray-400 max-w-3xl leading-7 mb-6">{section.blurb}</p>
            {section.products.length < THIN_SECTION_COUNT && (
              <p className="mb-5 text-sm leading-6 text-amber-200">
                This category is thin right now, so we are only showing the live item we could verify.
              </p>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {section.products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        ))}

        {!hasProducts && (
          <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 md:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Fallback mode</p>
              <h2 className="mt-3 text-3xl font-black text-white">No live SpanishTVShows-tagged merch is rendering right now.</h2>
              <p className="mt-4 text-base leading-7 text-gray-300">
                Instead of exposing dead collection paths, this page falls back to the working Fashionistas storefront and any verified live product pages we could fetch.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {featuredFallbacks.map((product) => (
                  <a
                    key={product.id}
                    href={getProductHref(product.handle)}
                    target="_blank"
                    rel="noopener nofollow"
                    className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-200 hover:text-white hover:border-neon/60 transition-all"
                  >
                    {product.title}
                  </a>
                ))}
                <a
                  href={getCollectionHref()}
                  target="_blank"
                  rel="noopener nofollow"
                  className="rounded-full bg-neon px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition-colors hover:opacity-90"
                >
                  Open collection
                </a>
                <a
                  href={getFullCatalogHref()}
                  target="_blank"
                  rel="noopener nofollow"
                  className="rounded-full bg-neon px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition-colors hover:opacity-90"
                >
                  Browse full catalog
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
