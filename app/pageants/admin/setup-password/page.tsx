"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SetupPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Always call the API — empty/missing token returns {valid:false}
    fetch(`/api/pageants/admin/setup-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d: { valid: boolean }) => setTokenValid(d.valid))
      .catch(() => setTokenValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pageants/admin/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/pageants/admin"), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#F5EDD4",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Georgia, serif",
    padding: "2rem 1rem",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "2px solid #D4A827",
    borderRadius: "8px",
    padding: "2.5rem",
    maxWidth: "420px",
    width: "100%",
  };

  if (tokenValid === null) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{ textAlign: "center", color: "#8B7355" }}>Validating your link…</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ color: "#2C4A2E", fontSize: "1.25rem", marginBottom: "1rem", textAlign: "center" }}>
            Link Expired or Invalid
          </h1>
          <p style={{ color: "#5C4A32", fontSize: "0.9375rem", lineHeight: 1.6, textAlign: "center" }}>
            This setup link has expired or already been used. Please contact the fair administrator
            to request a new invitation.
          </p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ color: "#2C4A2E", fontSize: "1.25rem", marginBottom: "1rem", textAlign: "center" }}>
            Account Activated!
          </h1>
          <p style={{ color: "#5C4A32", fontSize: "0.9375rem", lineHeight: 1.6, textAlign: "center" }}>
            Your password has been set. Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <p style={{ margin: "0 0 4px", color: "#D4A827", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>
            West Tennessee State Fair
          </p>
          <h1 style={{ margin: 0, color: "#2C4A2E", fontSize: "1.375rem", fontWeight: "normal" }}>
            Set Your Password
          </h1>
          <p style={{ margin: "8px 0 0", color: "#8B7355", fontSize: "0.8125rem" }}>
            Pageants Administration Portal
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: "#2C4A2E", fontSize: "0.875rem", marginBottom: "0.375rem", fontWeight: 600 }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={12}
              style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1px solid #E8DFC8", borderRadius: "4px", fontSize: "0.9375rem", fontFamily: "Georgia, serif", boxSizing: "border-box" }}
            />
            <p style={{ margin: "4px 0 0", color: "#8B7355", fontSize: "0.75rem" }}>Minimum 12 characters</p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "#2C4A2E", fontSize: "0.875rem", marginBottom: "0.375rem", fontWeight: 600 }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1px solid #E8DFC8", borderRadius: "4px", fontSize: "0.9375rem", fontFamily: "Georgia, serif", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem", color: "#991B1B", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ width: "100%", padding: "0.75rem", backgroundColor: submitting ? "#8B7355" : "#2C4A2E", color: "#F5EDD4", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}
          >
            {submitting ? "Activating…" : "Set Password & Activate Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#8B7355" }}>Loading…</p>
      </div>
    }>
      <SetupPasswordForm />
    </Suspense>
  );
}
