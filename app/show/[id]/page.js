import { PlayCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

async function getShowDetails(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=similar,videos`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function ShowPage({ params }) {
  const show = await getShowDetails(params.id);
  if (!show) return <div className="p-20 text-center">Show not found</div>;

  const trailer = show.videos?.results?.find(v => v.type === "Trailer" || v.type === "Teaser");

  return (
    <div className="min-h-screen bg-dark">
      {/* BACKDROP HEADER */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10"></div>
        <img 
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`} 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center text-neon font-bold text-sm mb-6 hover:underline">
              <ArrowLeftIcon className="h-4 w-4 mr-2"/> BACK TO RANKING
            </Link>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">{show.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-mono font-bold">
              <span className="bg-white text-black px-3 py-1 rounded">{show.number_of_seasons} SEASONS</span>
              <span className="bg-hot text-white px-3 py-1 rounded">{show.status}</span>
              <span className="border border-gray-600 px-3 py-1 rounded text-gray-400">{show.first_air_date.split('-')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-neon mb-4 uppercase">The Breakdown</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">{show.overview}</p>
          
          {/* AFFILIATE BOX */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 rounded-full blur-3xl group-hover:bg-neon/20 transition-all"></div>
            <h3 className="text-xl font-bold mb-2">Want to learn Spanish with {show.name}?</h3>
            <p className="text-gray-400 mb-6 text-sm">Don't just watch. Click words on screen to translate them instantly.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(show.name)}`} target="_blank" className="flex-1 py-4 bg-white text-black font-black uppercase text-center rounded hover:bg-gray-200 transition-colors flex justify-center items-center gap-2">
                <PlayCircleIcon className="h-5 w-5"/> Watch on Netflix/Hulu
              </a>
              {/* THIS IS YOUR FUTURE LINGOPIE LINK */}
              <a href="#" className="flex-1 py-4 border border-neon text-neon font-black uppercase text-center rounded hover:bg-neon hover:text-black transition-colors">
                Learn with this Show
              </a>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div>
            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">Details</h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Original Language</dt>
                <dd className="font-bold">Spanish</dd>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Rating</dt>
                <dd className="font-bold text-yellow-500">★ {show.vote_average.toFixed(1)}</dd>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Episodes</dt>
                <dd className="font-bold">{show.number_of_episodes}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
            }
