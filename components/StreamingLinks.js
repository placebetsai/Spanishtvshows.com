// components/StreamingLinks.js

const STREAMING_SERVICES = [
  {
    name: "Netflix",
    href: "https://www.netflix.com/?utm_source=spanishtvshows",
    color: "bg-red-600/20 text-red-400 border-red-600/30",
  },
  {
    name: "Hulu",
    href: "https://www.hulu.com/?utm_source=spanishtvshows",
    color: "bg-green-600/20 text-green-400 border-green-600/30",
  },
  {
    name: "HBO Max",
    href: "https://www.max.com/?utm_source=spanishtvshows",
    color: "bg-purple-600/20 text-purple-400 border-purple-600/30",
  },
];

export default function StreamingLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {STREAMING_SERVICES.map((service) => (
        <a
          key={service.name}
          href={service.href}
          target="_blank"
          rel="noopener noreferrer"
          data-affiliate="pending"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${service.color} hover:opacity-80 transition-opacity`}
        >
          {service.name}
          <span className="opacity-60">→</span>
        </a>
      ))}
    </div>
  );
}
