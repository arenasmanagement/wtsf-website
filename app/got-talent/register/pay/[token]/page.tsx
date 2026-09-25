"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import Link from "next/link";

type TokenResult = { status: string; token?: string; errors?: Array<{ message: string }> };
type WalletButton = {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<TokenResult>;
  addEventListener: (event: string, handler: (e: { detail: { tokenResult: TokenResult } }) => void) => void;
};

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<{
        card: () => Promise<{ attach: (s: string) => Promise<void>; tokenize: () => Promise<TokenResult> }>;
        paymentRequest: (opts: { countryCode: string; currencyCode: string; total: { amount: string; label: string } }) => unknown;
        googlePay: (req: unknown) => Promise<WalletButton>;
        applePay: (req: unknown) => Promise<WalletButton>;
      }>;
    };
  }
}

interface RegData {
  registrationId: string;
  status: string;
  actName: string;
  actType: string;
  division: string;
  divisionLabel: string;
  performanceDate: string;
  performanceTime: string;
  requiresMusic: boolean;
  maskedEmail: string;
  amountCents: number;
  paymentDeadline: string;
  registrationClosed: boolean;
}

const SANDBOX_MODE = process.env.NEXT_PUBLIC_SQUARE_SANDBOX_MODE !== "false";
const SQUARE_JS_URL = SANDBOX_MODE
  ? "https://sandbox.web.squarecdn.com/v1/square.js"
  : "https://web.squarecdn.com/v1/square.js";

