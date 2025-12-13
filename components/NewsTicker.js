"use client";

import { useEffect, useMemo, useState } from "react";

export default function NewsTicker() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [animKey, setAnimKey] = useState(0);

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
        setAnimKey((k) => k + 1); // kick Safari
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
  const contentItems = useMemo(() => items.slice(0, 18), [items]);

  function ContentBlock({ ariaHidden, tabIndex }) {
    return (
      <div className="content" aria-hidden={ariaHidden}>
        {contentItems.map((it, i) => (
          <a
            key={`${it.link}-${ariaHidden ? "dup" : "a"}-${i}`}
            href={it.link}
            target="_blank"
            rel="noreferrer"
            className="item"
            tabIndex={tabIndex}
          >
            <span className="dot">•</span>
            <span className="text">{it.title}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="tickerWrap" aria-label="Spanish TV entertainment headlines">
      {/* DESKTOP */}
      <div className="tickerDesktop">
        <span className="label">NEWS UPDATE:</span>

        <div className="viewport">
          {ready ? (
            <div key={animKey} className="track trackDesktop">
              <ContentBlock ariaHidden={false} tabIndex={0} />
              <ContentBlock ariaHidden={true} tabIndex={-1} />
            </div>
          ) : (
            <div className="idleRow">
              <span className="item muted">Loading Spanish TV headlines…</span>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE */}
      <div className="tickerMobile">
        <div className="pill">News Update</div>

        <div className="viewport">
          {ready ? (
            <div key={`m-${animKey}`} className="track trackMobile">
              <ContentBlock ariaHidden={false} tabIndex={0} />
              <ContentBlock ariaHidden={true} tabIndex={-1} />
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

        /* DESKTOP ROW: lock alignment */
        .tickerDesktop {
          display: flex;
          align-items: center; /* key */
          padding: 0 18px; /* vertical handled by fixed height */
          height: 44px; /* key: same row height every time */
          width: 100%;
        }

        .label {
          flex: 0 0 auto;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffb000;
          white-space: nowrap;
          line-height: 44px; /* key: matches row height */
          margin-right: 14px;
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

        /* VIEWPORT: center the animated line vertically */
        .viewport {
          flex: 1 1 auto;
          overflow: hidden;
          height: 44px; /* same as row */
          display: flex; /* key */
          align-items: center; /* key */
          position: relative;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .idleRow {
          display: flex;
          align-items: center;
          height: 44px;
        }

        /* TRACK */
        .track {
          display: inline-flex;
          width: max-content;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .content {
          display: inline-flex;
          width: max-content;
          white-space: nowrap;
          align-items: center; /* key */
        }

        .trackDesktop {
          animation: move 60s linear infinite;
          -webkit-animation: move 60s linear infinite;
        }

        .trackMobile {
          animation: move 50s linear infinite;
          -webkit-animation: move 50s linear infinite;
        }

        .tickerDesktop .viewport:hover .trackDesktop {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }

        /* ITEMS: match row vertical rhythm */
        .item {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 900;
          font-size: 15px;
          line-height: 44px; /* key: aligns with label */
          margin-right: 26px;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          white-space: nowrap;
        }

        .item:hover {
          color: #ffb000;
        }

        .muted {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 800;
          font-size: 14px;
          margin-right: 0;
          line-height: 44px;
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
          .viewport {
            height: 34px;
          }
          .item {
            font-size: 16px;
            font-weight: 900;
            line-height: 1.25;
          }
          .text {
            max-width: 85vw;
          }
        }
      `}</style>
    </div>
  );
}
