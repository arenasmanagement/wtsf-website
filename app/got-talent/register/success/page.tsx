"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { getDivisionById } from "@/lib/got-talent-config";

interface ConfirmedReg {
  id: string;
  actName: string;
  actType: string;
  division: string;
  primaryPerformerName: string;
  contactName: string;
  contactEmail: string;
  requiresMusic: boolean;
  amountCents: number;
  confirmedAt: string;
}

export default function GotTalentSuccessPage() {
  const params = useSearchParams();
  const registrationId = params.get("registrationId");
  const [reg, setReg] = useState<ConfirmedReg | null>(null);

  useEffect(() => {
    if (!registrationId) return;
    fetch(`/api/got-talent/admin/registrations/${registrationId}`)
      .then((r) => r.json())
      .then((data: ConfirmedReg & { error?: string }) => {
        if (!data.error) setReg(data);
      })
      .catch(() => null);

    trackEvent("got_talent_registration_success");
  }, [registrationId]);

  const divisionInfo = reg ? getDivisionById(reg.division) : null;

  return (
    <main
      id="main-content"
      style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", padding: "5rem 1.5rem 3rem", fontFamily: "Georgia, serif" }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        {/* Checkmark */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#2C4A2E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#F5EDD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={{ color: "#D4A827", fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 0.5rem" }}>
          Registration Confirmed
        </p>
        <h1 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "2.25rem", margin: "0 0 0.75rem" }}>
          You&apos;re In!
        </h1>

        {reg ? (
          <>
            <p style={{ color: "#5C4A32", fontSize: "1rem", lineHeight: "1.6", margin: "0 0 2rem" }}>
              <strong>{reg.actName}</strong> is officially entered in WTSF Got Talent 2026.
              {reg.contactEmail && (
                <> A confirmation has been sent to <strong>{reg.contactEmail}</strong>.</>
              )}
            </p>

            {/* Summary card */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "2px solid #D4A827",
                borderRadius: "8px",
                padding: "1.5rem",
                textAlign: "left",
                marginBottom: "2rem",
              }}
            >
              <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 1rem" }}>
                Your Details
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Act", reg.actName],
                    ["Talent Type", reg.actType],
                    ["Division", divisionInfo?.label ?? reg.division],
                    ...(divisionInfo
                      ? [["Performance", `${divisionInfo.performanceDate} · ${divisionInfo.performanceTime}`]]
                      : []),
                    ["Music Required", reg.requiresMusic ? "Yes — bring track on USB or phone" : "No"],
                    ["Paid", `$${(reg.amountCents / 100).toFixed(2)}`],
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: "1px solid #E8DFC8" }}>
                      <td style={{ padding: "0.5rem 0", color: "#7A6A52", fontSize: "0.85rem", width: "38%" }}>{label}</td>
                      <td style={{ padding: "0.5rem 0", color: "#2C4A2E", fontSize: "0.9rem" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Music reminder */}
            {reg.requiresMusic && (
              <div
                style={{
                  backgroundColor: "#FFF8E7",
                  border: "2px solid #D4A827",
                  borderRadius: "6px",
                  padding: "1.25rem",
                  textAlign: "left",
                  marginBottom: "1.5rem",
                }}
              >
                <p style={{ color: "#8B6914", fontWeight: "700", margin: "0 0 0.4rem" }}>🎵 Music Reminder</p>
                <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: 0 }}>
                  Please bring your track on a USB/jump drive or your phone. Have it downloaded and ready to play
                  before your performance — the sound team has cables for different phone types.
                </p>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "#5C4A32", lineHeight: "1.6", marginBottom: "2rem" }}>
            Your payment was successful and you are officially entered in WTSF Got Talent 2026.
            A confirmation email is on its way to you.
          </p>
        )}

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/got-talent"
            style={{
              backgroundColor: "#2C4A2E",
              color: "#F5EDD4",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.9rem",
            }}
          >
            Back to Got Talent
          </Link>
          <Link
            href="/"
            style={{
              border: "2px solid #2C4A2E",
              color: "#2C4A2E",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.9rem",
            }}
          >
            Visit the Fair Website
          </Link>
        </div>
      </div>
    </main>
  );
}
