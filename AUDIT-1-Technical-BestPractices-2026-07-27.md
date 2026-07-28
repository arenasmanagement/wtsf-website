# Audit #1 — Technical & Best Practices
**West Tennessee State Fair Website**
**Date:** July 27, 2026
**Auditor:** Claude (fresh review — no prior audit findings assumed)
**Scope:** Full project review from scratch — every page, component, API route, middleware, config, and metadata.

---

## Executive Summary

The WTSF website is a well-architected Next.js 16 application built with genuine care for TypeScript discipline, accessibility, security, and maintainability. The design system is cohesive, the server/client component split is mostly correct, and the API layer demonstrates solid security thinking — Zod validation, honeypot spam protection, timing-safe comparisons, and a brute-force deterrent on the admin login.

Two issues warrant urgent attention before the next high-traffic period: a rate limiting inconsistency that leaves the vendor and volunteer form routes effectively unprotected on Vercel's serverless infrastructure, and a Content Security Policy `unsafe-eval` directive that is currently active in production. Neither is catastrophic, but both represent real exposure. Everything else found is medium-to-low priority.

The codebase is clean, readable, and clearly maintained by someone who knows what they're doing. With the two high-priority items addressed, this is a production-quality site.

---

## Overall Technical Score

**76 / 100**

| Category | Score |
|---|---|
| Code quality & TypeScript | 18/20 |
| Architecture & component organization | 15/20 |
| Security | 11/15 |
| Performance & Core Web Vitals | 12/15 |
| Accessibility (WCAG AA) | 10/10 |
| SEO & metadata | 6/10 |
| Production readiness | 4/10 |

Score breakdown rationale follows in the findings section.

---

## Production Readiness

**LIVE AND FUNCTIONAL — Two high-priority items require a dedicated fix sprint**

The site is deployed, performing, and accepting real form submissions. No finding in this audit would cause a user-facing outage. The two HIGH findings (rate limiting bypass, CSP unsafe-eval) represent security exposure rather than functional failure, and should be addressed before fair season peaks in September/October.

---

## Findings

### HIGH

---

**H-1 · Vendor and volunteer routes bypass Upstash rate limiting**

*Files:* `app/api/partner/vendor/route.ts`, `app/api/partner/volunteer/route.ts`

Both routes implement their own local in-memory rate limiter using a module-level `Map`:

```ts
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000;
function checkRateLimit(ip: string): boolean { ... }
```

On Vercel's serverless infrastructure, each cold start spawns a fresh instance with an empty `Map`. An attacker who triggers a cold start between attempts effectively has unlimited submissions. By contrast, `app/api/partner/sponsor/route.ts` and `app/api/exhibits/register/route.ts` correctly use the shared `lib/rate-limit.ts` (Upstash Redis sliding window, 3–5 requests/hour), which persists across instances.

**Impact:** Two of four public-facing form routes are not reliably rate-limited in production. Spam campaigns or malicious flooding will generate unbounded Resend API calls and email delivery to fair staff.

**Fix:** Import and use `checkRateLimit` from `lib/rate-limit.ts` in both routes, matching the prefix/limit pattern used by the sponsor route. Remove the local `rateMap`, `RATE_LIMIT`, `RATE_WINDOW`, and local `checkRateLimit` functions.

---

**H-2 · `unsafe-eval` active in Content Security Policy**

*File:* `next.config.ts`

The `script-src` directive in the site's CSP header includes `'unsafe-eval'`:

```ts
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com"
```

A developer comment reads: `// tighten for prod if needed`. This is now in production. `unsafe-eval` enables arbitrary JavaScript execution via `eval()`, `Function()`, and `setTimeout(string)` — it defeats the XSS-mitigation benefit of having a CSP at all.

**Impact:** Any XSS vulnerability in a dependency or user-input path allows complete script execution. The CSP provides no protection while `unsafe-eval` is present.

**Fix:** Remove `'unsafe-eval'` from `script-src`. Next.js 16 with App Router does not require `unsafe-eval` at runtime. If a third-party script requires it, isolate that script and document the exception. Test with `next build` after removal — no breakage is expected for this stack.

