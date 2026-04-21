import React from 'react';
import ContactForm from './ContactForm';

export const metadata = {
  title: "Contact – Spanishtvshows.com",
  description: "Questions, partnerships, or media? Reach the team.",
};

export default function ContactPage({ searchParams }) {
  const sent = searchParams?.sent === "true";
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl group z-10">

        {/* The "Drama" Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 via-fuchsia-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>

        {/* The Content Card */}
        <div className="relative bg-black/90 border border-white/10 rounded-xl p-10 md:p-14 backdrop-blur-xl shadow-2xl">
          <ContactForm sent={sent} />
        </div>

      </div>
    </div>
  );
}
