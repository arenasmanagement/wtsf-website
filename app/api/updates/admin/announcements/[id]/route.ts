import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { publishAnnouncement } from "../route";

// PATCH /api/updates/admin/announcements/[id]
// Atomically claims and publishes a draft announcement.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Atomic claim: only transitions from 'draft' → 'sending'.
  // If the announcement is already sending/sent, the conditional .eq("send_status", "draft")
  // will match no rows and .single() returns null — we return 409.
  const { data: claimed, error: claimError } = await supabase
    .from("announcements")
    .update({
      published:        true,
      published_at:     new Date().toISOString(),
      send_status:      "sending",
      last_attempted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("send_status", "draft")
    .select("id, title, category, summary, body")
    .single();

  if (claimError || !claimed) {
    // Check whether the announcement exists at all
    const { data: existing } = await supabase
      .from("announcements")
      .select("id, send_status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Announcement already publishing or published. Emails will not be resent." },
      { status: 409 }
    );
  }

  const result = await publishAnnouncement(id, {
    title:    claimed.title,
    category: claimed.category,
    summary:  claimed.summary,
    body:     claimed.body,
  });

  return NextResponse.json({ success: true, ...result });
}
