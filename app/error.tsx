"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring service in production
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F5EDD4" }}
    >
      <div className="text-center max-w-md">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "#D4A827", letterSpacing: "0.25em" }}
        >
          Something went wrong
        </p>
        <h1
          className="text-3xl font-bold italic mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
        >
          We hit a snag
        </h1>
        <p className="text-sm mb-8" style={{ color: "#5C4A32", lineHeight: 1.7 }}>
          An unexpected error occurred. Please try again — if the problem
          persists, contact us at{" "}
          <a href="mailto:wtsfair@gmail.com" style={{ color: "#2C4A2E" }}>
            wtsfair@gmail.com
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2C4A2E", color: "#F5EDD4", letterSpacing: "0.1em" }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-xs font-bold tracking-widest uppercase border transition-opacity hover:opacity-70"
            style={{ borderColor: "#2C4A2E", color: "#2C4A2E", letterSpacing: "0.1em" }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
