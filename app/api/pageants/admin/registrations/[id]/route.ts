import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRoleServer } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const role = await getSessionRoleServer();
  if (!role || (role !== "super" && role !== "pageants")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("pageant_registrations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

const PatchSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const role = await getSessionRoleServer();
  if (!role || (role !== "super" && role !== "pageants")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const updates: Record<string, unknown> = {};

  if (parsed.data.status === "CANCELLED") {
    updates.status = "CANCELLED";
    updates.cancelled_at = now;
  } else if (parsed.data.status === "CONFIRMED") {
    updates.status = "CONFIRMED";
    updates.confirmed_at = now;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 422 });
  }

  const { data, error } = await supabase
    .from("pageant_registrations")
    .update(updates)
    .eq("id", id)
    .select("id, status, confirmed_at, cancelled_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
