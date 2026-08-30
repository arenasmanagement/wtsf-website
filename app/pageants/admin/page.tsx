"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function PageantsAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/pageants/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        router.push("/pageants/admin/dashboard");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Invalid credentials. Please try again.");
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
        minHeight: "100vh",
        backgroundColor: "#F5EDD4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          border: "2px solid #D4A827",
          borderRadius: "8px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#2C4A2E",
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: 0,
              marginBottom: "0.25rem",
            }}
          >
            West Tennessee State Fair
          </h1>
          <p style={{ color: "#8B7355", fontSize: "0.875rem", margin: 0 }}>
            Pageant Administration
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "4px",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              color: "#991B1B",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                color: "#5C4A32",
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "0.375rem",
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
              required
              style={{
                width: "100%",
                padding: "0.625rem 0.75rem",
                border: "1px solid #E8DFC8",
                borderRadius: "4px",
                fontSize: "1rem",
                color: "#2C4A2E",
                backgroundColor: "#FAFAF7",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: "#5C4A32",
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "0.375rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: "100%",
                padding: "0.625rem 0.75rem",
                border: "1px solid #E8DFC8",
                borderRadius: "4px",
                fontSize: "1rem",
                color: "#2C4A2E",
                backgroundColor: "#FAFAF7",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#8B7355" : "#2C4A2E",
              color: "#F5EDD4",
              border: "none",
              borderRadius: "4px",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Georgia, serif",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
