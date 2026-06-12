# Spec: Native Posture scan embed on the marketing site

**Date:** 2026-06-12
**Status:** Approved, ready for planning
**Repos:** `rosebud-react` (marketing site) + `rcs-prospecting-v2/apps/reports` (Posture API)

## Goal

Run the free Posture security scan natively on the rosebud-react marketing
site: domain input -> instant score teaser -> inline email capture, instead of
sending visitors to the standalone funnel in a new tab. The scan calls the
existing Posture public API from native React components styled with the site's
own design tokens. The detailed report still lives on the Posture domain and
opens in a new tab at the end.

This is "Option 2, native rebuild" (chosen over an iframe embed).

## Decisions (locked in brainstorm)

1. **Placement:** the interactive scan lives in the existing homepage "How
   exposed is your domain?" section AND on a new dedicated `/security-check`
   page. The nav "Free Security Check" button (desktop + mobile) links to
   `/security-check`.
2. **Report access:** capture email inline (every report = a captured lead),
   AND also show a "view report now" link that opens `/r/:token` on the Posture
   domain in a new tab.
3. **Teaser depth:** composite score /100 + word rating + issue-count line.
   No per-section breakdown (keeps it a teaser; the full breakdown is the
   unlock incentive).
4. **CORS allowlist:** dev subdomain + apex + www + localhost (superset, works
   regardless of which domain serves the site).

## Architecture

### Workstream A: Posture API (`apps/reports`), deploy as image v8

**A1. Scoped CORS middleware.** New `src/public/cors.ts` exporting a small
allowlist middleware. Mounted on the public API path only
(`app.use('/api/public', publicCors)`), never on staff/auth routes.
- Allowlist: `https://dev.rosebudcloudsolutions.co.uk`,
  `https://rosebudcloudsolutions.co.uk`,
  `https://www.rosebudcloudsolutions.co.uk`, `http://localhost:3002`.
- If the request `Origin` is in the allowlist: set
  `Access-Control-Allow-Origin: <that origin>` (reflected, never `*`),
  `Vary: Origin`, `Access-Control-Allow-Methods: POST, OPTIONS`,
  `Access-Control-Allow-Headers: Content-Type`.
- `OPTIONS` preflight from an allowed origin returns `204` and ends.
- No credentials header (the public API uses no cookies).
- Requests with no/disallowed origin pass through without CORS headers
  (server-to-server and same-origin callers are unaffected).

**A2. Expose raw teaser fields** in `POST /api/public/scan`. `runPublicScan`
already returns `{ token, score, issueCount }`. Change the response from
`{ token, teaserHtml }` to `{ token, score, grade, issueCount, teaserHtml }`
where `grade = ratingFor(score).word`. Additive only; `teaserHtml` stays so the
existing funnel page is untouched.

**A3.** No other endpoint changes. `POST /api/public/unlock` is already
`{ token, email } -> { ok: true }` and needs no edits.

**Testing (TDD, vitest + supertest, existing `tests/` harness):**
- CORS: allowed origin is reflected on a POST; disallowed origin gets no
  `Access-Control-Allow-Origin`; `OPTIONS` from allowed origin returns 204;
  staff route does not get the public CORS headers.
- Scan response: body includes numeric `score`, string `grade`, numeric
  `issueCount`, plus the existing `token` and `teaserHtml`.

**Deploy:** Danny runs `az acr build ... rcs-posture:v8` then
`az containerapp update ... --image ...:v8` (Claude is blocked from these).
Always a new tag. Claude then verifies live with read-only curl (CORS header
present, scan body has the raw fields).

### Workstream B: rosebud-react native scan

**B1. Config.** `src/config/posture.ts`:
```ts
export const POSTURE_API_BASE =
  import.meta.env.VITE_POSTURE_API_BASE ||
  'https://posture.rosebudcloudsolutions.co.uk';
```

**B2. API client.** `src/lib/postureApi.ts`: two async functions returning
discriminated-union results (no throwing for expected errors).
- `runScan(domain): Promise<ScanResult>` -> POST `/api/public/scan`.
  - `{ ok: true, token, score, grade, issueCount }`
  - `{ ok: false, kind: 'invalid' | 'rateLimited' | 'network', message, retryAfterSec? }`
  - 400 -> `invalid`; 429 -> `rateLimited` (carry `retryAfterSec`); fetch
    throw / non-JSON / 5xx -> `network`.
- `unlock(token, email): Promise<UnlockResult>` -> POST `/api/public/unlock`.
  - `{ ok: true }`
  - `{ ok: false, kind: 'invalidEmail' | 'expired' | 'network', message }`
  - 400 -> `invalidEmail`; 404 -> `expired`; else -> `network`.