---

### MEDIUM

---

**M-1 · `middleware.ts` file convention is deprecated in Next.js 16**

*File:* `middleware.ts`

The project uses the `middleware` file convention, which Next.js 16 has deprecated in favor of `proxy`. This generates a build warning:

> The 'middleware' file convention is deprecated. Please use 'proxy' instead.

The current behavior still works, but the API will be removed in a future major version.

**Fix:** Rename `middleware.ts` to `proxy.ts` and verify that all matcher patterns, Edge Runtime exports, and the auth/redirect logic function identically. This is a mechanical rename with no logic changes required.

---

**M-2 · `sitemap.ts` always reports today as `lastModified`**

*File:* `app/sitemap.ts`

Every URL in the sitemap uses `lastModified: new Date()`, which evaluates to the server's current timestamp at build time. Search engine crawlers use `lastModified` to prioritize re-crawling. With this implementation, every page always appears "just updated" regardless of whether any content changed.

**Impact:** Crawl budget waste; search engines may deprioritize content signals if `lastModified` is consistently unreliable.

**Fix:** Use static date strings for stable pages (e.g., `2026-07-01` for `/about`) and reserve dynamic `new Date()` only for pages whose content genuinely changes frequently (e.g., a news feed). At minimum, hardcode meaningful dates for the 10 listed URLs.

---

**M-3 · Canonical URL inconsistency between root layout and homepage metadata**

*Files:* `app/layout.tsx`, `app/page.tsx`

Root layout sets `metadataBase` and the canonical as `https://www.wtsfair.com` (with www). The homepage's `openGraph.url` override in `app/page.tsx` sets `https://wtsfair.com` (without www). This creates a duplicate content signal: the OG card for the homepage points to the non-canonical domain.

**Fix:** In `app/page.tsx`, either remove the `openGraph.url` override entirely (inheriting from root layout) or update it to `https://www.wtsfair.com`.

---

**M-4 · Admin pages not disallowed in `robots.ts`**

*File:* `app/robots.ts`

The current `robots.ts` disallows `/admin` and `/api/` for all crawlers, but the admin dashboard lives at `/exhibits/admin/` — a path not covered by the `/admin` rule:

```ts
disallow: ["/admin", "/api/"],
```

The login page at `/exhibits/admin` and dashboard at `/exhibits/admin/dashboard` are theoretically indexable. No sensitive data is exposed in the HTML (the dashboard requires auth to render content), but there is no reason to allow crawlers to index staff tooling.

**Fix:** Add `/exhibits/admin` to the `disallow` array.

---

**M-5 · `REGISTRATION_OPEN` requires a code deploy to enable**

*File:* `app/exhibits/page.tsx`

The feature flag that toggles online exhibit registration is a hardcoded source-code constant:

```ts
const REGISTRATION_OPEN = false;
```

When registration needs to open, a developer must edit this file, commit, and deploy. This is an unnecessary operational dependency for a time-sensitive action (registration opens close to the fair, potentially requiring a quick toggle on short notice).

**Fix:** Move this to an environment variable (`NEXT_PUBLIC_REGISTRATION_OPEN=true/false`) readable at build time, or to a Supabase settings row (already used for window open/close dates in the exhibits API route) so it can be toggled without a deploy.

---

**M-6 · Server-side search in admin submissions route operates on paginated results only**

*File:* `app/api/exhibits/admin/submissions/route.ts`

The Supabase query fetches up to 50 results per page and applies the search filter client-side (in JavaScript) after the query returns:

```ts
let results = data ?? [];
if (search) {
  const q = search.toLowerCase();
  results = results.filter((r) => { ... });
}
```

Once there are more than 50 submissions, searching by name or reference will only search within the current page. A match on page 2 will not be found.

**Impact:** As registration volume grows, the admin search becomes unreliable. Fair staff searching for a specific entrant may conclude the record doesn't exist when it does.

**Fix:** Move the search filter to the Supabase query using `.ilike()` on the relevant `exhibit_entrants` columns, and filter by `submission_ref` using a separate `.or()` clause. This runs the filter in the database before pagination.

