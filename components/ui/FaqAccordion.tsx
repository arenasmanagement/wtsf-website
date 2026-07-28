"use client";

import { useState, useId } from "react";
import type { ReactNode } from "react";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

interface FaqAccordionProps {
  items: FaqItem[];
  /** Unique string prefix so IDs stay distinct when multiple accordions appear on one page. */
  idPrefix: string;
}

export default function FaqAccordion({ items, idPrefix }: FaqAccordionProps) {
  const uid = useId();
  const prefix = idPrefix || uid;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const btnId   = `${prefix}-q-${i}`;
        const panelId = `${prefix}-a-${i}`;

        return (
          <div
            key={i}
            style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
          >
            <button
              type="button"
              id={btnId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIndex(isOpen ? null : i);
                }
              }}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A827] focus-visible:ring-inset"
            >
              <span
                className="text-base font-bold italic leading-snug"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                {item.question}
              </span>
              <span
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-200"
                style={{
                  color:     "#D4A827",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
            >
              <div
                className="px-6 pb-6 pt-4 text-sm leading-relaxed"
                style={{ borderTop: "1px solid #E8DFC8", color: "#5C4A32" }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
