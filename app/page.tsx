import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import KeyFactsBar from "@/components/home/KeyFactsBar";
import FairCountdown from "@/components/home/FairCountdown";
import HeritageSection from "@/components/home/HeritageSection";
import FairExperience from "@/components/home/FairExperience";
import EntertainmentSpotlight from "@/components/home/EntertainmentSpotlight";
import ParticipationCTAs from "@/components/home/ParticipationCTAs";
import SponsorSection from "@/components/home/SponsorSection";
import SubscribeSection from "@/components/updates/SubscribeSection";

export const metadata: Metadata = {
  title: "West Tennessee State Fair 2026 — Back to Our Roots",
  description:
    "Join us October 2026 in Henderson, TN for the West Tennessee State Fair. Rodeo, live entertainment, livestock shows, pageants, exhibits, food vendors, and more. 171 years of tradition.",
  openGraph: {
    title: "West Tennessee State Fair 2026 — Back to Our Roots",
    description:
      "171 years of community, competition, and celebration. October 2026 in Henderson, TN.",
    url: "https://www.wtsfair.com",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <KeyFactsBar />
      <FairCountdown />
      <HeritageSection />
      <FairExperience />
      <EntertainmentSpotlight />
      <ParticipationCTAs />
      <SponsorSection />
      <SubscribeSection />
    </>
  );
}
