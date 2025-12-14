import React from 'react';

export const metadata = {
  title: "Contact – Spanishtvshows.com",
  description: "Questions, partnerships, or telenovela drama? Reach the team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambient Glow (Optional for atmosphere) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl group z-10">
        
        {/* The "Drama" Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 via-fuchsia-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
        
        {/* The Content Card */}
        <div className="relative bg-black/90 border border-white/10 rounded-xl p-8 md:p-12 text-center backdrop-blur-xl shadow-2xl">
          
          {/* Eyebrow Text */}
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-rose-500 mb-6 animate-pulse">
            Questions • Partnerships • Chisme
          </p>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
            Talk to the people who <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-400">actually watch</span> this stuff.
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto">
            Whether you've got a success story, a wild recommendation, 
            or you just want to roast a season finale — we read every message.
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <a 
              href="mailto:info@spanishtvshows.com"
              className="group/btn relative inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-white text-black font-black text-sm tracking-[0.15em] uppercase rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.6)]"
            >
              <span className="mr-2">📧</span>
              info@spanishtvshows.com
            </a>
          </div>

          {/* Footer Note */}
          <p className="mt-8 text-xs text-gray-600 font-mono">
            NO ROBOTS. NO AUTO-REPLIES. JUST US.
          </p>

        </div>
      </div>
    </div>
  );
}
