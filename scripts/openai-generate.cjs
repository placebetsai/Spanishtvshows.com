// scripts/openai-generate.cjs
async function generateHtml({ title, showName, similarShows }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const prompt = `
Write an SEO article in VALID HTML only.

TITLE: ${title}
Audience: streaming viewers deciding what to watch next.
Tone: confident, modern, helpful (not cringe).

Rules:
- 900–1200 words
- Use <h2> sections
- Include a short intro (2–4 sentences)
- Include a list of 6 similar Spanish-language TV shows (use the provided list)
- Include a "Where to Watch" section (no outbound links)
- Include an FAQ with 3 questions
- Do NOT mention AI
- Output ONLY HTML (no markdown fences)

SHOW: ${showName}

SIMILAR SHOWS (use these exact names):
${similarShows.map((x) => `- ${x}`).join("\n")}
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: "You write clean entertainment articles in valid HTML." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const html = json.choices?.[0]?.message?.content?.trim() || "";
  if (!html.startsWith("<")) throw new Error("Model did not return HTML.");
  return html;
}

module.exports = { generateHtml };
