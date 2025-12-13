"use client";

import { useEffect, useMemo, useState } from "react";

export default function NewsTicker() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setStatus("loading");
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (!alive) return;

        const list = Array.isArray(data?.items) ? data.items : [];
        setItems(list.slice(0, 18)); // keep it tight for performance
        setStatus("ready");
      } catch (e) {
        if (!alive) return;
        setItems([]);
        setStatus("error");
      }
    }

    load();
    // refresh every 30 min (the API is cached anyway; this just keeps UI fresh)
    const t = setInterval(load, 30 * 60 * 1000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  // duplicate for seamless loop (prevents blank gaps on mobile)
  const loopItems = useMemo(() => {
    if (!items.length) return [];
    return [...items, ...items];
  }, [items]);

  const isEmpty = status !== "ready" || loopItems.length === 0;

  return (
    <div className="tickerWrap" aria-label="Spanish TV entertainment headlines">
      {/* Desktop inline label + flowing feed */}
      <div className="tickerDesktop">
        <div className="label">News Update:</div>

        <div className="viewport" role="marquee" aria-live="polite">
          <div className={`track ${isEmpty ? "trackIdle" : ""}`}>
            {isEmpty ? (
              <span className="item muted">
                Loading Spanish & Latin entertainment headlines…
              </span>
            ) : (
              loopItems.map((it, idx) => (
                <a
                  key={`${it.link}-${idx}`}
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                  title={it.source ? `Source: ${it.source}` : undefined}
                >
                  <span className="dot">•</span>
                  <span className="text">{it.title}</span>
                  {it.source ? <span className="src">({it.source})</span> : null}
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile pill above-left + feed below */}
      <div className="tickerMobile">
        <div className="pill">News Update</div>
        <div className="viewport" role="marquee" aria-live="polite">
          <div className={`track ${isEmpty ? "trackIdle" : ""}`}>
            {isEmpty ? (
              <span className="item muted">
                Loading Spanish & Latin entertainment headlines…
              </span>
            ) : (
              loopItems.map((it, idx) => (
                <a
                  key={`${it.link}-m-${idx}`}
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                  title={it.source ? `Source: ${it.source}` : undefined}
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
          background: rgba(0, 0, 0, 0.65);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
        }

        .tickerDesktop {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .label {
          flex: 0 0 auto;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255, 176, 0, 0.18);
          border: 1px solid rgba(255, 176, 0, 0.35);
          color: #ffb000; /* amber */
          white-space: nowrap;
        }

        .tickerMobile {
          display: none;
          padding: 10px 12px 12px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255, 176, 0, 0.18);
          border: 1px solid rgba(255, 176, 0, 0.35);
          color: #ffb000;
          margin-bottom: 8px;
        }

        .viewport {
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 22px;
        }

        .track {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          white-space: nowrap;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          animation: tickerMove 70s linear infinite;
          -webkit-animation: tickerMove 70s linear infinite;
        }

        /* pauses on hover for desktop */
        .tickerDesktop .viewport:hover .track {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }

        .trackIdle {
          animation: none !important;
          -webkit-animation: none !important;
          transform: none !important;
        }

        .item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
        }

        .item:hover {
          color: #ffb000; /* amber hover */
        }

        .muted {
          color: rgba(255, 255, 255, 0.55);
        }

        .dot {
          color: rgba(255, 176, 0, 0.95);
          transform: translateY(-1px);
        }

        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70vw;
        }

        .src {
          color: rgba(255, 255, 255, 0.55);
          font-size: 11px;
        }

        /* Safari-safe keyframes: translate3d + -webkit-keyframes */
        @-webkit-keyframes tickerMove {
          0% {
            -webkit-transform: translate3d(0, 0, 0);
          }
          100% {
            -webkit-transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes tickerMove {
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
          .text {
            max-width: 80vw;
          }
        }
      `}</style>
    </div>
  );
}

