"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Matches /pageants/register/pay/ followed by a token segment
const PAY_TOKEN_RE = /^\/pageants\/register\/pay\/[^?#/]+/;

/**
 * Fires fbq('track','PageView') on every route change EXCEPT tokenized payment
 * pages (/pageants/register/pay/[token]). This prevents the 64-char resume
 * token from being transmitted to Meta's servers in the page URL.
 *
 * On pay-token pages PageView is suppressed — the CompleteRegistration event
 * still fires from the pay page component when payment succeeds.
 */
export default function MetaPixelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    if (PAY_TOKEN_RE.test(pathname ?? "")) return; // token URL — suppress
    window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}
