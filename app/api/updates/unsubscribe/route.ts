import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wtsfair.com";

  // Rate limit: 10 attempts per hour per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(ip, "unsubscribe", 10, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=error`);
  }

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=invalid`);
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, unsubscribed_at")
    .eq("unsubscribe_token", token)
    .single();

  if (error || !data) {
    return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=invalid`);
  }

  if (data.unsubscribed_at) {
    return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=already`);
  }

  const { error: updateError } = await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", data.id);

  if (updateError) {
    console.error(`[unsubscribe] Failed to unsubscribe subscriber ${data.id}:`, updateError.code);
    return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=error`);
  }

  return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=success`);
}
