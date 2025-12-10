// app/terms/page.js
export const metadata = {
  title: "Terms of Use | SpanishTVShows.com",
  description:
    "Terms and conditions for using SpanishTVShows.com. Educational rankings, not streaming or legal advice.",
};

export default function TermsPage() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/40">
            Legal Stuff
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms of Use
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
            Short version: this site is for entertainment and education. We help
            you discover TV shows — we don’t control the platforms that stream
            them.
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-slate-300">
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              1. What this site is
            </h2>
            <p>
              SpanishTVShows.com is an informational website that ranks and
              reviews Spanish-language TV series. We don’t host video content,
              sell subscriptions, or represent any streaming platforms.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              2. No guarantees
            </h2>
            <p>
              Streaming availability changes constantly. We do our best to keep
              links and platform info up to date, but we can’t guarantee that
              any show will be available in your region at any given time.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              3. Personal responsibility
            </h2>
            <p>
              You are responsible for your own streaming subscriptions, data
              usage, and any costs related to watching the shows we list. Use
              legit services, support the creators, and don’t be shady.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              4. Changes to these terms
            </h2>
            <p>
              We may update these terms from time to time as the site grows.
              When that happens, the new version will replace this one and the
              updated date will change at the top of the page.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              5. Contact
            </h2>
            <p>
              Questions about these terms? Email{" "}
              <a
                href="mailto:info@spanishtvshows.com"
                className="text-orange-300 underline decoration-dotted underline-offset-2"
              >
                info@spanishtvshows.com
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </div>
  );
                }
