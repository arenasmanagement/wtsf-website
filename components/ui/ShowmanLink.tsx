"use client";

import React from "react";

interface ShowmanLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Optional species tag sent with the GA4 event (cattle | goats | sheep | general) */
  species?: string;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for any <a> that links to Showman.
 * Fires a `livestock_registration_clicked` GA4 event on click.
 * All standard anchor props (href, className, style, rel, target, …) pass through.
 */
export default function ShowmanLink({
  species = "general",
  children,
  onClick,
  ...rest
}: ShowmanLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag?.("event", "livestock_registration_clicked", {
        species,
      });
    } catch {
      // silently swallow — never block navigation
    }
    onClick?.(e);
  }

  return (
    <a {...rest} onClick={handleClick}>
      {children}
    </a>
  );
}
