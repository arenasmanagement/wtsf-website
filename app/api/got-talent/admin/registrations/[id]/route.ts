import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionRole, getSessionAccountId } from "@/lib/admin-auth";

const ALLOWED_REMOVAL_REASONS = new Set([
  "contestant_withdrew",
  "duplicate_registration",
  "disqualified_ineligible",
  "administrative_correction",
  "test_registration",
  "other",
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const role = getSessionRole(request);
  if (!role || (role !== "super" && role !== "talent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("got_talent_registrations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// PATCH /api/got-talent/admin/registrations/[id]
// Soft-removes a registration by setting status = 'REMOVED' and recording
// the audit trail. Never deletes data or triggers a Square refund.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const role = getSessionRole(request);
  if (!role || (role !== "super" && role !== "talent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, reason, notes } = (body ?? {}) as Record<string, unknown>;

  if (action !== "remove") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  if (typeof reason !== "string" || !ALLOWED_REMOVAL_REASONS.has(reason)) {
    return NextResponse.json({ error: "A valid removal reason is required." }, { status: 400 });
  }

  if (reason === "other" && (typeof notes !== "string" || notes.trim().length === 0)) {
    return NextResponse.json({ error: "Please provide notes when selecting Other." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Confirm the registration exists and isn't already removed
  const { data: existing, error: fetchErr } = await supabase
    .from("got_talent_registrations")
    .select("id, status, act_name")
    .eq("id", id)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  if (existing.status === "REMOVED") {
    return NextResponse.json({ error: "This registration has already been removed." }, { status: 409 });
  }

  const removedBy = getSessionAccountId(request);
  const removalNotes = reason === "other" && typeof notes === "string" ? notes.trim() : null;

  const { error: updateErr } = await supabase
    .from("got_talent_registrations")
    .update({
      status: "REMOVED",
      removed_at: new Date().toISOString(),
      removed_by: removedBy,
      removal_reason: reason,
      removal_notes: removalNotes,
    })
    .eq("id", id);

  if (updateErr) {
    console.error("Failed to soft-remove registration:", updateErr);
    return NextResponse.json({ error: "Removal failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: `Registration "${existing.act_name as string}" has been removed.` });
}
