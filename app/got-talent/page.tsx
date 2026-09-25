import type { Metadata } from "next";
import Link from "next/link";
import { GOT_TALENT_DIVISIONS } from "@/lib/got-talent-config";
import { createAdminClient } from "@/lib/supabase/admin";

// Force dynamic rendering so the closed/open state is always fresh.
// Deadline is sourced from got_talent_settings.registration_closes_at in Supabase
// (set to 2026-10-21 05:00:00 UTC = midnight America/Chicago CDT).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WTSF Got Talent 2026 — West Tennessee State Fair",
  description:
    "Show your talent at the 2026 West Tennessee State Fair! Kids, Youth, and Adult divisions. $25 per act. Register by October 20, 2026.",
  alternates: {
    canonical: "https://wtsfair.com/got-talent",
  },
  openGraph: {
    title: "WTSF Got Talent 2026",
    description: "Compete in singing, dancing, comedy, magic, and more at the West Tennessee State Fair.",
    url: "https://wtsfair.com/got-talent",
  },
};

const DIV_COLORS: Record<string, string> = {
  kids: "#D4A827",
  youth: "#2C4A2E",
  adult: "#8B2E2E",
};

/** Derive the human-readable deadline day from the DB timestamp (in America/Chicago). */
function formatDeadlineDay(closesAt: string): string {
  // closes_at is the exclusive cutoff (midnight Oct 21 = after Oct 20).
  // Subtract 1 ms to land in the final eligible second, then format in Chicago.
  return new Date(new Date(closesAt).getTime() - 1).toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function getRegistrationStatus(): Promise<{
  isOpen: boolean;
  deadlineDay: string;
}> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("got_talent_settings")
      .select("registration_open, registration_closes_at")
      .eq("id", 1)
      .single();

    if (!data) return { isOpen: true, deadlineDay: "October 20, 2026" };

    const closesAt = data.registration_closes_at as string | null;
    const deadlineDay = closesAt ? formatDeadlineDay(closesAt) : "October 20, 2026";
    const isOpen =
      data.registration_open === true &&
      (!closesAt || new Date() < new Date(closesAt));

    return { isOpen, deadlineDay };
  } catch {
    // Fail open for the public UI — API routes enforce strictly regardless.
    return { isOpen: true, deadlineDay: "October 20, 2026" };
  }
}

