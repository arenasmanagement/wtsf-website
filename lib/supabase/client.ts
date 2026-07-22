// Browser-side Supabase client — safe for use in "use client" components.
// Only has access to the anon key (public data + RLS-permitted operations).
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
