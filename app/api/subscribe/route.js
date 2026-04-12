import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const webhookUrl = process.env.EMAIL_WEBHOOK_URL;

    // If a webhook URL is configured, POST to it
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "spanishtvshows.com",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        // Webhook failed but don't block the user
        console.error("Webhook failed:", e.message);
      }
    }

    // Also try to save to local JSON file (works in Node.js runtime, not edge)
    try {
      const fs = await import("fs");
      const path = await import("path");
      const dataDir = path.join(process.cwd(), "data");
      const filePath = path.join(dataDir, "subscribers.json");

      // Ensure data directory exists
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      let subscribers = [];
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        subscribers = JSON.parse(raw);
      }

      // Deduplicate
      if (!subscribers.some((s) => s.email === email)) {
        subscribers.push({
          email,
          source: "spanishtvshows.com",
          subscribedAt: new Date().toISOString(),
        });
        fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));
      }
    } catch (e) {
      // fs not available (edge runtime) or write failed — that's ok
      console.error("Local save failed:", e.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
