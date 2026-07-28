"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ backgroundColor: "#F5EDD4" }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: "#2C4A2E" }} className="px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827" }}>
            Staff Dashboard · WTSF
          </p>
          <h1
            className="text-xl font-bold italic"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
          >
            Exhibit Registrations
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "#D4A827", letterSpacing: "0.25em" }}
        >
          Dashboard error
        </p>
        <h2
          className="text-2xl font-bold italic mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
        >
          Couldn&apos;t load submissions
        </h2>
        <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "#5C4A32", lineHeight: 1.7 }}>
          An error occurred while loading the submission data. No data has been
          changed. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4", letterSpacing: "0.1em" }}
        >
          Reload Dashboard
        </button>
      </div>
    </div>
  );
}
