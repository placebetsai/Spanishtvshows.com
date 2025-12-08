"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, FireIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-black italic tracking-tighter text-white"
        >
          SPANISHTVSHOWS<span className="text-neon">.COM</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 font-bold text-xs tracking-widest text-gray-400">
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
            href="/learn-english"
            className="hover:text-neon transition-colors"
          >
            LEARN ENGLISH
          </Link>
          <Link href="/contact" className="hover:text-neon transition-colors">
            CONTACT
          </Link>
          <a
            href="https://lingopie.com"
            target="_blank"
            className="bg-neon text-black px-4 py-2 rounded-sm hover:bg-white transition-colors flex items-center gap-2 font-black"
          >
            <FireIcon className="h-4 w-4" /> START LEARNING
          </a>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white"
        >
          {isOpen ? (
            <XMarkIcon className="h-8 w-8 text-neon" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-gray-800 absolute w-full left-0 top-16 flex flex-col shadow-2xl shadow-neon/10 z-50">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="p-6 border-b border-gray-900 text-xl font-bold uppercase hover:text-neon"
          >
            Trending Shows
          </Link>
          <Link
            href="/learn-spanish"
            onClick={() => setIsOpen(false)}
            className="p-6 border-b border-gray-900 text-xl font-bold uppercase hover:text-neon"
          >
            Learn Spanish
          </Link>
          <Link
            href="/learn-english"
            onClick={() => setIsOpen(false)}
            className="p-6 border-b border-gray-900 text-xl font-bold uppercase hover:text-neon"
          >
            Learn English
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="p-6 border-b border-gray-900 text-xl font-bold uppercase hover:text-neon"
          >
            Contact
          </Link>

          <div className="p-6">
            <a
              href="https://lingopie.com"
              target="_blank"
              className="w-full bg-neon text-black font-black uppercase py-4 rounded hover:bg-white text-xl flex items-center justify-center gap-2"
            >
              <FireIcon className="h-6 w-6" /> Start Learning
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