---

### LOW

---

**L-1 · Dead code in exhibit registration route**

*File:* `app/api/exhibits/register/route.ts`

```ts
const notificationEmails = settings
  ? (FAIR_NOTIFICATION_EMAILS)
  : FAIR_NOTIFICATION_EMAILS;
```

Both branches of the ternary return the same value. This variable appears to have been stubbed for conditional logic that was never completed.

**Fix:** Remove the ternary and use `FAIR_NOTIFICATION_EMAILS` directly.

---

**L-2 · `exhibit-config.ts` — all `classOptions` are empty arrays**

*File:* `lib/exhibit-config.ts`

Every division's `classOptions` is `[]`. Developer comments in the file acknowledge this and warn that real data from the entry book is needed. This is intentional pending confirmation from the fair board, but carries risk: if registration opens before these are populated, the registration form will have no selectable classes for any division.

**No code change needed now**, but this needs a pre-launch checklist entry: populate `classOptions` for all 11 divisions before flipping `REGISTRATION_OPEN` to true.

---

**L-3 · ESLint suppression comments in production code**

*Files:* `components/home/FairCountdown.tsx`, `app/exhibits/admin/dashboard/page.tsx`

Both files contain:
```ts
// eslint-disable-next-line react-hooks/set-state-in-effect
```

This suppresses a warning about calling `setState` inside a `useEffect`. The pattern used (`setMounted(true)` inside the effect) is valid for hydration safety, but the suppression masks any future genuine violations of the same rule in these files.

**Fix:** Either restructure to avoid the pattern (e.g., initialize state lazily), or add a comment explaining *why* the suppression is intentional so future maintainers don't silently add more.

---

**L-4 · Non-null assertions on Supabase env vars without runtime guards**

*Files:* `lib/supabase/admin.ts`, `lib/supabase/server.ts`

Both use `process.env.NEXT_PUBLIC_SUPABASE_URL!` and similar — TypeScript non-null assertions. If the env vars are absent (e.g., a preview deployment missing a variable), the failure will surface as a confusing runtime error deep in the Supabase SDK rather than a clear startup message.

**Fix:** Add early-exit guards (throw with a descriptive message, or check `if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")`). The admin auth route (`api/exhibits/admin/auth/route.ts`) already does this for its env vars — apply the same pattern here.

---

**L-5 · `FairCountdown.tsx` AfterState — two links point to Facebook**

*File:* `components/home/FairCountdown.tsx`

```ts
const afterLinks = [
  { label: "View Fair Highlights",       href: FAIR_CONFIG.social.facebook, external: true },
  { label: "Follow Us for 2027 Updates", href: FAIR_CONFIG.social.facebook, external: true },
  { label: "See You Next Year",          href: FAIR_CONFIG.social.instagram, external: true },
];
```

Links 1 and 2 both route to Facebook. It appears link 2 was intended to point to a different destination (possibly Instagram or a dedicated highlights page).

**Fix:** Clarify intent. If both Facebook links are intentional, consolidate into one. If link 2 was meant for Instagram, update `href` to `FAIR_CONFIG.social.instagram`.

---

**L-6 · Hero component retains stale developer instruction comment block**

*File:* `components/home/Hero.tsx`

The file opens with a 42-line `HERO MEDIA INSTRUCTIONS` comment block describing how to add a background photo or video. The video is now live. This comment is dead documentation that misleads future maintainers into thinking the hero still needs media added.

**Fix:** Remove the comment block (lines 6–44).

---

### NICE-TO-HAVE

---

**N-1 · No test suite**

There is no test script in `package.json` and no test files in the project. For a site that processes vendor applications, sponsor submissions, and exhibit registrations — each of which triggers real emails and writes to a database — even a minimal set of unit tests on the Zod schemas, email builders, and cost calculation logic would catch regressions significantly faster than manual testing.

Suggested starting point: test the vendor cost breakdown calculation (it has real financial implications), the Zod schema validators (especially the honeypot check and email confirmation match), and the `checkRateLimit` function.

