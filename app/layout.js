import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Spanish TV Shows Ranked | 2025 Official List',
  description: 'The definitive ranking of the best Spanish TV shows for entertainment and language learning.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark text-white min-h-screen flex flex-col font-sans selection:bg-hot selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
