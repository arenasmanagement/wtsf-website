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
    "livestock show West Tennessee",
    "pageant Henderson TN",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.wtsfair.com",
    siteName: "West Tennessee State Fair",
    title: "West Tennessee State Fair 2026 — Back to Our Roots",
    description:
      "171 years of tradition in Henderson, TN. Livestock shows, pageants, exhibits, rodeo, live entertainment. October 2026. $5 admission. Free parking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "West Tennessee State Fair 2026",
    description:
      "171 years of tradition in Henderson, TN. October 2026. $5 admission. Free parking.",
  },
  metadataBase: new URL("https://www.wtsfair.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-cream text-near-black antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
