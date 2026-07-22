import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/exhibits/admin/submissions/[id]  — single submission detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: registration, error } = await supabase
    .from("exhibit_registrations")
    .select(`
      *,
      exhibit_entrants (*),
      exhibit_entries (*)
    `)
    .eq("id", id)
    .single();

  if (error || !registration) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  return NextResponse.json({ data: registration });
}

const UpdateSchema = z.object({
  official_program_id: z.string().max(100).optional(),
  data_entry_status: z
    .enum(["Pending", "In Progress", "Entered", "Needs Review"])
    .optional(),
  notes:  z.string().max(2000).optional(),
  status: z.enum(["submitted", "pending_review", "entered", "cancelled"]).optional(),
});

// PATCH /api/exhibits/admin/submissions/[id]  — update staff fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("exhibit_registrations")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
