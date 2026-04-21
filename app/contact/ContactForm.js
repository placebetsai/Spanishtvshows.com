// SERVER COMPONENT — renders form HTML on first paint, no JS hydration delay.
// Was a "use client" component wrapped in Suspense which caused fillable
// fields to lag while JS downloaded + hydrated. Reading ?sent=true from
// searchParams (passed by parent page) instead of useSearchParams().

export default function ContactForm({ sent = false }) {
  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/40">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
          Message <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Sent</span>
        </h2>

        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We got your message and will get back to you within 24 hours. Thanks for reaching out.
        </p>

        <a
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3 bg-white/10 border border-white/20 text-white font-bold text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white/20 transition-all duration-300"
        >
          Send Another
        </a>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-mono tracking-[0.25em] uppercase text-rose-500 mb-6 text-center">
        Direct Access
      </p>

      <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight text-center">
        Talk to the people who{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-400">
          actually watch
        </span>{" "}
        this stuff.
      </h1>

      <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto text-center">
        Whether you&apos;ve got a partnership idea, a wild recommendation, or you
        just want to roast a season finale &mdash; we read every message.
      </p>

      <form
        action="https://formsubmit.co/info@spanishtvshows.com"
        method="POST"
        className="space-y-5"
      >
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value="https://spanishtvshows.com/contact?sent=true" />
        <input type="hidden" name="_subject" value="SpanishTVShows Contact Form" />

        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Your name"
            autoComplete="name"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
            Subject
          </label>
          <select
            name="subject"
            id="subject"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-colors duration-200 appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled className="bg-black text-gray-500">
              Select a topic...
            </option>
            <option value="General" className="bg-black">General</option>
            <option value="Content Suggestion" className="bg-black">Content Suggestion</option>
            <option value="Partnership" className="bg-black">Partnership</option>
            <option value="Report Issue" className="bg-black">Report Issue</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            required
            rows={5}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-colors duration-200 resize-vertical"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="group/btn relative inline-flex items-center justify-center w-full md:w-auto px-10 py-4 bg-white text-black font-black text-sm tracking-[0.15em] uppercase rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.6)]"
          >
            Send Message
          </button>
        </div>
      </form>

      <div className="mt-10 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">or</span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <div className="mt-6 text-center">
        <a
          href="mailto:info@spanishtvshows.com"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-rose-400 transition-colors duration-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Email us directly at info@spanishtvshows.com
        </a>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
        <div className="h-px w-8 bg-gray-600"></div>
        <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
          Response time: &lt; 24h
        </p>
        <div className="h-px w-8 bg-gray-600"></div>
      </div>
    </div>
  );
}
