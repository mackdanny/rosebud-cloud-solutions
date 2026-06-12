# Native Posture Scan Embed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run the free Posture scan natively on the marketing site (domain -> instant score teaser -> inline email capture), calling the existing Posture public API.

**Architecture:** Two workstreams. (A) Posture API (`apps/reports`) gains scoped CORS on `/api/public/*` and raw teaser fields on the scan response, shipped as image v8. (B) rosebud-react gets a typed API client, a state-machine hook, a `PostureScan` component, placed in the homepage section and a new `/security-check` page, with the nav pointing at the page.

**Tech Stack:** Express + TypeScript ESM + Vitest/supertest (API); Vite + React + React Router + Tailwind + framer-motion (site). rosebud-react has no test runner, so its tasks verify via the preview tools, matching repo convention.

**Conventions (apply to every task):** No em-dashes in any copy. Never stage the Shadow AI checker files (`cloudflare-worker/`, `public/shadow-ai-checker.html`, `public/fonts/`, `scripts/gen-og-card.py`); stage only listed files by explicit path. Shell cwd resets between calls; prefix with `cd <abs path> &&`. rosebud-react work happens on branch `feature/posture-native-embed`.

---

## Workstream A: Posture API (`apps/reports`)

Absolute repo root: `/Users/danny/dev/rcs-prospecting-v2/apps/reports`. Run tests with `npx vitest run <path>` from that dir. The reports repo is part of the `rcs-prospecting-v2` monorepo; commit there separately from rosebud-react.

### Task A1: Scoped CORS middleware

**Files:**
- Create: `src/public/cors.ts`
- Create: `tests/public-cors.test.ts`
- Modify: `src/server.ts` (import + mount)

- [ ] **Step 1: Write the failing test**

Create `tests/public-cors.test.ts`. This boots the real app the same way `tests/public-funnel.test.ts` does (mock `scan-core`, set env, import default app), then asserts CORS behavior.

```ts
import { it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('scan-core', async () => {
  const actual = await vi.importActual<typeof import('scan-core')>('scan-core');
  return {
    ...actual,
    scanDomain: vi.fn().mockResolvedValue({
      domain: 'example.com', scannedAt: '2026-06-07T00:00:00.000Z',
      dns: { mx: [], spf: 'v=spf1 -all', spfLookupCount: 1, dmarc: 'v=DMARC1; p=none',
        dkimChecked: [{ selector: 'selector1', found: true }], emailProvider: 'Microsoft 365',
        nameservers: [], dnsProvider: 'Cloudflare', mtaSts: null, bimi: null, tlsRpt: null, caa: [] },
      http: { error: 'skipped' }, subdomains: { error: 'skipped' },
      smtp: { error: 'skipped' }, tls: { error: 'skipped' },
      spfAlignment: { dmarcPolicy: 'none', dmarcSubdomainPolicy: null, dmarcPct: null,
        aspf: 'relaxed', adkim: 'relaxed', spfAllMechanism: '-all',
        spfIncludeDomains: [], spfProviders: [], multiProviderSpf: false },
    }),
  };
});

let app: typeof import('../src/server.js').default;

beforeAll(async () => {
  process.env.DATABASE_PATH = join(mkdtempSync(join(tmpdir(), 'rcs-cors-')), 'test.db');
  process.env.PUBLIC_SCAN_MAX_PER_HOUR = '50';
  process.env.PUBLIC_BASE_URL = 'http://localhost:8790';
  process.env.ALLOW_DEV_LOGIN = 'true';
  process.env.NODE_ENV = 'test';
  app = (await import('../src/server.js')).default;
});

it('reflects an allowed origin on a public POST', async () => {
  const res = await request(app)
    .post('/api/public/scan')
    .set('Origin', 'https://dev.rosebudcloudsolutions.co.uk')
    .send({ domain: 'example.com' });
  expect(res.headers['access-control-allow-origin']).toBe('https://dev.rosebudcloudsolutions.co.uk');
  expect(res.headers['vary']).toMatch(/Origin/);
});

it('answers an OPTIONS preflight from an allowed origin with 204', async () => {
  const res = await request(app)
    .options('/api/public/scan')
    .set('Origin', 'http://localhost:3002')
    .set('Access-Control-Request-Method', 'POST');
  expect(res.status).toBe(204);
  expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3002');
  expect(res.headers['access-control-allow-methods']).toMatch(/POST/);
});

it('does NOT send CORS headers for a disallowed origin', async () => {
  const res = await request(app)
    .post('/api/public/scan')
    .set('Origin', 'https://evil.example.com')
    .send({ domain: 'example.com' });
  expect(res.headers['access-control-allow-origin']).toBeUndefined();
});

it('does NOT apply public CORS to staff routes', async () => {
  const res = await request(app)
    .get('/leads')
    .set('Origin', 'https://dev.rosebudcloudsolutions.co.uk');
  expect(res.headers['access-control-allow-origin']).toBeUndefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/public-cors.test.ts`
