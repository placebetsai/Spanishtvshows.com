// app/privacy/page.js
export const metadata = {
  title: "Privacy Policy | SpanishTVShows.com",
  description: "Privacy policy for SpanishTVShows.com – what data we collect, how we use it, and your rights.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: April 2026</p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-slate-300">
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">1. Who We Are</h2>
            <p>
              SpanishTVShows.com is an independent fan-run website that aggregates publicly available
              TV show data from The Movie Database (TMDB) API. We are not affiliated with, endorsed by,
              or connected to Netflix, HBO, Telemundo, Univision, ViX, Disney+, or any streaming platform
              or production company. All show titles, images, and descriptions are the property of their
              respective owners. Show data is provided by{" "}
              <a href="https://www.themoviedb.org" className="text-orange-300 underline" target="_blank" rel="noopener noreferrer">
                TMDB
              </a>.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">2. What We Collect</h2>
            <p className="mb-2">We collect minimal data:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Standard web server logs (IP address, browser type, pages visited) for security and performance monitoring</li>
              <li>If you email us, we retain that email to respond to you</li>
              <li>We do not require account registration or collect personal information</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">3. Advertising & Cookies</h2>
            <p className="mb-2">
              This site uses Google AdSense to display advertisements. Google AdSense may use cookies
              and similar tracking technologies to serve ads based on your prior visits to this and
              other websites. These cookies allow Google and its partners to serve ads based on your
              interests.
            </p>
            <p className="mb-2">
              You may opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" className="text-orange-300 underline" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>{" "}
              or{" "}
              <a href="https://www.aboutads.info/choices/" className="text-orange-300 underline" target="_blank" rel="noopener noreferrer">
                aboutads.info
              </a>.
            </p>
            <p>
              Third-party ad vendors, including Google, use cookies to serve ads based on a user's
              prior visits to this website or other websites. Google's use of advertising cookies
              enables it and its partners to serve ads based on your visit to our site and/or other
              sites on the Internet. For more information about Google's practices, see{" "}
              <a href="https://policies.google.com/technologies/partner-sites" className="text-orange-300 underline" target="_blank" rel="noopener noreferrer">
                Google's Privacy & Terms
              </a>.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">4. Third-Party Links & Affiliate Links</h2>
            <p>
              This site contains links to third-party streaming platforms (Netflix, HBO, etc.) via
              JustWatch search. We may earn a referral commission from Amazon and other platforms when
              you click affiliate links. These are clearly intended to help you find where to watch
              shows — we are not claiming any official relationship with these platforms.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">5. Data Retention & Your Rights</h2>
            <p>
              We do not sell, rent, or share personal data with third parties beyond what is required
              for standard web hosting and ad serving. If you are in the EU or California, you have the
              right to request deletion of any personal data we hold about you. Contact us at{" "}
              <a href="mailto:info@spanishtvshows.com" className="text-orange-300 underline">
                info@spanishtvshows.com
              </a>.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">6. Contact</h2>
            <p>
              Questions about this policy:{" "}
              <a href="mailto:info@spanishtvshows.com" className="text-orange-300 underline">
                info@spanishtvshows.com
              </a>
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
