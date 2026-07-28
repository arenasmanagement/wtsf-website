import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildOptInEmail } from "@/lib/emails/updates-opt-in";
import { checkRateLimit } from "@/lib/rate-limit";
import { CATEGORY_VALUES } from "@/lib/updates/categories";

const SubscribeSchema = z.object({
  email:      z.string().email("Invalid email address").max(200).toLowerCase(),
  categories: z
    .array(z.enum(CATEGORY_VALUES))
    .min(1, "Select at least one category")
    .max(8),
  // Honeypot — bots fill this; humans leave it blank
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Rate limit: 3 subscriptions per IP per hour
  const rl = await checkRateLimit(ip, "updates_subscribe", 3, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot check
  if (
    typeof raw === "object" &&
    raw !== null &&
    "website" in raw &&
    (raw as Record<string, unknown>).website
  ) {
    // Silent success for bots
    return NextResponse.json({ success: true });
  }

  const parsed = SubscribeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { email, categories } = parsed.data;
  const supabase = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wtsfair.com";

  // Check for existing subscriber
  const { data: existing } = await supabase
    .from("subscribers")
    .select("id, confirmed, unsubscribed_at, categories, confirmation_token")
    .eq("email", email)
    .single();

  let confirmationToken: string;

  if (existing) {
    // Merge categories (union), clear unsubscribed_at if re-subscribing
    const merged = Array.from(new Set([...existing.categories, ...categories]));
    const wasUnsubscribed = existing.unsubscribed_at !== null;

    const updates: Record<string, unknown> = { categories: merged };
    if (wasUnsubscribed) {
      updates.unsubscribed_at = null;
      updates.confirmed = false;
    }

    if (wasUnsubscribed || !existing.confirmed) {
      // Need to re-confirm — generate a fresh token and set expiry (7 days)
      const newToken = crypto.randomUUID();
      const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from("subscribers")
        .update({
          ...updates,
          confirmation_token:          newToken,
          confirmation_token_expires_at: tokenExpiry,
          confirmed:                   false,
        })
        .eq("id", existing.id);

      confirmationToken = newToken;
    } else {
      // Already confirmed — just update categories silently
      await supabase
        .from("subscribers")
        .update({ categories: merged })
        .eq("id", existing.id);
      // Don't send another confirmation email — they're already confirmed
      return NextResponse.json({ success: true, alreadyConfirmed: true });
    }
  } else {
    // New subscriber — insert with token expiry
    confirmationToken = crypto.randomUUID();
    const unsubscribeToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from("subscribers").insert({
      email,
      categories,
      confirmed:                       false,
      confirmation_token:              confirmationToken,
      confirmation_token_expires_at:   tokenExpiry,
      unsubscribe_token:               unsubscribeToken,
      ip_address:                      ip,
    });

    if (error) {
      console.error("Failed to insert subscriber:", error.code);
      return NextResponse.json(
        { error: "Failed to save subscription" },
        { status: 500 }
      );
    }
  }

  // Send opt-in confirmation email
  const confirmUrl = `${siteUrl}/api/updates/confirm?token=${encodeURIComponent(confirmationToken)}`;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

    try {
      const emailContent = buildOptInEmail({ confirmUrl, categories, siteUrl });
      await resend.emails.send({
        from:    `West Tennessee State Fair <${fromEmail}>`,
        to:      email,
        subject: emailContent.subject,
        html:    emailContent.html,
        text:    emailContent.text,
      });
    } catch (err) {
      console.error("Failed to send opt-in email:", err instanceof Error ? err.message : "unknown error");
      // Don't fail the request — subscriber is saved, they can re-subscribe if needed
    }
  } else {
    console.warn("RESEND_API_KEY not set — skipping opt-in email");
  }

  return NextResponse.json({ success: true });
}
