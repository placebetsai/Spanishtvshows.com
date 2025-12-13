"use client";

import { useEffect, useState } from "react";

export default function NewsTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="ticker-root">
      <div className="ticker-row">
        <span className="ticker-label">NEWS UPDATE:</span>

        <div className="ticker-viewport">
          <div className="ticker-track">
            {[...items, ...items].map((it, i) => (
              <a
                key={i}
                href={it.link}
                target="_blank"
                rel="noreferrer"
                className="ticker-item"
              >
                • {it.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ROOT — sits BELOW sticky header */
        .ticker-root {
          position: relative;
          z-index: 20;
          background: rgba(0, 0, 0, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: 64px; /* 👈 HEADER HEIGHT — adjust if needed */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        /* ROW */
        .ticker-row {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 16px;
          overflow: hidden;
        }

        .ticker-label {
          flex-shrink: 0;
          margin-right: 14px;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffb000;
          white-space: nowrap;
        }

        /* VIEWPORT */
        .ticker-viewport {
          position: relative;
          overflow: hidden;
          flex: 1;
        }

        /* TRACK — FAST ENOUGH FOR SAFARI */
        .ticker-track {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll-desktop 28s linear infinite;
          -webkit-animation: scroll-desktop 28s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        .ticker-item {
          display: inline-block;
          margin-right: 28px;
          font-weight: 800;
          font-size: 14px;
          color: #ffffff;
          text-decoration: none;
          white-space: nowrap;
        }

        .ticker-item:hover {
          color: #ffb000;
        }

        /* DESKTOP KEYFRAMES */
        @keyframes scroll-desktop {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @-webkit-keyframes scroll-desktop {
          from {
            -webkit-transform: translateX(0);
          }
          to {
            -webkit-transform: translateX(-50%);
          }
        }

        /* 🚨 SAFARI / iOS OVERRIDE 🚨 */
        @supports (-webkit-touch-callout: none) {
          .ticker-track {
            animation: scroll-safari 18s linear infinite;
            -webkit-animation: scroll-safari 18s linear infinite;
          }

          @keyframes scroll-safari {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          @-webkit-keyframes scroll-safari {
            from {
              -webkit-transform: translate3d(0, 0, 0);
            }
            to {
              -webkit-transform: translate3d(-50%, 0, 0);
            }
          }
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .ticker-root {
            margin-top: 56px; /* slightly smaller header */
          }

          .ticker-row {
            height: 36px;
          }

          .ticker-item {
            font-size: 15px;
            font-weight: 900;
          }
        }
      `}</style>
    </div>
  );
}
