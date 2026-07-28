import Link from "next/link";
import { stayUpdatedUrl } from "@/lib/updates/url-helpers";

interface StayUpdatedCalloutProps {
  heading: string;
  description: string;
  /** Category value that matches a CATEGORIES entry in SubscribeSection */
  topic: string;
  buttonLabel?: string;
}

export default function StayUpdatedCallout({
  heading,
  description,
  topic,
  buttonLabel = "Stay Updated",
}: StayUpdatedCalloutProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 p-6 sm:p-8"
      style={{
        backgroundColor: "#FDFAF3",
        border:     "1px solid #D4C9A8",
        borderLeft: "4px solid #D4A827",
      }}
    >
      <div>
        <p
          className="text-xs font-bold tracking-widest uppercase mb-2"
          style={{ color: "#D4A827", letterSpacing: "0.18em" }}
        >
          Stay Updated
        </p>
        <p
          className="text-base font-bold italic mb-1"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
        >
          {heading}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#5C4A32" }}>
          {description}
        </p>
      </div>
      <Link
        href={stayUpdatedUrl(topic)}
        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C4A2E]"
        style={{ backgroundColor: "#2C4A2E", color: "#D4A827", letterSpacing: "0.08em" }}
      >
        {buttonLabel}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