Expected: FAIL (allow-origin header undefined / OPTIONS not 204).

- [ ] **Step 3: Write the middleware**

Create `src/public/cors.ts`:

```ts
import type { Request, Response, NextFunction } from 'express';

/**
 * Scoped CORS for the public lead-funnel API only. The marketing site (rosebud)
 * calls these endpoints cross-origin; staff/auth routes must stay same-origin,
 * so this is mounted on `/api/public` alone, never globally. The allowed origin
 * is reflected (never `*`), and no credentials are involved (the public API uses
 * no cookies).
 */
const ALLOWED_ORIGINS = new Set([
  'https://dev.rosebudcloudsolutions.co.uk',
  'https://rosebudcloudsolutions.co.uk',
  'https://www.rosebudcloudsolutions.co.uk',
  'http://localhost:3002',
]);

export function publicCors(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') {
    // Preflight: answer immediately. 204 even for disallowed origins is fine
    // (no allow-origin header was set, so the browser still blocks the real call).
    res.status(204).end();
    return;
  }
  next();
}
```

- [ ] **Step 4: Mount it in `src/server.ts`**

Add the import alongside the other `./public/*` imports (near line 24):

```ts
import { publicCors } from './public/cors.js';
```

Mount it immediately before the first `/api/public/*` route (the `app.post('/api/public/scan', ...)` at ~line 128). Add this line above that route:

```ts
app.use('/api/public', publicCors);
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/public-cors.test.ts tests/public-funnel.test.ts`
Expected: PASS (new CORS tests green; existing funnel tests still green).

- [ ] **Step 6: Commit**

```bash
cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && git add src/public/cors.ts tests/public-cors.test.ts src/server.ts && git commit -m "feat(posture): scoped CORS on public funnel API for marketing site"
```

### Task A2: Raw teaser fields on the scan response

**Files:**
- Modify: `src/server.ts` (the `/api/public/scan` response object, ~line 145)
- Modify/Create test: `tests/public-funnel.test.ts` (add an assertion) or new `tests/public-scan-shape.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/public-scan-shape.test.ts` (same boot pattern as A1):

```ts
import { it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('scan-core', async () => {
  const actual = await vi.importActual<typeof import('scan-core')>('scan-core');
  return {
    ...actual,
    scanDomain: vi.fn().mockResolvedValue({
      domain: 'example.com', scannedAt: '2026-06-07T00:00:00.000Z',
      dns: { mx: [], spf: 'v=spf1 -all', spfLookupCount: 1, dmarc: 'v=DMARC1; p=none',
        dkimChecked: [{ selector: 'selector1', found: true }], emailProvider: 'Microsoft 365',
        nameservers: [], dnsProvider: 'Cloudflare', mtaSts: null, bimi: null, tlsRpt: null, caa: [] },
      http: { error: 'skipped' }, subdomains: { error: 'skipped' },
      smtp: { error: 'skipped' }, tls: { error: 'skipped' },
      spfAlignment: { dmarcPolicy: 'none', dmarcSubdomainPolicy: null, dmarcPct: null,
        aspf: 'relaxed', adkim: 'relaxed', spfAllMechanism: '-all',
        spfIncludeDomains: [], spfProviders: [], multiProviderSpf: false },
    }),
  };
});

let app: typeof import('../src/server.js').default;

beforeAll(async () => {
  process.env.DATABASE_PATH = join(mkdtempSync(join(tmpdir(), 'rcs-shape-')), 'test.db');
  process.env.PUBLIC_SCAN_MAX_PER_HOUR = '50';
  process.env.PUBLIC_BASE_URL = 'http://localhost:8790';
  process.env.ALLOW_DEV_LOGIN = 'true';
  process.env.NODE_ENV = 'test';
  app = (await import('../src/server.js')).default;
});

it('returns raw teaser fields alongside token and teaserHtml', async () => {
  const res = await request(app).post('/api/public/scan').send({ domain: 'example.com' });
  expect(res.status).toBe(200);
  expect(typeof res.body.token).toBe('string');
  expect(typeof res.body.score).toBe('number');
  expect(typeof res.body.grade).toBe('string');
  expect(res.body.grade.length).toBeGreaterThan(0);
  expect(typeof res.body.issueCount).toBe('number');
  expect(typeof res.body.teaserHtml).toBe('string'); // kept for the existing funnel
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/public-scan-shape.test.ts`
Expected: FAIL (`score`/`grade`/`issueCount` undefined).

