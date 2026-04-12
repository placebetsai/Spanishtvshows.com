// components/VpnCta.js
import AffiliateDisclosure from "./AffiliateDisclosure";

const VPN_PROVIDERS = [
  {
    name: "NordVPN",
    href: "https://nordvpn.com/?utm_source=spanishtvshows",
    tagline: "Fastest speeds for streaming",
  },
  {
    name: "ExpressVPN",
    href: "https://expressvpn.com/?utm_source=spanishtvshows",
    tagline: "Works in 94+ countries",
  },
];

export default function VpnCta() {
  return (
    <div className="rounded-2xl border border-gray-800/60 bg-black/70 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🌐</span>
        <h3 className="text-lg font-black">
          Can't access this show in your country?
        </h3>
      </div>
      <p className="text-gray-400 text-sm mb-5 leading-relaxed">
        A VPN lets you watch from anywhere. Unlock geo-restricted Spanish
        content on Netflix, HBO Max, and more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {VPN_PROVIDERS.map((vpn) => (
          <a
            key={vpn.name}
            href={vpn.href}
            target="_blank"
            rel="noopener noreferrer"
            data-affiliate="pending"
            className="show-card flex items-center justify-between gap-3 px-5 py-4 hover:border-neon group"
          >
            <div>
              <div className="font-black text-sm group-hover:text-neon transition-colors">
                {vpn.name}
              </div>
              <div className="text-gray-500 text-xs mt-0.5">{vpn.tagline}</div>
            </div>
            <span className="text-neon font-black text-sm group-hover:translate-x-1 transition-transform">
              Try Free →
            </span>
          </a>
        ))}
      </div>

      <AffiliateDisclosure className="mt-4" />
    </div>
  );
}
