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

  // longest-first so "HBO Max" beats "HBO"
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

export default function NewsTicker() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [runKey, setRunKey] = useState(0);

  // tap-to-pause (mobile)
  const [pausedMobile, setPausedMobile] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (!alive) return;

        const list = Array.isArray(data?.items) ? data.items : [];
        setItems(list.slice(0, 18));

        // Safari: force a clean animation restart after DOM paints
        setReady(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!alive) return;
            setRunKey((k) => k + 1);
            setReady(true);
          });
        });
      } catch {
        if (!alive) return;
        setItems([]);
        setReady(false);
      }
    }

    load();
    const t = setInterval(load, 30 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const contentItems = useMemo(() => items.slice(0, 18), [items]);
  const hasItems = contentItems.length > 0;

  return (
    <div className="tickerRoot" aria-label="Spanish TV entertainment headlines">
      {/* DESKTOP (NO capsule) */}
      <div className="desktopRow">
        <span className="label">NEWS UPDATE:</span>

        <div className="viewport">
          {!hasItems ? (
            <div className="idle">Loading Spanish TV headlines…</div>
          ) : (
            <div
              key={runKey}
              className={`track ${ready ? "run desktopSpeed" : ""}`}
            >
              <div className="content">
                {contentItems.map((it, i) => (
                  <a
                    key={`${it.link}-${i}`}
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                    className="item"
                    title={it.title}
                  >
                    <span className="dot">•</span>
                    <span className="text">{highlightTitle(it.title)}</span>
                  </a>
                ))}
              </div>

              <div className="content" aria-hidden="true">
                {contentItems.map((it, i) => (
                  <a
                    key={`${it.link}-dup-${i}`}
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                    className="item"
                    tabIndex={-1}
                    title={it.title}
                  >
                    <span className="dot">•</span>
                    <span className="text">{highlightTitle(it.title)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE (subtle label + tap-to-pause) */}
      <div className="mobileRow">
        <div className="mobileLabel">
          <span className="mobileDot">•</span>
          <span className="mobileText">News Update</span>
          <span className="tapHint">{pausedMobile ? "Paused" : "Tap to pause"}</span>
        </div>

        <div
          className="viewport"
          role="button"
          aria-label="Tap to pause or resume headlines"
          onClick={() => setPausedMobile((p) => !p)}
        >
          {!hasItems ? (
            <div className="idle">Loading Spanish TV headlines…</div>
          ) : (
            <div
              key={`m-${runKey}`}
              className={`track ${ready ? "run mobileSpeed" : ""} ${
                pausedMobile ? "paused" : ""
              }`}
            >
              <div className="content">
                {contentItems.map((it, i) => (
                  <a
                    key={`${it.link}-m-${i}`}
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                    className="item"
                    title={it.title}
                    onClick={(e) => {
                      // If pausedMobile toggle was intended, allow it; but don't block link taps.
                      // If you want "tap pauses only, second tap opens link", tell me.
                      e.stopPropagation();
                    }}
                  >
                    <span className="dot">•</span>
                    <span className="text">{highlightTitle(it.title)}</span>
                  </a>
                ))}
              </div>

              <div className="content" aria-hidden="true">
                {contentItems.map((it, i) => (
                  <a
                    key={`${it.link}-m-dup-${i}`}
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                    className="item"
                    tabIndex={-1}
                    title={it.title}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="dot">•</span>
                    <span className="text">{highlightTitle(it.title)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .tickerRoot {
          width: 100%;
          background: rgba(0, 0, 0, 0.72);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 5;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        /* DESKTOP */
        .desktopRow {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 16px;
          gap: 12px;
        }

        .label {
          flex: 0 0 auto;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffb000;
          white-space: nowrap;
          line-height: 1;
        }

        /* MOBILE */
        .mobileRow {
          display: none;
          padding: 10px 12px 12px;
        }

        .mobileLabel {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }

        .mobileDot {
          color: #ffb000;
          font-size: 18px;
          line-height: 1;
        }

        .mobileText {
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffb000;
        }

        .tapHint {
          margin-left: auto;
          font-size: 11px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* VIEWPORT + EDGE FADE */
        .viewport {
          flex: 1 1 auto;
          overflow: hidden;
          height: 40px;
          display: flex;
          align-items: center;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          position: relative;
        }

        /* gradient fade edges */
        .viewport::before,
        .viewport::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 44px;
          pointer-events: none;
          z-index: 3;
        }

        .viewport::before {
          left: 0;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.95),
            rgba(0, 0, 0, 0)
          );
        }

        .viewport::after {
          right: 0;
          background: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.95),
            rgba(0, 0, 0, 0)
          );
        }

        .idle {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 800;
          font-size: 14px;
          white-space: nowrap;
        }

        /* TRACK: two identical halves end-to-end, animate -50% */
        .track {
          display: inline-flex;
          width: max-content;
          white-space: nowrap;
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .content {
          display: inline-flex;
          width: max-content;
          align-items: center;
          white-space: nowrap;
        }

        /* start animation only when ready */
        .run.desktopSpeed {
          animation: move 86s linear infinite;
          -webkit-animation: move 86s linear infinite;
        }

        .run.mobileSpeed {
          animation: move 55s linear infinite; /* unchanged */
          -webkit-animation: move 55s linear infinite;
        }

        /* pause on hover (desktop) */
        .desktopRow .viewport:hover .run.desktopSpeed {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }

        /* tap-to-pause (mobile) */
        .paused {
          animation-play-state: paused !important;
          -webkit-animation-play-state: paused !important;
        }

        /* Items: no flex-gap inside animation */
        .item {
          display: inline-flex;
          align-items: center;
          font-weight: 900;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.95);
          text-decoration: none;
          margin-right: 26px;
          line-height: 1.15;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          white-space: nowrap;
        }

        .item:hover {
          color: #ffb000;
        }

        .dot {
          color: #ffb000;
          margin-right: 10px;
          flex: 0 0 auto;
        }

        .text {
          max-width: 75vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }

        /* keyword color pop */
        :global(.kw) {
          color: #ffb000;
          font-weight: 950;
        }

        /* Safari-safe keyframes */
        @-webkit-keyframes move {
          0% {
            -webkit-transform: translate3d(0, 0, 0);
          }
          100% {
            -webkit-transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes move {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (max-width: 768px) {
          .desktopRow {
            display: none;
          }
          .mobileRow {
            display: block;
          }
          .viewport {
            height: 34px;
          }
          .item {
            font-size: 16px;
            font-weight: 900;
          }
          .text {
            max-width: 85vw;
          }
          .viewport::before,
          .viewport::after {
            width: 34px;
          }
        }
      `}</style>
    </div>
  );
}
