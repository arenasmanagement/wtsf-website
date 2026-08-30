import { NextRequest, NextResponse } from "next/server";
import {
  verifyAccountCredentials,
  setAccountSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body as Record<string, unknown>;

  if (typeof username !== "string" || username.length === 0) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const role = verifyAccountCredentials(username, password);
  if (!role) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (role !== "pageants" && role !== "super") {
    return NextResponse.json({ error: "Access denied for this area" }, { status: 403 });
  }

  const response = NextResponse.json({ success: true, role });
  return setAccountSessionCookie(response, username, role);
}

export async function DELETE(_request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  return clearAdminSessionCookie(response);
}
