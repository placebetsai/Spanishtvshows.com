#!/usr/bin/env node
/**
 * Generate blog articles using Gemini Flash API.
 * Outputs JSON files to content/blog/
 *
 * Usage: GEMINI_API_KEY=xxx node scripts/generate-blog-articles.js
 */

const fs = require("fs");
const path = require("path");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const OUTPUT_DIR = path.join(__dirname, "..", "content", "blog");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ARTICLES = [
  {
    slug: "best-spanish-shows-on-netflix-2026",
    keyword: "best spanish shows on netflix 2026",
    prompt: `Write a 1500+ word SEO article titled "The 15 Best Spanish Shows on Netflix in 2026". Cover the top Spanish-language series currently streaming on Netflix in 2026. For each show, include a brief synopsis, why it's worth watching, and the rating/seasons. Include shows from Spain, Mexico, Colombia, and Argentina. Mention Money Heist, Elite, Vis a Vis, Who Killed Sara, Dark Desire, Control Z, High Seas, Cable Girls, Narcos Mexico, Sky Rojo, Wrong Side of the Tracks, Valeria, and others. End with a tip about using subtitles vs dubbing. Write in an engaging, authoritative editorial voice for English-speaking audiences interested in Spanish TV.`
  },
  {
    slug: "shows-like-money-heist",
    keyword: "shows like money heist",
    prompt: `Write a 1500+ word SEO article titled "12 Shows Like Money Heist (La Casa de Papel) You Need to Watch". For fans who loved Money Heist, recommend 12 similar shows with heist themes, clever protagonists, or intense cat-and-mouse plots. Include both Spanish-language shows (Sky Rojo, Vis a Vis, Elite) and international ones (Lupin, Squid Game) that share DNA with La Casa de Papel. For each show, explain the premise and why Money Heist fans will love it. Write in an engaging editorial voice.`
  },
  {
    slug: "shows-like-elite",
    keyword: "shows like elite",
    prompt: `Write a 1500+ word SEO article titled "10 Shows Like Elite for Your Next Binge". For fans of Netflix's Elite, recommend 10 similar shows featuring teen drama, mystery, class conflict, and twists. Include Spanish shows (Rebelde, Control Z, Valeria) and international picks (Gossip Girl, How to Get Away with Murder, Euphoria). For each, explain the plot and connection to Elite. Write in an engaging editorial tone for English-speaking audiences.`
  },
  {
    slug: "best-telenovelas-of-all-time",
    keyword: "best telenovelas of all time",
    prompt: `Write a 1500+ word SEO article titled "The 20 Best Telenovelas of All Time, Ranked". Cover the greatest telenovelas ever produced, from classics to modern hits. Include Betty La Fea, Rebelde, Pasion de Gavilanes, La Reina del Sur, El Senor de los Cielos, Teresa, Cuna de Lobos, Maria la del Barrio, and others from Mexico, Colombia, Venezuela, and Argentina. Explain what makes telenovelas different from regular TV series. Write in an authoritative editorial voice for English-speaking audiences curious about telenovelas.`
  },
  {
    slug: "best-spanish-crime-shows",
    keyword: "best spanish crime shows",
    prompt: `Write a 1500+ word SEO article titled "The 15 Best Spanish Crime Shows and Thrillers". Cover the top crime and thriller series from Spain and Latin America. Include Money Heist, Vis a Vis, The Innocent, Who Killed Sara, La Casa de las Flores (crime elements), Wrong Side of the Tracks, The Mess You Leave Behind, High Seas, Fariña, Mar de plastico, and more. For each, give synopsis and what makes the crime elements compelling. Write in editorial voice for English-speaking crime drama fans.`
  },
  {
    slug: "best-spanish-comedy-shows",
    keyword: "best spanish comedy shows",
    prompt: `Write a 1500+ word SEO article titled "12 Best Spanish Comedy Shows That Will Make You Laugh". Cover the funniest Spanish-language comedy series. Include La Casa de las Flores, Valeria, Paquita Salas, Los Espookys, Club de Cuervos, El Pueblo, Aqui No Hay Quien Viva, La Que Se Avecina, Merlí, and others. Explain what makes Spanish humor unique. Write in a fun, engaging editorial voice for English-speaking audiences looking for comedy recommendations.`
  },
  {
    slug: "spanish-shows-with-english-subtitles",
    keyword: "spanish shows with english subtitles",
    prompt: `Write a 1500+ word SEO article titled "Best Spanish Shows with English Subtitles: Where to Watch Them". Guide English-speaking viewers on how to find and watch Spanish TV with English subtitles. Cover which streaming platforms (Netflix, HBO Max, Amazon Prime, Tubi) offer the best subtitle support. Recommend 15+ shows that are perfect for subtitle viewing. Discuss subtitles vs dubbing pros/cons. Include tips for getting started with Spanish TV if you've never watched foreign-language content before. Write in a helpful editorial voice.`
  },
  {
    slug: "how-to-learn-spanish-watching-tv",
    keyword: "how to learn spanish watching tv",
    prompt: `Write a 1500+ word SEO article titled "How to Learn Spanish by Watching TV Shows: A Complete Guide". Provide a practical guide for using Spanish TV shows as a language-learning tool. Cover the science behind learning languages through immersion media. Recommend specific shows for beginners, intermediate, and advanced learners. Discuss subtitle strategies (Spanish subs, English subs, no subs). Include specific tips like keeping a vocabulary notebook, the 80/20 rule of comprehension, and recommended apps to pair with TV watching. Mention shows like Extra en Espanol, Destinos, Money Heist, and Club de Cuervos. Write in an educational but engaging voice.`
  },
  {
    slug: "best-argentine-shows",
    keyword: "best argentine shows",
    prompt: `Write a 1500+ word SEO article titled "The 12 Best Argentine TV Shows You Should Be Watching". Cover the best TV series from Argentina. Include El Marginal, Los Simuladores, Okupas, El Encargado, Terapia Alternativa, Epitafios, Casi Angeles, Mujeres Asesinas, and others. Discuss what makes Argentine TV distinct (dark humor, social commentary, Buenos Aires setting, Rioplatense Spanish). Write in an engaging editorial voice for English-speaking audiences discovering Argentine television.`
  },
  {
    slug: "best-mexican-shows-on-netflix",
    keyword: "best mexican shows on netflix",
    prompt: `Write a 1500+ word SEO article titled "The 15 Best Mexican Shows on Netflix Right Now". Cover the top Mexican series streaming on Netflix in 2026. Include Who Killed Sara, Dark Desire, Control Z, Club de Cuervos, La Casa de las Flores, Rebelde, Monarca, Ingobernable, Luis Miguel, Somos, and more. Discuss Mexico's growing role in Netflix's international content strategy. Write in an engaging editorial voice for English-speaking audiences.`
  },
  {
    slug: "best-colombian-shows",
    keyword: "best colombian shows",
    prompt: `Write a 1500+ word SEO article titled "The 12 Best Colombian TV Shows to Stream Now". Cover the best series from Colombia. Include Narcos, Betty La Fea, La Reina del Sur, Distrito Salvaje, Siempre Bruja, Chichipatos, El Robo del Siglo, Green Frontier, The Queen of Flow, Surviving Escobar, and others. Discuss Colombia's TV industry and unique storytelling traditions. Write in an engaging editorial voice for English-speaking audiences.`
  },
  {
    slug: "la-casa-de-papel-review",
    keyword: "la casa de papel review",
    prompt: `Write a 1500+ word SEO article titled "La Casa de Papel (Money Heist) Review: Why It Became a Global Phenomenon". Provide a comprehensive review of all 5 parts of Money Heist. Cover the plot (without major spoilers), character analysis (The Professor, Tokyo, Berlin, Nairobi), the show's evolution from Spanish TV to Netflix global hit, cultural impact, and legacy. Discuss what worked and what didn't in later seasons. Rate it overall and recommend who should watch it. Write in a critical but enthusiastic editorial review voice.`
  },
  {
    slug: "elite-show-review",
    keyword: "elite show review",
    prompt: `Write a 1500+ word SEO article titled "Elite Review: Is Netflix's Spanish Teen Drama Worth Watching?". Provide a comprehensive review of all seasons of Elite. Cover the premise (working-class students at elite school), character dynamics, the murder mystery format, LGBTQ+ representation, and how the show evolved across seasons. Discuss which seasons are strongest, where it falls off, and whether to keep watching. Rate it and say who it's for. Write in an honest editorial review voice.`
  },
  {
    slug: "narcos-vs-narcos-mexico-comparison",
    keyword: "narcos vs narcos mexico comparison",
    prompt: `Write a 1500+ word SEO article titled "Narcos vs. Narcos: Mexico — Which Series Is Better?". Compare the two Narcos series in detail. Cover setting (Colombia vs Mexico), protagonists (Escobar/Cali cartel vs Gallardo/Arellano Felix), storytelling approach, historical accuracy, acting performances, tone, and which is more rewatchable. Include a season-by-season breakdown. Give your verdict on which is better overall and in specific categories. Write in an opinionated but fair editorial comparison voice.`
  },
  {
    slug: "best-spanish-horror-shows",
    keyword: "best spanish horror shows",
    prompt: `Write a 1500+ word SEO article titled "The 10 Best Spanish Horror Shows That Will Keep You Up at Night". Cover the best horror and supernatural series from Spain and Latin America. Include 30 Coins (30 Monedas), Veronica, The Head, Alma, Hache, Diablero, Siempre Bruja, Los Favoritos de Midas, Welcome to Eden, and others. Discuss Spain's rich horror tradition (from Guillermo del Toro to J.A. Bayona) and how it translates to TV. Write in an atmospheric editorial voice for horror fans.`
  },
  {
    slug: "spanish-shows-for-beginners",
    keyword: "spanish shows for beginners",
    prompt: `Write a 1500+ word SEO article titled "10 Easy Spanish Shows for Beginners Learning the Language". Recommend 10 Spanish TV shows perfect for people just starting to learn Spanish. Include shows with clear dialogue, slow pacing, and simple vocabulary. Cover Extra en Espanol, Destinos, Club de Cuervos, La Casa de las Flores, and others. For each, explain why it's beginner-friendly (clear accents, simple plots, available subtitles). Include a viewing strategy guide for absolute beginners. Write in a helpful, encouraging editorial voice.`
  },
  {
    slug: "best-spanish-thriller-shows-2026",
    keyword: "best spanish thriller shows 2026",
    prompt: `Write a 1500+ word SEO article titled "The 12 Best Spanish Thriller Shows to Watch in 2026". Cover the top thriller series from Spain and Latin America available in 2026. Include new releases and returning favorites. Cover The Innocent, The Mess You Leave Behind, Wrong Side of the Tracks, Jaguar, High Seas, Fariña, Who Killed Sara, and others. Focus on tension, plot twists, and binge-worthiness. Write in an engaging editorial voice for thriller fans.`
  },
  {
    slug: "vis-a-vis-review",
    keyword: "vis a vis review",
    prompt: `Write a 1500+ word SEO article titled "Vis a Vis (Locked Up) Review: Spain's Answer to Orange Is the New Black". Review all seasons of Vis a Vis plus the spinoff El Oasis. Cover the premise (innocent woman thrown into brutal women's prison), character analysis (Macarena, Zulema), comparison with OITNB, what makes it uniquely Spanish, and the show's cult following. Discuss the tonal shifts between seasons and the spinoff quality. Rate it and recommend who should watch. Write in an engaging editorial review voice.`
  },
  {
    slug: "best-short-spanish-series",
    keyword: "best short spanish series",
    prompt: `Write a 1500+ word SEO article titled "15 Best Short Spanish Series You Can Finish in a Weekend". Recommend 15 Spanish-language series with 1-2 seasons or limited runs that are perfect for weekend binges. Include The Innocent (8 episodes), The Mess You Leave Behind (8 episodes), Alma, Welcome to Eden S1, Jaguar, Grand Hotel mini-arcs, and others. For each, give episode count, total runtime, and why it's worth your weekend. Write in an engaging editorial voice for busy viewers.`
  },
  {
    slug: "upcoming-spanish-shows-2026",
    keyword: "upcoming spanish shows 2026",
    prompt: `Write a 1500+ word SEO article titled "Most Anticipated Spanish Shows Coming in 2026". Cover the most anticipated upcoming Spanish-language TV series for 2026. Include new seasons of popular shows, brand new series from Netflix, HBO Max, Amazon Prime, and Spanish/Latin American networks. Discuss trends in Spanish TV production (bigger budgets, international co-productions, genre diversity). Speculate on what genres are growing. Mention any casting news or trailer releases. Write in an excited, forward-looking editorial voice.`
  }
];

