"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

/**
 * Sanitize page paths before sending to GA4.
 * Resume/recovery tokens are 64-char hex strings. Replace the token segment so
 * GA4 never receives raw tokens or any PII in the URL.
 *
 * /pageants/register/pay/abc123...  →  /pageants/register/pay
 * All other paths are sent as-is.
 *
 * Note: usePathname() returns the path only (no query string), so query params
 * such as ?registrationId= on /pageants/register/success are never sent to GA4.
 */
function sanitizePath(path: string): string {
  // Remove resume/recovery token from payment page URL
  return path.replace(/^(\/pageants\/register\/pay)\/[^?#]+/, "$1");
}

/**
 * Return true for paths that should NOT be tracked in GA4.
 * Admin dashboards and private management routes are excluded — we only want
 * public visitor behaviour.
 */
function isAdminPath(path: string): boolean {
  return (
    path.startsWith("/pageants/admin") ||
    path.startsWith("/exhibits/admin") ||
    path.startsWith("/updates/admin") ||
    path.startsWith("/partner-with-us/admin") ||
    path.startsWith("/got-talent/admin")
  );
}

// Typed gtag helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gtag(...args: any[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (window.gtag as (...a: unknown[]) => void)(...args);
  }
}

/**
 * Fire a GA4 custom event. Safe to call anywhere; no-ops if GA4 is not loaded.
 * NEVER pass PII: no names, emails, DOBs, registration IDs, tokens.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (!GA_ID) return;
  gtag("event", eventName, params);
}

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    dataLayer: unknown[];
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Send pageview on route change with sanitized path — skip admin routes
  useEffect(() => {
    if (!GA_ID) return;
    const path = pathname ?? "";
    if (isAdminPath(path)) return; // do not track admin/private routes
    const sanitized = sanitizePath(path);
    gtag("config", GA_ID, {
      page_path: sanitized,
      // Disable sending the full URL (which might contain tokens in search params)
      send_page_view: false,
    });
    gtag("event", "page_view", {
      page_path: sanitized,
      page_location: window.location.origin + sanitized,
    });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: false,
            cookie_flags: 'SameSite=None;Secure',
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
