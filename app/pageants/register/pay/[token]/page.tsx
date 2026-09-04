"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<TokenResult>;
        }>;
        paymentRequest: (opts: {
          countryCode: string;
          currencyCode: string;
          total: { amount: string; label: string };
        }) => unknown;
        googlePay: (paymentRequest: unknown) => Promise<WalletButton>;
        applePay: (paymentRequest: unknown) => Promise<WalletButton>;
      }>;
    };
  }
}

interface RegistrationData {
  registrationId: string;
  divisionId: string;
  divisionName: string;
  contestantFirstName: string;
  contestantLastName: string;
  guardianEmail: string;
  amountCents: number | null;
  paymentDeadline: string;
  status: string;
}

const SANDBOX_MODE = process.env.NEXT_PUBLIC_SQUARE_SANDBOX_MODE !== "false";
const SQUARE_JS_URL = SANDBOX_MODE
  ? "https://sandbox.web.squarecdn.com/v1/square.js"
  : "https://web.squarecdn.com/v1/square.js";

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
    timeZoneName: "short",
  });
}

export default function PaymentPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token;

  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [squareReady, setSquareReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [applePayDebug, setApplePayDebug] = useState<string | null>(null); // TEMP: remove after debugging
  const cardRef = useRef<{ tokenize: () => Promise<TokenResult> } | null>(null);
  const googlePayRef = useRef<WalletButton | null>(null);
  const applePayRef = useRef<WalletButton | null>(null);
  const squareMountedRef = useRef(false);

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
  const squareConfigured = Boolean(appId && locationId);

  // Fetch registration
  useEffect(() => {
    if (!token) return;
    fetch(`/api/pageants/resume/${token}`)
      .then(async (res) => {
        const data = await res.json() as RegistrationData & { expired?: boolean; error?: string };
        if (res.status === 410 || data.expired) {
          setExpired(true);
          return;
        }
        if (!res.ok) {
          setError(data.error ?? "Registration not found.");
          return;
        }
        setRegistration(data);
      })
      .catch(() => setError("Failed to load registration. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  // Load Square SDK and initialize card + wallet buttons
  useEffect(() => {
    if (!registration || !squareConfigured || squareMountedRef.current) return;
    squareMountedRef.current = true;

    const script = document.createElement("script");
    script.src = SQUARE_JS_URL;
    script.async = true;
    script.onload = async () => {
      try {
        if (!window.Square) {
          console.error("[WTSF Pay] window.Square undefined after script load");
          return;
        }
        console.log("[WTSF Pay] Square SDK loaded. appId:", appId.slice(0,8), "locationId:", locationId.slice(0,8));
        const payments = await window.Square.payments(appId, locationId);
        console.log("[WTSF Pay] payments object created:", typeof payments);
        console.log("[WTSF Pay] Init domain:", window.location.origin);

        // Card form — retry up to 3 times (Square SDK often fails attempt 1)
        let card = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            card = await payments.card();
            await card.attach("#square-card-container");
            console.log("[WTSF Pay] Card form attached on attempt", attempt);
            break;
          } catch (err) {
            console.warn(`[WTSF Pay] Card init attempt ${attempt} failed:`, err);
            if (attempt === 3) throw err;
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          }
        }
        cardRef.current = card as typeof card;
        setSquareReady(true);

        // Wallet buttons — fully isolated; never affect card form
        if (registration.amountCents) {
          const amountStr = (registration.amountCents / 100).toFixed(2);

          // Pre-flight: Apple Pay browser support check
          const applePaySessionAvailable =
            typeof window !== "undefined" &&
            "ApplePaySession" in window &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof (window as any).ApplePaySession?.canMakePayments === "function" &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).ApplePaySession.canMakePayments();
          console.log("[WTSF Pay] ApplePaySession available:", applePaySessionAvailable);

          // Verify containers exist before attaching
          const gpContainer = document.getElementById("google-pay-button");
          const apContainer = document.getElementById("apple-pay-button");
          console.log("[WTSF Pay] google-pay-button element:", gpContainer ? "present" : "MISSING");
          console.log("[WTSF Pay] apple-pay-button element:", apContainer ? "present" : "MISSING");
          if (gpContainer) {
            const rect = gpContainer.getBoundingClientRect();
            console.log("[WTSF Pay] google-pay-button rect:", JSON.stringify({ w: rect.width, h: rect.height, vis: getComputedStyle(gpContainer).display }));
          }
          if (apContainer) {
            const rect = apContainer.getBoundingClientRect();
            console.log("[WTSF Pay] apple-pay-button rect:", JSON.stringify({ w: rect.width, h: rect.height, vis: getComputedStyle(apContainer).display }));
          }

          // Google Pay — retry up to 2 times
          console.log("[WTSF Pay] Attempting Google Pay init...");
          for (let gpAttempt = 1; gpAttempt <= 2; gpAttempt++) {
            try {
              const gpReq = payments.paymentRequest({
                countryCode: "US",
                currencyCode: "USD",
                total: { amount: amountStr, label: "WTSF 2026 Pageant Entry" },
              });
              console.log("[WTSF Pay] Google Pay paymentRequest created (attempt", gpAttempt, ")");
              const gp = await payments.googlePay(gpReq);
              console.log("[WTSF Pay] payments.googlePay() resolved:", typeof gp);
              await gp.attach("#google-pay-button");
              console.log("[WTSF Pay] Google Pay attached to DOM ✓");
              googlePayRef.current = gp;
              gp.addEventListener("ontokenization", (event) => {
                const { tokenResult } = event.detail;
                if (tokenResult.status === "OK" && tokenResult.token) {
                  void submitPayment(tokenResult.token);
                }
              });
              setGooglePayAvailable(true);
              break;
            } catch (gpErr) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const e = gpErr as any;
              console.warn("[WTSF Pay] Google Pay FAILED (attempt", gpAttempt, "):", {
                name: e?.name, message: e?.message, type: e?.type, code: e?.code, details: e?.details,
              }, gpErr);
              if (gpAttempt < 2) await new Promise((r) => setTimeout(r, 1500));
            }
          }

          // Apple Pay — retry up to 2 times
          console.log("[WTSF Pay] Attempting Apple Pay init...");
          for (let apAttempt = 1; apAttempt <= 2; apAttempt++) {
            try {
              const apReq = payments.paymentRequest({
                countryCode: "US",
                currencyCode: "USD",
                total: { amount: amountStr, label: "WTSF 2026 Pageant Entry" },
              });
              console.log("[WTSF Pay] Apple Pay paymentRequest created (attempt", apAttempt, ")");
              const ap = await payments.applePay(apReq);
              console.log("[WTSF Pay] payments.applePay() resolved:", typeof ap, "attach:", typeof ap?.attach);
              // Guard: Square returns a stub without .attach() in unsupported browsers
              if (!ap || typeof ap.attach !== "function") {
                console.warn("[WTSF Pay] Apple Pay stub returned (no attach) — unsupported browser");
                setApplePayDebug(`AP stub: ap=${typeof ap} attach=${typeof ap?.attach} (no card in Wallet or unsupported browser)`);
                break;
              }
              await ap.attach("#apple-pay-button");
              console.log("[WTSF Pay] Apple Pay attached to DOM ✓");
              applePayRef.current = ap;
              ap.addEventListener("ontokenization", (event) => {
                const { tokenResult } = event.detail;
                if (tokenResult.status === "OK" && tokenResult.token) {
                  void submitPayment(tokenResult.token);
                }
              });
              setApplePayAvailable(true);
              break;
            } catch (apErr) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const e = apErr as any;
              console.warn("[WTSF Pay] Apple Pay FAILED (attempt", apAttempt, "):", {
                name: e?.name, message: e?.message, type: e?.type, code: e?.code, details: e?.details,
              }, apErr);
              if (apAttempt < 2) await new Promise((r) => setTimeout(r, 1500));
              else setApplePayDebug(`AP error: name=${e?.name} msg=${e?.message} type=${e?.type} code=${e?.code}`);
            }
          }

          console.log("[WTSF Pay] Wallet init complete. GP:", googlePayRef.current ? "ready" : "unavailable", "AP:", applePayRef.current ? "ready" : "unavailable");
        }
      } catch (err) {
        console.error("[WTSF Pay] Square init error:", err);
        setPayError("Could not initialize payment form. Please refresh the page.");
      }
    };
    script.onerror = () => setPayError("Could not load payment library. Please refresh and try again.");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registration, squareConfigured, appId, locationId]);

  async function submitPayment(sourceId: string) {
    if (!registration) return;
    setPaying(true);
    setPayError(null);

    try {
      const res = await fetch("/api/pageants/square/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.registrationId, sourceId }),
      });

      const data = await res.json() as { success?: boolean; error?: string; squareError?: string };

      if (res.ok && data.success) {
        router.push(`/pageants/register/success?registrationId=${registration.registrationId}`);
      } else {
        setPayError(data.error ?? data.squareError ?? "Payment was not completed. Please try again.");
        setPaying(false);
      }
    } catch {
      setPayError("A network error occurred. Please try again.");
      setPaying(false);
    }
  }

  async function handlePay() {
    if (!cardRef.current) return;
    setPaying(true);
    setPayError(null);

    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        const msg = result.errors?.map((e) => e.message).join("; ") ?? "Card tokenization failed.";
        setPayError(msg);
        setPaying(false);
        return;
      }
      await submitPayment(result.token);
    } catch {
      setPayError("A network error occurred. Please try again.");
      setPaying(false);
    }
  }

  // Nav is fixed at 72px. marginTop pushes content below nav.
  // minHeight fills the remaining viewport so flexbox can center the card.
  // On short viewports (mobile with tall card) minHeight expands naturally — no clipping.
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#F5EDD4",
    marginTop: "72px",
    minHeight: "calc(100vh - 72px)",
    padding: "2rem 1rem",
    fontFamily: "Georgia, serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "1px solid #E8DFC8",
    borderRadius: "8px",
    padding: "2rem",
    maxWidth: "520px",
    width: "100%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{ color: "#8B7355", textAlign: "center" }}>Loading registration…</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ color: "#8B2E2E", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", margin: "0 0 1rem" }}>
            Payment Link Expired
          </h1>
          <p style={{ color: "#5C4A32", marginBottom: "1.25rem" }}>
            The payment deadline for this registration has passed. Pending registrations expire after the payment grace period.
          </p>
          <p style={{ color: "#5C4A32", marginBottom: "1.5rem" }}>
            To register, please start a new registration. If you believe this is an error, contact us at{" "}
            <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E" }}>wtsfpageant@outlook.com</a>.
          </p>
          <Link
            href="/pageants/register"
            style={{ display: "block", textAlign: "center", backgroundColor: "#2C4A2E", color: "#F5EDD4", borderRadius: "4px", padding: "0.75rem", textDecoration: "none", fontWeight: 600 }}
          >
            Start New Registration
          </Link>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ color: "#8B2E2E", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", margin: "0 0 1rem" }}>
            Registration Not Found
          </h1>
          <p style={{ color: "#5C4A32" }}>{error ?? "This registration could not be found."}</p>
          <Link href="/pageants/register" style={{ display: "block", marginTop: "1.5rem", textAlign: "center", backgroundColor: "#2C4A2E", color: "#F5EDD4", borderRadius: "4px", padding: "0.75rem", textDecoration: "none", fontWeight: 600 }}>
            Return to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <p style={{ color: "#D4A827", fontSize: "0.75rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 0.25rem" }}>
            West Tennessee State Fair · 2026
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Complete Your Registration
          </h1>
        </div>

        {/* Registration summary */}
        <div style={{ backgroundColor: "#F5EDD4", border: "1px solid #D4A827", borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
            <span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Contestant</span>
            <span style={{ color: "#2C4A2E", fontWeight: 600, fontSize: "0.875rem" }}>
              {registration.contestantFirstName} {registration.contestantLastName}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
            <span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Division</span>
            <span style={{ color: "#2C4A2E", fontWeight: 600, fontSize: "0.875rem" }}>{registration.divisionName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
            <span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Entry Fee</span>
            <span style={{ color: "#2C4A2E", fontWeight: 700, fontSize: "1rem" }}>
              {registration.amountCents ? formatDollars(registration.amountCents) : "Fee TBD"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8B7355", fontSize: "0.8125rem" }}>Pay Before</span>
            <span style={{ color: "#8B2E2E", fontSize: "0.8125rem" }}>{formatDeadline(registration.paymentDeadline)}</span>
          </div>
        </div>

        {!registration.amountCents && (
          <div style={{ backgroundColor: "#FEF9E7", border: "1px solid #D4A827", borderRadius: "4px", padding: "0.875rem", marginBottom: "1.25rem", color: "#5C4A32", fontSize: "0.9rem" }}>
            The entry fee has not yet been set. Please contact{" "}
            <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E" }}>wtsfpageant@outlook.com</a>{" "}
            to complete your registration.
          </div>
        )}

        {!squareConfigured && (
          <div style={{ backgroundColor: "#F5EDD4", border: "1px solid #D4A827", borderRadius: "6px", padding: "1rem", marginBottom: "1.25rem", textAlign: "center" }}>
            <p style={{ color: "#5C4A32", fontSize: "0.9375rem", margin: 0 }}>
              Online payment is being set up. Please contact{" "}
              <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E", fontWeight: 600 }}>wtsfpageant@outlook.com</a>{" "}
              to complete your registration.
            </p>
          </div>
        )}

        {squareConfigured && registration.amountCents && (
          <>
            {/* Wallet buttons — always in DOM so Square can attach; empty until SDK renders */}
            <div id="google-pay-button" style={{ marginBottom: googlePayAvailable ? "0.75rem" : 0 }} />
            <div id="apple-pay-button" style={{ marginBottom: applePayAvailable ? "0.75rem" : 0 }} />
            {applePayDebug && <div style={{ fontSize: "0.75rem", color: "red", background: "#fff0f0", border: "1px solid red", borderRadius: 4, padding: "0.5rem", marginBottom: "0.5rem", wordBreak: "break-all" }}>{applePayDebug}</div>}

            {(googlePayAvailable || applePayAvailable) && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E8DFC8" }} />
                <span style={{ color: "#8B7355", fontSize: "0.75rem", whiteSpace: "nowrap" }}>or pay with card</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E8DFC8" }} />
              </div>
            )}

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: "#5C4A32", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                Card Information
              </label>
              <div
                id="square-card-container"
                style={{
                  border: "1px solid #E8DFC8",
                  borderRadius: "4px",
                  padding: "0.75rem",
                  backgroundColor: "#FAFAF7",
                  minHeight: "48px",
                }}
              />
              {!squareReady && (
                <p style={{ color: "#8B7355", fontSize: "0.8125rem", marginTop: "0.375rem" }}>Loading payment form…</p>
              )}
            </div>

            {payError && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem", color: "#991B1B", fontSize: "0.875rem" }}>
                {payError}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={!squareReady || paying}
              style={{
                width: "100%",
                backgroundColor: !squareReady || paying ? "#8B7355" : "#2C4A2E",
                color: "#F5EDD4",
                border: "none",
                borderRadius: "4px",
                padding: "0.875rem",
                fontSize: "1.0625rem",
                fontFamily: "Georgia, serif",
                fontWeight: 700,
                cursor: !squareReady || paying ? "not-allowed" : "pointer",
              }}
            >
              {paying ? "Processing…" : `Pay ${formatDollars(registration.amountCents)} & Confirm`}
            </button>

            <p style={{ color: "#8B7355", fontSize: "0.8125rem", textAlign: "center", marginTop: "0.875rem" }}>
              Secure payment processed by Square. Your card details are never stored on our servers.
            </p>
          </>
        )}

        <p style={{ color: "#8B7355", fontSize: "0.8125rem", textAlign: "center", marginTop: "1rem" }}>
          Questions? <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E" }}>wtsfpageant@outlook.com</a>
        </p>
      </div>
    </div>
  );
}
