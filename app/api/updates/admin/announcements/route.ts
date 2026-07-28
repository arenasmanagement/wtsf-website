import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildAnnouncementEmail } from "@/lib/emails/updates-announcement";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const VALID_CATEGORIES = [
  "entertainment",
  "tickets",
  "exhibits",
  "livestock",
  "pageants",
  "vendors",
  "volunteers",
  "general",
] as const;

const AnnouncementSchema = z.object({
  title:    z.string().min(1, "Title is required").max(200),
  category: z.enum(VALID_CATEGORIES),
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
    .select("id, title, category, summary, published, published_at, emails_sent, send_status, created_at")
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

  // Publish: send emails
  const result = await publishAnnouncement(announcement.id, { title, category, summary, body });
  return NextResponse.json({ success: true, id: announcement.id, published: true, ...result });
}

/** Shared publish logic used by POST (create+publish) and PATCH (publish existing). */
export async function publishAnnouncement(
  announcementId: string,
  content: { title: string; category: string; summary: string; body: string }
): Promise<{ emailsSent: number; error?: string }> {
  const supabase  = createAdminClient();
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wtsfair.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  // Mark as sending
  await supabase
    .from("announcements")
    .update({ published: true, published_at: new Date().toISOString(), send_status: "sending" })
    .eq("id", announcementId);

  if (!process.env.RESEND_API_KEY) {
    await supabase
      .from("announcements")
      .update({ send_status: "error", send_error: "RESEND_API_KEY not configured" })
      .eq("id", announcementId);
    return { emailsSent: 0, error: "RESEND_API_KEY not configured" };
  }

  // Fetch matching confirmed subscribers
  // "general" category in the announcement matches subscribers who have "general" in their array.
  // Subscribers match if their categories array contains the announcement's category.
  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("id, email, unsubscribe_token")
    .eq("confirmed", true)
    .is("unsubscribed_at", null)
    .contains("categories", [content.category]);

  if (subError) {
    console.error("Failed to fetch subscribers:", subError);
    await supabase
      .from("announcements")
      .update({ send_status: "error", send_error: "Failed to fetch subscribers" })
      .eq("id", announcementId);
    return { emailsSent: 0, error: "Failed to fetch subscribers" };
  }

  if (!subscribers || subscribers.length === 0) {
    await supabase
      .from("announcements")
      .update({ send_status: "sent", emails_sent: 0, published_at: new Date().toISOString() })
      .eq("id", announcementId);
    return { emailsSent: 0 };
  }

  const resend  = new Resend(process.env.RESEND_API_KEY);
  let emailsSent = 0;
  const errors: string[] = [];

  // Send individually so each email has a unique unsubscribe link
  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${siteUrl}/api/updates/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;
    const emailContent = buildAnnouncementEmail({
      title:    content.title,
      category: content.category,
      summary:  content.summary,
      body:     content.body,
      unsubscribeUrl,
      siteUrl,
    });

    try {
      await resend.emails.send({
        from:    `West Tennessee State Fair <${fromEmail}>`,
        to:      subscriber.email,
        subject: emailContent.subject,
        html:    emailContent.html,
        text:    emailContent.text,
      });
      emailsSent++;
    } catch (err) {
      console.error(`Failed to send to ${subscriber.email}:`, err);
      errors.push(subscriber.email);
    }

    // Small delay to avoid Resend rate limits on large lists
    if (emailsSent % 10 === 0 && emailsSent > 0) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  await supabase
    .from("announcements")
    .update({
      send_status:  errors.length > 0 && emailsSent === 0 ? "error" : "sent",
      emails_sent:  emailsSent,
      send_error:   errors.length > 0 ? `Failed to send to: ${errors.slice(0, 10).join(", ")}` : null,
      published_at: new Date().toISOString(),
    })
    .eq("id", announcementId);

  return { emailsSent };
}
