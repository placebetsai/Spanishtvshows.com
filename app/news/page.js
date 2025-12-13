"use client";

import { useEffect, useMemo, useState } from "react";

const KEYWORDS = [
  "Netflix",
  "HBO",
  "HBO Max",
  "Max",
  "Telemundo",
  "Univision",
  "ViX",
  "Vix",
  "Prime Video",
  "Amazon",
  "Disney+",
  "Disney Plus",
  "Apple TV+",
  "Apple TV Plus",
];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightTitle(title) {
  const t = String(title || "");
  if (!t) return t;

  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "gi");

  const parts = t.split(pattern);
  return parts.map((part, idx) => {
    if (!part) return null;
    const isKeyword = sorted.some((k) => k.toLowerCase() === part.toLowerCase());
    return isKeyword ? (
      <span key={idx} className="kw">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    );
  });
}

function formatTime(d) {
  try {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function NewsPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [lastUpdated, setLastUpdated] = useState(null);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      setStatus("loading");
      const res = await fetch("/api/news", { cache: "no-store" });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const list = Array.isArray(data?.items) ? data.items : [];
      setItems(list);
      setLastUpdated(new Date());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000); // auto refresh
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      String(it?.title || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="page">
      <header className="top">
        <div className="titleBlock">
          <a className="back" href="/">
            ← Back
          </a>
          <h1 className="h1">Latest Spanish & Latin Entertainment News</h1>
          <p className="sub">
            Live headlines • Auto-refresh • Clean sources (no trash)
          </p>
        </div>

        <div className="controls">
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: Netflix, Telemundo, novelas…"
          />
          <button className="btn" onClick={load} type="button">
            Refresh
          </button>
        </div>

        <div className="meta">
          {status === "error" ? (
            <span className="metaText error">Couldn’t load news right now.</span>
          ) : (
            <span className="metaText">
              {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : "Loading…"}
            </span>
          )}
        </div>
      </header>

      <main className="grid">
        {filtered.map((it, idx) => (
          <a
            key={`${it.link}-${idx}`}
            className="card"
            href={it.link}
            target="_blank"
            rel="noreferrer"
          >
            <div className="cardTop">
              <span className="badge">Headline</span>
              {it.source ? <span className="source">{it.source}</span> : null}
            </div>

            <div className="cardTitle">{highlightTitle(it.title)}</div>

            <div className="cardFooter">
              <span className="open">Open →</span>
            </div>
          </a>
        ))}
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111827, #020617 55%, #000);
          color: #fff;
          padding: 28px 16px 60px;
        }

        .top {
          max-width: 1100px;
          margin: 0 auto 18px;
          padding: 18px 18px 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(12px);
          border-radius: 16px;
        }

        .titleBlock {
          margin-bottom: 12px;
        }

        .back {
          display: inline-block;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          margin-bottom: 10px;
        }

        .back:hover {
          color: #ffb000;
        }

        .h1 {
          font-size: 26px;
          font-weight: 950;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }

        .sub {
          margin: 0;
          color: rgba(255, 255, 255, 0.65);
          font-weight: 700;
          font-size: 13px;
        }

        .controls {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .search {
          flex: 1 1 320px;
          padding: 12px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.35);
          color: #fff;
          outline: none;
          font-weight: 800;
        }

        .search:focus {
          border-color: rgba(255, 176, 0, 0.5);
          box-shadow: 0 0 0 3px rgba(255, 176, 0, 0.18);
        }

        .btn {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 176, 0, 0.35);
          background: rgba(255, 176, 0, 0.18);
          color: #ffb000;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
          cursor: pointer;
        }

        .btn:hover {
          background: rgba(255, 176, 0, 0.26);
        }

        .meta {
          margin-top: 12px;
        }

        .metaText {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
        }

        .error {
          color: rgba(255, 120, 120, 0.9);
        }

        .grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
        }

        .card {
          grid-column: span 6;
          display: block;
          padding: 16px 16px 14px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          text-decoration: none;
          color: #fff;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 176, 0, 0.35);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .badge {
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255, 176, 0, 0.14);
          border: 1px solid rgba(255, 176, 0, 0.30);
          color: #ffb000;
        }

        .source {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }

        .cardTitle {
          font-size: 16px;
          font-weight: 900;
          line-height: 1.25;
          color: rgba(255, 255, 255, 0.95);
        }

        .cardFooter {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
        }

        .open {
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 176, 0, 0.9);
        }

        :global(.kw) {
          color: #ffb000;
          font-weight: 950;
        }

        @media (max-width: 900px) {
          .card {
            grid-column: span 12;
          }
        }
      `}</style>
    </div>
  );
              }
