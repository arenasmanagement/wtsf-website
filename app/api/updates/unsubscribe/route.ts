import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wtsfair.com";

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
    console.error("Failed to unsubscribe:", updateError);
    return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=error`);
  }

  return NextResponse.redirect(`${siteUrl}/updates/unsubscribe?status=success`);
}
