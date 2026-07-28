import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { publishAnnouncement } from "../route";

// PATCH /api/updates/admin/announcements/[id]
// Publish a draft announcement that was already created.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Fetch the announcement
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, category, summary, body, published")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }

  if (data.published) {
    return NextResponse.json(
      { error: "Announcement already published. Emails will not be resent." },
      { status: 409 }
    );
  }

  const result = await publishAnnouncement(id, {
    title:    data.title,
    category: data.category,
    summary:  data.summary,
    body:     data.body,
  });

  return NextResponse.json({ success: true, ...result });
}
