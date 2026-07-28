import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildAnnouncementEmail } from "@/lib/emails/updates-announcement";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { VALID_CATEGORIES, CATEGORY_VALUES } from "@/lib/updates/categories";

const AnnouncementSchema = z.object({
  title:    z.string().min(1, "Title is required").max(200),
  category: z.enum(CATEGORY_VALUES),
  summary:  z.string().min(1, "Summary is required").max(500),
  body:     z.string().min(1, "Full message is required").max(5000),
  publish:  z.boolean().default(false),
});

// GET — list all announcements (newest first)
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, category, summary, published, published_at, emails_sent, emails_targeted, emails_failed, batch_count, last_attempted_at, send_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }

  // Also return total confirmed subscriber count
  const { count: subscriberCount } = await supabase
    .from("subscribers")
    .select("id", { count: "exact", head: true })
    .eq("confirmed", true)
    .is("unsubscribed_at", null);

  return NextResponse.json({ data, subscriberCount: subscriberCount ?? 0 });
}

// POST — create announcement (and optionally publish)
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = AnnouncementSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { title, category, summary, body, publish } = parsed.data;
  const supabase = createAdminClient();

  // Insert announcement (draft first)
  const { data: announcement, error: insertError } = await supabase
    .from("announcements")
    .insert({
      title,
      category,
      summary,
      body,
      published:   false,
      send_status: "draft",
    })
    .select("id")
    .single();

  if (insertError || !announcement) {
    console.error("Failed to create announcement:", insertError);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }

  if (!publish) {
    return NextResponse.json({ success: true, id: announcement.id, published: false });
  }

  // Atomically claim for publish: transition draft → sending
  const supabase2 = createAdminClient();
  const { data: claimed, error: claimError } = await supabase2
    .from("announcements")
    .update({ published: true, published_at: new Date().toISOString(), send_status: "sending", last_attempted_at: new Date().toISOString() })
    .eq("id", announcement.id)
    .eq("send_status", "draft")
    .select("id")
    .single();

  if (!claimed || claimError) {
    return NextResponse.json({ error: "Announcement already publishing or published" }, { status: 409 });
  }

  // Publish: send emails
  const result = await publishAnnouncement(announcement.id, { title, category, summary, body });
  return NextResponse.json({ success: true, id: announcement.id, published: true, ...result });
}

/** Shared publish logic.
 *
 * PRECONDITION: The announcement record must already be in 'sending' status
 * (atomically claimed by the caller). This function only handles email delivery
 * and final status update.
 */
export async function publishAnnouncement(
  announcementId: string,
  content: { title: string; category: string; summary: string; body: string }
): Promise<{ emailsSent: number; emailsFailed: number; error?: string }> {
  const supabase  = createAdminClient();
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wtsfair.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!process.env.RESEND_API_KEY) {
    await supabase
      .from("announcements")
      .update({ send_status: "error", send_error: "RESEND_API_KEY not configured" })
      .eq("id", announcementId);
    return { emailsSent: 0, emailsFailed: 0, error: "RESEND_API_KEY not configured" };
  }

  // Fetch matching confirmed subscribers
  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("id, email, unsubscribe_token")
    .eq("confirmed", true)
    .is("unsubscribed_at", null)
    .contains("categories", [content.category]);

  if (subError) {
    console.error(`[announce:${announcementId}] Failed to fetch subscribers:`, subError);
    await supabase
      .from("announcements")
      .update({ send_status: "error", send_error: "Failed to fetch subscribers" })
      .eq("id", announcementId);
    return { emailsSent: 0, emailsFailed: 0, error: "Failed to fetch subscribers" };
  }

  if (!subscribers || subscribers.length === 0) {
    await supabase
      .from("announcements")
      .update({
        send_status:     "sent",
        emails_sent:     0,
        emails_targeted: 0,
        emails_failed:   0,
        batch_count:     0,
        published_at:    new Date().toISOString(),
      })
      .eq("id", announcementId);
    return { emailsSent: 0, emailsFailed: 0 };
  }

  const resend       = new Resend(process.env.RESEND_API_KEY);
  const BATCH_SIZE   = 50;
  let emailsSent     = 0;
  let emailsFailed   = 0;
  let batchCount     = 0;
  const emailsTargeted = subscribers.length;

  // Send in batches of 50 (well within Resend Pro batch limit of 100)
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const chunk = subscribers.slice(i, i + BATCH_SIZE);
    batchCount++;

    const batchPayload = chunk.map((subscriber) => {
      const unsubscribeUrl = `${siteUrl}/api/updates/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;
      const emailContent = buildAnnouncementEmail({
        title:    content.title,
        category: content.category,
        summary:  content.summary,
        body:     content.body,
        unsubscribeUrl,
        siteUrl,
      });
      return {
        from:    `West Tennessee State Fair <${fromEmail}>`,
        to:      subscriber.email,
        subject: emailContent.subject,
        html:    emailContent.html,
        text:    emailContent.text,
      };
    });

    try {
      const result = await resend.batch.send(batchPayload);
      // Each entry in result.data corresponds to one email
      const batchData = result.data ?? [];
      // Count successes: entries with an id and no error
      const batchSent   = Array.isArray(batchData)
        ? batchData.filter((r: { id?: string; error?: unknown }) => r.id && !r.error).length
        : chunk.length;
      const batchFailed = chunk.length - batchSent;
      emailsSent   += batchSent;
      emailsFailed += batchFailed;

      if (batchFailed > 0) {
        console.error(
          `[announce:${announcementId}] Batch ${batchCount}: ${batchFailed}/${chunk.length} failed`
        );
      }
    } catch (err) {
      console.error(`[announce:${announcementId}] Batch ${batchCount} threw:`, err);
      emailsFailed += chunk.length;
    }
  }

  // Determine final status
  const finalStatus =
    emailsFailed === 0                             ? "sent"
    : emailsFailed === emailsTargeted              ? "error"
    :                                               "partially_failed";

  await supabase
    .from("announcements")
    .update({
      send_status:     finalStatus,
      emails_sent:     emailsSent,
      emails_targeted: emailsTargeted,
      emails_failed:   emailsFailed,
      batch_count:     batchCount,
      published_at:    new Date().toISOString(),
      send_error:      emailsFailed > 0
        ? `${emailsFailed} of ${emailsTargeted} emails failed across ${batchCount} batch(es)`
        : null,
    })
    .eq("id", announcementId);

  return { emailsSent, emailsFailed };
}

// Export VALID_CATEGORIES for consumers that still reference it from this module
export { VALID_CATEGORIES };
