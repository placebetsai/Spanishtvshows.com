export default function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-black py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-black italic tracking-tighter text-gray-800 mb-8">
          SPANISHTV<span className="text-gray-700">.COM</span>
        </h2>
        
        <div className="flex justify-center gap-8 mb-8 text-xs font-mono text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-neon">Privacy</a>
          <a href="#" className="hover:text-neon">Terms</a>
          <a href="#" className="hover:text-neon">Affiliate Disclosure</a>
          <a href="#" className="hover:text-neon">Contact</a>
        </div>

        <p className="text-gray-700 text-xs max-w-lg mx-auto leading-relaxed">
          Spanishtvshows.com is a participant in the Amazon Services LLC Associates Program and JustWatch affiliate programs. 
          We make money when you watch good TV.
        </p>
      </div>
    </footer>
  );
}
