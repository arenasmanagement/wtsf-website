import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wtsfair.com";

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=invalid`);
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, confirmed, unsubscribed_at")
    .eq("confirmation_token", token)
    .single();

  if (error || !data) {
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=invalid`);
  }

  if (data.confirmed && !data.unsubscribed_at) {
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=already`);
  }

  const { error: updateError } = await supabase
    .from("subscribers")
    .update({
      confirmed:      true,
      confirmed_at:   new Date().toISOString(),
      unsubscribed_at: null,
    })
    .eq("id", data.id);

  if (updateError) {
    console.error("Failed to confirm subscriber:", updateError);
    return NextResponse.redirect(`${siteUrl}/updates/confirm?status=error`);
  }

  return NextResponse.redirect(`${siteUrl}/updates/confirm?status=success`);
}
