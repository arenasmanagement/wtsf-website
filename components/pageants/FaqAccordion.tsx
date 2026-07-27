"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              backgroundColor: "#FDFAF3",
              border: "1px solid #E8DFC8",
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span
                className="text-base font-bold italic leading-snug"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#2C4A2E",
                }}
              >
                {faq.question}
              </span>
              <span
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-200"
                style={{
                  color: "#D4A827",
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
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              hidden={!isOpen}
            >
              <div
                className="px-6 pb-5"
                style={{ borderTop: "1px solid #E8DFC8" }}
              >
                <p
                  className="text-sm leading-relaxed pt-4"
                  style={{ color: "#5C4A32" }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
