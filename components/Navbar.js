"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, FireIcon } from "@heroicons/react/24/solid";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/best-on-netflix", label: "Best on Netflix" },
  { href: "/best-spanish-crime-shows", label: "Crime Shows" },
  { href: "/shows-like-money-heist", label: "Like Money Heist" },
  { href: "/learn-spanish", label: "Learn Spanish" },
  { href: "/learn-english", label: "Learn English" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-black italic tracking-tighter text-white hover:opacity-90 transition-opacity"
        >
          SPANISHTVSHOWS
          <span className="text-neon">.COM</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-5 font-bold text-[0.7rem] tracking-[0.2em] text-gray-400 uppercase">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-neon transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}

          <form
            role="search"
            className="flex items-center bg-white/5 border border-white/10 rounded-full pl-3 ml-2 focus-within:border-neon/40"
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.currentTarget.q.value.trim();
              if (!q) return;
              window.open(`https://www.google.com/search?q=${encodeURIComponent("site:spanishtvshows.com " + q)}`, "_blank", "noopener");
            }}
          >
            <input name="q" type="search" placeholder="Search…" aria-label="Search site" autoComplete="off" className="bg-transparent outline-none text-white text-xs w-28 py-1.5 placeholder-gray-500" />
            <button type="submit" aria-label="Search" className="w-7 h-7 flex items-center justify-center rounded-full bg-neon/20 hover:bg-neon text-neon hover:text-black transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
          </form>

          {/* CTA */}
          <Link
            href="/trending"
            className="bg-neon text-black px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2 font-black ml-2"
          >
            <FireIcon className="h-4 w-4" />
            EXPLORE
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="h-7 w-7 text-neon" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-black border-b border-gray-800 absolute w-full left-0 top-16 flex flex-col shadow-2xl shadow-black/50 z-50">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="px-6 py-4 border-b border-gray-900/50 text-base font-bold uppercase tracking-wider hover:text-neon hover:bg-white/[0.02] transition-all"
            >
              {link.label}
            </Link>
          ))}

          <div className="p-5">
            <Link
              href="/trending"
              onClick={closeMenu}
              className="w-full bg-neon text-black font-black uppercase py-4 rounded-lg hover:bg-white text-base flex items-center justify-center gap-2 transition-colors"
            >
              <FireIcon className="h-5 w-5" />
              Explore Shows
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
