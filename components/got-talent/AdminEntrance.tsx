"use client";

import { useRouter } from "next/navigation";

/** Hidden admin entrance — tiny lock icon, single click → /got-talent/admin */
export default function AdminEntrance() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/got-talent/admin")}
      style={{
        textAlign: "center",
        padding: "0.6rem 0 0.2rem",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <span
        style={{ color: "#C8B89A", fontSize: "0.6rem", opacity: 0.5 }}
        role="presentation"
        aria-hidden="true"
      >
        🔒
      </span>
    </div>
  );
}
