"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function GotTalentAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/got-talent/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        router.push("/got-talent/admin/dashboard");
      } else {
        setError(data.error ?? "Invalid credentials.");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        backgroundColor: "#F5EDD4",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ color: "#D4A827", fontSize: "0.65rem", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 0.5rem" }}>
            WTSF Got Talent 2026
          </p>
          <h1 style={{ color: "#2C4A2E", fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.75rem", margin: 0 }}>
            Admin Access
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", border: "2px solid #D4A827", borderRadius: "8px", padding: "2rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: "#5C4A32", fontSize: "0.85rem", marginBottom: "0.4rem" }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "2px solid #D4C89A", borderRadius: "4px", fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "#5C4A32", fontSize: "0.85rem", marginBottom: "0.4rem" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "2px solid #D4C89A", borderRadius: "4px", fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
          {error && (
            <div style={{ backgroundColor: "#FDF0F0", border: "1px solid #E57373", borderRadius: "4px", padding: "0.75rem", marginBottom: "1rem" }}>
              <p style={{ color: "#8B2E2E", margin: 0, fontSize: "0.9rem" }}>{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#A89070" : "#2C4A2E",
              color: "#F5EDD4",
              border: "none",
              padding: "0.85rem",
              borderRadius: "4px",
              fontSize: "1rem",
              fontFamily: "Georgia, serif",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
