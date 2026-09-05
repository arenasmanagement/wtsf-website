import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDivisionById } from "@/lib/pageant-config";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registration Confirmed — 2026 Traditional Fair Pageants",
  robots: { index: false, follow: false },
};

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

interface PageProps {
  searchParams: Promise<{ registrationId?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { registrationId } = await searchParams;

  if (!registrationId) {
    return (
      <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Georgia, serif" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#8B2E2E", fontFamily: "var(--font-playfair), Georgia, serif" }}>Missing Registration ID</h1>
          <Link href="/pageants/register" style={{ color: "#2C4A2E" }}>Return to Registration</Link>
        </div>
      </main>
    );
  }

  const supabase = createAdminClient();
  const { data: reg } = await supabase
    .from("pageant_registrations")
    .select("id, division_id, division_name, status, contestant_first_name, contestant_last_name, guardian_email, confirmed_at")
    .eq("id", registrationId)
    .eq("status", "CONFIRMED")
    .single();

  const division = reg ? getDivisionById(reg.division_id) : undefined;

  if (!reg) {
    return (
      <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Georgia, serif" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <h1 style={{ color: "#8B2E2E", fontFamily: "var(--font-playfair), Georgia, serif", marginBottom: "1rem" }}>
            Registration Not Confirmed
          </h1>
          <p style={{ color: "#5C4A32", marginBottom: "1.5rem" }}>
            We could not verify a confirmed registration with this ID. If you believe this is an error, please contact{" "}
            <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E" }}>wtsfpageant@outlook.com</a>.
          </p>
          <Link href="/pageants/register" style={{ color: "#2C4A2E", fontWeight: 600 }}>Return to Registration</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#F5EDD4", minHeight: "100vh", padding: "3rem 1rem", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        {/* Success card */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "2px solid #D4A827",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: "#2C4A2E", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✓</div>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4", fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
              Registration Confirmed
            </h1>
            <p style={{ color: "#D4A827", margin: 0, fontSize: "0.9375rem" }}>
              2026 West Tennessee State Fair Traditional Pageants
            </p>
          </div>

          {/* Details */}
          <div style={{ padding: "2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <p style={{ color: "#2C4A2E", fontSize: "1.125rem", fontWeight: 700, margin: "0 0 0.25rem", fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {reg.contestant_first_name} {reg.contestant_last_name}
              </p>
              <p style={{ color: "#8B7355", margin: 0, fontSize: "0.9375rem" }}>{reg.division_name}</p>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Date", "October 17, 2026"],
                  ["Venue", "Williams Auditorium · Henderson, Tennessee"],
                  ...(division ? [
                    ["Arrival Time", division.arrivalTime],
                    ["Competition Time", division.competitionTime],
                  ] : []),
                  ["Payment", "Received ✓"],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: "1px solid #F5EDD4" }}>
                    <td style={{ padding: "0.625rem 0", color: "#8B7355", fontSize: "0.8125rem", width: "40%", verticalAlign: "top" }}>{label}</td>
                    <td style={{ padding: "0.625rem 0", color: "#2C4A2E", fontSize: "0.9375rem", fontWeight: 600 }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ backgroundColor: "#F5EDD4", borderRadius: "6px", padding: "1rem", marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ color: "#5C4A32", fontSize: "0.9rem", margin: "0 0 0.375rem" }}>
                A confirmation has been sent to{" "}
                <strong style={{ color: "#2C4A2E" }}>{maskEmail(reg.guardian_email)}</strong>
              </p>
              <p style={{ color: "#8B7355", fontSize: "0.875rem", margin: 0 }}>
                Questions?{" "}
                <a href="mailto:wtsfpageant@outlook.com" style={{ color: "#2C4A2E", fontWeight: 600 }}>
                  wtsfpageant@outlook.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/" style={{ color: "#5C4A32", fontSize: "0.9375rem", textDecoration: "none" }}>
            ← Return to WTSF Home
          </Link>
        </div>
      </div>
    </main>
  );
}
