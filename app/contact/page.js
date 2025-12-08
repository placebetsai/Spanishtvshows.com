export const metadata = {
  title: "Contact – Spanishtvshows.com",
  description:
    "Questions, partnerships or media? Reach the team behind Spanishtvshows.com.",
};

export default function ContactPage() {
  return (
    <div className="bg-dark min-h-screen">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-mono tracking-[0.25em] uppercase text-neon mb-4">
          QUESTIONS • PARTNERSHIPS • STORIES
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Get in touch with the people who actually watch this stuff.
        </h1>
        <p className="text-gray-300 text-lg mb-10">
          Whether you&apos;ve got a success story, a wild telenovela recommendation,
          a partnership idea, or you just want to roast a show — we read
          every message. No auto-reply robot here.
        </p>

        <div className="bg-black/90 border border-gray-800 rounded-2xl p-8 box-glow">
          <h2 className="text-xl font-bold mb-4">Send us a message</h2>
          <p className="text-sm text-gray-400 mb-6">
            This form opens your email app and sends directly to{" "}
            <span className="text-neon font-semibold">
              info@spanishtvshows.com
            </span>
            . Keep it short, blunt, and real.
          </p>

          <form
            action="mailto:info@spanishtvshows.com"
            method="POST"
            encType="text/plain"
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.25em] text-gray-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full rounded-lg bg-dark border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-neon"
                placeholder="Netflix addict #492"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.25em] text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg bg-dark border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-neon"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.25em] text-gray-400 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                className="w-full rounded-lg bg-dark border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-neon"
                placeholder="Collab idea, show recommendation, or complaint"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.25em] text-gray-400 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full rounded-lg bg-dark border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-neon resize-none"
                placeholder="Tell us what you want, no fluff."
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 rounded-full bg-neon text-black font-black text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors"
            >
              Send email
            </button>
          </form>

          <p className="mt-4 text-[0.7rem] text-gray-500">
            Tip: if nothing happens when you press the button, make sure you
            have a default email app set up on your phone or computer.
          </p>
        </div>
      </section>
    </div>
  );
                  }
