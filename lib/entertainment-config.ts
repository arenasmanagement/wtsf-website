/**
 * entertainment-config.ts
 * ─────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH — 2026 West Tennessee State Fair
 * confirmed headline entertainment events.
 *
 * HOW TO UPDATE:
 *   • Add confirmed events to CONFIRMED_EVENTS.
 *   • Set isFeatured: true for the primary headline event.
 *   • Set image: "/images/[event]-poster.webp" when official art is available.
 *   • components/home/EntertainmentSpotlight.tsx renders from this config.
 * ─────────────────────────────────────────────────────────────
 */

import { RODEO_SCHEDULE } from "@/lib/fair-config";

export interface EventNight {
  date: string;
  day: string;
  time: string;
}

export interface ConfirmedEvent {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  nights: EventNight[];
  isFeatured: boolean;
  image?: string; // Set this when official event image is available
}

export const CONFIRMED_EVENTS: ConfirmedEvent[] = [
  {
    id: "bulls-barrels",
    title: "Bulls & Barrels – Buckin’ by Faith",
    category: "Rodeo",
    tagline: "Two Nights of Rodeo Action",
    description:
      "Bull riding, barrel racing, and more — two electrifying nights of rodeo action at the West Tennessee State Fair.",
    nights: [
      { date: RODEO_SCHEDULE[0].shortDate, day: RODEO_SCHEDULE[0].day, time: RODEO_SCHEDULE[0].time },
      { date: RODEO_SCHEDULE[1].shortDate, day: RODEO_SCHEDULE[1].day, time: RODEO_SCHEDULE[1].time },
    ],
    isFeatured: true,
  },
  {
    id: "junior-rodeo",
    title: "Junior Rodeo",
    category: "Youth Rodeo",
    tagline: "Youth Competitors Take Center Stage",
    description:
      "Junior Rodeo showcases the next generation of competitors in traditional rodeo events.",
    nights: [
      { date: RODEO_SCHEDULE[2].shortDate, day: RODEO_SCHEDULE[2].day, time: RODEO_SCHEDULE[2].time },
    ],
    isFeatured: false,
  },
  {
    id: "grill-competition",
    title: "Grill Competition",
    category: "Competition",
    tagline: "Opening Day · Best Grill in West Tennessee",
    description:
      "Competitors fire up their grills on Opening Day. Come out and taste the best barbecue West Tennessee has to offer.",
    nights: [
      { date: "Oct 15", day: "Thursday", time: "2:00 PM" },
    ],
    isFeatured: false,
  },
  {
    id: "antique-tractor-show",
    title: "Antique Tractor Show",
    category: "Exhibit & Show",
    tagline: "Classic Iron on Display",
    description:
      "Beautifully restored antique tractors on display — a celebration of the agricultural heritage that built West Tennessee.",
    nights: [
      { date: "Oct 24", day: "Saturday", time: "Time TBD" },
    ],
    isFeatured: false,
  },
];
