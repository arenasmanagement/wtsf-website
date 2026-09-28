import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/exhibits/admin",
        "/updates/admin",
        "/pageants/admin",
        "/got-talent/admin",
        "/got-talent/setup-password",
        "/api/",
      ],
    },
    sitemap: "https://wtsfair.com/sitemap.xml",
  };
}
