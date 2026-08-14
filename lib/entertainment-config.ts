/**
 * entertainment-config.ts
 * ─────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH — 2026 West Tennessee State Fair
 * confirmed headline entertainment events.
 *
 * HOW TO UPDATE:
 *   • Add confirmed events to CONFIRMED_EVENTS.
 *   • Rodeo dates/times come from RODEO_SCHEDULE in lib/fair-config.ts
 *     — do not duplicate them here. Reference them directly.
 *   • Set isFeatured: true for the primary headline event.
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
}

export const CONFIRMED_EVENTS: ConfirmedEvent[] = [
  {
    id: "prca-rodeo",
    title: "PRCA Rodeo",
    category: "Professional Rodeo",
    tagline: "Two Nights of Professional Rodeo Action",
    description:
      "The West Tennessee State Fair hosts two nights of PRCA-sanctioned rodeo — bull riding, barrel racing, calf roping, and more.",
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
];
