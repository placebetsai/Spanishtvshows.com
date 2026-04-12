// components/AffiliateDisclosure.js

export default function AffiliateDisclosure({ className = "" }) {
  return (
    <p className={`text-[11px] text-gray-600 leading-relaxed ${className}`}>
      Some links on this page are affiliate links. We may earn a commission at
      no extra cost to you.
    </p>
  );
}
