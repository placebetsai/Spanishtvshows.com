"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, FireIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-black italic tracking-tighter text-white"
        >
          SPANISHTVSHOWS<span className="text-neon">.COM</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest text-gray-400">
          <Link href="/" className="hover:text-neon transition-colors">
            TRENDING
          </Link>
          <Link
            href="/learn-spanish"
            className="hover:text-neon transition-colors"
          >
            LEARN SPANISH
          </Link>
          <Link
            href="/best-on-netflix"
            className="hover:text-neon transition-colors"
          >
            BEST ON NETFLIX
          </Link>

          <a
            href="https://lingopie.com"
            target="_blank"
            className="bg-neon text-black px-4 py-2 rounded-sm hover:bg-white transition-colors flex items-center gap-2 font-black"
          >
            <FireIcon className="h-4 w-4" />
            START LEARNING
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-white"
        >
          {open ? (
            <XMarkIcon className="h-8 w-8 text-neon" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black border-b border-gray-800">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-6 py-4 border-t border-gray-900 text-sm font-bold uppercase hover:text-neon"
          >
            Trending
          </Link>
          <Link
            href="/learn-spanish"
            onClick={() => setOpen(false)}
            className="block px-6 py-4 border-t border-gray-900 text-sm font-bold uppercase hover:text-neon"
          >
            Learn Spanish
          </Link>
          <Link
            href="/best-on-netflix"
            onClick={() => setOpen(false)}
            className="block px-6 py-4 border-t border-gray-900 text-sm font-bold uppercase hover:text-neon"
          >
            Best on Netflix
          </Link>
          <a
            href="https://lingopie.com"
            target="_blank"
            className="block px-6 py-4 border-t border-gray-900 text-sm font-black uppercase text-neon hover:text-white"
          >
            Start Learning
          </a>
        </div>
      )}
    </nav>
  );
              }
