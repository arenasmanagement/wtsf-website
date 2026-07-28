// Service-role Supabase client — bypasses RLS.
// NEVER import this in browser-side code. Server / Route Handlers only.
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error(
      "Missing env var: NEXT_PUBLIC_SUPABASE_URL — " +
      "set it in .env.local (dev) and the Vercel dashboard (prod)."
    );
  }
  if (!key) {
    throw new Error(
      "Missing env var: SUPABASE_SERVICE_ROLE_KEY — " +
      "set it in .env.local (dev) and the Vercel dashboard (prod). " +
      "Never expose this key on the client side."
    );
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