- [ ] **Step 3: Extend the response**

In `src/server.ts`, the scan handler already imports `ratingFor`? It does not yet. Add to the existing `./ui/rating.js`-adjacent imports near the top:

```ts
import { ratingFor } from './ui/rating.js';
```

Then change the response in the `/api/public/scan` handler from:

```ts
    res.json({
      token: result.token,
      teaserHtml: renderTeaserFragment(result.token, result.score, result.issueCount),
    });
```

to:

```ts
    res.json({
      token: result.token,
      score: result.score,
      grade: ratingFor(result.score).word,
      issueCount: result.issueCount,
      teaserHtml: renderTeaserFragment(result.token, result.score, result.issueCount),
    });
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/public-scan-shape.test.ts tests/public-funnel.test.ts tests/public-cors.test.ts`
Expected: PASS (all green).

- [ ] **Step 5: Commit**

```bash
cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && git add tests/public-scan-shape.test.ts src/server.ts && git commit -m "feat(posture): expose score/grade/issueCount on public scan response"
```

### Task A3: Deploy v8 and verify live (manual deploy by Danny)

**Files:** none (deploy + verification only).

- [ ] **Step 1: Full reports test pass**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run`
Expected: PASS (whole suite green) before shipping.

- [ ] **Step 2: Danny runs the deploy** (Claude is blocked from `az acr build`/`containerapp update`). Ensure PIM Contributor is active first; if AuthorizationFailed, `az account clear && az login`.

```bash
cd /Users/danny/dev/rcs-prospecting-v2 && az acr build --registry rcspostureacr --image rcs-posture:v8 --file Dockerfile.reports --build-arg CACHEBUST=$(date +%s) .
az containerapp update -n ca-rcs-posture -g rg-rcs-posture --image rcspostureacr.azurecr.io/rcs-posture:v8
```

- [ ] **Step 3: Claude verifies live (read-only curl)**

```bash
curl -s -i -X POST https://posture.rosebudcloudsolutions.co.uk/api/public/scan \
  -H 'content-type: application/json' \
  -H 'origin: https://dev.rosebudcloudsolutions.co.uk' \
  -d '{"domain":"example.com"}' | head -40
```
Expected: `200`, an `access-control-allow-origin: https://dev.rosebudcloudsolutions.co.uk` header, and a JSON body containing `score`, `grade`, `issueCount`, `token`, `teaserHtml`.

---

## Workstream B: rosebud-react native scan

Absolute repo root: `/Users/danny/Desktop/Claude/rosebud-react`. Branch: `feature/posture-native-embed`. No unit-test runner; verify with the preview tools (launch config "Static Server", port 3002). Build check: `npx tsc --noEmit` (or `npm run build`) where noted.

### Task B1: API base config

**Files:** Create `src/config/posture.ts`

- [ ] **Step 1: Create the config constant**

```ts
// Base URL of the Posture public API (the scan + unlock endpoints). Overridable
// per-environment via VITE_POSTURE_API_BASE; defaults to the live custom domain.
export const POSTURE_API_BASE =
  import.meta.env.VITE_POSTURE_API_BASE ||
  'https://posture.rosebudcloudsolutions.co.uk';
```

- [ ] **Step 2: Commit**

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/config/posture.ts && git commit -m "feat(scan): posture API base config"
```

### Task B2: Typed API client

**Files:** Create `src/lib/postureApi.ts`

- [ ] **Step 1: Write the client**

```ts
import { POSTURE_API_BASE } from '../config/posture';

