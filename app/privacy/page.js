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
          <p className="mt-2 text-xs text-slate-500">Last updated: February 2026</p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-slate-300">

          {/* NEW - Advertising section - REQUIRED by AdSense */}
          <section className="rounded-2xl bg-orange-500/10 border border-orange-500/40 p-5">
            <h2 className="text-lg font-semibold text-orange-300 mb-2">
              1. Advertising (Google AdSense)
            </h2>
            <p className="mb-3">
              SpanishTVShows.com uses Google AdSense to display advertisements. Google and its
              partners use cookies to serve ads based on your prior visits to this site and
              other sites on the internet. This allows Google to show you personalized ads.
            </p>
            <p className="mb-3">
              Google's use of advertising cookies enables it and its partners to serve ads
              based on your visit to our site. You can opt out of personalized advertising by
              visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-300 underline decoration-dotted underline-offset-2"
              >
                Google's Ads Settings
              </a>
              . You can also opt out via the{" "}
              <a
                href="https://optout.networkadvertising.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-300 underline decoration-dotted underline-offset-2"
              >
                Network Advertising Initiative opt-out page
              </a>
              .
            </p>
            <p>
              For more information on how Google uses data when you use our site, visit:{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-300 underline decoration-dotted underline-offset-2"
              >
                How Google uses information from sites that use our services
              </a>
              .
            </p>
          </section>

          {/* NEW - Cookies section - REQUIRED by AdSense */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              2. Cookies
            </h2>
            <p className="mb-3">
              This site uses cookies — small text files stored on your device. Cookies are
              used for advertising personalization (via Google AdSense), analytics, and to
              remember your preferences.
            </p>
            <p>
              You can disable cookies in your browser settings at any time. Note that
              disabling cookies may affect how parts of the site function and may result in
              seeing non-personalized ads instead of personalized ones.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              3. Basic analytics
            </h2>
            <p>
              We may use privacy-friendly analytics to understand which pages people visit,
              which shows get clicks, and what devices are used. This helps us improve
              rankings and layout, not stalk individuals.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              4. Affiliate links (Amazon Associates)
            </h2>
            <p>
              SpanishTVShows.com is a participant in the Amazon Services LLC Associates
              Program. Some links on this site are affiliate links — if you click one and
              make a purchase, we may earn a small commission at no extra cost to you.
              Amazon may use cookies to track purchases originating from our site. See{" "}
              <a
                href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-300 underline decoration-dotted underline-offset-2"
              >
                Amazon's Privacy Notice
              </a>{" "}
              for details.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              5. Email
            </h2>
            <p>
              If you email us at{" "}
              <a
                href="mailto:info@spanishtvshows.com"
                className="text-orange-300 underline decoration-dotted underline-offset-2"
              >
                info@spanishtvshows.com
              </a>
              , we obviously see your email address and whatever you send. We use it only to
              reply or review suggestions. We don't sell it, rent it, or upload it to random
              tools.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              6. Third-party services
            </h2>
            <p>
              This site links to and embeds content from third-party platforms (Netflix,
              Amazon, YouTube, etc.). Those platforms may set their own cookies and have
              their own privacy policies — their policies apply to that data, not ours.
              SpanishTVShows.com does not host or stream any TV content.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              7. Data requests
            </h2>
            <p>
              If you ever want to know what data we have about you (if any), contact us and
              we'll do our best to help or delete it where possible.
            </p>
          </section>

        </div>
      </section>
    </div>
  );
                }