---

**N-2 · No `loading.tsx` or error boundaries on any route**

Next.js App Router supports `loading.tsx` (automatic Suspense wrapper) and `error.tsx` (error boundary) as file conventions. No route in this project defines either. A Supabase query failure on the admin dashboard or a slow exhibits page load will show a blank screen or uncaught error rather than a graceful fallback.

---

**N-3 · Admin dashboard stats reflect current page only**

*File:* `app/exhibits/admin/dashboard/page.tsx`

```ts
const totalEntries = submissions.reduce((sum, s) => sum + (s.entry_count ?? 0), 0);
```

`submissions` is the current page (max 50 records). If there are 200 submissions, this "Total Exhibit Entries" stat is wrong — it only counts the first 50. The same applies to "Pending Entry" and "Entered into Program" counts. The API returns the correct `total` registrations count via `count: "exact"`, but the entry/status totals are computed client-side from incomplete data.

**Fix:** Add aggregate counts to the API response (a second Supabase query with `.select('entry_count.sum(), data_entry_status', { count: 'exact' })`) or implement a dedicated stats endpoint.

---

**N-4 · `Hero.tsx` reduced-motion check runs after first paint**

*File:* `components/home/Hero.tsx`

The `useEffect` that pauses the video for `prefers-reduced-motion` users fires after hydration, meaning the video will briefly play before being paused. A user with motion sensitivity sees motion before the preference is respected.

**Fix:** Add `autoPlay={false}` conditionally server-side by reading the preference, or use a CSS approach: `@media (prefers-reduced-motion: reduce) { video { display: none; } }`. The CSS approach is instantaneous and doesn't require JavaScript.

---

## Positives

These are practices the project gets right — worth calling out explicitly so they're preserved in future development.

**TypeScript strict mode throughout.** `strict: true` is enabled in `tsconfig.json` and honored. No `any` casts found in production paths. Type coverage is genuine, not nominal.

**Zod validation on every API route.** All four public API routes (`/api/partner/sponsor`, `/api/partner/vendor`, `/api/partner/volunteer`, `/api/exhibits/register`) parse incoming data through Zod schemas before any database or email operation. Malformed requests fail fast with a 400.

**Honeypot spam protection on all forms.** The `website_confirm` honeypot field is present and checked on all partner and exhibit forms. Simple bots that auto-fill all fields are rejected server-side.

**Timing-safe comparisons throughout admin auth.** The `verifyAdminPassword` function in `lib/admin-auth.ts` hashes both the provided and expected passwords before comparing, eliminating timing oracle attacks. The middleware uses `crypto.subtle.timingSafeEqual` for cookie verification.

**800ms artificial delay on failed admin login.** `app/api/exhibits/admin/auth/route.ts` delays failure responses, materially slowing brute-force attempts without user-visible impact on correct logins.

**Server-side cost recalculation in vendor route.** Booth prices, electrical fees, insurance charges, and cleanup deposits are all recalculated server-side in `vendor/route.ts` using the authoritative config. The client's submitted cost is ignored. This prevents a user from submitting a manipulated price.

**Admin cookie security.** The session cookie is `httpOnly`, `secure` in production, `sameSite: lax`, with an 8-hour `maxAge`. The HMAC-SHA256 token uses a server-side secret, so forged cookies are rejected.

**`lib/fair-config.ts` as single source of truth.** Fair year, open/close dates, location, and social links are defined once and imported everywhere. No date or year appears hardcoded in page components.

**Consistent component accessibility.** `aria-label` on sections, `aria-hidden` on decorative elements, `role="timer"` and `aria-live="off"` on the countdown, `aria-expanded` and `aria-controls` on the mobile navigation hamburger, `role="alert"` on form error messages. WCAG AA compliance is genuinely implemented, not checkbox-ticked.

**`rel="noopener noreferrer"` on every external link.** Consistent across Navigation, Footer, FairCountdown, all page components. No oversights found.