export interface ScanSuccess {
  ok: true;
  token: string;
  score: number;
  grade: string;
  issueCount: number;
}
export interface ScanFailure {
  ok: false;
  kind: 'invalid' | 'rateLimited' | 'network';
  message: string;
  retryAfterSec?: number;
}
export type ScanResult = ScanSuccess | ScanFailure;

export interface UnlockSuccess { ok: true }
export interface UnlockFailure {
  ok: false;
  kind: 'invalidEmail' | 'expired' | 'network';
  message: string;
}
export type UnlockResult = UnlockSuccess | UnlockFailure;

const NETWORK_MSG = 'Something went wrong running the scan. Please try again.';

/** Normalise a user-typed domain: drop scheme, path, whitespace, leading www. */
export function normaliseDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./i, '')
    .toLowerCase();
}

export async function runScan(domain: string): Promise<ScanResult> {
  let res: Response;
  try {
    res = await fetch(`${POSTURE_API_BASE}/api/public/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
  } catch {
    return { ok: false, kind: 'network', message: NETWORK_MSG };
  }
  if (res.status === 429) {
    const body = await res.json().catch(() => ({}));
    return {
      ok: false,
      kind: 'rateLimited',
      message: 'You have run a few scans already. Please try again in a few minutes.',
      retryAfterSec: typeof body.retryAfterSec === 'number' ? body.retryAfterSec : undefined,
    };
  }
  if (res.status === 400) {
    return {
      ok: false,
      kind: 'invalid',
      message: 'That does not look like a valid domain. Try something like yourcompany.co.uk.',
    };
  }
  if (!res.ok) return { ok: false, kind: 'network', message: NETWORK_MSG };
  const body = await res.json().catch(() => null);
  if (!body || typeof body.token !== 'string') {
    return { ok: false, kind: 'network', message: NETWORK_MSG };
  }
  return {
    ok: true,
    token: body.token,
    score: Number(body.score) || 0,
    grade: String(body.grade ?? ''),
    issueCount: Number(body.issueCount) || 0,
  };
}

export async function unlock(token: string, email: string): Promise<UnlockResult> {
  let res: Response;
  try {
    res = await fetch(`${POSTURE_API_BASE}/api/public/unlock`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, email }),
    });
  } catch {
    return { ok: false, kind: 'network', message: 'Something went wrong. Please try again.' };
  }
  if (res.status === 400) {
    return { ok: false, kind: 'invalidEmail', message: 'Please enter a valid email address.' };
  }
  if (res.status === 404) {
    return { ok: false, kind: 'expired', message: 'That scan has expired. Please run it again.' };
  }
  if (!res.ok) {
    return { ok: false, kind: 'network', message: 'Something went wrong. Please try again.' };
  }
  return { ok: true };
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors from this file.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/lib/postureApi.ts && git commit -m "feat(scan): typed posture API client with error mapping"
```

### Task B3: State-machine hook

**Files:** Create `src/hooks/usePostureScan.ts`

- [ ] **Step 1: Write the hook**

```ts
import { useState, useCallback } from 'react';
import { runScan, unlock, normaliseDomain, type ScanSuccess } from '../lib/postureApi';

export type ScanPhase = 'idle' | 'scanning' | 'teaser' | 'submitting' | 'done';

export interface PostureScanState {
  phase: ScanPhase;
  result: ScanSuccess | null;
  error: string | null;
  scan: (rawDomain: string) => Promise<void>;
  submitEmail: (email: string) => Promise<void>;
  reset: () => void;
}

export function usePostureScan(): PostureScanState {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [result, setResult] = useState<ScanSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (rawDomain: string) => {
    const domain = normaliseDomain(rawDomain);
    if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
      setError('That does not look like a valid domain. Try something like yourcompany.co.uk.');
      return;
    }
    setError(null);
    setPhase('scanning');
    const res = await runScan(domain);
    if (res.ok) {
      setResult(res);
      setPhase('teaser');
    } else {
      setError(res.message);
      setPhase('idle');
    }
  }, []);

  const submitEmail = useCallback(async (email: string) => {
    if (!result) return;
    setError(null);
    setPhase('submitting');
    const res = await unlock(result.token, email);
    if (res.ok) {
      setPhase('done');
    } else {
      setError(res.message);
      setPhase(res.kind === 'expired' ? 'idle' : 'teaser');
    }
  }, [result]);

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError(null);
  }, []);

  return { phase, result, error, scan, submitEmail, reset };
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/hooks/usePostureScan.ts && git commit -m "feat(scan): usePostureScan state machine hook"
```

### Task B4: PostureScan component

**Files:** Create `src/components/PostureScan.tsx`

Design: matches the premium dark/magenta tokens. Score ring is an SVG circle whose stroke color is a semantic band (green >=75, amber >=40, red <40) computed locally; number in white; word rating below in the band color. Uses `btn-animated`, Material Symbols, framer-motion. `variant` controls padding/size only.

- [ ] **Step 1: Write the component**

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostureScan } from '../hooks/usePostureScan';
import { POSTURE_API_BASE } from '../config/posture';

interface PostureScanProps {
  readonly variant?: 'section' | 'page';
}

function bandColor(score: number): string {
  if (score >= 75) return '#3fa996'; // teal-green
  if (score >= 40) return '#e0a82e'; // amber
  return '#d05a5a'; // soft red
}

const ScoreRing: React.FC<{ score: number; grade: string }> = ({ score, grade }) => {
  const col = bandColor(score);
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="relative w-[140px] h-[140px] mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-4xl font-extrabold text-white leading-none">{Math.round(score)}</span>
        <span className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/70 mt-1">/ 100</span>
      </div>
    </div>
  );
};

export const PostureScan: React.FC<PostureScanProps> = ({ variant = 'section' }) => {
  const { phase, result, error, scan, submitEmail, reset } = usePostureScan();
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const pad = variant === 'page' ? 'px-6 py-10 md:px-12 md:py-14' : 'px-6 py-8 md:px-10 md:py-10';

  return (
    <div className={`relative mx-auto w-full max-w-xl rounded-2xl border border-outline/60 bg-surface/80 backdrop-blur ${pad}`}>
      <AnimatePresence mode="wait">
        {(phase === 'idle' || phase === 'scanning') && (
          <motion.form
            key="input"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => { e.preventDefault(); scan(domain); }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text" inputMode="url" autoComplete="off" spellCheck={false}
                value={domain} onChange={(e) => setDomain(e.target.value)}
                placeholder="yourcompany.co.uk"
                disabled={phase === 'scanning'}
                className="flex-1 rounded-lg bg-background/70 border border-outline px-4 py-3.5 text-white placeholder:text-on-surface-variant/50 outline-none focus:border-primary/70 transition-colors"
              />
              <button
                type="submit" disabled={phase === 'scanning'}
                className="btn-animated text-white font-headline font-bold px-7 py-3.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {phase === 'scanning' ? (
                  <>
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Scanning
                  </>
                ) : (
                  <>
                    Run free check
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
            {phase === 'scanning' && (
              <p className="text-sm text-on-surface-variant/80 font-label">Checking your email, web and exposure surface...</p>
            )}
            {error && phase === 'idle' && <p className="text-sm text-secondary">{error}</p>}
            <p className="text-xs text-on-surface-variant/60 font-label tracking-wide">~15 seconds. Nothing to install, no access to your systems.</p>
          </motion.form>
        )}

        {(phase === 'teaser' || phase === 'submitting') && result && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <ScoreRing score={result.score} grade={result.grade} />
            <div className="font-headline text-2xl font-bold" style={{ color: bandColor(result.score) }}>{result.grade}</div>
            <p className="text-on-surface-variant text-sm max-w-sm">
              {result.issueCount === 0
                ? 'No material issues found. Unlock the full breakdown to confirm.'
                : `${result.issueCount} ${result.issueCount === 1 ? 'opportunity' : 'opportunities'} to improve across your email, web and external surface.`}
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); submitEmail(email); }}
              className="w-full flex flex-col gap-3 mt-2"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email" autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.co.uk" disabled={phase === 'submitting'}
                  className="flex-1 rounded-lg bg-background/70 border border-outline px-4 py-3.5 text-white placeholder:text-on-surface-variant/50 outline-none focus:border-primary/70 transition-colors"
                />
                <button
                  type="submit" disabled={phase === 'submitting'}
                  className="btn-animated text-white font-headline font-bold px-7 py-3.5 rounded-lg whitespace-nowrap disabled:opacity-70"
                >
                  {phase === 'submitting' ? 'Sending' : 'Email me the report'}
                </button>
              </div>
              {error && <p className="text-sm text-secondary">{error}</p>}
              <p className="text-xs text-on-surface-variant/60 font-label">We email a private link to your full graded report. No spam.</p>
            </form>
          </motion.div>
        )}

        {phase === 'done' && result && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-4 py-2"
          >
            <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[28px]">mark_email_read</span>
            </div>
            <h3 className="font-headline text-2xl font-bold">Check your inbox</h3>
            <p className="text-on-surface-variant text-sm max-w-sm">We have emailed a private link to your full security report. It may take a minute to arrive.</p>
            <a
              href={`${POSTURE_API_BASE}/r/${result.token}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-label text-sm uppercase tracking-[0.18em] no-underline hover:gap-3 transition-all"
            >
              View report now
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
            <button onClick={reset} className="text-xs text-on-surface-variant/60 font-label hover:text-white transition-colors mt-1">Scan another domain</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostureScan;
```

- [ ] **Step 2: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/components/PostureScan.tsx && git commit -m "feat(scan): PostureScan native teaser + email capture component"
```

### Task B5: Wire into the homepage section

**Files:** Modify `src/pages/HomePage.tsx` (the "Free Posture Check" section, lines ~343-366)

- [ ] **Step 1: Add the import** near the other component imports (top of file):

```tsx
import { PostureScan } from '../components/PostureScan';
```

- [ ] **Step 2: Replace the static CTA.** In the "Free Posture Check" section, replace the `<a ...>...Run my free check...</a>` block AND the trailing `~15 seconds` `<p>` (the `<a>` and the `<p className="mt-6 ...">`) with:

```tsx
                <div className="mt-2">
                  <PostureScan variant="section" />
                </div>
```

Keep the eyebrow ("Free tool"), the `<h2>` heading, and the descriptive `<p>` above it intact.

- [ ] **Step 3: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/pages/HomePage.tsx && git commit -m "feat(scan): embed native PostureScan in homepage section"
```

### Task B6: Dedicated /security-check page + route + SEO meta

**Files:** Create `src/pages/SecurityCheckPage.tsx`; Modify `src/App.tsx` (lazy import + route); Modify `src/data/seoMeta.ts` (add `securityCheck` entry).

- [ ] **Step 1: Add SEO meta.** In `src/data/seoMeta.ts`, inside the `pageMeta` object, add:

```ts
  securityCheck: {
    title: 'Free Security Check | Scan Your Domain',
    description:
      'Run a free external security scan of your domain in seconds. See your email, web and exposure risks from an attacker point of view. No install, no access to your systems.',
  },
```

- [ ] **Step 2: Create the page.**

```tsx
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { PostureScan } from '../components/PostureScan';
import { pageMeta } from '../data/seoMeta';

const CHECKS = [
  { icon: 'mail', title: 'Email security', body: 'SPF, DKIM, DMARC and spoofing exposure.' },
  { icon: 'public', title: 'Web and TLS', body: 'Certificates, headers and exposed services.' },
  { icon: 'travel_explore', title: 'External surface', body: 'Subdomains and attacker-visible footprint.' },
];

export const SecurityCheckPage: React.FC = () => (
  <main className="pt-32 md:pt-40 pb-32 bg-background relative overflow-hidden">
    <SEO {...pageMeta.securityCheck} />
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-[0.16]" style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(160,0,181,0.55), transparent 70%)' }} />
    <div className="max-w-[1100px] mx-auto px-6 relative">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label mb-6"
        >
          Free tool
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-6"
        >
          How exposed is your domain?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto text-on-surface-variant text-lg leading-relaxed"
        >
          Run a free external security scan in seconds and see your risks from an attacker point of view. No install, no access to your systems.
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
        <PostureScan variant="page" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {CHECKS.map(({ icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-outline/50 bg-surface/60 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-4">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
            </div>
            <h2 className="font-headline text-lg font-bold mb-2">{title}</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </main>
);

export default SecurityCheckPage;
```

- [ ] **Step 3: Add the route in `src/App.tsx`.** Add the lazy import alongside the other page imports:

```tsx
const SecurityCheckPage = lazy(() =>
  import('./pages/SecurityCheckPage').then((m) => ({ default: m.SecurityCheckPage })),
);
```

And add the route inside `<Routes>` (place it near the top, after the `/` route):

```tsx
            <Route path="/security-check" element={<SecurityCheckPage />} />
```

- [ ] **Step 4: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/pages/SecurityCheckPage.tsx src/App.tsx src/data/seoMeta.ts && git commit -m "feat(scan): dedicated /security-check page"
```

### Task B7: Point the nav at the page

**Files:** Modify `src/components/Nav.tsx` (desktop CTA ~line 210, mobile CTA ~line 345)

- [ ] **Step 1: Desktop CTA.** Replace the desktop `<a href="https://posture.../posture-check" ...>` wrapper around the "Free Security Check" button with a router `<Link to="/security-check" className="no-underline">`, keeping the inner `<motion.button>` and its classes unchanged. `Link` is already imported in this file.

- [ ] **Step 2: Mobile CTA.** Replace the mobile `<a href="https://posture.../posture-check" ... className="mt-6 no-underline">` around the "Free Security Check" button with `<Link to="/security-check" className="mt-6 no-underline">`, keeping the inner `<button>` unchanged.

- [ ] **Step 3: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/components/Nav.tsx && git commit -m "feat(scan): nav Free Security Check links to /security-check"
```

### Task B8: Preview verification (desktop + mobile)

**Files:** none (verification only). Requires the Posture API v8 to be live (Task A3) for a real end-to-end scan; if v8 is not yet deployed, verify UI states against the live v7 (scan will succeed but the native teaser needs v8 raw fields, so confirm the homepage/page render and input states first, then re-verify the teaser after A3).

- [ ] **Step 1: Start the preview.** `preview_start` the "Static Server" config (port 3002).

- [ ] **Step 2: Homepage section.** Load `/`, scroll to "How exposed is your domain?", confirm the input + button render in-theme. `preview_screenshot` desktop.

- [ ] **Step 3: Run a real scan.** `preview_fill` the domain input with a real domain (e.g. `bbc.co.uk`), click "Run free check". Confirm loading then the score ring + grade + issue line render. `preview_console_logs` and `preview_network` clean (CORS ok, 200). `preview_screenshot`.

- [ ] **Step 4: Email capture.** `preview_fill` the email field, submit, confirm "Check your inbox" + "View report now" link. `preview_screenshot`.

- [ ] **Step 5: Dedicated page.** Navigate to `/security-check`, confirm hero + scan + 3 check cards. `preview_screenshot` desktop.

- [ ] **Step 6: Nav.** Click the nav "Free Security Check"; confirm it routes to `/security-check` (no new tab). Check mobile: `preview_resize` to 390px wide, open the mobile menu, confirm the CTA routes correctly. `preview_screenshot` mobile of both the homepage section and `/security-check`.

- [ ] **Step 7: Error path.** `preview_fill` an invalid domain (e.g. `not a domain`), submit, confirm the inline invalid-domain message. `preview_screenshot`.

- [ ] **Step 8: Production build sanity.** Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npm run build`. Expected: build + prerender succeed (the new route prerenders without throwing).

---

## Self-Review

**Spec coverage:** A1 CORS, A2 raw fields, A3 deploy+verify -> Workstream A complete. B1 config, B2 client, B3 hook, B4 component, B5 homepage, B6 page+route, B7 nav, B8 verify -> Workstream B complete. All four locked decisions (homepage + dedicated page; email + instant view link; score/rating/issue teaser; CORS superset) are implemented. Conventions (no em-dashes, no Shadow AI staging, explicit-path commits, push-on-request) are stated in the header and per-task git commands stage only named files.

**Placeholder scan:** No TBDs; every code step shows full code; error copy is concrete; commands have expected output.

**Type consistency:** `ScanSuccess`/`ScanResult`/`UnlockResult` from B2 are consumed unchanged in B3; `usePostureScan` return shape from B3 is consumed unchanged in B4; `POSTURE_API_BASE` (B1) used in B2/B4; `pageMeta.securityCheck` (B6 step 1) consumed in B6 step 2. API response fields `score`/`grade`/`issueCount`/`token`/`teaserHtml` (A2) match what B2 reads.

**Deploy ordering note:** the native teaser needs A2's raw fields, so A1+A2 should ship as v8 (A3) before B8's teaser step fully passes. B1-B7 can be built in parallel and typecheck independently; only the live end-to-end teaser verification depends on v8.
