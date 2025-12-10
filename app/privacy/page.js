// app/privacy/page.js
export const metadata = {
  title: "Privacy Policy | SpanishTVShows.com",
  description:
    "Privacy policy for SpanishTVShows.com. Basic analytics, no creepy tracking, no selling your data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/40">
            Privacy
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
            We like great shows, not creepy tracking. This page explains what we
            collect (very little) and how we use it.
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-slate-300">
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              1. Basic analytics
            </h2>
            <p>
              We may use privacy-friendly analytics to understand which pages
              people visit, which shows get clicks, and what devices are used.
              This helps us improve rankings and layout, not stalk individuals.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              2. Email
            </h2>
            <p>
              If you email us at{" "}
              <a
                href="mailto:info@spanishtvshows.com"
                className="text-orange-300 underline decoration-dotted underline-offset-2"
              >
                info@spanishtvshows.com
              </a>
              , we obviously see your email address and whatever you send. We
              use it only to reply or review suggestions. We don’t sell it, rent
              it, or upload it to random tools.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              3. Cookies & third-party services
            </h2>
            <p>
              If we embed trailers, streaming buttons, or social links, those
              third-party platforms may set their own cookies. Their privacy
              policies apply to that data — not ours.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              4. Data requests
            </h2>
            <p>
              If you ever want to know what data we have about you (if any),
              contact us and we’ll do our best to help or delete it where
              possible.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
              }