export default async function GotTalentPage() {
  const { isOpen, deadlineDay } = await getRegistrationStatus();

  return (
    <main id="main-content" style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>

      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: "#1E3320",
          backgroundImage: "radial-gradient(ellipse at 60% 40%, rgba(212,168,39,0.12) 0%, transparent 60%)",
          padding: "7rem 1.5rem 5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#D4A827",
            fontSize: "0.75rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            margin: "0 0 1rem",
          }}
        >
          West Tennessee State Fair · 2026
        </p>
        <h1
          style={{
            color: "#F5EDD4",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontFamily: "var(--font-playfair, Georgia, serif)",
            margin: "0 0 1.25rem",
            lineHeight: 1.1,
          }}
        >
          WTSF Got Talent
        </h1>
        <p
          style={{
            color: "#E8DFC8",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            maxWidth: "580px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}
        >
          Singing. Dancing. Comedy. Magic. Variety. Whatever you&apos;ve got —
          bring it to the stage at the West Tennessee State Fair.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {isOpen ? (
            <Link
              href="/got-talent/register"
              style={{
                display: "inline-block",
                backgroundColor: "#D4A827",
                color: "#1A1A1A",
                padding: "0.9rem 2.25rem",
                borderRadius: "4px",
                fontFamily: "Georgia, serif",
                fontWeight: "700",
                fontSize: "1rem",
                textDecoration: "none",
                letterSpacing: "0.5px",
              }}
            >
              Register Your Act — $25
            </Link>
          ) : (
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#5C4A32",
                color: "#D4C89A",
                padding: "0.9rem 2.25rem",
                borderRadius: "4px",
                fontFamily: "Georgia, serif",
                fontWeight: "700",
                fontSize: "1rem",
                letterSpacing: "0.5px",
                cursor: "default",
              }}
            >
              REGISTRATION CLOSED
            </span>
          )}
          <a
            href="#details"
            style={{
              display: "inline-block",
              border: "2px solid #D4A827",
              color: "#D4A827",
              padding: "0.85rem 2rem",
              borderRadius: "4px",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            Event Details
          </a>
        </div>
        <p style={{ color: "#A89070", fontSize: "0.85rem", margin: "1.5rem 0 0" }}>
          {isOpen
            ? `Registration closes ${deadlineDay} · $25 per act · All ages welcome`
            : `Registration closed ${deadlineDay} · All ages welcome`}
        </p>
      </section>

      {/* ── Divisions ── */}
      <section id="details" style={{ padding: "5rem 1.5rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#2C4A2E",
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontFamily: "var(--font-playfair, Georgia, serif)",
            margin: "0 0 0.75rem",
          }}
        >
          Competition Divisions
        </h2>
        <p style={{ textAlign: "center", color: "#5C4A32", fontSize: "1rem", margin: "0 0 3rem", lineHeight: 1.6 }}>
          Age determines your division. Performance dates vary — check yours below.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {GOT_TALENT_DIVISIONS.map((div) => (
            <div
              key={div.id}
              style={{
                backgroundColor: "#fff",
                border: `2px solid ${DIV_COLORS[div.id] ?? "#D4A827"}`,
                borderRadius: "8px",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: DIV_COLORS[div.id] ?? "#D4A827",
                  color: div.id === "youth" ? "#F5EDD4" : "#1A1A1A",
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "3px",
                  fontSize: "0.7rem",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  marginBottom: "0.75rem",
                }}
              >
                {div.ageLabel}
              </div>
              <h3
                style={{
                  color: "#2C4A2E",
                  fontFamily: "var(--font-playfair, Georgia, serif)",
                  fontSize: "1.75rem",
                  margin: "0 0 1.25rem",
                }}
              >
                {div.label}
              </h3>
              <div style={{ borderTop: "1px solid #E8DFC8", paddingTop: "1.25rem" }}>
                <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>
                  <strong>Performance Date</strong>
                </p>
                <p style={{ color: "#2C4A2E", fontSize: "1rem", margin: "0 0 0.75rem", fontWeight: "700" }}>
                  {div.performanceDate}
                </p>
                <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: "0 0 0.25rem" }}>
                  Check-in / Start Time
                </p>
                <p style={{ color: "#2C4A2E", fontSize: "1rem", margin: "0" }}>
                  {div.performanceTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Entry Details ── */}
      <section style={{ backgroundColor: "#2C4A2E", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#D4A827",
              fontFamily: "var(--font-playfair, Georgia, serif)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              margin: "0 0 2rem",
              textAlign: "center",
            }}
          >
            Entry Information
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              { label: "Entry Fee", value: "$25 per act" },
              isOpen
                ? { label: "Registration Deadline", value: deadlineDay }
                : { label: "Registration", value: "Closed" },
              { label: "Act Types", value: "Solo or small group" },
              { label: "Bands", value: "Not permitted" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <p style={{ color: "#A89070", fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.35rem" }}>
                  {item.label}
                </p>
                <p style={{ color: "#F5EDD4", fontSize: "1.1rem", fontWeight: "700", margin: "0" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Rules block */}
          <div
            style={{
              backgroundColor: "rgba(212,168,39,0.12)",
              border: "1px solid rgba(212,168,39,0.4)",
              borderRadius: "6px",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.25rem",
            }}
          >
            <p style={{ color: "#D4A827", fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem", fontWeight: "700" }}>
              Act Guidelines
            </p>
            <p style={{ color: "#E8DFC8", fontSize: "0.95rem", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
              Solo and small-group musical acts are welcome, including performers using instruments.
              Bands are not permitted, and <strong>instruments and personal audio equipment cannot be
              connected to the Fair&apos;s sound system.</strong>
            </p>
            <p style={{ color: "#E8DFC8", fontSize: "0.95rem", margin: "0", lineHeight: 1.6 }}>
              If your performance uses a music track, please bring it downloaded and ready to play
              on a <strong>USB/jump drive</strong> or your <strong>phone</strong>. Our sound team has
              cables for different phone types. Do not rely on streaming.
            </p>
          </div>

          {/* Prizes placeholder */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(245,237,212,0.15)",
              borderRadius: "6px",
              padding: "1.25rem 1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <p style={{ color: "#D4A827", fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.5rem", fontWeight: "700" }}>
              Prizes
            </p>
            <p style={{ color: "#E8DFC8", fontSize: "0.95rem", margin: "0", lineHeight: 1.6 }}>
              1st Place — $200 &nbsp;·&nbsp; 2nd Place — $100 &nbsp;·&nbsp; 3rd Place — $50
            </p>
            <p style={{ color: "#A89070", fontSize: "0.8rem", margin: "0.5rem 0 0" }}>
              Prize structure details (per division vs. overall) to be announced.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            {isOpen ? (
              <Link
                href="/got-talent/register"
                style={{
                  display: "inline-block",
                  backgroundColor: "#D4A827",
                  color: "#1A1A1A",
                  padding: "0.9rem 2.5rem",
                  borderRadius: "4px",
                  fontFamily: "Georgia, serif",
                  fontWeight: "700",
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                Register Now — $25 per Act
              </Link>
            ) : (
              <p style={{ color: "#D4C89A", fontSize: "1rem", margin: 0 }}>
                Registration for WTSF Got Talent 2026 is now closed.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: "720px", margin: "0 auto" }}>
        <h2
          style={{
            color: "#2C4A2E",
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            margin: "0 0 2rem",
            textAlign: "center",
          }}
        >
          Questions
        </h2>
        {[
          {
            q: "Can a group enter as one act?",
            a: "Yes. One registration covers your whole group. $25 per act, regardless of size. Note: bands are not permitted.",
          },
          {
            q: "What if my group has performers in different age divisions?",
            a: "Contact us before registering. Mixed-age groups may require coordinator review to confirm the correct division assignment.",
          },
          {
            q: "What types of talent can compete?",
            a: "Singing, dancing, comedy, magic, instrumental, variety, novelty, and cheer acts are all welcome. Bands are not permitted.",
          },
          {
            q: "Can I perform with an instrument?",
            a: "Yes — solo instrumentalists and small musical acts are welcome. However, instruments and personal audio equipment cannot be connected to the Fair's sound system. If your performance includes a backing track, bring it on a USB/jump drive or your phone.",
          },
          {
            q: "Do I bring my music with me?",
            a: "Yes. Bring your track on a USB/jump drive or your phone with it downloaded. Our sound team can accept both. Do not rely on streaming.",
          },
          {
            q: "What is the registration deadline?",
            a: isOpen
              ? `${deadlineDay} at 11:59 PM CT. Contestants must complete the $25 payment by the deadline to be officially registered. Register early.`
              : `Registration closed at the end of ${deadlineDay}. WTSF Got Talent 2026 registration is now closed.`,
          },
        ].map((item) => (
          <div
            key={item.q}
            style={{
              borderBottom: "1px solid #D4C89A",
              padding: "1.25rem 0",
            }}
          >
            <h3 style={{ color: "#2C4A2E", fontSize: "1rem", margin: "0 0 0.5rem", fontFamily: "Georgia, serif", fontWeight: "700" }}>
              {item.q}
            </h3>
            <p style={{ color: "#5C4A32", fontSize: "0.95rem", margin: "0", lineHeight: 1.6 }}>
              {item.a}
            </p>
          </div>
        ))}
      </section>

      {/* ── Final CTA ── */}
      <section style={{ backgroundColor: "#F5EDD4", borderTop: "2px solid #D4A827", padding: "3rem 1.5rem", textAlign: "center" }}>
        {isOpen ? (
          <>
            <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.75rem", margin: "0 0 0.75rem" }}>
              Ready to Compete?
            </h2>
            <p style={{ color: "#5C4A32", margin: "0 0 1.75rem" }}>
              Registration closes {deadlineDay} at 11:59 PM CT · $25 per act
            </p>
            <Link
              href="/got-talent/register"
              style={{
                display: "inline-block",
                backgroundColor: "#2C4A2E",
                color: "#F5EDD4",
                padding: "0.9rem 2.25rem",
                borderRadius: "4px",
                fontFamily: "Georgia, serif",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Register Your Act
            </Link>
          </>
        ) : (
          <>
            <h2 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.75rem", margin: "0 0 0.75rem" }}>
              WTSF Got Talent 2026
            </h2>
            <p style={{ color: "#5C4A32", margin: "0" }}>
              Registration closed {deadlineDay}. Thank you to everyone who entered.
            </p>
          </>
        )}
      </section>

    </main>
  );
}