export default function GotTalentPayPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token;

  const [loading, setLoading] = useState(true);
  const [reg, setReg] = useState<RegData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [squareReady, setSquareReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const cardRef = useRef<{ tokenize: () => Promise<TokenResult> } | null>(null);
  const googlePayRef = useRef<WalletButton | null>(null);
  const applePayRef = useRef<WalletButton | null>(null);
  const squareMountedRef = useRef(false);

  // Got Talent uses its own public location ID
  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId =
    process.env.NEXT_PUBLIC_GOT_TALENT_SQUARE_LOCATION_ID ??
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ??
    "";
  const squareConfigured = Boolean(appId && locationId);

  // Fetch registration data from resume endpoint
  useEffect(() => {
    if (!token) return;
    fetch(`/api/got-talent/resume?token=${token}`)
      .then(async (res) => {
        const data = await res.json() as RegData & { error?: string };
        if (!res.ok) {
          setFetchError(data.error ?? "Registration not found.");
          return;
        }
        if (data.status === "CONFIRMED") {
          router.replace(`/got-talent/register/success?registrationId=${data.registrationId}`);
          return;
        }
        if (data.registrationClosed) {
          setRegistrationClosed(true);
        }
        setReg(data);
        trackEvent("got_talent_payment_started");
      })
      .catch(() => setFetchError("Failed to load registration. Please try again."))
      .finally(() => setLoading(false));
  }, [token, router]);

  // Load Square SDK
  useEffect(() => {
    if (!reg || !squareConfigured || squareMountedRef.current) return;
    squareMountedRef.current = true;

    const script = document.createElement("script");
    script.src = SQUARE_JS_URL;
    script.async = true;
    script.onload = async () => {
      try {
        if (!window.Square) return;
        const payments = await window.Square.payments(appId, locationId);

        // Card form — retry up to 3 times
        let card = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            card = await payments.card();
            await card.attach("#square-card-container");
            break;
          } catch {
            if (attempt === 3) throw new Error("Card form failed to initialize");
            await new Promise((r) => setTimeout(r, 1000 * attempt));
          }
        }
        cardRef.current = card as typeof card;
        setSquareReady(true);

        // Wallet buttons
        if (reg.amountCents) {
          const amountStr = (reg.amountCents / 100).toFixed(2);

          // Google Pay
          try {
            const gpReq = payments.paymentRequest({ countryCode: "US", currencyCode: "USD", total: { amount: amountStr, label: "WTSF Got Talent Entry" } });
            const gp = await payments.googlePay(gpReq);
            await gp.attach("#google-pay-button");
            googlePayRef.current = gp;
            gp.addEventListener("ontokenization", (e) => {
              const { tokenResult } = e.detail;
              if (tokenResult.status === "OK" && tokenResult.token) void submitPayment(tokenResult.token);
            });
            setGooglePayAvailable(true);
          } catch { /* unavailable in this browser */ }

          // Apple Pay
          try {
            const apReq = payments.paymentRequest({ countryCode: "US", currencyCode: "USD", total: { amount: amountStr, label: "WTSF Got Talent Entry" } });
            const ap = await payments.applePay(apReq);
            if (ap && typeof ap.attach === "function") {
              await ap.attach("#apple-pay-button");
              applePayRef.current = ap;
              ap.addEventListener("ontokenization", (e) => {
                const { tokenResult } = e.detail;
                if (tokenResult.status === "OK" && tokenResult.token) void submitPayment(tokenResult.token);
              });
              setApplePayAvailable(true);
            }
          } catch { /* unavailable in this browser */ }
        }
      } catch {
        setPayError("Could not initialize payment form. Please refresh the page.");
      }
    };
    script.onerror = () => setPayError("Could not load payment library. Please refresh and try again.");
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reg, squareConfigured, appId, locationId]);

  async function submitPayment(sourceId: string) {
    if (!reg) return;
    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch("/api/got-talent/square/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: reg.registrationId, sourceId }),
      });
      const data = await res.json() as { success?: boolean; error?: string; squareError?: string };
      if (res.ok && data.success) {
        trackEvent("got_talent_registration_confirmed");
        router.push(`/got-talent/register/success?registrationId=${reg.registrationId}`);
      } else {
        setPayError(data.squareError ?? data.error ?? "Payment was not completed. Please try again.");
        setPaying(false);
      }
    } catch {
      setPayError("A network error occurred. Please try again.");
      setPaying(false);
    }
  }

  async function handleCardPay() {
    if (!cardRef.current || paying) return;
    setPaying(true);
    setPayError(null);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status === "OK" && result.token) {
        await submitPayment(result.token);
      } else {
        const msgs = result.errors?.map((e) => e.message).join(", ");
        setPayError(msgs ?? "Card validation failed. Please check your card details.");
        setPaying(false);
      }
    } catch {
      setPayError("An error occurred. Please try again.");
      setPaying(false);
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#5C4A32", fontFamily: "Georgia, serif" }}>Loading…</p>
      </main>
    );
  }

  // ── Error ──
  if (fetchError || !reg) {
    return (
      <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <h1 style={{ color: "#8B2E2E", fontFamily: "Georgia, serif", marginBottom: "1rem" }}>Registration Not Found</h1>
          <p style={{ color: "#5C4A32", marginBottom: "1.5rem" }}>{fetchError ?? "This registration link is invalid or has expired."}</p>
          <Link href="/got-talent" style={{ color: "#2C4A2E", fontWeight: "700" }}>← Back to Got Talent</Link>
        </div>
      </main>
    );
  }

  // ── Registration Closed ──
  if (registrationClosed && reg) {
    return (
      <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "520px" }}>
          <p style={{ color: "#D4A827", fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 1rem" }}>
            WTSF Got Talent 2026
          </p>
          <h1 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "2rem", margin: "0 0 1rem" }}>
            Registration is Closed
          </h1>
          <p style={{ color: "#5C4A32", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
            WTSF Got Talent 2026 registration closed at the end of October 20, 2026.
          </p>
          <p style={{ color: "#5C4A32", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            Your application for <strong>{reg.actName}</strong> has not been confirmed.
            Only paid registrations received by the deadline count as official entries.
          </p>
          <div style={{ backgroundColor: "#fff", border: "1px solid #D4C89A", borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
            <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.5rem" }}>Your Application</p>
            <p style={{ color: "#2C4A2E", margin: "0 0 0.25rem" }}><strong>{reg.actName}</strong> · {reg.divisionLabel}</p>
            <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: 0 }}>Status: <strong>Not confirmed</strong> — payment deadline passed</p>
          </div>
          <Link href="/got-talent" style={{ color: "#2C4A2E", fontWeight: "700" }}>← Back to Got Talent</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", padding: "5rem 1.5rem 3rem", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ color: "#D4A827", fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 0.5rem" }}>
            WTSF Got Talent 2026 · One Step Left
          </p>
          <h1 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "2rem", margin: "0 0 0.5rem" }}>
            Complete Your Entry
          </h1>
          <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: 0 }}>
            A confirmation email will be sent to {reg.maskedEmail}
          </p>
        </div>

        {/* Registration summary */}
        <div style={{ backgroundColor: "#fff", border: "2px solid #D4A827", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem" }}>Registration Summary</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Act", reg.actName],
                ["Talent Type", reg.actType],
                ["Division", `${reg.divisionLabel}`],
                ["Performance", `${reg.performanceDate} · ${reg.performanceTime}`],
                ...(reg.requiresMusic ? [["Music", "Bring track on USB or phone"]] : []),
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: "1px solid #E8DFC8" }}>
                  <td style={{ padding: "0.5rem 0", color: "#7A6A52", fontSize: "0.85rem", width: "40%" }}>{label}</td>
                  <td style={{ padding: "0.5rem 0", color: "#2C4A2E", fontSize: "0.9rem" }}>{value}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: "0.75rem 0 0", color: "#2C4A2E", fontWeight: "700" }}>Entry Fee</td>
                <td style={{ padding: "0.75rem 0 0", color: "#2C4A2E", fontWeight: "700", fontSize: "1.1rem" }}>
                  ${(reg.amountCents / 100).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Square not configured */}
        {!squareConfigured && (
          <div style={{ backgroundColor: "#FFF8E7", border: "2px solid #D4A827", borderRadius: "6px", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#8B6914", fontWeight: "700", margin: "0 0 0.5rem" }}>Payment System Not Yet Configured</p>
            <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: 0 }}>
              Online payment is not yet available for Got Talent registrations. Please contact us at{" "}
              <a href="mailto:wtsfair@wtsfair.com" style={{ color: "#2C4A2E" }}>wtsfair@wtsfair.com</a> to complete your registration.
            </p>
          </div>
        )}

        {/* Payment form */}
        {squareConfigured && (
          <div style={{ backgroundColor: "#fff", border: "2px solid #D4C89A", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#7A6A52", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 1rem" }}>Payment</p>

            {/* Wallet buttons */}
            {(googlePayAvailable || applePayAvailable) && (
              <div style={{ marginBottom: "1rem" }}>
                <div id="google-pay-button" style={{ display: googlePayAvailable ? "block" : "none", marginBottom: "0.5rem" }} />
                <div id="apple-pay-button" style={{ display: applePayAvailable ? "block" : "none", marginBottom: "0.5rem" }} />
                {(googlePayAvailable || applePayAvailable) && (
                  <div style={{ textAlign: "center", color: "#A89070", fontSize: "0.8rem", margin: "0.75rem 0" }}>— or pay by card —</div>
                )}
              </div>
            )}

            {/* Hidden wallet containers when not showing */}
            {!googlePayAvailable && <div id="google-pay-button" style={{ display: "none" }} />}
            {!applePayAvailable && <div id="apple-pay-button" style={{ display: "none" }} />}

            {/* Card input */}
            <div
              id="square-card-container"
              style={{
                minHeight: "90px",
                border: squareReady ? "2px solid #D4C89A" : "2px dashed #E8DFC8",
                borderRadius: "4px",
                padding: "0.5rem",
                backgroundColor: squareReady ? "#fff" : "#FAFAF8",
                marginBottom: "1rem",
              }}
            />

            {!squareReady && !payError && (
              <p style={{ color: "#A89070", fontSize: "0.85rem", textAlign: "center", marginBottom: "1rem" }}>
                Loading payment form…
              </p>
            )}

            {payError && (
              <div style={{ backgroundColor: "#FDF0F0", border: "1px solid #E57373", borderRadius: "4px", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
                <p style={{ color: "#8B2E2E", margin: 0, fontSize: "0.9rem" }}>{payError}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleCardPay}
              disabled={!squareReady || paying}
              style={{
                width: "100%",
                backgroundColor: paying || !squareReady ? "#A89070" : "#D4A827",
                color: "#1A1A1A",
                border: "none",
                padding: "0.95rem",
                borderRadius: "4px",
                fontSize: "1rem",
                fontFamily: "Georgia, serif",
                fontWeight: "700",
                cursor: paying || !squareReady ? "not-allowed" : "pointer",
              }}
            >
              {paying ? "Processing…" : `Pay $${(reg.amountCents / 100).toFixed(2)} and Enter`}
            </button>

            <p style={{ color: "#A89070", fontSize: "0.75rem", textAlign: "center", margin: "0.75rem 0 0" }}>
              Secured by Square · Your registration is not confirmed until payment succeeds
            </p>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#A89070" }}>
          <Link href="/got-talent" style={{ color: "#5C4A32" }}>← Back to Got Talent</Link>
        </p>
      </div>
    </main>
  );
}
