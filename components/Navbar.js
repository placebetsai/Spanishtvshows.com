import Link from 'next/link';
import { FireIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-1">
          <span className="text-2xl font-black italic tracking-tighter text-white">
            SPANISHTV<span className="text-neon group-hover:text-hot transition-colors">.COM</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 font-mono text-sm font-bold tracking-widest">
          <Link href="/" className="text-gray-400 hover:text-neon transition-colors">TRENDING</Link>
          <Link href="/#learning" className="text-gray-400 hover:text-neon transition-colors">LEARN SPANISH</Link>
          <a href="https://www.lingopie.com" target="_blank" className="px-5 py-2 bg-neon text-black hover:bg-white transition-colors uppercase rounded-sm flex items-center gap-2">
            <FireIcon className="h-4 w-4"/> Start Learning
          </a>
        </div>
      </div>
    </nav>
  );
}
