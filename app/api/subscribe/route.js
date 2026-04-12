import { NextResponse } from "next/server";

export const runtime = "edge";

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

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
