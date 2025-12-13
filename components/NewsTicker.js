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
        setItems(list.slice(0, 18));
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

  const loopItems = useMemo(() => {
    if (!items.length) return [];
    return [...items, ...items];
  }, [items]);

  const isEmpty = status !== "ready" || loopItems.length === 0;

  return (
    <div className="tickerWrap" aria-label="Spanish TV entertainment headlines">
      {/* DESKTOP */}
      <div className="tickerDesktop">
        <div className="label">News Update:</div>
        <div className="viewport">
          <div className={`track trackDesktop ${isEmpty ? "trackIdle" : ""}`}>
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
          <div className={`track trackMobile ${isEmpty ? "trackIdle" : ""}`}>
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
        }

        /* ---------- DESKTOP ---------- */
        .tickerDesktop {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .label {
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 176, 0, 0.18);
          border: 1px solid rgba(255, 176, 0, 0.35);
          color: #ffb000;
          white-space: nowrap;
        }

        /* ---------- MOBILE ---------- */
        .tickerMobile {
          display: none;
          padding: 12px;
        }

        .pill {
          display: inline-flex;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 176, 0, 0.18);
          border: 1px solid rgba(255, 176, 0, 0.35);
          color: #ffb000;
          margin-bottom: 8px;
        }

        /* ---------- SHARED ---------- */
        .viewport {
          overflow: hidden;
          width: 100%;
          min-height: 28px;
        }

        .track {
          display: inline-flex;
          align-items: center;
          gap: 22px;
          white-space: nowrap;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        /* SPEED CONTROL */
        .trackDesktop {
          animation: tickerMove 90s linear infinite;
          -webkit-animation: tickerMove 90s linear infinite;
        }

        .trackMobile {
          animation: tickerMove 70s linear infinite;
          -webkit-animation: tickerMove 70s linear infinite;
        }

        .tickerDesktop .viewport:hover .track {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }

        .trackIdle {
          animation: none !important;
          transform: none !important;
        }

        .item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 15px; /* BIGGER */
          font-weight: 800; /* BOLDER */
          color: rgba(255, 255, 255, 0.92);
          text-decoration: none;
        }

        .item:hover {
          color: #ffb000;
        }

        .muted {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
        }

        .dot {
          color: #ffb000;
        }

        .text {
          max-width: 75vw;
        }

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
          .item {
            font-size: 16px; /* EXTRA BIG on mobile */
            font-weight: 900;
          }
        }
      `}</style>
    </div>
  );
}