async function generateArticle(article) {
  const systemPrompt = `You are an expert entertainment journalist writing for SpanishTVShows.com, a website dedicated to Spanish-language television for English-speaking audiences.

IMPORTANT FORMATTING RULES:
- Return ONLY valid JSON, no markdown code fences
- The JSON must have these exact fields: title, metaDescription, content
- "title" is the SEO title (60-70 chars)
- "metaDescription" is the meta description (150-160 chars)
- "content" is the full article in HTML format (use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags)
- Write 1500+ words minimum
- Include 3-5 <h2> subheadings throughout the article
- DO NOT include <h1> (we add that separately)
- DO NOT include any preamble, explanation, or markdown — just the raw JSON object
- The article should be written in 2026, referencing current shows
- Naturally mention that readers can find show pages on SpanishTVShows.com`;

  const body = {
    contents: [
      {
        parts: [
          { text: systemPrompt + "\n\n" + article.prompt + "\n\nReturn ONLY the JSON object, nothing else." }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error(`No content returned for ${article.slug}`);
  }

  // Parse JSON — strip any markdown fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleaned);
  return parsed;
}

async function main() {
  console.log(`Generating ${ARTICLES.length} blog articles using Gemini Flash...\n`);

  const results = [];

  for (let i = 0; i < ARTICLES.length; i++) {
    const article = ARTICLES[i];
    console.log(`[${i + 1}/${ARTICLES.length}] Generating: ${article.slug}`);

    try {
      const content = await generateArticle(article);

      const blogPost = {
        slug: article.slug,
        keyword: article.keyword,
        title: content.title,
        metaDescription: content.metaDescription,
        content: content.content,
        publishedAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        author: "SpanishTVShows Editorial",
        generatedBy: "gemini-2.0-flash"
      };

      const outPath = path.join(OUTPUT_DIR, `${article.slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(blogPost, null, 2));
      results.push(blogPost);
      console.log(`  -> Saved: ${outPath}`);

      // Rate limit: wait 1.5s between requests
      if (i < ARTICLES.length - 1) {
        await new Promise(r => setTimeout(r, 1500));
      }
    } catch (err) {
      console.error(`  !! FAILED: ${article.slug} — ${err.message}`);
    }
  }

  // Write index file with all articles metadata
  const index = results.map(r => ({
    slug: r.slug,
    keyword: r.keyword,
    title: r.title,
    metaDescription: r.metaDescription,
    publishedAt: r.publishedAt,
    author: r.author
  }));

  const indexPath = path.join(OUTPUT_DIR, "_index.json");
  fs.writeFileSync(indexPath, JSON.stringify({ articles: index }, null, 2));
  console.log(`\nIndex written to ${indexPath}`);
  console.log(`Successfully generated ${results.length}/${ARTICLES.length} articles.`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
