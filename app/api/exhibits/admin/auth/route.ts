import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/admin-auth";

// POST /api/exhibits/admin/auth  — login
export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.password || !verifyAdminPassword(body.password)) {
    // Slow response to deter brute-force
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  return setAdminSessionCookie(response);
}

// DELETE /api/exhibits/admin/auth  — logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  return clearAdminSessionCookie(response);
}
