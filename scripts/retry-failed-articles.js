#!/usr/bin/env node
/**
 * Retry failed blog articles with exponential backoff.
 */

const fs = require("fs");
const path = require("path");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const OUTPUT_DIR = path.join(__dirname, "..", "content", "blog");

const FAILED_ARTICLES = [
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
    slug: "best-spanish-crime-shows-guide",
    keyword: "best spanish crime shows",
    prompt: `Write a 1500+ word SEO article titled "The 15 Best Spanish Crime Shows and Thrillers". Cover the top crime and thriller series from Spain and Latin America. Include Money Heist, Vis a Vis, The Innocent, Who Killed Sara, Wrong Side of the Tracks, The Mess You Leave Behind, High Seas, Farina, and more. For each, give synopsis and what makes the crime elements compelling. Write in editorial voice for English-speaking crime drama fans.`
  },
  {
    slug: "best-spanish-comedy-shows",
    keyword: "best spanish comedy shows",
    prompt: `Write a 1500+ word SEO article titled "12 Best Spanish Comedy Shows That Will Make You Laugh". Cover the funniest Spanish-language comedy series. Include La Casa de las Flores, Valeria, Paquita Salas, Los Espookys, Club de Cuervos, El Pueblo, Aqui No Hay Quien Viva, La Que Se Avecina, Merli, and others. Explain what makes Spanish humor unique. Write in a fun, engaging editorial voice for English-speaking audiences looking for comedy recommendations.`
  },
  {
    slug: "spanish-shows-with-english-subtitles",
    keyword: "spanish shows with english subtitles",
    prompt: `Write a 1500+ word SEO article titled "Best Spanish Shows with English Subtitles: Where to Watch Them". Guide English-speaking viewers on how to find and watch Spanish TV with English subtitles. Cover which streaming platforms (Netflix, HBO Max, Amazon Prime, Tubi) offer the best subtitle support. Recommend 15+ shows that are perfect for subtitle viewing. Discuss subtitles vs dubbing pros/cons. Write in a helpful editorial voice.`
  },
  {
    slug: "how-to-learn-spanish-watching-tv",
    keyword: "how to learn spanish watching tv",
    prompt: `Write a 1500+ word SEO article titled "How to Learn Spanish by Watching TV Shows: A Complete Guide". Provide a practical guide for using Spanish TV shows as a language-learning tool. Cover the science behind learning languages through immersion media. Recommend specific shows for beginners, intermediate, and advanced learners. Discuss subtitle strategies. Include specific tips like keeping a vocabulary notebook. Mention shows like Extra en Espanol, Destinos, Money Heist, and Club de Cuervos. Write in an educational but engaging voice.`
  },
  {
    slug: "best-argentine-shows",
    keyword: "best argentine shows",
    prompt: `Write a 1500+ word SEO article titled "The 12 Best Argentine TV Shows You Should Be Watching". Cover the best TV series from Argentina. Include El Marginal, Los Simuladores, Okupas, El Encargado, Terapia Alternativa, Epitafios, Casi Angeles, Mujeres Asesinas, and others. Discuss what makes Argentine TV distinct (dark humor, social commentary, Buenos Aires setting, Rioplatense Spanish). Write in an engaging editorial voice for English-speaking audiences discovering Argentine television.`
  },
  {
    slug: "narcos-vs-narcos-mexico-comparison",
    keyword: "narcos vs narcos mexico comparison",
    prompt: `Write a 1500+ word SEO article titled "Narcos vs. Narcos: Mexico - Which Series Is Better?". Compare the two Narcos series in detail. Cover setting (Colombia vs Mexico), protagonists (Escobar/Cali cartel vs Gallardo/Arellano Felix), storytelling approach, historical accuracy, acting performances, tone, and which is more rewatchable. Give your verdict on which is better overall and in specific categories. Write in an opinionated but fair editorial comparison voice.`
  },
  {
    slug: "best-spanish-horror-shows",
    keyword: "best spanish horror shows",
    prompt: `Write a 1500+ word SEO article titled "The 10 Best Spanish Horror Shows That Will Keep You Up at Night". Cover the best horror and supernatural series from Spain and Latin America. Include 30 Coins (30 Monedas), The Head, Alma, Diablero, Siempre Bruja, Welcome to Eden, and others. Discuss Spain's rich horror tradition and how it translates to TV. Write in an atmospheric editorial voice for horror fans.`
  },
  {
    slug: "spanish-shows-for-beginners",
    keyword: "spanish shows for beginners",
    prompt: `Write a 1500+ word SEO article titled "10 Easy Spanish Shows for Beginners Learning the Language". Recommend 10 Spanish TV shows perfect for people just starting to learn Spanish. Include shows with clear dialogue, slow pacing, and simple vocabulary. Cover Extra en Espanol, Destinos, Club de Cuervos, La Casa de las Flores, and others. For each, explain why it is beginner-friendly. Include a viewing strategy guide for absolute beginners. Write in a helpful, encouraging editorial voice.`
  }
];

