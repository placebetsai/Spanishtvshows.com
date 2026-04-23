"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Routes where ads are suppressed for UX reasons — contact/checkout/auth pages
// are transactional and need fast-responding input. AdSense work on main thread
// was adding ~1s of input lag on /contact.
const NO_AD_ROUTES = ["/contact", "/privacy", "/terms"];

export default function AdUnit({ slot = "6600722153", className = "", style = {} }) {
  const pathname = usePathname();
  const adRef = useRef(null);
  const pushed = useRef(false);

  const suppress = NO_AD_ROUTES.some((r) => pathname === r || pathname?.startsWith(r + "/"));

  useEffect(() => {
    if (suppress || pushed.current) return;
    try {
      if (adRef.current && typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense not loaded or blocked
    }
  }, [suppress]);

  if (suppress) return null;

  return (
    <div className={className} style={{ textAlign: "center", overflow: "hidden", ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7215975042937417"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
}
