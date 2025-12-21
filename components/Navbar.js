"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, FireIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-black italic tracking-tighter text-white"
        >
          SPANISHTVSHOWS
          <span className="text-neon">.COM</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 font-bold text-[0.7rem] tracking-[0.25em] text-gray-400 uppercase">
          <Link href="/" className="hover:text-neon transition-colors">
            Home
          </Link>

          <Link href="/trending" className="hover:text-neon transition-colors">
            Trending
          </Link>

          <Link
            href="/best-on-netflix"
            className="hover:text-neon transition-colors"
          >
            Best on Netflix
          </Link>

          <Link
            href="/learn-spanish"
            className="hover:text-neon transition-colors"
          >
            Learn Spanish
          </Link>

          <Link
            href="/learn-english"
            className="hover:text-neon transition-colors"
          >
            Learn English
          </Link>

          {/* ✅ NEW: Resources */}
          <Link
            href="/resources"
            className="hover:text-neon transition-colors"
          >
            Resources
          </Link>

          <Link href="/contact" className="hover:text-neon transition-colors">
            Contact
          </Link>

          {/* CTA */}
          <Link
            href="/learn-spanish"
            className="bg-neon text-black px-4 py-2 rounded-sm hover:bg-white transition-colors flex items-center gap-2 font-black"
          >
            <FireIcon className="h-4 w-4" />
            START LEARNING
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="h-8 w-8 text-neon" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-gray-800 absolute w-full left-0 top-16 flex flex-col shadow-2xl shadow-neon/10 z-50">
          <Link
            href="/"
            onClick={closeMenu}
            className="p-5 border-b border-gray-900 text-lg font-bold uppercase hover:text-neon"
          >
            Home
          </Link>

          <Link
            href="/trending"
            onClick={closeMenu}
            className="p-5 border-b border-gray-900 text-lg font-bold uppercase hover:text-neon"
          >
            Trending
          </Link>

          <Link
            href="/best-on-netflix"
            onClick={closeMenu}
            className="p-5 border-b border-gray-900 text-lg font-bold uppercase hover:text-neon"
          >
            Best on Netflix
          </Link>

          <Link
            href="/learn-spanish"
            onClick={closeMenu}
            className="p-5 border-b border-gray-900 text-lg font-bold uppercase hover:text-neon"
          >
            Learn Spanish
          </Link>

          <Link
            href="/learn-english"
            onClick={closeMenu}
            className="p-5 border-b border-gray-900 text-lg font-bold uppercase hover:text-neon"
          >
            Learn English
          </Link>

          {/* ✅ NEW: Resources */}
          <Link
            href="/resources"
            onClick={closeMenu}
            className="p-5 border-b border-gray-900 text-lg font-bold uppercase hover:text-neon"
          >
            Resources
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            className="p-5 border-b border-gray-900 text-lg font-bold uppercase hover:text-neon"
          >
            Contact
          </Link>

          <div className="p-5">
            <Link
              href="/learn-spanish"
              onClick={closeMenu}
              className="w-full bg-neon text-black font-black uppercase py-4 rounded hover:bg-white text-lg flex items-center justify-center gap-2"
            >
              <FireIcon className="h-6 w-6" />
              Start Learning
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
