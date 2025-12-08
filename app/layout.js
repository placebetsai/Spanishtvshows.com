import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "SpanishTVShows.com – Best Spanish Shows Ranked (2025)",
  description:
    "Live rankings of the best Spanish-language TV shows in 2025. Trending series, where to watch, and how to learn Spanish using TV.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
