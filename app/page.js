import Link from 'next/link';
import { FireIcon, StarIcon } from '@heroicons/react/24/solid';

async function getShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_original_language=es&vote_count.gte=100`,
    { next: { revalidate: 3600 } }
  );
  return res.ok ? res.json() : { results: [] };
}

export default async function Home() {
  const data = await getShows();
  const shows = data.results || [];

  return (
    <div className="bg-dark">
      {/* HERO */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-dark to-dark -z-10"></div>
        <h1 className="text-6xl md:text-8xl font-black uppercase mb-6 leading-[0.85] tracking-tighter">
          Spanish <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple-600">TV Ranked</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-mono">
          Dec 2025 Data • Global Popularity • Difficulty Levels
        </p>
      </section>

      {/* LIST */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {shows.map((show, index) => (
            <Link key={show.id} href={`/show/${show.id}`} className="group block">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 border border-gray-800 group-hover:border-neon transition-colors">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`} 
                  alt={show.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-3 py-1 font-mono text-neon text-sm font-bold border border-gray-700 rounded">
                  #{index + 1}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-hot mb-2">
                <span className="flex items-center"><FireIcon className="h-3 w-3 mr-1"/> {Math.round(show.popularity)} HEAT</span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center text-yellow-500"><StarIcon className="h-3 w-3 mr-1"/> {show.vote_average.toFixed(1)}</span>
              </div>

              <h2 className="text-2xl font-black uppercase leading-none mb-2 group-hover:text-neon transition-colors">{show.name}</h2>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{show.overview}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
