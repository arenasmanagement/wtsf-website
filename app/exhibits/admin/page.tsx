"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res  = await fetch("/api/exhibits/admin/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/exhibits/admin/dashboard");
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center py-12 px-4"
      style={{ backgroundColor: "#F5EDD4" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#D4A827", letterSpacing: "0.2em" }}
          >
            West Tennessee State Fair
          </p>
          <h1
            className="text-2xl font-bold italic"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
          >
            Staff Dashboard
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
          <div className="mb-5">
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold tracking-wide uppercase mb-2"
              style={{ color: "#5C4A32" }}
            >
              Staff Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              autoComplete="current-password"
              className="w-full border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white"
              style={{ borderColor: "#D4C9A8" }}
              required
            />
          </div>

          {error && (
            <div
              className="mb-4 p-3 text-sm"
              role="alert"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#2C4A2E", color: "#D4A827", letterSpacing: "0.08em" }}
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: "#8B7355" }}>
          Staff access only. Set the password in your environment variables.
        </p>
      </div>
    </div>
  );
}
