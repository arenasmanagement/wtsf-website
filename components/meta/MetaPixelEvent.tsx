"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
  }
}

interface MetaPixelEventProps {
  eventName: string;
}

export default function MetaPixelEvent({ eventName }: MetaPixelEventProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", eventName);
    }
  }, [eventName]);
  return null;
}
