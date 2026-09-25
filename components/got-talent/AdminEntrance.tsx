"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Hidden admin entrance — no visible affordance.
 * 5 clicks/taps within 3 seconds → redirects to /got-talent/admin.
 * Does NOT grant access. The admin route still requires real authentication.
 */
export default function AdminEntrance() {
  const router = useRouter();
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    count.current += 1;

    if (count.current === 1) {
      // Start 3-second window on first tap
      timer.current = setTimeout(() => {
        count.current = 0;
        timer.current = null;
      }, 3000);
    }

    if (count.current >= 5) {
      if (timer.current) clearTimeout(timer.current);
      count.current = 0;
      timer.current = null;
      router.push("/got-talent/admin");
    }
  };

  return (
    <div
      onClick={handleTap}
      style={{
        textAlign: "center",
        padding: "0.75rem 0 0.25rem",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <span style={{ color: "#C8B89A", fontSize: "0.65rem", letterSpacing: "1px" }}>
        WTSF Got Talent
      </span>
    </div>
  );
}
