"use client";

import { useState } from "react";

export default function NewsletterSignup({ className = "" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center ${className}`}>
        <p className="text-green-400 font-black text-sm">
          You're in! We'll send you the best Spanish TV picks.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-gray-800/60 bg-black/70 p-6 md:p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">📬</span>
        <h3 className="text-lg font-black">Get the Best Shows in Your Inbox</h3>
      </div>
      <p className="text-gray-400 text-sm mb-5 leading-relaxed">
        Weekly picks, new releases, and hidden gems. No spam, unsubscribe anytime.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 rounded-lg bg-neon text-black font-black text-sm hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-red-400 text-xs mt-3">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
