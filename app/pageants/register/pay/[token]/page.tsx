"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<{
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{ status: string; token?: string; errors?: Array<{ message: string }> }>;
        }>;
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
  isLateFee: boolean;
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
  const cardRef = useRef<{ tokenize: () => Promise<{ status: string; token?: string; errors?: Array<{ message: string }> }> } | null>(null);
  const squareMountedRef = useRef(false);

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
  const squareConfigured = Boolean(appId && locationId);

  // Fetch registration — resume endpoint returns the CURRENT calculated amount
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

  // Load Square SDK and initialize card form
  useEffect(() => {
    if (!registration || !squareConfigured || squareMountedRef.current) return;
    squareMountedRef.current = true;

    const script = document.createElement("script");
    script.src = SQUARE_JS_URL;
    script.async = true;
    script.onload = async () => {
      // Brief delay allows Square SDK internal iframes to establish before init
      await new Promise((res) => setTimeout(res, 800));
      try {
        if (!window.Square) return;
        const payments = await window.Square.payments(appId, locationId);
        const card = await payments.card();
        await card.attach("#square-card-container");
        cardRef.current = card;
        setSquareReady(true);
      } catch (err) {
        console.error("Square init error:", err);
        setPayError("Could not initialize payment form. Please refresh the page.");
      }
    };
    script.onerror = () => setPayError("Could not load payment library. Please refresh and try again.");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [registration, squareConfigured, appId, locationId]);

  async function handlePay() {
    if (!cardRef.current || !registration) return;
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

      // The server recalculates the amount at the moment of payment.
      // Do NOT pass an amount from the client — the server is authoritative.
      const res = await fetch("/api/pageants/square/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.registrationId, sourceId: result.token }),
      });

      const data = await res.json() as { success?: boolean; status?: string; error?: string; squareError?: string };

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

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#F5EDD4",
    minHeight: "100vh",
    padding: "calc(72px + 2.5rem) 1rem 3rem",
    fontFamily: "Georgia, serif",
    display: "flex",
    alignItems: "flex-start",
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
    marginTop: "1rem",
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
          <a
            href="/pageants/register"
            style={{ display: "block", textAlign: "center", backgroundColor: "#2C4A2E", color: "#F5EDD4", borderRadius: "4px", padding: "0.75rem", textDecoration: "none", fontWeight: 600 }}
          >
            Start New Registration
          </a>
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
          <a href="/pageants/register" style={{ display: "block", marginTop: "1.5rem", textAlign: "center", backgroundColor: "#2C4A2E", color: "#F5EDD4", borderRadius: "4px", padding: "0.75rem", textDecoration: "none", fontWeight: 600 }}>
            Return to Registration
          </a>
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

        {/* Late fee notice — shown when the late fee window is active */}
        {registration.isLateFee && (
          <div style={{ backgroundColor: "#FEF3C7", border: "1px solid #D97706", borderRadius: "4px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
            <p style={{ color: "#92400E", fontSize: "0.875rem", margin: 0, fontWeight: 600 }}>
              Late Registration Fee Applied
            </p>
            <p style={{ color: "#92400E", fontSize: "0.8125rem", margin: "0.25rem 0 0" }}>
              The $10 late fee is included because payment is being completed after October 10, 2026.
            </p>
          </div>
        )}

        {/* Registration summary */}
        <div style={{ backgroundColor: "#F5EDD4", border: "1px solid #D4A827", borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
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

        {/* Pricing policy notice */}
        <p style={{ color: "#8B7355", fontSize: "0.8rem", marginBottom: "1.25rem", lineHeight: 1.4 }}>
          Entry fee is calculated at the time payment is completed. Payments received on or before
          October 10, 2026 are $55. A $10 late fee applies beginning October 11, 2026.
          Submitting this form does not lock in the earlier price.
        </p>

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
