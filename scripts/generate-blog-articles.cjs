#!/usr/bin/env node
/**
 * generate-blog-articles.cjs
 * Generates blog articles using Claude AI for SpanishTVShows.com
 * Run: node scripts/generate-blog-articles.cjs
 * Env: ANTHROPIC_API_KEY, GITHUB_TOKEN
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content/blog/posts");
const USED_FILE = path.join(ROOT, "content/blog/.used-topics.json");
const ARTICLES_PER_RUN = parseInt(process.env.ARTICLES_PER_RUN || "50", 10);

const TOPICS = [
  { slug: "money-heist-review-best-spanish-show", angle: "Why Money Heist is the most addictive Spanish show ever made — and what makes it work" },
  { slug: "elite-netflix-review-2026", angle: "Elite on Netflix: the guilty pleasure Spanish show you cannot stop watching" },
  { slug: "learn-spanish-netflix-shows-2026", angle: "The best Netflix shows to learn Spanish for every level in 2026" },
  { slug: "best-spanish-shows-beginners", angle: "5 Spanish shows perfect for total beginners — no subtitles needed by episode 5" },
  { slug: "spanish-accents-tv-shows-explained", angle: "Spain vs Mexico vs Argentina: understanding Spanish accents through TV" },
  { slug: "shows-like-money-heist", angle: "If you loved Money Heist, here are 10 Spanish shows to watch next" },
  { slug: "best-spanish-crime-dramas-ranked", angle: "Ranked: the best Spanish-language crime dramas of all time" },
  { slug: "subtitles-strategy-spanish-learning", angle: "The exact subtitle strategy for learning Spanish faster with TV — tested by language teachers" },
  { slug: "vis-a-vis-locked-up-review", angle: "Locked Up (Vis a Vis): Spain's answer to Orange is the New Black" },
  { slug: "la-casa-de-papel-explained", angle: "Money Heist plot explained season by season — and why it resonated globally" },
  { slug: "best-spanish-shows-intermediate-learners", angle: "Spanish TV shows for intermediate learners who are tired of easy content" },
  { slug: "spanish-slang-money-heist", angle: "Spanish slang from Money Heist that actually shows up in real conversation" },
  { slug: "binge-watching-language-learning-science", angle: "The science behind binge-watching as a language learning strategy — does it actually work?" },
  { slug: "spain-culture-tv-shows", angle: "What Spanish TV shows reveal about modern Spanish culture that tourists never see" },
  { slug: "narcos-language-learning-review", angle: "Learning Spanish from Narcos: is it actually good for language learners?" },
  { slug: "telenovelas-vs-prestige-dramas-learning", angle: "Telenovelas vs prestige dramas: which is better for learning Spanish?" },
  { slug: "best-argentinian-tv-shows", angle: "Argentina's best TV exports beyond the telenovela era" },
  { slug: "best-mexican-series-streaming-2026", angle: "The best Mexican TV series streaming right now in 2026" },
  { slug: "where-to-stream-spanish-shows-2026", angle: "The complete guide to where Spanish shows are streaming in 2026" },
  { slug: "dubbed-vs-subtitled-spanish-learning", angle: "Dubbed vs subtitled Spanish shows for learning: the definitive verdict" },
  { slug: "best-spanish-comedy-shows", angle: "The funniest Spanish TV comedies that will actually make you laugh out loud" },
  { slug: "club-de-cuervos-review", angle: "Club de Cuervos: the underrated Mexican comedy everyone on Netflix slept on" },
  { slug: "shadowing-technique-spanish-tv", angle: "The shadowing technique: how to speak Spanish like your favorite TV character" },
  { slug: "best-colombian-shows-netflix", angle: "The best Colombian shows on Netflix beyond Narcos" },
  { slug: "castilian-vs-latin-american-spanish-tv", angle: "Castilian vs Latin American Spanish: what TV shows teach you and which to choose" },
  { slug: "spanish-historical-dramas-ranked", angle: "Spanish historical dramas worth every subtitled hour — ranked" },
  { slug: "netflix-spain-original-series-ranked", angle: "Netflix Spain original series: ranked from essential to skip" },
  { slug: "language-reactor-review-spanish", angle: "Language Reactor review 2026: is it worth it for Spanish learners?" },
  { slug: "underrated-spanish-shows-2026", angle: "10 underrated Spanish shows that deserve way more viewers" },
  { slug: "best-spanish-thriller-series", angle: "Edge-of-your-seat Spanish thriller series that deserve more attention" },
  { slug: "gran-hotel-series-review", angle: "Gran Hotel: the classic Spanish mystery series worth binging in 2026" },
  { slug: "hbo-max-spanish-shows", angle: "The best Spanish shows on HBO Max that nobody is talking about" },
  { slug: "elite-cast-where-are-they-now", angle: "Elite cast: where they are now and what they're doing next" },
  { slug: "spanish-vocabulary-crime-shows", angle: "100 Spanish vocabulary words you will learn from crime dramas — with examples" },
  { slug: "best-short-spanish-series", angle: "Best Spanish TV shows under 6 episodes for when you cannot commit to a full series" },
  { slug: "money-heist-vs-dark-comparison", angle: "Money Heist vs Dark: two European crime masterpieces compared" },
  { slug: "farina-narco-spain-review", angle: "Fariña: the true story of Spanish drug trafficking on TV" },
  { slug: "skam-espana-teen-drama-review", angle: "SKAM España: the Spanish teen drama that actually gets Gen Z right" },
  { slug: "velvet-series-review", angle: "Velvet: the Spanish period drama that is equal parts soap opera and fashion show" },
  { slug: "how-to-find-spanish-shows", angle: "The non-obvious ways to discover Spanish shows that haven't gone mainstream yet" },
  { slug: "voseo-argentina-tv-explained", angle: "Understanding voseo (vos) in Argentine TV shows — a guide for learners" },
  { slug: "anki-spanish-tv-phrases", angle: "How to build the perfect Spanish Anki deck from your favorite shows" },
  { slug: "elite-vs-gossip-girl", angle: "Elite vs Gossip Girl: why the Spanish version wins and what makes it different" },
  { slug: "formal-informal-spanish-tv", angle: "Tú vs usted: when Spanish TV characters switch and what it means" },
  { slug: "best-money-heist-episodes", angle: "The 10 best Money Heist episodes to rewatch — and which to skip" },
  { slug: "spanish-shows-not-netflix", angle: "Incredible Spanish shows that are not on Netflix and where to find them" },
  { slug: "lingopie-review-2026", angle: "Lingopie review 2026: is the Spanish learning streaming platform actually worth it?" },
  { slug: "most-rewatchable-spanish-shows", angle: "Spanish shows you can rewatch endlessly and why they hold up" },
  { slug: "best-spanish-shows-amazon-prime", angle: "Best Spanish-language shows on Amazon Prime you are probably sleeping on" },
  { slug: "spanish-shows-kids-families", angle: "Best Spanish TV shows for kids and families learning Spanish together" },
  { slug: "chilean-spanish-tv-guide", angle: "Chilean Spanish is difficult — here is how TV can help you finally understand it" },
  { slug: "binge-worthy-spanish-shows-2026", angle: "The most binge-worthy Spanish shows of 2026, ranked by rewatchability" },
  { slug: "money-heist-characters-ranked", angle: "All Money Heist characters ranked from best to completely unnecessary" },
  { slug: "spanish-idioms-explained-tv", angle: "Spanish idioms from TV shows and what they actually mean in real life" },
  { slug: "watch-spanish-shows-habit", angle: "How to build a daily Spanish TV habit that actually sticks and produces results" },
  { slug: "rioplatense-spanish-netflix", angle: "Rioplatense Spanish: the dialect from Buenos Aires you keep hearing on Netflix" },
  { slug: "pluto-tv-spanish-channels", angle: "Free Spanish language channels on Pluto TV worth watching right now" },
  { slug: "false-cognates-spanish-tv", angle: "Embarrassing false cognates you will hear in Spanish TV — and should not repeat" },
  { slug: "classic-spanish-shows-rewatch-2026", angle: "Classic Spanish shows worth rewatching in 2026 and why they still hold up" },
  { slug: "family-dynamics-spanish-tv", angle: "What Spanish TV shows teach you about family dynamics in Hispanic culture" },
  { slug: "spanish-curse-words-tv-context", angle: "Spanish profanity in TV shows: what it means and when characters actually use it" },
  { slug: "disney-plus-spanish-shows", angle: "Disney Plus Spanish language content guide 2026 — what is actually worth watching" },
  { slug: "apply-tv-spanish-content", angle: "Apple TV Plus Spanish language content: is there actually anything worth watching?" },
  { slug: "colombian-culture-tv-shows", angle: "How Colombian culture gets portrayed in TV and why it is more complex than Narcos" },
  { slug: "spanish-show-streaming-platforms-compared", angle: "Netflix vs HBO vs Amazon for Spanish content: a 2026 honest breakdown" },
  { slug: "madrid-culture-elite-show", angle: "Madrid's elite culture explained through the Netflix show Elite" },
  { slug: "best-spanish-shows-endings", angle: "The best and worst series finales in Spanish TV history" },
  { slug: "saddest-spanish-tv-deaths", angle: "The character deaths in Spanish TV that destroyed us emotionally" },
  { slug: "italian-vs-spanish-tv-learning", angle: "Spanish vs Italian TV for language learning: which actually works better?" },
  { slug: "youtube-spanish-shows-free", angle: "Free Spanish TV shows and films on YouTube you probably did not know existed" },
  { slug: "pimsleur-vs-spanish-tv", angle: "Pimsleur vs learning with Spanish TV: an honest 6-month comparison" },
  { slug: "duolingo-plus-spanish-shows", angle: "Duolingo plus Spanish TV: the lazy learner path to conversational Spanish" },
  { slug: "best-spanish-shows-plot-twists", angle: "The most jaw-dropping plot twists in Spanish TV history" },
  { slug: "narcos-vs-patron-del-mal", angle: "Narcos vs El Patron del Mal: which Pablo Escobar show is more accurate?" },
  { slug: "velvet-collection-review", angle: "Velvet Coleccion review: is the spinoff worth watching after the original?" },
  { slug: "spanish-listening-improvement-tv", angle: "How watching Spanish TV transformed my listening comprehension in 90 days" },
  { slug: "rosetta-stone-vs-spanish-shows", angle: "Rosetta Stone vs watching Spanish shows: which actually gets you fluent faster?" },
  { slug: "hbo-spain-series-ranked", angle: "HBO Spain original series ranked: everything from Foodie Love to 30 Coins" },
  { slug: "best-spanish-documentaries-learning", angle: "Best Spanish-language documentaries for language learners — real speech, real topics" },
  { slug: "velvet-collection-characters", angle: "Velvet Collection characters explained: who is who in the fashion world spinoff" },
  { slug: "italian-dramas-vs-spanish-dramas", angle: "Italian dramas vs Spanish dramas: differences in storytelling, pacing, and culture" },
  { slug: "spanish-reality-tv-learning", angle: "Can you learn Spanish from reality TV? An honest look at La Isla de las Tentaciones" },
  { slug: "gran-bretana-spanish-series", angle: "Cable Girls (Las Chicas del Cable): the Spanish period drama you need to watch next" },
  { slug: "monarca-netflix-mexico-review", angle: "Monarca on Netflix: the Mexican business drama that delivers on every level" },
  { slug: "who-killed-sara-review", angle: "Who Killed Sara?: the Mexican mystery thriller that had everyone obsessed" },
  { slug: "dark-desire-review", angle: "Dark Desire (Oscuro Deseo): the Mexican erotic thriller Netflix does not promote enough" },
  { slug: "45-rpm-review-spanish", angle: "45 RPM: the Spanish music industry drama set in the 1960s worth binging" },
  { slug: "live-and-let-live-review", angle: "Vivir sin permiso: the Galician crime drama that flew under the radar" },
  { slug: "grand-hotel-spain-deep-dive", angle: "Grand Hotel Spain: a complete guide to the mystery, cast, and where to stream it" },
  { slug: "malaka-review-spain", angle: "Spanish crime shows set outside Madrid: the regional dramas worth your time" },
  { slug: "money-heist-korea-comparison", angle: "Money Heist Korea vs the original: what changed and what stayed the same" },
  { slug: "berlin-series-review", angle: "Berlin (Money Heist spinoff): does the prequel live up to the original?" },
  { slug: "learn-spanish-one-year-tv", angle: "I watched Spanish TV for one year instead of taking classes — here is what happened" },
  { slug: "comprehensible-input-spanish-tv", angle: "Comprehensible input and Spanish TV: how to use Krashen's theory with Netflix" },
  { slug: "best-spanish-shows-romance", angle: "The best Spanish romance series that are not cheesy telenovelas" },
  { slug: "spanish-shows-true-crime", angle: "Spanish true crime shows and docuseries worth watching in 2026" },
  { slug: "fuerza-de-la-sangre-review", angle: "El Ministerio del Tiempo: the Spanish time travel show that deserves a global audience" },
];

const AUTHORS = [
  { name: "Sofia Martinez", bio: "Spanish TV enthusiast and bilingual writer covering Spanish-language cinema and television for 8 years.", gradient: "from-rose-500 to-orange-500" },
  { name: "Carlos Rivera", bio: "Language teacher and TV critic who believes the best Spanish classroom is a Netflix subscription.", gradient: "from-cyan-500 to-blue-500" },
  { name: "Ana Lopez", bio: "Cultural journalist specializing in Latin American and Spanish media, pop culture, and language learning.", gradient: "from-purple-500 to-pink-500" },
  { name: "Diego Santos", bio: "Linguistics enthusiast and native Spanish speaker who reviews shows from a language-learning angle.", gradient: "from-green-500 to-teal-500" },
  { name: "Maria Fernandez", bio: "Former Spanish teacher turned content writer. Obsessed with telenovelas, prestige dramas, and helping people get fluent.", gradient: "from-yellow-500 to-orange-500" },
  { name: "Luis Torres", bio: "Binge-watcher and amateur linguist who has watched 200+ Spanish shows and tracked the evolution of Spanish TV storytelling.", gradient: "from-indigo-500 to-violet-500" },
  { name: "Carmen Ruiz", bio: "Travel writer and Spanish learner documenting her journey from A1 to C1 entirely through Spanish-language TV.", gradient: "from-rose-500 to-pink-500" },
  { name: "Pablo Morales", bio: "Film school graduate and TV critic analyzing narrative structure, culture, and language in Spanish dramas.", gradient: "from-emerald-500 to-cyan-500" },
];

const HERO_IMAGES = [
  "1489599849927499de66",
  "1522869635100-d0cd5700faaa",
  "1517604931-879a5b0e79e9",
  "1536440136628-849c177e76a1",
  "1611532736597-de2d4265fba3",
  "1506905925346-21bda4d32df4",
  "1574375927818da6edce",
  "1594909122845-11baa439b7bf",
];

function pickTopics(count) {
  let used = [];
  try {
    if (fs.existsSync(USED_FILE)) used = JSON.parse(fs.readFileSync(USED_FILE, "utf8"));
  } catch {}

  const available = TOPICS.filter((t) => !used.includes(t.slug));
  if (available.length < count) {
    used = [];
    fs.writeFileSync(USED_FILE, JSON.stringify([], null, 2));
  }

  const picked = [...available].sort(() => Math.random() - 0.5).slice(0, count);
  const newUsed = [...used, ...picked.map((t) => t.slug)].slice(-120);
  fs.writeFileSync(USED_FILE, JSON.stringify(newUsed, null, 2));
  return picked;
}

function randomAuthor() {
  return AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
}

function randomHero() {
  return HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
}

async function generateArticle(topic) {
  const prompt = `You write for SpanishTVShows.com — a site about Spanish-language TV shows and learning Spanish through TV.

Write a detailed SEO article about: "${topic.angle}"

Rules:
- 1200+ words total
- Specific show names, character names, streaming platforms, real statistics
- Direct, useful tone — not fluffy or academic
- H1 title + 5-6 H2 subheadings
- Include specific recommendations and actionable tips
- Mention streaming availability where relevant

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "SEO title under 65 chars",
  "metaDescription": "Compelling meta description under 155 chars",
  "h1": "Article headline (can be longer/more creative than title)",
  "sections": [
    {"h2": "Section heading", "body": "Full section content, 2-4 paragraphs, 200+ words each"}
  ],
  "conclusion": "Strong concluding paragraph with clear takeaway or CTA"
}`;

  const msg = await claude.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");

  try {
    return JSON.parse(match[0]);
  } catch {
    const open = (match[0].match(/\{/g) || []).length;
    const close = (match[0].match(/\}/g) || []).length;
    return JSON.parse(match[0] + "}".repeat(Math.max(0, open - close)));
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[blog-gen] No ANTHROPIC_API_KEY — skipping");
    process.exit(0);
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(USED_FILE), { recursive: true });

  const topics = pickTopics(ARTICLES_PER_RUN);
  console.log(`[blog-gen] Generating ${topics.length} articles...`);

  const now = new Date();
  let count = 0;

  for (const topic of topics) {
    try {
      const article = await generateArticle(topic);
      const author = randomAuthor();

      // Vary publish dates over the past week for natural look
      const date = new Date(now - Math.random() * 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const post = {
        slug: topic.slug,
        title: article.title,
        metaDescription: article.metaDescription,
        h1: article.h1,
        author: author.name,
        authorBio: author.bio,
        authorGradient: author.gradient,
        date,
        heroImageId: randomHero(),
        sections: article.sections || [],
        conclusion: article.conclusion || "",
      };

      fs.writeFileSync(
        path.join(POSTS_DIR, `${topic.slug}.json`),
        JSON.stringify(post, null, 2),
        "utf8"
      );

      count++;
      console.log(`[blog-gen] [${count}/${topics.length}] ${topic.slug}`);
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.error(`[blog-gen] Failed ${topic.slug}: ${err.message}`);
    }
  }

  if (count === 0) {
    console.warn("[blog-gen] No articles generated");
    process.exit(0);
  }

  // Commit and push
  try {
    const dateStr = now.toISOString().split("T")[0];
    execSync("git config user.email 'bot@spanishtvshows.com'", { cwd: ROOT });
    execSync("git config user.name 'spanishtvshows-bot'", { cwd: ROOT });

    const token = process.env.GITHUB_TOKEN;
    if (token) {
      execSync(
        `git remote set-url origin https://${token}@github.com/placebetsai/Spanishtvshows.com.git`,
        { cwd: ROOT }
      );
    }

    execSync("git add content/blog/", { cwd: ROOT });
    execSync(`git commit -m "Add ${count} blog articles (${dateStr})"`, { cwd: ROOT });
    execSync("git push origin main", { cwd: ROOT });
    console.log(`[blog-gen] Pushed ${count} articles`);
  } catch (err) {
    console.error(`[blog-gen] Git error: ${err.message}`);
  }
}

main().catch((err) => {
  console.error("[blog-gen] Fatal:", err.message);
  process.exit(0);
});
