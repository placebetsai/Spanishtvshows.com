"use client";

import { useEffect, useMemo, useState } from "react";

export default function NewsTicker() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (!alive) return;
        setItems((data.items || []).slice(0, 18));
        setStatus("ready");
      } catch {
        if (!alive) return;
        setItems([]);
        setStatus("error");
      }
    }

    load();
    const t = setInterval(load, 30 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const loopItems = useMemo(
    () => (items.length ? [...items, ...items] : []),
    [items]
  );

  const empty = status !== "ready" || !loopItems.length;

  return (
    <div className="tickerWrap">
      {/* DESKTOP */}
      <div className="tickerDesktop">
        <span className="label">NEWS UPDATE:</span>
        <div className="viewport">
          <div className={`track trackDesktop ${empty ? "idle" : ""}`}>
            {empty ? (
              <span className="item muted">Loading Spanish TV headlines…</span>
            ) : (
              loopItems.map((it, i) => (
                <a
                  key={`${it.link}-${i}`}
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                >
                  <span className="dot">•</span>
                  <span className="text">{it.title}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="tickerMobile">
        <div className="pill">News Update</div>
        <div className="viewport">
          <div className={`track trackMobile ${empty ? "idle" : ""}`}>
            {empty ? (
              <span className="item muted">Loading Spanish TV headlines…</span>
            ) : (
              loopItems.map((it, i) => (
                <a
                  key={`${it.link}-m-${i}`}
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                >
                  <span className="dot">•</span>
                  <span className="text">{it.title}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tickerWrap {
          width: 100%;
          background: rgba(0, 0, 0, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
        }

        /* DESKTOP */
        .tickerDesktop {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .label {
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffb000;
          white-space: nowrap;
          margin-right: 14px; /* no flex gap */
          flex: 0 0 auto;
        }

        /* MOBILE */
        .tickerMobile {
          display: none;
          padding: 12px;
        }

        .pill {
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 176, 0, 0.18);
          border: 1px solid rgba(255, 176, 0, 0.35);
          color: #ffb000;
          margin-bottom: 8px;
          display: inline-block;
        }

        /* SHARED */
        .viewport {
          overflow: hidden;
          width: 100%;
          min-height: 34px; /* more vertical room for bold fonts */
          -webkit-transform: translateZ(0);
        }

        .track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-wrap: nowrap;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
        }

        /* SPEED CONTROL */
        .trackDesktop {
          animation: move 90s linear infinite;
          -webkit-animation: move 90s linear infinite;
        }

        .trackMobile {
          animation: move 70s linear infinite;
          -webkit-animation: move 70s linear infinite;
        }

        .tickerDesktop .viewport:hover .track {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }

        .idle {
          animation: none !important;
          -webkit-animation: none !important;
          transform: none !important;
          -webkit-transform: none !important;
        }

        /* IMPORTANT: no flex-gap; use margins for Safari */
        .item {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.95);
          font-size: 15px;
          font-weight: 900;
          line-height: 1.25; /* prevents overlap */
          margin-right: 26px; /* spacing instead of gap */
          -webkit-transform: translateZ(0);
        }

        .item:hover {
          color: #ffb000;
        }

        .muted {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          margin-right: 0;
        }

        .dot {
          color: #ffb000;
          margin-right: 10px; /* spacing instead of gap */
          flex: 0 0 auto;
        }

        .text {
          display: inline-block;
          max-width: 80vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          .tickerDesktop {
            display: none;
          }
          .tickerMobile {
            display: block;
          }
          .item {
            font-size: 16px;
            font-weight: 900;
          }
        }
      `}</style>
    </div>
  );
}
