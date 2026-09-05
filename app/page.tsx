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
  title: {
    absolute: "West Tennessee State Fair 2026 | October 15–24 · Henderson, TN",
  },
  description:
    "Ten days of livestock shows, pageants, exhibits, carnival rides, rodeo, fair food, and family entertainment. October 15–24, 2026 in Henderson, TN. Admission from $5. Free parking. 171 years of West Tennessee tradition.",
  alternates: {
    canonical: "https://wtsfair.com",
  },
  openGraph: {
    title: "West Tennessee State Fair 2026 — Back to Our Roots",
    description:
      "171 years of community, competition, and celebration. October 15–24, 2026 in Henderson, TN.",
    url: "https://wtsfair.com",
  },
};


function SeasonPassBanner() {
  return (
    <section
      className="py-12 md:py-14"
      style={{ backgroundColor: "#2C4A2E" }}
      aria-labelledby="season-pass-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "#D4A827", letterSpacing: "0.3em" }}
        >
          2026 Fair Gate Season Pass
        </p>
        <p
          id="season-pass-heading"
          className="text-5xl sm:text-6xl font-bold italic mb-3"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
        >
          $25
        </p>
        <p
          className="text-xl font-bold italic mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#D4A827" }}
        >
          Come Every Day for Just $25
        </p>
        <div className="w-10 h-0.5 mx-auto mb-5" style={{ backgroundColor: "rgba(212,168,39,0.4)" }} aria-hidden="true" />
        <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "#A8BFA9" }}>
          One pass gets you gate admission every day of the fair — all 10 days,
          October 15–24. Does not include ride armbands. Available at the gate.
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <KeyFactsBar />
      <FairCountdown />
      <HeritageSection />
      <FairExperience />
      <SeasonPassBanner />
      <EntertainmentSpotlight />
      <ParticipationCTAs />
      <SponsorSection />
      <SubscribeSection />
    </>
  );
}
