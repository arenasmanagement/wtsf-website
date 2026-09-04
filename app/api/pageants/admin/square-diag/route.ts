// TEMPORARY DIAGNOSTIC — DELETE AFTER USE
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== "diag-wtsf-2026") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  const sandboxMode = process.env.NEXT_PUBLIC_SQUARE_SANDBOX_MODE !== "false";
  const baseUrl = sandboxMode ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";

  if (!token || !locationId) {
    return NextResponse.json({ error: "env vars missing", tokenSet: !!token, locationIdSet: !!locationId });
  }

  const res = await fetch(`${baseUrl}/v2/locations/${locationId}`, {
    headers: { Authorization: `Bearer ${token}`, "Square-Version": "2024-01-18" },
  });
  const data = await res.json() as { location?: { capabilities?: string[]; status?: string; name?: string }; errors?: unknown[] };
  const loc = data.location;
  return NextResponse.json({
    sandboxMode,
    name: loc?.name,
    status: loc?.status,
    capabilities: loc?.capabilities ?? [],
    errors: data.errors ?? null,
  });
}
