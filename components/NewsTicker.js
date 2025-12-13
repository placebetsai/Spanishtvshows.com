"use client";

import { useEffect, useMemo, useState } from "react";

export default function NewsTicker() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [runKey, setRunKey] = useState(0);

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
                  >
                    <span className="dot">•</span>
                    <span className="text">{it.title}</span>
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
                  >
                    <span className="dot">•</span>
                    <span className="text">{it.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE (capsule stays) */}
      <div className="mobileRow">
        <div className="pill">News Update</div>

        <div className="viewport">
          {!hasItems ? (
            <div className="idle">Loading Spanish TV headlines…</div>
          ) : (
            <div
              key={`m-${runKey}`}
              className={`track ${ready ? "run mobileSpeed" : ""}`}
            >
              <div className="content">
                {contentItems.map((it, i) => (
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
                  >
                    <span className="dot">•</span>
                    <span className="text">{it.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* NO margin-top. No black gap. */
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

        .pill {
          display: inline-block;
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
        }

        /* VIEWPORT */
        .viewport {
          flex: 1 1 auto;
          overflow: hidden;
          height: 40px;
          display: flex;
          align-items: center;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
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

        /* Start animation only when ready (prevents Safari vanish) */
        .run.desktopSpeed {
          animation: move 80s linear infinite;
          -webkit-animation: move 80s linear infinite;
        }

        .run.mobileSpeed {
          animation: move 55s linear infinite;
          -webkit-animation: move 55s linear infinite;
        }

        /* Pause on hover desktop */
        .desktopRow .viewport:hover .run.desktopSpeed {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }

        /* Items: no flex-gap inside animation (Safari hates it) */
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
        }
      `}</style>
    </div>
  );
}
