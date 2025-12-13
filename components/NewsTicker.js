"use client";

import { useEffect, useMemo, useState } from "react";

export default function NewsTicker() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [animKey, setAnimKey] = useState(0); // forces Safari to restart animation reliably

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

        // Safari sometimes needs a re-mount to start animating
        setAnimKey((k) => k + 1);
      } catch {
        if (!alive) return;
        setItems([]);
        setStatus("error");
        setAnimKey((k) => k + 1);
      }
    }

    load();
    const t = setInterval(load, 30 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const ready = status === "ready" && items.length > 0;

  // Build ONE content list (not duplicated here). We duplicate in the DOM as two blocks.
  const contentItems = useMemo(() => items.slice(0, 18), [items]);

  return (
    <div className="tickerWrap" aria-label="Spanish TV entertainment headlines">
      {/* DESKTOP (no capsule) */}
      <div className="tickerDesktop">
        <span className="label">NEWS UPDATE:</span>

        <div className="viewport">
          {ready ? (
            <div key={animKey} className="track trackDesktop">
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
          ) : (
            <div className="idleRow">
              <span className="item muted">Loading Spanish TV headlines…</span>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE (capsule stays) */}
      <div className="tickerMobile">
        <div className="pill">News Update</div>

        <div className="viewport">
          {ready ? (
            <div key={`m-${animKey}`} className="track trackMobile">
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
          ) : (
            <div className="idleRow">
              <span className="item muted">Loading Spanish TV headlines…</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .tickerWrap {
          width: 100%;
          background: rgba(0, 0, 0, 0.72);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
        }

        /* DESKTOP */
        .tickerDesktop {
          display: flex;
          align-items: center;
          gap: 12px; /* safe here; not inside animated track */
          padding: 12px 18px;
          width: 100%;
        }

        .label {
          flex: 0 0 auto;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffb000; /* amber */
          white-space: nowrap;
          line-height: 1; /* fixes alignment weirdness */
          padding-top: 1px; /* micro baseline nudge */
        }

        /* MOBILE */
        .tickerMobile {
          display: none;
          padding: 12px;
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
          min-height: 34px;
          position: relative;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }

        .idleRow {
          display: flex;
          align-items: center;
          height: 34px;
        }

        /* TRACK (Safari-safe marquee pattern)
           - track is 200% width (two identical blocks)
           - animate -50% so it loops seamlessly */
        .track {
          display: flex;
          width: 200%;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .content {
          width: 50%;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }

        /* SPEED */
        .trackDesktop {
          animation: move 60s linear infinite;
          -webkit-animation: move 60s linear infinite;
        }

        .trackMobile {
          animation: move 70s linear infinite;
          -webkit-animation: move 70s linear infinite;
        }

        /* Pause on hover (desktop only) */
        .tickerDesktop .viewport:hover .trackDesktop {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }

        /* ITEMS (NO gap inside animated flex — Safari stacks/overlaps) */
        .item {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 900;
          line-height: 1.25;
          font-size: 15px;
          margin-right: 26px; /* spacing (Safari-safe) */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .item:hover {
          color: #ffb000;
        }

        .muted {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 800;
          font-size: 14px;
          margin-right: 0;
        }

        .dot {
          color: #ffb000;
          margin-right: 10px;
          flex: 0 0 auto;
        }

        .text {
          display: inline-block;
          max-width: 75vw;
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
          .text {
            max-width: 85vw;
          }
        }
      `}</style>
    </div>
  );
}
