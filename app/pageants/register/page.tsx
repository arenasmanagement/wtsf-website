import type { Metadata } from "next";
import { PAGEANT_DIVISIONS, PAGEANT_DATE, PAGEANT_VENUE, PAGEANT_LOCATION, PAGEANT_REGISTRATION_ENABLED } from "@/lib/pageant-config";

export const metadata: Metadata = {
  title: "Register — 2026 Traditional Fair Pageants",
  description: "Register your contestant for the 2026 West Tennessee State Fair Traditional Pageants at Williams Auditorium in Henderson, Tennessee.",
  alternates: {
    canonical: "https://www.wtsfair.com/pageants/register",
  },
};

export default function PageantRegisterPage() {
  return (
    <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Hero */}
      <section
        style={{
          backgroundColor: "#2C4A2E",
          padding: "3rem 1.5rem 2.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#D4A827",
            fontSize: "0.75rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            margin: "0 0 0.5rem",
          }}
        >
          West Tennessee State Fair · 2026
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#F5EDD4",
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            fontWeight: 700,
            margin: "0 0 0.75rem",
          }}
        >
          Traditional Fair Pageants
        </h1>
        <p style={{ color: "#E8DFC8", fontSize: "1.0625rem", margin: 0 }}>
          {PAGEANT_DATE} &nbsp;&bull;&nbsp; {PAGEANT_VENUE} &nbsp;&bull;&nbsp; {PAGEANT_LOCATION}
        </p>
      </section>

      {/* Registration status banner */}
      {!PAGEANT_REGISTRATION_ENABLED && (
        <section
          style={{
            backgroundColor: "#E8DFC8",
            borderBottom: "1px solid #D4A827",
            padding: "1.25rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#5C4A32",
              fontSize: "0.9375rem",
              margin: 0,
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Registration for the 2026 Traditional Fair Pageants will open soon. Check back here
            or{" "}
            <a href="/stay-updated" style={{ color: "#2C4A2E", fontWeight: 600 }}>
              subscribe to Fair Updates
            </a>{" "}
            for announcements.
          </p>
        </section>
      )}

      {/* Division cards */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#2C4A2E",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Pageant Divisions
        </h2>
        <p
          style={{
            color: "#8B7355",
            textAlign: "center",
            marginBottom: "2.5rem",
            fontSize: "0.9375rem",
          }}
        >
          Seven divisions for contestants ages 0–13 years
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {PAGEANT_DIVISIONS.map((division) => (
            <div
              key={division.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #E8DFC8",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Accent bar */}
              <div
                style={{
                  backgroundColor: division.accentColor,
                  height: "5px",
                }}
              />
              <div style={{ padding: "1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: division.accentColor,
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    margin: "0 0 0.25rem",
                  }}
                >
                  {division.name}
                </h3>
                <p
                  style={{
                    color: "#8B7355",
                    fontSize: "0.875rem",
                    margin: "0 0 1rem",
                    fontStyle: "italic",
                  }}
                >
                  Ages {division.ageLabel}
                </p>

                <div style={{ borderTop: "1px solid #E8DFC8", paddingTop: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Date</span>
                    <span style={{ color: "#2C4A2E", fontSize: "0.875rem", fontWeight: 600 }}>
                      October 17, 2026
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Arrival</span>
                    <span style={{ color: "#2C4A2E", fontSize: "0.875rem", fontWeight: 600 }}>
                      {division.arrivalTime}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Competition</span>
                    <span style={{ color: "#2C4A2E", fontSize: "0.875rem", fontWeight: 600 }}>
                      {division.competitionTime}
                    </span>
                  </div>
                </div>

                <button
                  disabled
                  style={{
                    width: "100%",
                    backgroundColor: "#E8DFC8",
                    color: "#8B7355",
                    border: "1px solid #D4A827",
                    borderRadius: "4px",
                    padding: "0.625rem",
                    fontSize: "0.875rem",
                    fontFamily: "Georgia, serif",
                    cursor: "not-allowed",
                  }}
                >
                  Registration Opening Soon
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Questions note */}
        <p
          style={{
            textAlign: "center",
            color: "#8B7355",
            fontSize: "0.9375rem",
            marginTop: "2.5rem",
          }}
        >
          Questions? Contact the pageant team at{" "}
          <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E", fontWeight: 600 }}>
            wtsfpageant@outlook.com
          </a>
        </p>
      </section>
    </main>
  );
}
