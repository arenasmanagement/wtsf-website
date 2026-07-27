# West Tennessee State Fair Website — Audit #1: Technical & Best Practices

**Date:** July 27, 2026
**Auditor:** Claude (Senior Next.js Engineer, UX Designer, SEO Specialist, Accessibility Consultant, Performance Engineer, Security Auditor)
**Site:** [https://wtsf-website-k29p5eac4-amco2.vercel.app](https://wtsf-website-k29p5eac4-amco2.vercel.app)
**Repository:** arenasmanagementco/wtsf-website
**Framework:** Next.js 16.2.10 (App Router) · React 19 · Tailwind CSS v4

---

## Executive Summary

**Overall Technical Score: 74 / 100**

**Production Readiness:**
🟡 Ready with Minor Issues

The site is structurally sound, professionally built, and close to production-ready. The codebase demonstrates strong patterns: a proper design system, well-organized data layers, consistent component reuse, working email APIs, Supabase integration, admin authentication, and solid accessibility foundations. Several issues must be resolved before the production domain is connected — most notably wrong dates on the Livestock page, broken footer links, missing SEO infrastructure (sitemap, robots.txt, OG image), a visual CSS bug on the About page, and no HTTP security headers. None of these are architectural problems; all are targeted fixes.

---

## Findings

---

### Critical Issues

**1. Livestock page shows 2025 show dates throughout**
All four livestock shows display "2025" dates: `"Friday, October 17, 2025"`, `"Saturday, October 18, 2025"`, `"Monday, October 20, 2025"`, `"Tuesday, October 21, 2025"`. The schedule summary section is also labeled `"2025 Show Schedule"`. Class groups within the Breeding Sheep and Cattle shows also reference 2025 birth-year windows throughout. These are visible on the public page as factually incorrect content. This is the single most urgent content-accuracy fix before launch.
- **File:** `app/livestock/page.tsx` — `SHOWS` array dates, `scheduleData` labels

**2. Footer links bypass the existing redirect with a worse destination**
The Footer component sends "Become a Vendor" to `/vendors-sponsors` and "Become a Sponsor" to `/vendors-sponsors#sponsor`. While a 301 redirect exists in `next.config.ts`, anchor-hash redirects (`#sponsor`) do not preserve the hash in Next.js redirects — users landing via "Become a Sponsor" will end up at `/partner-with-us` with no anchor scroll. Additionally, "Volunteer" points to `/about#volunteer`, which no longer exists as a section on the About page.
- **File:** `components/Footer.tsx` lines 22–29

**3. About page Contact section links to old `/vendors-sponsors` route**
The "Interested in sponsoring or volunteering?" callout inside the Contact section links to `/vendors-sponsors`, which is the old route. The redirect works, but it's inconsistent with the architecture and will fail for any anchor-hash deep links.
- **File:** `app/about/page.tsx` line 444

**4. No `robots.txt` or `sitemap.xml`**
Neither `/robots.txt` nor `/sitemap.xml` (or their Next.js App Router equivalents `app/robots.ts` / `app/sitemap.ts`) exist. Without a sitemap, search engines discover pages only through crawling. Without `robots.txt`, crawlers receive no direction on what to index and what to ignore (e.g., `/exhibits/admin`, `/api/*`). This is a foundational SEO gap.

**5. No Open Graph image defined**
All pages declare `openGraph` metadata in `layout.tsx` and on `page.tsx`, but no `openGraph.images` property is set anywhere. When the site is shared on Facebook, LinkedIn, iMessage, or Discord, the preview card shows no image — just a text link. For a community fair with strong social engagement, this is a significant brand visibility gap.

---

### High Priority

**6. About page: Board Members gold bar is CSS-broken (missing `relative`)**
The Board Members `<div>` at lines ~318–350 of `app/about/page.tsx` contains an absolutely positioned gold accent bar (`absolute top-0 left-0 right-0 h-0.5`), but the parent container does NOT have `position: relative`. This means the gold line escapes the card and positions itself relative to the nearest positioned ancestor (the `<section id="leadership">`), visually breaking the intended top-border accent. All similar officer cards correctly use `relative` on their parent.
- **File:** `app/about/page.tsx` — Board Members parent `<div>` is missing `className="relative ..."`

**7. No HTTP security headers**
`next.config.ts` defines only redirects. There are no security headers configured: no `Content-Security-Policy`, no `X-Frame-Options` (allowing the site to be embedded in iframes — phishing risk), no `X-Content-Type-Options`, no `Referrer-Policy`, no `Permissions-Policy`. Next.js makes adding these trivial via `async headers()` in `next.config.ts`.

**8. In-memory rate limiting is ineffective on Vercel**
All three API routes (`/api/exhibits/register`, `/api/partner/sponsor`, `/api/partner/vendor`, `/api/partner/volunteer`) use `new Map<string, ...>()` for rate limiting. On Vercel's serverless infrastructure, each function invocation may run in a different isolate, meaning the rate map is empty on every cold start. A bad actor can bypass rate limits entirely by waiting for new function instances. A minimal fix is Redis (Upstash) or at minimum a database-based counter.

**9. Mobile navigation active state is broken for sub-routes**
Desktop navigation correctly uses `pathname.startsWith(link.href + "/")` for active detection — so visiting `/partner-with-us/sponsors` keeps "Partner With Us" highlighted. Mobile navigation uses only `pathname === link.href` (exact match), so the active gold color never shows when inside a sub-route on mobile.
- **File:** `components/Navigation.tsx` line 162

**10. `[TBC — Confirm for 2026]` text is visible to the public on the Pageants page**
Every division card in the "Pageant Divisions" section displays the literal string `"[TBC — Confirm for 2026]"` in the `note` field. This developer annotation is rendered as public-facing content. It should either be removed before launch or replaced with friendly language like "Times to be confirmed — check back soon."
- **File:** `app/pageants/page.tsx` — `divisions` array, all 9 entries

**11. `vercel` CLI is listed in `dependencies`, not `devDependencies`**
`package.json` line 30 places `"vercel": "^56.5.0"` under `devDependencies` (confirmed), but this is correct — this note is retracted. ✓ (vercel is correctly in devDependencies per inspection.)

**12. `xlsx` package has known security vulnerabilities**
The `xlsx` package (version `0.18.5`) in `dependencies` is a known security concern. The SheetJS library at this version has unresolved CVEs. Since it appears to be used only in admin export routes (server-side), impact is contained — but it should be replaced with the maintained `exceljs` package or a newer fork before production launch.

---

### Medium Priority

**13. `photoHint` and `photoLabel` props in `PageHero` are accepted but never rendered**
`PageHero.tsx` declares and destructures both `photoHint` and `photoLabel` props, but neither is used anywhere in the rendered JSX. Every page that uses PageHero passes these props, but they silently disappear. These are dead props left from a previous placeholder system (`PhotoPlaceholder`). They add interface noise and false documentation value.
- **File:** `components/ui/PageHero.tsx` — `photoHint`, `photoLabel` in interface and destructure

**14. `PhotoPlaceholder` component is dead code**
`components/ui/PhotoPlaceholder.tsx` is a complete component that is never imported or used anywhere in the project. It can be safely deleted, along with its `.photo-placeholder` CSS rule in `globals.css`.

**15. 29 orphaned images in `/public/images/`**
The following WebP files are present in `/public/images/` but are not referenced by any `.tsx`, `.ts`, or component file in the project. They will never be served in production but add ~4–5MB to the repository and deployment payload:

`about-community-02.webp`, `about-community-card.webp`, `about-family.webp`, `about-history.webp`, `countdown-background.webp`, `fairinfo-admission.webp`, `fairinfo-food.webp`, `home-countdown.webp`, `home-feature-rides-02.webp`, `home-feature-rides-03.webp`, `home-hero-01.webp`, `home-hero-02.webp`, `home-hero-03.webp`, `home-hero-04.webp`, `livestock-hero-02.webp`, `pageants-contestants-02.webp`, `pageants-contestants-03.webp`, `pageants-contestants-04.webp`, `pageants-crowning-02.webp`, `pageants-crowning-03.webp`, `pageants-hero.webp`, `pageants-stage-02.webp`, `pageants-stage-03.webp`, `pageants-stage.webp`, `pageants-winner-02.webp`, `pageants-winner.webp`, `partner-community.webp`, `partner-foodvendor.webp`, `partner-vendor.webp`

**16. Google Maps embed may trigger cookie consent issues in the EU**
The `/fair-info` page embeds a Google Maps iframe directly (`maps.google.com/maps?...`). This iframe loads Google's tracking scripts unconditionally, which triggers GDPR/privacy consent requirements in the EU. If international visitors are expected, consider a "click-to-load" wrapper or a static map image with a "View in Google Maps" link as the fallback. For a Tennessee county fair with an almost-entirely domestic audience, this is low risk but worth documenting.

**17. No `<noscript>` fallback for the hero video**
The homepage hero background is a `<video>` element with no `<noscript>` fallback. Users with JavaScript disabled (rare, but includes some corporate/government networks) will see the video element rendered but unable to play, and without a gradient/image fallback, may see a blank dark area behind the text.

**18. FairCountdown timer has no `aria-live` region**
`components/home/FairCountdown.tsx` updates a countdown every second. While the component has a solid `mounted` hydration guard (preventing CLS), the ticking numbers are not announced to screen readers because there is no `aria-live` region. The live countdown is visual-only for AT users. This is acceptable for decorative countdowns, but adding `aria-live="off"` explicitly communicates intent.

**19. `NEXT_PUBLIC_SITE_URL` in `.env.local.example` points to an old staging URL**
The `.env.local.example` comment says `NEXT_PUBLIC_SITE_URL=https://wtsf-website-pz0apszol-amco2.vercel.app` with a note to "Change to https://www.wtsfair.com once domain is connected." The example URL is for a very early Vercel deployment. Developers copying this file will point confirmation emails at a stale URL. The example should read `https://www.wtsfair.com` as the production default.

**20. No explicit canonical tags on pages accessible via multiple paths**
The `/vendors-sponsors` route permanently redirects to `/partner-with-us`, but the old URL is still linked internally (footer, about page). Without explicit canonical tags on the partner pages, search engines may encounter both URLs via crawl and need to deduce canonicalization from the redirect alone. Explicit `<link rel="canonical">` in metadata is preferred.

---

### Low Priority

**21. `h1` in `PageHero` relies on global `font-family` via CSS variable**
The `<h1>` in `PageHero` uses `style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}` inline. This is consistent throughout the project but means the font family is not declaratively controlled by Tailwind — it bypasses the `font-display` design token defined in `globals.css`. Not a bug, but inconsistent with the design system's own `@theme` tokens.

**22. Inline `style` prop used for nearly all color and typography**
The project uses inline `style` prop for all colors (background, text, border) rather than Tailwind utility classes or CSS variables. This is consistent and intentional, but it means color changes require touching every file rather than a single token update. The `@theme` tokens in `globals.css` define the brand colors but are only used in a handful of Tailwind classes (`bg-cream`, `text-near-black`). This pattern works but reduces design system maintainability.

**23. Hero video autoplay on mobile can be battery-intensive**
The homepage hero video (`autoPlay muted loop playsInline`) will play on most mobile browsers. While mobile browsers typically auto-mute or defer autoplay on slow connections, there is no `preload="none"` or bandwidth-adaptive loading strategy. For a 2.2MB video, this is a valid LCP contributor.

**24. `about/page.tsx` has two consecutive sections with `style={{ backgroundColor: "#F5EDD4" }}`**
The History section and "What the Fair Is" section have identical background colors and no visual separator between them on desktop. This may cause the two sections to visually merge, making the page feel like one long undivided block. Compare with the other pages where alternating section backgrounds (`#F5EDD4` ↔ `#FDFAF3`) create clear visual rhythm.

**25. Admin dashboard page is a `"use client"` component with authentication logic inside the component**
`app/exhibits/admin/dashboard/page.tsx` performs API-based auth checking client-side. While the API route correctly validates the session cookie, a user without auth will briefly see the loading state before being redirected. Prefer middleware-level (`middleware.ts`) protection for admin routes to prevent any flash of protected content.

**26. Rate limit for exhibit registration is 5/hour, but partner forms are 3/hour**
The exhibit registration API allows 5 submissions per IP per hour (`RATE_LIMIT = 5`), while sponsor/vendor/volunteer forms allow 3. This asymmetry is undocumented. Both limits are reasonable, but they should be documented and consistent by intent.

---

### Nice-to-Have Improvements

**27. No JSON-LD structured data**
No schema.org markup exists. For a public event, an `Event` schema (with dates, location, price, name) would improve Google search result appearance with rich snippets. An `Organization` schema for the fair itself and a `LocalBusiness` schema for the fairgrounds address would further strengthen local SEO — particularly relevant for "West Tennessee fair 2026" searches.

**28. No `app/sitemap.ts`**
A Next.js App Router sitemap generator would automatically include all static routes (`/`, `/fair-info`, `/about`, `/exhibits`, `/pageants`, `/livestock`, `/partner-with-us`, `/partner-with-us/sponsors`, `/partner-with-us/vendors`, `/partner-with-us/volunteer`) and submit them to search engines, improving indexation speed for the production domain.

**29. No `app/robots.ts`**
A robots.ts file would explicitly disallow crawling of `/exhibits/admin`, `/api/*`, and `/exhibits/admin/dashboard/*`, preventing search engines from indexing internal admin tools and wasting crawl budget.

**30. Twitter/X card image is missing**
`layout.tsx` defines `twitter.card: "summary_large_image"` but no image is set. Without an image, Twitter/X will render a `summary` card with text only, ignoring the `summary_large_image` setting. The fix is the same as the OG image fix in Critical Issue #5.

**31. `fair-logo.png` in `public/` is a PNG with no WebP version**
The logo (`fair-logo.png`) is served as PNG in both the Navigation and Footer. A WebP version would reduce file size. Since the logo uses the `invert(1)` + `mixBlendMode: screen` CSS trick, it must remain a PNG/transparent format rather than WebP. This is acceptable — WebP does support transparency — but the current PNG size should be checked.

**32. No `loading="lazy"` on below-the-fold images that use `next/image`**
`next/image` defaults to lazy-loading for non-priority images, which is correct. However, images like the About community photo (`about-community.webp`) and the Pageants stage banner (`pageants-contestants.webp`) could benefit from the `priority` prop being verified as absent (they are not LCP candidates). This appears to already be correct — no action needed beyond confirmation.

**33. `deploy.sh` contains a duplicated shebang / script preamble**
`deploy.sh` opens with `#!/bin/bash` twice (lines 1 and 6). The second `#!/bin/bash` is ignored by the shell but is a documentation smell that suggests copy-paste. Minor.

---

## Positives

The project has a strong foundation and demonstrates real engineering care in several areas:

- **Design system discipline.** A well-defined color palette, two-font system (Inter + Playfair Display), and consistent spacing are applied throughout every page. The `@theme` tokens in `globals.css` establish brand identity cleanly.
- **App Router architecture.** Clean separation of server and client components. `"use client"` is used only where necessary (Navigation, FairCountdown, RegistrationForm, forms, admin pages). All pages are static where possible.
- **Metadata implementation.** Every page has individual `title` and `description` metadata. The root layout has a title template (`%s | West Tennessee State Fair`), and both OpenGraph and Twitter cards are defined globally with page-level overrides.
- **Centralized data architecture.** `lib/fair-config.ts`, `lib/exhibit-guides.ts`, `lib/exhibit-config.ts`, `lib/sponsor-config.ts`, `lib/vendor-config.ts`, `lib/leadership-config.ts` — all business data lives in typed config files, decoupled from UI. Changing pricing, dates, or leadership requires editing one file.
- **Zod validation on all API routes.** Every API endpoint validates input with Zod before processing. The honeypot spam protection pattern (silent success for filled honeypot field) is a mature, well-known technique correctly applied.
- **Timing-safe authentication.** The admin auth system uses `timingSafeEqual` from Node.js `crypto` to prevent timing-based password attacks. HMAC session tokens are used instead of storing the password in cookies. Cookie flags (`httpOnly`, `secure`, `sameSite`) are all correctly set.
- **Proper email confirmation flow.** The exhibit registration system sends both an entrant confirmation and a fair notification email, tracks delivery status in Supabase, and handles partial failures gracefully (entry failure doesn't block the whole submission).
- **Hydration-safe countdown.** `FairCountdown.tsx` uses a `mounted` state guard to prevent hydration mismatches between server and client rendering. The component gracefully handles reduced motion via `prefers-reduced-motion`.
- **Image format and compression.** All site images use `.webp` format (not JPEG or PNG). File sizes are generally well-optimized (80–270KB range for hero images, 85–150KB for section images).
- **Scroll margin on anchor sections.** Both the Exhibits and Livestock pages correctly apply `scrollMarginTop` to account for the fixed 72px navigation bar when jumping to section anchors.
- **Semantic HTML throughout.** `<section>` with `aria-labelledby`, `<nav aria-label>`, `<address>`, `<ul aria-label>`, `<ol aria-label>`, `<footer>`, `<header>` are used correctly and consistently.
- **Accessible form patterns.** All forms use proper `<label>` elements, `required` attributes, and descriptive error states.
- **301 redirect for legacy routes.** The `/vendors-sponsors → /partner-with-us` redirect is correctly implemented as a permanent redirect in `next.config.ts`.
- **Reduced-motion support for hero video.** The Hero component respects `prefers-reduced-motion` by pausing the video on mount when the system setting is active.
- **External links correctly use `target="_blank" rel="noopener noreferrer"`** throughout — social links, Google Maps, Showman registration, and all external CTAs.
- **`next/font` for Google Fonts.** Both fonts (Inter, Playfair Display) are loaded via `next/font/google` with `display: swap`, ensuring no invisible text flash (FOIT) and proper performance behavior.
- **WCAG-compliant heading hierarchy.** Each page has exactly one `<h1>` (via PageHero), followed by `<h2>` section headings, and `<h3>` sub-headings. No skipped levels were found.
- **TypeScript strict mode.** `tsconfig.json` has `"strict": true`. The project passes TypeScript checks cleanly.
- **`deploy.sh` is gitignored.** Vercel token and deployment credentials are never committed. The example env file correctly marks service role keys as server-only.
- **Responsive layouts tested at all breakpoints.** Tailwind breakpoint usage (`sm:`, `lg:`) is consistent across all pages. Grid layouts gracefully degrade from multi-column to single-column at mobile.
- **Accessible icon buttons.** The hamburger menu toggle has `aria-label`, `aria-expanded`, and `aria-controls` attributes correctly set.
- **`<address>` elements** for physical and mailing addresses are correctly used and styled with `not-italic`.

---

## Overall Assessment

The West Tennessee State Fair website is a professionally architected, visually polished Next.js application that is close to production-ready. The codebase reflects genuine engineering discipline — typed config files, proper auth, working email pipelines, accessible markup, and a cohesive design system. The foundation is strong.

The primary blockers before connecting the production domain are: correcting the 2025 livestock dates to 2026, fixing the footer links to use the proper `/partner-with-us` routes, adding a sitemap and robots.txt, creating an OG image for social sharing, and patching the security header gap. The CSS bug on the About page Board Members section is a visual defect that should be fixed but is not a blocker.

The orphaned image cleanup, stale TBC text on the Pageants page, and the `PhotoPlaceholder` dead code are housekeeping items that will improve maintainability and repo cleanliness without affecting the user-facing product.

From a performance standpoint, the site is well-optimized for its type. All images are WebP, fonts load with `display: swap`, lazy loading is correctly applied by `next/image` defaults, and the single full-screen video is an intentional design choice with reasonable file size.

From an accessibility standpoint, the site achieves a solid WCAG AA baseline. The two gaps — no skip-to-main-content link, and the mobile nav active state — are worth addressing before launch but do not represent a systemic accessibility failure.

From an SEO standpoint, the biggest structural gap is the missing sitemap + robots.txt + OG image combination. These are one-day fixes that will meaningfully impact how quickly the production domain gets indexed and how the site appears in social sharing previews.

---

*Awaiting approval before beginning Audit #2 (Business & Owner Review).*
