import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import StayUpdatedCallout from "@/components/updates/StayUpdatedCallout";
import {
  SHOWS_2026,
  SHOWMAN_URL,
  type LivestockShow,
} from "@/lib/livestock-config";

export const metadata: Metadata = {
  title: "Livestock Shows — Cattle, Sheep, Goats & Market Animals",
  description:
    "Compete in the 2026 West Tennessee State Fair livestock shows — Cattle Show (Oct 15), Meat Goat Show (Oct 16), and Breeding Sheep Show (Oct 17). Youth exhibitors (12th grade & below) welcome. Henderson, TN.",
  alternates: {
    canonical: "https://wtsfair.com/livestock",
  },
  openGraph: {
    url: "https://wtsfair.com/livestock",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",            item: "https://wtsfair.com" },
    { "@type": "ListItem", position: 2, name: "Livestock Shows", item: "https://wtsfair.com/livestock" },
  ],
};

function IconExternal() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

const REGISTER_LABELS: Record<string, string> = {
  cattle: "Register Cattle",
  "meat-goat": "Register Goats",
  "breeding-sheep": "Register Sheep",
};

function ShowSection({ show, registerLabel }: { show: LivestockShow; registerLabel: string }) {
  const regularPremiums = show.premiums.filter((p) => !p.isChampion);
  const championPremiums = show.premiums.filter((p) => p.isChampion);

  return (
    <section id={show.id} className="scroll-mt-20">
      <div style={{ backgroundColor: show.accentColor }} className="py-7 md:py-9">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {!show.dateConfirmed && (
            <span
              className="inline-block mb-3 px-3 py-1 text-xs font-bold tracking-widest uppercase"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.1em" }}
            >
              Schedule Coming Soon
            </span>
          )}
          <p
            className="text-xs font-bold tracking-widest uppercase mb-1"
            style={{ color: "rgba(245,237,212,0.65)", letterSpacing: "0.2em" }}
          >
            {show.dateConfirmed ? show.date : "2026 · Date To Be Announced"}
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold italic"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            {show.title}
          </h2>
        </div>
      </div>

      <div style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">

          {!show.dateConfirmed && (
            <div
              className="mb-8 px-5 py-4 border-l-4"
              style={{ backgroundColor: "#FFF9EC", borderColor: "#D4A827" }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: "#5C4A32" }}>
                2026 Schedule Not Yet Confirmed
              </p>
              <p className="text-sm" style={{ color: "#8B7355" }}>
                The Fair Board has not yet released the 2026 schedule for this show.
                Rules, premiums, and entry information are listed below. Date and time
                will be posted here as soon as confirmed.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {show.dateConfirmed && show.scheduleRows.length > 0 && (
              <div>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-4"
                  style={{ color: show.accentColor, letterSpacing: "0.15em" }}
                >
                  Schedule
                </p>
                <div className="divide-y" style={{ borderColor: "#E8DFC8" }}>
                  {show.scheduleRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2.5">
                      <span className="text-sm" style={{ color: "#5C4A32" }}>{row.label}</span>
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: row.time === "To Be Announced" ? "#8B7355" : "#1A1A1A",
                          fontStyle: row.time === "To Be Announced" ? "italic" : "normal",
                        }}
                      >
                        {row.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={show.dateConfirmed && show.scheduleRows.length > 0 ? "" : "md:col-span-2"}>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: show.accentColor, letterSpacing: "0.15em" }}
              >
                Entry Details
              </p>
              <div className="divide-y" style={{ borderColor: "#E8DFC8" }}>
                <div className="flex items-start justify-between py-2.5">
                  <span className="text-sm" style={{ color: "#5C4A32" }}>Entry Fee</span>
                  <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{show.entryFee}</span>
                </div>
                <div className="py-2.5">
                  <p className="text-sm mb-1.5" style={{ color: "#5C4A32" }}>Divisions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {show.divisions.map((div) => (
                      <span key={div} className="px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: "#F5EDD4", color: "#5C4A32" }}>
                        {div}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="py-2.5">
                  <p className="text-sm mb-1" style={{ color: "#5C4A32" }}>Format</p>
                  <p className="text-sm" style={{ color: "#8B7355" }}>{show.format}</p>
                </div>
              </div>
            </div>
          </div>

          {show.checkInNotes.length > 0 && (
            <div className="mb-8 px-5 py-4" style={{ backgroundColor: "#F5EDD4", border: "1px solid #E8DFC8" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: show.accentColor, letterSpacing: "0.15em" }}>
                Check-In Notes
              </p>
              <ul className="space-y-1.5">
                {show.checkInNotes.map((note, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: "#5C4A32" }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: show.accentColor }}>•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {show.ruleSets.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: show.accentColor, letterSpacing: "0.15em" }}>
                Rules &amp; Regulations
              </p>
              <div className="space-y-6">
                {show.ruleSets.map((ruleSet) => (
                  <div key={ruleSet.title}>
                    <p className="text-sm font-bold mb-3" style={{ color: "#1A1A1A" }}>{ruleSet.title}</p>
                    <ul className="space-y-2">
                      {ruleSet.rules.map((rule, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
                          <span className="flex-shrink-0 w-5 h-5 mt-0.5 text-xs font-bold flex items-center justify-center" style={{ backgroundColor: show.accentColor, color: "#F5EDD4" }}>
                            {i + 1}
                          </span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {show.breeds && show.breeds.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: show.accentColor, letterSpacing: "0.15em" }}>
                Recognized Breeds
              </p>
              <div className="flex flex-wrap gap-2">
                {show.breeds.map((breed) => (
                  <span key={breed} className="px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: show.accentColor, color: show.accentColor }}>
                    {breed}
                  </span>
                ))}
              </div>
            </div>
          )}

          {show.classGroups && show.classGroups.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: show.accentColor, letterSpacing: "0.15em" }}>
                Classes
              </p>
              <div className={show.classGroups.length > 1 ? "grid gap-6 md:grid-cols-2" : "grid gap-6"}>
                {show.classGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-sm font-bold mb-3" style={{ color: "#1A1A1A" }}>{group.title}</p>
                    <ul className="space-y-1.5">
                      {group.classes.map((cls, i) => (
                        <li
                          key={i}
                          className="text-sm py-1.5 px-3 border-l-2"
                          style={{
                            borderColor: cls.toLowerCase().includes("champion") ? "#D4A827" : show.accentColor + "60",
                            color: cls.toLowerCase().includes("champion") ? "#1A1A1A" : "#5C4A32",
                            fontWeight: cls.toLowerCase().includes("champion") ? 600 : 400,
                            backgroundColor: cls.toLowerCase().includes("champion") ? "#FFF9EC" : "transparent",
                          }}
                        >
                          {cls}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {show.premiums.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: show.accentColor, letterSpacing: "0.15em" }}>
                Premiums
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {regularPremiums.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#8B7355" }}>Placings</p>
                    <div className="divide-y" style={{ borderColor: "#E8DFC8" }}>
                      {regularPremiums.map((premium) => (
                        <div key={premium.label} className="flex items-center justify-between py-2">
                          <span className="text-sm" style={{ color: "#5C4A32" }}>{premium.label}</span>
                          <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{premium.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {championPremiums.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#8B7355" }}>Champion Awards</p>
                    <div className="divide-y" style={{ borderColor: "#E8DFC8" }}>
                      {championPremiums.map((premium) => (
                        <div key={premium.label} className="flex items-center justify-between py-2">
                          <span className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>{premium.label}</span>
                          <span className="text-sm font-bold" style={{ color: "#D4A827" }}>{premium.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            className="mt-8 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ borderColor: "#E8DFC8" }}
          >
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-1"
                style={{ color: show.accentColor, letterSpacing: "0.15em" }}
              >
                Registration
              </p>
              <p className="text-sm" style={{ color: "#8B7355" }}>
                Entries accepted online through Showman
              </p>
            </div>
            <a
              href={SHOWMAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80 flex-shrink-0"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
            >
              {registerLabel}
              <IconExternal />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LivestockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHero
        overline="West Tennessee State Fair"
        headline="Livestock"
        headlineAccent="Shows"
        subtext="Cattle, meat goats, and breeding sheep — judged by certified professionals. Youth exhibitors (12th grade & below) welcome."
        imageSrc="/images/livestock-hero.webp"
        accentColor="#D4A827"
      />

      <div style={{ backgroundColor: "#2C4A2E" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { label: "Shows",        value: "3 Livestock Shows"  },
              { label: "First Show",   value: "Thursday, Oct 15"   },
              { label: "Registration", value: "Online via Showman"         },
              { label: "Eligibility",  value: "12th Grade & Below"  },
            ].map((item) => (
              <div key={item.label} className="px-4 py-4 text-center">
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827", letterSpacing: "0.18em" }}>{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: "#F5EDD4" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b" style={{ backgroundColor: "#F5EDD4", borderColor: "#E8DFC8" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#8B7355", letterSpacing: "0.15em" }}>
            Jump To Show
          </p>
          <div className="flex flex-wrap gap-2">
            {SHOWS_2026.map((show) => (
              <a
                key={show.id}
                href={"#" + show.id}
                className="text-xs font-bold tracking-wide px-4 py-2 border transition-opacity hover:opacity-70"
                style={{ borderColor: show.accentColor, color: show.accentColor, letterSpacing: "0.04em" }}
              >
                {show.navLabel}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#F5EDD4" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="space-y-12">
            {SHOWS_2026.map((show) => (
              <div key={show.id} style={{ border: "1px solid #E8DFC8", overflow: "hidden" }}>
                <ShowSection show={show} registerLabel={REGISTER_LABELS[show.id] ?? "Register Now"} />
              </div>
            ))}
          </div>
        </div>
      </div>


      <section style={{ backgroundColor: "#2C4A2E" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#D4A827" }}>Questions About Livestock?</p>
            <p className="text-xl font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}>
              We&apos;re here to help.
            </p>
            <p className="text-sm" style={{ color: "#A8BFA9" }}>Livestock inquiries: wtsfair@gmail.com</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
<a
              href="mailto:wtsfair@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase border transition-all hover:opacity-80 active:scale-95"
              style={{ borderColor: "rgba(245,237,212,0.35)", color: "#F5EDD4", letterSpacing: "0.1em" }}
            >
              Email the Livestock Team
              <IconArrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
