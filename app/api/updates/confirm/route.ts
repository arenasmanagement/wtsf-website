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

  const rl = await checkRateLimit(ip, "confirm", 10, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=error`);
  }

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=invalid`);
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, confirmed, unsubscribed_at, confirmation_token_expires_at")
    .eq("confirmation_token", token)
    .single();

  if (error || !data) {
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=invalid`);
  }

  // Check token expiry
  if (data.confirmation_token_expires_at) {
    const expiresAt = new Date(data.confirmation_token_expires_at);
    if (expiresAt < new Date()) {
      // Token expired — redirect to invalid so the user can resubscribe
      console.warn(`[confirm] Expired token for subscriber ${data.id}`);
      return NextResponse.redirect(`${siteUrl}/updates/confirm?status=invalid`);
    }
  }

  if (data.confirmed && !data.unsubscribed_at) {
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=already`);
  }

  const { error: updateError } = await supabase
    .from("subscribers")
    .update({
      confirmed:                       true,
      confirmed_at:                    new Date().toISOString(),
      unsubscribed_at:                 null,
      confirmation_token_expires_at:   null, // consume the token
    })
    .eq("id", data.id);

  if (updateError) {
    console.error(`[confirm] Failed to confirm subscriber ${data.id}:`, updateError.code);
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=error`);
  }

  return NextResponse.redirect(`${siteUrl}/updates/confirm?status=success`);
}