async function generateWithRetry(article, maxRetries = 3) {
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
- DO NOT include any preamble, explanation, or markdown - just the raw JSON object
- The article should be written in 2026, referencing current shows
- Naturally mention that readers can find show pages on SpanishTVShows.com
- IMPORTANT: Keep all strings properly escaped for JSON. Do not use unescaped quotes inside strings.`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const body = {
        contents: [
          {
            parts: [
              { text: systemPrompt + "\n\n" + article.prompt + "\n\nReturn ONLY the JSON object, nothing else." }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      };

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.status === 503 || res.status === 429) {
        const waitTime = Math.pow(2, attempt) * 3000;
        console.log(`    Rate limited (${res.status}), waiting ${waitTime / 1000}s...`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("No content returned");

      let cleaned = rawText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      console.log(`    Attempt ${attempt}/${maxRetries} failed: ${err.message.slice(0, 100)}`);
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 2000;
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  console.log(`Retrying ${FAILED_ARTICLES.length} failed articles...\n`);

  const allResults = [];

  // Load existing index
  let existingIndex = [];
  try {
    const existing = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, "_index.json"), "utf-8"));
    existingIndex = existing.articles || [];
  } catch {}

  for (let i = 0; i < FAILED_ARTICLES.length; i++) {
    const article = FAILED_ARTICLES[i];
    console.log(`[${i + 1}/${FAILED_ARTICLES.length}] Retrying: ${article.slug}`);

    try {
      const content = await generateWithRetry(article);

      const blogPost = {
        slug: article.slug,
        keyword: article.keyword,
        title: content.title,
        metaDescription: content.metaDescription,
        content: content.content,
        publishedAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        author: "SpanishTVShows Editorial",
        generatedBy: "gemini-2.5-flash"
      };

      const outPath = path.join(OUTPUT_DIR, `${article.slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(blogPost, null, 2));
      allResults.push(blogPost);
      console.log(`  -> Saved: ${outPath}`);

      // Wait between requests
      if (i < FAILED_ARTICLES.length - 1) {
        await new Promise(r => setTimeout(r, 3000));
      }
    } catch (err) {
      console.error(`  !! FAILED after retries: ${article.slug} — ${err.message.slice(0, 150)}`);
    }
  }

  // Merge with existing index
  const newEntries = allResults.map(r => ({
    slug: r.slug,
    keyword: r.keyword,
    title: r.title,
    metaDescription: r.metaDescription,
    publishedAt: r.publishedAt,
    author: r.author
  }));

  const mergedIndex = [...existingIndex, ...newEntries];
  const indexPath = path.join(OUTPUT_DIR, "_index.json");
  fs.writeFileSync(indexPath, JSON.stringify({ articles: mergedIndex }, null, 2));
  console.log(`\nIndex updated: ${mergedIndex.length} total articles.`);
  console.log(`Successfully retried ${allResults.length}/${FAILED_ARTICLES.length} articles.`);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