**B3. State machine hook.** `src/hooks/usePostureScan.ts`. Phases:
`idle -> scanning -> teaser -> submitting -> done`, with an `error` field on the
relevant phases. Exposes `phase`, `result`, `error`, and actions
`scan(domain)`, `submitEmail(email)`, `reset()`. Holds the `token`, `score`,
`grade`, `issueCount` after a successful scan. Pure logic, no JSX.

**B4. Component.** `src/components/PostureScan.tsx`. Presentational, driven by
the hook. `variant?: 'section' | 'page'` controls density only.
- **Input phase:** domain `<input>` + "Run free check" `btn-animated` button.
  Basic client-side domain sanity check before calling (trim, strip scheme).
- **Scanning phase:** animated loading state ("Scanning your domain...", with a
  subtle pulse/progress, framer-motion).
- **Teaser phase:** animated circular score ring (SVG) with the number, the
  word rating below (colored by score band: green/amber/red semantic), and an
  issue-count line. Below it, inline email capture: email `<input>` +
  "Email me the full report" button.
- **Submitting phase:** button shows a spinner / disabled.
- **Done phase:** "Check your inbox" success message + a "view report now" link
  that opens `${POSTURE_API_BASE}/r/${token}` in a new tab
  (`rel="noopener noreferrer"`).
- **Errors:** rendered inline per phase. Copy:
  - invalid domain: "That does not look like a valid domain. Try something like
    yourcompany.co.uk."
  - rate limited: "You have run a few scans already. Please try again in a few
    minutes."
  - network: "Something went wrong running the scan. Please try again."
  - invalid email: "Please enter a valid email address."
  - expired: "That scan has expired. Please run it again." (offers reset)
- Uses existing tokens (`bg-surface`, `border-outline`, `text-primary`,
  `text-on-surface-variant`, `font-headline`, `font-label`, `btn-animated`),
  Material Symbols icons, framer-motion.

**B5. Homepage.** `src/pages/HomePage.tsx`: in the existing "How exposed is
your domain?" section, replace the static `<a>...Run my free check</a>` block
with `<PostureScan variant="section" />`. Keep the surrounding section shell,
eyebrow, heading, and sub-copy.

**B6. Dedicated page.** `src/pages/SecurityCheckPage.tsx`: standalone
`/security-check` page. Hero heading + `<PostureScan variant="page" />` +
a short "what we check" trust strip (email / web / exposure, 3 points) +
SEO meta via the existing `SEO` component. Add the route in `src/App.tsx`.

**B7. Nav.** `src/components/Nav.tsx`: replace the two
`<a href="https://posture.../posture-check">Free Security Check</a>` blocks
(desktop CTA + mobile menu) with React Router `<Link to="/security-check">`,
keeping the same button styling.

**Verification (no test runner in rosebud-react; repo convention + handoff =
preview-tool verification):** `preview_start` the "Static Server" launch config
(port 3002), then exercise the full flow (enter a real domain -> teaser ->
email -> success), check `preview_console_logs` / `preview_network` for errors,
and `preview_screenshot` desktop + mobile for both the homepage section and
`/security-check`. Logic pieces (B2/B3) are kept small and isolated; they are
verified behaviorally through the preview flow rather than unit tests, matching
this repo's existing zero-test convention.

## Out of scope / non-goals

- No iframe embed.
- No changes to the detailed report (`/r/:token`) rendering or tiering.
- No new test framework added to rosebud-react.
- No per-section score breakdown in the teaser.
- No changes to staff/auth routes or the existing `/posture-check` funnel page.

## Conventions and guardrails

- **No em-dashes** anywhere in copy (UI, comments-as-copy). Use commas /
  periods / arrows.
- **Do not touch, stage, or commit** the unrelated uncommitted "Shadow AI
  checker" work in rosebud-react (`cloudflare-worker/`,
  `public/shadow-ai-checker.html`, `public/fonts/`, `scripts/gen-og-card.py`).
  Stage only scan-feature files, by explicit path.
- Push rosebud-react to `origin` (which auto-deploys to dev) only when Danny
  explicitly asks. `personal` remote is the default for non-deploy pushes.
- Posture API base URL lives in config, never hard-coded inline in components.
- Shell cwd resets between Bash calls; prefix with `cd <abs path> &&`.

## Files touched

**apps/reports:** `src/public/cors.ts` (new), `src/server.ts` (mount CORS,
extend scan response), `tests/` (new CORS + scan-shape tests).

**rosebud-react:** `src/config/posture.ts` (new), `src/lib/postureApi.ts`
(new), `src/hooks/usePostureScan.ts` (new), `src/components/PostureScan.tsx`
(new), `src/pages/SecurityCheckPage.tsx` (new), `src/pages/HomePage.tsx`
(edit), `src/components/Nav.tsx` (edit), `src/App.tsx` (add route),
plus SEO meta wiring as needed.
