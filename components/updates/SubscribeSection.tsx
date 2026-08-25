"use client";

import { useState } from "react";
import { VALID_CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/updates/categories";
import { parseTopicFromSearch } from "@/lib/updates/url-helpers";

const CATEGORIES = VALID_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));

type Status = "idle" | "submitting" | "success" | "error";

function getInitialSelected(): Set<Category> {
    if (typeof window === "undefined") return new Set<Category>(["general"]);
  const topic = parseTopicFromSearch(window.location.search);
  if (topic && (VALID_CATEGORIES as readonly string[]).includes(topic)) {
    return new Set([topic as Category]);
  }
    return new Set<Category>(["general"]);
}

export default function SubscribeSection() {
  const [email, setEmail]       = useState("");
  // Lazy initializer reads ?topic= param on first render to preselect a category
  const [selected, setSelected] = useState<Set<Category>>(getInitialSelected);
  const [status, setStatus]     = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function toggleCategory(cat: Category) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setErrorMsg(null);

    if (selected.size === 0) {
      setErrorMsg("Please select at least one topic.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/updates/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, categories: Array.from(selected) }),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Connection error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <section
        aria-label="Subscription confirmation"
        style={{ backgroundColor: "#2C4A2E" }}
        className="py-16 px-4"
      >
        <div className="max-w-xl mx-auto text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-xl font-bold"
            style={{ backgroundColor: "rgba(212,168,39,0.15)", color: "#D4A827", border: "2px solid #D4A827" }}
          >
            ✓
          </div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827" }}>
            Almost Done
          </p>
          <h2
            className="text-2xl font-bold italic mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Check Your Email
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#A8BFA9" }}>
            We sent a confirmation link to <strong style={{ color: "#F5EDD4" }}>{email}</strong>.
            Click the link to activate your subscription.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="stay-updated"
      aria-labelledby="subscribe-heading"
      style={{ backgroundColor: "#2C4A2E" }}
      className="py-16 px-4 scroll-mt-20"
    >
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#D4A827", letterSpacing: "0.2em" }}>
            2026 West Tennessee State Fair
          </p>
          <h2
            id="subscribe-heading"
            className="text-3xl font-bold italic mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Stay Updated
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#A8BFA9", maxWidth: 460, margin: "0 auto" }}>
            Be the first to know when new information is announced for the 2026 West Tennessee State Fair.
            Receive updates about the topics that matter most to you.
          </p>
        </div>

        <form onSubmit={handleSubmit} method="post" noValidate>
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            className="sr-only"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Category grid */}
          <fieldset className="mb-6">
            <legend className="block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#D4A827" }}>
              I want updates about:
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const checked = selected.has(cat.value);
                return (
                  <label
                    key={cat.value}
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm transition-colors"
                    style={{
                      backgroundColor: checked ? "rgba(212,168,39,0.12)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${checked ? "#D4A827" : "rgba(255,255,255,0.15)"}`,
                      color: checked ? "#F5EDD4" : "#A8BFA9",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleCategory(cat.value)}
                    />
                    <span
                      className="w-4 h-4 flex-shrink-0 flex items-center justify-center border text-xs font-bold"
                      style={{
                        backgroundColor: checked ? "#D4A827" : "transparent",
                        borderColor: checked ? "#D4A827" : "rgba(255,255,255,0.3)",
                        color: "#1A1A1A",
                      }}
                      aria-hidden="true"
                    >
                      {checked ? "✓" : ""}
                    </span>
                    <span>{cat.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Email input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="subscribe-email" className="sr-only">Email address</label>
              <input
                id="subscribe-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                className="w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A827]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#F5EDD4",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-8 py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 flex-shrink-0"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
            >
              {status === "submitting" && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {status === "submitting" ? "Sending…" : "Subscribe"}
            </button>
          </div>

          {/* Error message */}
          {(status === "error" || errorMsg) && (
            <p className="mt-3 text-sm" style={{ color: "#FCA5A5" }} role="alert">
              {errorMsg}
            </p>
          )}

          {/* Privacy note */}
          <p className="mt-4 text-xs text-center" style={{ color: "#6B8F6C" }}>
            You&apos;ll receive a confirmation email. We&apos;ll only contact you about topics you select.
            Unsubscribe at any time from any email.
          </p>
        </form>
      </div>
    </section>
  );
}
