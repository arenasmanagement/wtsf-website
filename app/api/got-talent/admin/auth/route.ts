import { NextRequest, NextResponse } from "next/server";
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import {
  verifyAccountCredentials,
  setAccountSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/admin-auth";

const scryptAsync = promisify(scrypt);

async function verifyDbPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [salt, key] = hash.split(":");
    if (!salt || !key) return false;
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(Buffer.from(key, "hex"), derived);
  } catch {
    return false;
  }
}

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

  // Allow super and talent roles for Got Talent admin
  const envRole = verifyAccountCredentials(username, password);
  if (envRole && (envRole === "talent" || envRole === "super")) {
    const response = NextResponse.json({ success: true, role: envRole });
    return setAccountSessionCookie(response, username, envRole);
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE(_request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  return clearAdminSessionCookie(response);
}
