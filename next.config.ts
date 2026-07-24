import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
