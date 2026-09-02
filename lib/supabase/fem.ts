// lib/supabase/fem.ts
// Fair Exhibit Manager — service-role Supabase client.
// Connects to the FEM project (SEPARATE from the WTSF website Supabase project).
// NEVER import this in browser-side code. Server / Route Handlers only.

import { createClient } from "@supabase/supabase-js";

export function createFemAdminClient() {
  const url = process.env.FEM_SUPABASE_URL;
  const key = process.env.FEM_SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error(
      "Missing env var: FEM_SUPABASE_URL — " +
      "add it to .env.local (dev) and the Vercel dashboard (prod)."
    );
  }
  if (!key) {
    throw new Error(
      "Missing env var: FEM_SUPABASE_SERVICE_ROLE_KEY — " +
      "add it to .env.local (dev) and the Vercel dashboard (prod). " +
      "Never expose this key on the client side."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
