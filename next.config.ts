import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Allow Google Maps iframe, Square, Google Pay, Apple Pay, fonts, images
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' is required by Next.js App Router for inline event handlers and <style> tags.
      // 'unsafe-eval' has been intentionally removed — Next.js 16 App Router does not require it at runtime.
      // pay.google.com + gstatic.com are required by Square's Web Payments SDK to load the Google Pay button.
      "script-src 'self' 'unsafe-inline' https://web.squarecdn.com https://sandbox.web.squarecdn.com https://pay.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      // pay.google.com is required: Square SDK renders the Google Pay button inside a pay.google.com iframe.
      "frame-src https://www.google.com https://maps.google.com https://pci-connect.squareup.com https://pci-connect.squareupsandbox.com https://web.squarecdn.com https://sandbox.web.squarecdn.com https://pay.google.com",
      // pay.google.com + gstatic.com needed for Google Pay API calls; *.apple.com for Apple Pay merchant validation.
      "connect-src 'self' https://*.supabase.co https://api.resend.com https://*.upstash.io https://pci-connect.squareup.com https://connect.squareup.com https://pci-connect.squareupsandbox.com https://connect.squareupsandbox.com https://web.squarecdn.com https://sandbox.web.squarecdn.com https://*.apple.com https://pay.google.com https://www.gstatic.com",
      "media-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Canonical: always serve on wtsfair.com (no www)
      // Apple Pay domain verification is registered against wtsfair.com only.
      // Without this redirect, www.wtsfair.com visitors get PaymentMethodUnsupportedError.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.wtsfair.com" }],
        destination: "https://wtsfair.com/:path*",
        permanent: true,
      },
      {
        source: "/vendors-sponsors",
        destination: "/partner-with-us",
        permanent: true,
      },
      {
        source: "/vendors-sponsors/:path*",
        destination: "/partner-with-us/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
