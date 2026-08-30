import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRoleServer } from "@/lib/admin-auth";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  const role = await getSessionRoleServer();
  if (!role || (role !== "super" && role !== "pageants")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pageant_settings")
    .select("*")
    .eq("fair_year", 2026)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

const SettingsPatchSchema = z.object({
  registration_open: z.boolean().optional(),
  registration_opens_at: z.string().nullable().optional(),
  registration_closes_at: z.string().nullable().optional(),
  payment_grace_days: z.number().int().min(1).max(30).optional(),
  entry_fee_cents: z.number().int().min(0).nullable().optional(),
  late_fee_cents: z.number().int().min(0).nullable().optional(),
  late_fee_begins_at: z.string().nullable().optional(),
  rules_content: z.string().nullable().optional(),
  media_release_content: z.string().nullable().optional(),
  pageant_team_email: z.string().email().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const role = await getSessionRoleServer();
  if (!role || (role !== "super" && role !== "pageants")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SettingsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // Strip undefined fields
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      updates[key] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 422 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pageant_settings")
    .update(updates)
    .eq("fair_year", 2026)
    .select("*")
    .single();

  if (error || !data) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
