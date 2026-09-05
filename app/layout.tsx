import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | West Tennessee State Fair",
    default: "West Tennessee State Fair 2026 — Back to Our Roots",
  },
  description:
    "The West Tennessee State Fair returns October 2026 in Henderson, TN. 171 years of tradition — livestock shows, pageants, exhibits, rodeo, entertainment, and more. $5 admission. Free parking.",
  icons: {
    icon:  [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png",    sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  keywords: [
    "West Tennessee State Fair",
    "WTSF",
    "Henderson TN fair",
    "Tennessee fair 2026",
    "fair Henderson Tennessee",
    "livestock shows West Tennessee",
    "pageant Henderson TN",
    "county fair West Tennessee",
    "agricultural fair Tennessee",
    "Chester County Tennessee fair",
    "family events Henderson TN",
    "fall festival West Tennessee",
    "fair October Henderson",
    "West TN state fair",
    "livestock cattle sheep goat fair",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wtsfair.com",
    siteName: "West Tennessee State Fair",
    title: "West Tennessee State Fair 2026 — Back to Our Roots",
    description:
      "171 years of tradition in Henderson, TN. Livestock shows, pageants, exhibits, rodeo, live entertainment. October 2026. $5 admission. Free parking.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "West Tennessee State Fair — October 15–24, 2026 · Henderson, Tennessee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "West Tennessee State Fair 2026",
    description:
      "171 years of tradition in Henderson, TN. October 2026. $5 admission. Free parking.",
    images: ["/og-image.webp"],
  },
  alternates: {
    canonical: "https://wtsfair.com",
  },
  verification: {
    google: "LWNElxt0H0EkjQG_n3n3s9sME3kZxyTIa1muaQNl2pc",
  },
  metadataBase: new URL("https://wtsfair.com"),
};

const jsonLdEvent = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "West Tennessee State Fair 2026",
  description:
    "The West Tennessee State Fair — 171 years of tradition in Henderson, Tennessee. Livestock shows, pageants, exhibits, rodeo, live entertainment, and more.",
  startDate: "2026-10-15T16:00:00-05:00",
  endDate: "2026-10-24T23:00:00-05:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "West Tennessee State Fair Grounds",
    address: {
      "@type": "PostalAddress",
      streetAddress: "575 Fourth Street",
      addressLocality: "Henderson",
      addressRegion: "TN",
      postalCode: "38340",
      addressCountry: "US",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "West Tennessee State Fair",
    url: "https://wtsfair.com",
    email: "wtsfair@gmail.com",
  },
  offers: {
    "@type": "Offer",
    price: "5",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://wtsfair.com/fair-info#admission",
  },
  image: "https://wtsfair.com/og-image.webp",
  url: "https://wtsfair.com",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "West Tennessee State Fair",
  url: "https://wtsfair.com",
  logo: "https://wtsfair.com/fair-logo.png",
  email: "wtsfair@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "P.O. Box 1404",
    addressLocality: "Jackson",
    addressRegion: "TN",
    postalCode: "38302",
    addressCountry: "US",
  },
  foundingDate: "1855",
  areaServed: "West Tennessee, USA",
  sameAs: [
    "https://www.facebook.com/WTSFAIR",
    "https://www.instagram.com/westtnstatefair",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-near-black antialiased">
        <Navigation />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