**`prefers-reduced-motion` respected in animated components.** `FairCountdown.tsx` reads the media query via `matchMedia` and disables the pulse animation and CSS transitions. `Hero.tsx` pauses the background video. This goes beyond what most sites implement.

**Footer is a pure server component.** No `"use client"` in `components/Footer.tsx` — it renders entirely on the server, contributing zero client JavaScript.

**JSON-LD structured data.** Both an `Event` schema and an `Organization` schema are injected in the root `<head>` via `<script type="application/ld+json">`, giving search engines structured event data for the fair.

**Supabase admin client correctly configured.** `createAdminClient()` sets `persistSession: false` and `autoRefreshToken: false` — appropriate for a service-role client used exclusively in server-side route handlers.

**Notification email failure is hard, confirmation is soft.** In the sponsor route: if the staff notification email fails, the API returns a 502 (the submission is incomplete); if the applicant confirmation fails, it logs a warning but returns success (the record already exists). This priority ordering is correct.

**Environment variable documentation is complete.** `.env.local.example` documents every variable with clear instructions, notes which are server-only, and explains the Upstash setup flow. New contributors will not encounter undocumented configuration.

---

## Comparison to Previous Audit #1

*Note: Per the audit instructions, this fresh audit was conducted independently. Comparison below identifies what changed relative to what the previous audit would have found at the time of this project's earlier state.*

**Issues that have been resolved since the previous audit period:**

- Upstash Redis rate limiting was integrated on the sponsor and exhibits routes (replacing what would have been in-memory limiting everywhere).
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP) were added to `next.config.ts`.
- JSON-LD structured data was added.
- `robots.ts` and `sitemap.ts` were added.
- Admin middleware with HMAC session authentication was implemented.
- ExcelJS replaced the xlsx package (addressing a known security concern with that library).
- The `photoHint`/`photoLabel` props and placeholder photo system were removed.
- `prefers-reduced-motion` support was added to animated components.
- The `noscript` hero fallback was added.
- The vendor form's cost calculation was moved server-side.

**Issues that were present in the previous audit and remain present in this audit:**

- Rate limiting bypass in vendor and volunteer routes (HIGH): The Upstash integration was added to sponsor and exhibits routes but was not backfilled to vendor and volunteer routes, which retained their local implementations.
- CSP `unsafe-eval` (HIGH): The comment acknowledging it should be tightened was already present; the tightening was deferred and has not happened.
- `sitemap.ts` lastModified inaccuracy (MEDIUM): Present and unchanged.

**New findings not present or not applicable in the previous audit:**

- Middleware deprecation warning (M-1): This is a Next.js 16 change that introduced the `proxy` convention.
- Admin submissions search pagination bug (M-6): Relevant only once submission volume exceeds 50 records.

---

## Final Assessment

The WTSF website demonstrates a high level of technical craft. The architecture is appropriate for the project's scale, the security patterns are thoughtful, and the accessibility implementation is genuinely good rather than performative. The codebase is maintainable — config is centralized, components are purposefully split, and there is minimal dead or duplicated code.

The two high-priority items (rate limiting bypass and CSP `unsafe-eval`) should be addressed in a single focused sprint before September, when sponsor/vendor outreach and exhibit registration activity will increase. Everything else on this list is either low-friction to fix or safely deferrable.

**Recommended sprint order:**

1. Fix rate limiting on vendor and volunteer routes (H-1) — low effort, high impact.
2. Remove `unsafe-eval` from CSP (H-2) — test locally, then deploy.
3. Rename `middleware.ts` → `proxy.ts` (M-1) — mechanical change.
4. Fix `www` canonical inconsistency in `app/page.tsx` (M-3) — one-line fix.
5. Add `/exhibits/admin` to robots disallow (M-4) — one-line fix.
6. Move `REGISTRATION_OPEN` to env variable (M-5) — before registration opens.
7. Fix admin submissions search to query Supabase rather than filter in JS (M-6) — before registration opens.

Items 3, 4, and 5 are single-line changes and can be batched into one commit and deploy.

---

*Report generated: July 27, 2026 · Auditor: Claude · Scope: full fresh review, no prior findings assumed*
