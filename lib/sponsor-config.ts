/**
 * SPONSOR PACKAGES — West Tennessee State Fair
 * ─────────────────────────────────────────────────────────────────────────
 * Source of truth: Sponsors.pdf (2026 West Tennessee State Fair)
 *
 * HOW TO UPDATE ANNUALLY
 * ───────────────────────
 * Update package prices and benefits here only.
 * Do not scatter prices across multiple page or form files.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { FAIR_CONFIG } from "@/lib/fair-config";

export interface SponsorPackage {
  id: string;
  name: string;
  price: string;        // Display string, e.g. "$10,000+"
  priceMin: number;     // Minimum numeric value for form display
  ribbonColor: string;
  benefits: string[];
}

export const SPONSOR_PACKAGES: SponsorPackage[] = [
  {
    id: "best-of-show",
    name: "Best of Show Sponsor",
    price: "$10,000+",
    priceMin: 10000,
    ribbonColor: "#D4A827",
    benefits: [
      "Company naming rights to one night of the fair AND a specific event ALL WEEK on all TV/radio/billboards",
      "Logo on ALL event materials and social media",
      "Prominent logo on the website with a link to your website",
      "Vendor Booth 24 × 10 of your choosing — plus banners disbursed throughout fairgrounds",
      "50 Fair Tickets",
    ],
  },
  {
    id: "blue-ribbon",
    name: "Blue Ribbon Sponsor",
    price: "$5,000+",
    priceMin: 5000,
    ribbonColor: "#2563EB",
    benefits: [
      "Company sponsorship of a special event — constant announcements and signage during the event, daily social media, and Logo & Name on all materials",
      "Prominent logo on the website with a link to your website",
      "Vendor Booth 16 × 10 plus 2 banners displayed throughout the fairgrounds",
      "25 Fair Tickets",
    ],
  },
  {
    id: "red-ribbon",
    name: "Red Ribbon Sponsor",
    price: "$2,500+",
    priceMin: 2500,
    ribbonColor: "#8B2E2E",
    benefits: [
      "Company sponsorship of an exhibit area or act",
      "Logo on all event materials and social media",
      "Prominent logo on the website with a link to your website",
      "Vendor Booth 8 × 10",
      "15 Fair Tickets",
    ],
  },
  {
    id: "white-ribbon",
    name: "White Ribbon Sponsor",
    price: "$1,000+",
    priceMin: 1000,
    ribbonColor: "#9CA3AF",
    benefits: [
      "Logo on all event materials and social media",
      "Prominent logo on the website with a link to your webpage",
      "Product Display Area",
      "10 Fair Tickets",
    ],
  },
  {
    id: "yellow-ribbon",
    name: "Yellow Ribbon Sponsor",
    price: "$500+",
    priceMin: 500,
    ribbonColor: "#D4A827",
    benefits: [
      "Vendor Booth 10 × 10",
      "Quarter Page Ad in Fair Program",
      "6 Fair Tickets",
    ],
  },
  {
    id: "pink-ribbon",
    name: "Pink Ribbon Sponsor",
    price: "$250+",
    priceMin: 250,
    ribbonColor: "#C2728A",
    benefits: [
      "Business Card Ad in Fair Program",
      "4 Fair Tickets",
    ],
  },
];

// Fair year used in form subject lines and emails
export const SPONSOR_FAIR_YEAR = FAIR_CONFIG.year;

// Contact info shown in sponsorship section
export const SPONSOR_CONTACT = {
  email: "wtsfair@gmail.com",
  phone: "731-608-6009",
  mailingAddress: "P.O. Box 1404, Jackson, TN 38302",
};

// Custom option shown alongside packages in the form
export const CUSTOM_SPONSORSHIP_OPTION = {
  id: "custom",
  name: "I would like to discuss a custom sponsorship",
  price: "Contact us",
  priceMin: 0,
};
