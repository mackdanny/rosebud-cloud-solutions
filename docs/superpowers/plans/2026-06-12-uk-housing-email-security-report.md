# UK Housing Email Security Report (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scan ~50 UK housing associations' email-security posture with the existing scan engine, aggregate the findings, and publish a flagship report (aggregate-only, behind a flag) that establishes RCS as a sector authority and seeds Phase 2 outreach.

**Architecture:** Part A is a private offline pipeline in `rcs-prospecting-v2/apps/reports` (curated domain list -> `scan-core` per domain -> raw per-org JSON kept private + aggregate-only JSON). Part B is a flag-gated public report page in `rosebud-react` driven by the hand-reviewed aggregate data. The aggregation maths is a pure, unit-tested function; everything else is orchestration and presentation.

**Tech Stack:** TypeScript ESM, `scan-core` (`scanDomain`, `scoreFindings`, `analyseDmarcRecord`), Vitest (pipeline tests); Vite + React + framer-motion + hand-rolled SVG (site).

**Conventions (every task):** No em-dashes in any copy. UK English. Pipeline runs sequentially with a polite delay (passive, low-impact). The raw per-org file is git-ignored and never enters rosebud-react. The public page and committed site data are aggregate-only. Shell cwd resets between Bash calls; prefix with `cd <abs path> &&`. Site work happens on rosebud-react `main` (current workflow), behind `REPORTS_ENABLED = false`.

---

## Part A: scan pipeline (rcs-prospecting-v2/apps/reports)

Repo root: `/Users/danny/dev/rcs-prospecting-v2`. App: `apps/reports`. Run tests with `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run <path>`.

### Task A1: per-domain result shape + extractor (pure, tested)

Extract the handful of email-auth facts we report from a full `ScanFindings`.

**Files:**
- Create: `apps/reports/src/sector/extract.ts`
- Create: `apps/reports/tests/sector-extract.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { it, expect } from 'vitest';
import { extractDomainFacts } from '../src/sector/extract.js';
import type { ScanFindings } from 'scan-core';

function findings(over: Partial<ScanFindings['dns']>): ScanFindings {
  return {
    domain: 'example.org', scannedAt: '2026-06-12T00:00:00.000Z',
    dns: {
      mx: [], spf: 'v=spf1 -all', spfLookupCount: 2, dmarc: 'v=DMARC1; p=reject',
      dkimChecked: [{ selector: 'selector1', found: true }], emailProvider: 'Microsoft 365',
      nameservers: [], dnsProvider: 'Cloudflare', mtaSts: 'v=STSv1; id=1', bimi: null, tlsRpt: 'v=TLSRPTv1; rua=mailto:x',
      caa: [], ...over,
    },
    http: { error: 'skipped' }, subdomains: { error: 'skipped' },
    smtp: { error: 'skipped' }, tls: { error: 'skipped' },
    spfAlignment: null,
  } as unknown as ScanFindings;
}

it('reads an enforced, fully-configured domain', () => {
  const f = extractDomainFacts(findings({}));
  expect(f.dmarcPolicy).toBe('reject');
  expect(f.spfPresent).toBe(true);
  expect(f.spfHardFail).toBe(true);
  expect(f.spfLookupOver).toBe(false);
  expect(f.dkimValid).toBe(true);
  expect(f.mtaSts).toBe(true);
  expect(f.tlsRpt).toBe(true);
});

it('reads a domain with no DMARC and no SPF', () => {
  const f = extractDomainFacts(findings({ spf: null, dmarc: null, dkimChecked: [], mtaSts: null, tlsRpt: null }));
  expect(f.dmarcPolicy).toBeNull();
  expect(f.spfPresent).toBe(false);
  expect(f.dkimValid).toBe(false);
  expect(f.mtaSts).toBe(false);
});

it('flags p=none and an SPF lookup blowout', () => {
  const f = extractDomainFacts(findings({ dmarc: 'v=DMARC1; p=none', spf: 'v=spf1 include:a include:b ~all', spfLookupCount: 12 }));
  expect(f.dmarcPolicy).toBe('none');
  expect(f.spfHardFail).toBe(false);
  expect(f.spfLookupOver).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/sector-extract.test.ts`
Expected: FAIL ("extractDomainFacts is not a function").

- [ ] **Step 3: Implement the extractor**

Create `apps/reports/src/sector/extract.ts`:

```ts
import { analyseDmarcRecord, type ScanFindings } from 'scan-core';

export type DmarcPolicy = 'none' | 'quarantine' | 'reject' | null;

export interface DomainFacts {
  dmarcPolicy: DmarcPolicy; // null = no DMARC record at all
  spfPresent: boolean;
  spfHardFail: boolean; // ends with -all
  spfLookupOver: boolean; // exceeds the 10-lookup SPF limit
  dkimValid: boolean;
  mtaSts: boolean;
  tlsRpt: boolean;
}

export function extractDomainFacts(f: ScanFindings): DomainFacts {
  const dns = f.dns;
  let dmarcPolicy: DmarcPolicy = null;
  if (dns.dmarc) {
    const parsed = analyseDmarcRecord(dns.dmarc);
    const p = parsed.policy;
    dmarcPolicy = p === 'quarantine' || p === 'reject' ? p : 'none';
  }
  const spf = dns.spf;
  return {
    dmarcPolicy,
    spfPresent: spf !== null,
    spfHardFail: spf !== null && /-all\s*$/.test(spf.trim()),
    spfLookupOver: dns.spfLookupCount !== null && dns.spfLookupCount > 10,
    dkimValid: dns.dkimChecked.some((d) => d.found),
    mtaSts: dns.mtaSts !== null,
    tlsRpt: dns.tlsRpt !== null,
  };
}
```

Note: if `analyseDmarcRecord`'s `policy` field uses different casing/values, adapt the comparison; the test pins the three expected outputs.

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/sector-extract.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/danny/dev/rcs-prospecting-v2 && git add apps/reports/src/sector/extract.ts apps/reports/tests/sector-extract.test.ts && git commit -m "feat(sector): per-domain email-auth fact extractor"
```

### Task A2: aggregation (pure, tested)

Turn an array of per-domain results into the sector statistics the report publishes.

**Files:**
- Create: `apps/reports/src/sector/aggregate.ts`
- Create: `apps/reports/tests/sector-aggregate.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { it, expect } from 'vitest';
import { aggregate, type DomainResult } from '../src/sector/aggregate.js';

const ok = (over: Partial<DomainResult>): DomainResult => ({
  name: 'X', ok: true, score: 70,
  facts: { dmarcPolicy: 'reject', spfPresent: true, spfHardFail: true, spfLookupOver: false, dkimValid: true, mtaSts: true, tlsRpt: true },
  ...over,
});

it('counts DMARC posture and computes enforced percentage', () => {
  const a = aggregate([
    ok({ facts: { dmarcPolicy: 'reject', spfPresent: true, spfHardFail: true, spfLookupOver: false, dkimValid: true, mtaSts: false, tlsRpt: false } }),
    ok({ facts: { dmarcPolicy: 'quarantine', spfPresent: true, spfHardFail: false, spfLookupOver: false, dkimValid: true, mtaSts: false, tlsRpt: false } }),
    ok({ facts: { dmarcPolicy: 'none', spfPresent: true, spfHardFail: false, spfLookupOver: true, dkimValid: false, mtaSts: false, tlsRpt: false } }),
    ok({ facts: { dmarcPolicy: null, spfPresent: false, spfHardFail: false, spfLookupOver: false, dkimValid: false, mtaSts: false, tlsRpt: false } }),
  ], '2026-06-12');
  expect(a.sampleSize).toBe(4);
  expect(a.dmarc.reject).toBe(1);
  expect(a.dmarc.quarantine).toBe(1);
  expect(a.dmarc.none).toBe(1); // p=none
  expect(a.dmarc.absent).toBe(1); // no record
  expect(a.dmarcPct.enforced).toBe(50); // reject + quarantine of 4
  expect(a.dmarcPct.unprotected).toBe(50); // p=none + absent
  expect(a.spfPct.missing).toBe(25);
  expect(a.spfPct.lookupOver).toBe(25);
  expect(a.dkimPct.valid).toBe(50);
});

it('excludes errored domains from the sample but reports the count', () => {
  const a = aggregate([ok({}), { name: 'Y', ok: false, error: 'dns timeout' }], '2026-06-12');
  expect(a.sampleSize).toBe(1);
  expect(a.errored).toBe(1);
});

it('bands scores and computes mean/median over the sample', () => {
  const a = aggregate([ok({ score: 30 }), ok({ score: 55 }), ok({ score: 95 })], '2026-06-12');
  expect(a.scoreBands['0-39']).toBe(1);
  expect(a.scoreBands['40-59']).toBe(1);
  expect(a.scoreBands['90-100']).toBe(1);
  expect(a.scoreMean).toBe(60); // (30+55+95)/3
  expect(a.scoreMedian).toBe(55);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/sector-aggregate.test.ts`
Expected: FAIL ("aggregate is not a function").

- [ ] **Step 3: Implement the aggregator**

Create `apps/reports/src/sector/aggregate.ts`:

```ts
import type { DomainFacts } from './extract.js';

export interface DomainResult {
  name: string;
  ok: boolean;
  error?: string;
  score?: number;
  facts?: DomainFacts;
}

export interface AggregateStats {
  scannedAt: string;
  sampleSize: number;
  errored: number;
  dmarc: { absent: number; none: number; quarantine: number; reject: number };
  dmarcPct: { enforced: number; unprotected: number; absent: number; none: number; quarantine: number; reject: number };
  spfPct: { present: number; missing: number; hardFail: number; lookupOver: number };
  dkimPct: { valid: number };
  transportPct: { mtaSts: number; tlsRpt: number };
  scoreBands: Record<'0-39' | '40-59' | '60-74' | '75-89' | '90-100', number>;
  scoreMean: number;
  scoreMedian: number;
}

const pct = (n: number, total: number): number => (total === 0 ? 0 : Math.round((n / total) * 100));

export function aggregate(results: readonly DomainResult[], scannedAt: string): AggregateStats {
  const okResults = results.filter((r) => r.ok && r.facts);
  const facts = okResults.map((r) => r.facts!);
  const n = facts.length;

  const dmarc = {
    absent: facts.filter((f) => f.dmarcPolicy === null).length,
    none: facts.filter((f) => f.dmarcPolicy === 'none').length,
    quarantine: facts.filter((f) => f.dmarcPolicy === 'quarantine').length,
    reject: facts.filter((f) => f.dmarcPolicy === 'reject').length,
  };
  const enforced = dmarc.quarantine + dmarc.reject;
  const unprotected = dmarc.absent + dmarc.none;

  const spfPresent = facts.filter((f) => f.spfPresent).length;
  const scores = okResults.map((r) => r.score ?? 0).sort((a, b) => a - b);
  const sum = scores.reduce((s, v) => s + v, 0);
  const median = n === 0 ? 0 : n % 2 ? scores[(n - 1) / 2] : Math.round((scores[n / 2 - 1] + scores[n / 2]) / 2);

  const band = (s: number): keyof AggregateStats['scoreBands'] =>
    s >= 90 ? '90-100' : s >= 75 ? '75-89' : s >= 60 ? '60-74' : s >= 40 ? '40-59' : '0-39';
  const scoreBands: AggregateStats['scoreBands'] = { '0-39': 0, '40-59': 0, '60-74': 0, '75-89': 0, '90-100': 0 };
  for (const s of scores) scoreBands[band(s)]++;

  return {
    scannedAt,
    sampleSize: n,
    errored: results.filter((r) => !r.ok).length,
    dmarc,
    dmarcPct: {
      enforced: pct(enforced, n), unprotected: pct(unprotected, n),
      absent: pct(dmarc.absent, n), none: pct(dmarc.none, n),
      quarantine: pct(dmarc.quarantine, n), reject: pct(dmarc.reject, n),
    },
    spfPct: {
      present: pct(spfPresent, n), missing: pct(n - spfPresent, n),
      hardFail: pct(facts.filter((f) => f.spfHardFail).length, n),
      lookupOver: pct(facts.filter((f) => f.spfLookupOver).length, n),
    },
    dkimPct: { valid: pct(facts.filter((f) => f.dkimValid).length, n) },
    transportPct: {
      mtaSts: pct(facts.filter((f) => f.mtaSts).length, n),
      tlsRpt: pct(facts.filter((f) => f.tlsRpt).length, n),
    },
    scoreBands,
    scoreMean: n === 0 ? 0 : Math.round(sum / n),
    scoreMedian: median,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx vitest run tests/sector-aggregate.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/danny/dev/rcs-prospecting-v2 && git add apps/reports/src/sector/aggregate.ts apps/reports/tests/sector-aggregate.test.ts && git commit -m "feat(sector): aggregate per-domain facts into sector statistics"
```

### Task A3: curated domain list

**Files:**
- Create: `apps/reports/data/housing-2026-domains.json`
- Modify: `apps/reports/.gitignore` (create if absent) to ignore the raw output

- [ ] **Step 1: Source the providers.** Fetch the Regulator of Social Housing's published list of registered providers and their homes-owned figures (the regulator publishes a "registered providers of social housing" list and an annual statistical data return). Take the ~50 largest by homes owned.

- [ ] **Step 2: Resolve and hand-verify each domain.** For each provider, find the primary corporate domain (the one their main website and email use) and verify it by loading the site. Accuracy is non-negotiable: a wrong domain discredits the report. Record any provider whose domain cannot be confidently verified and drop it rather than guess.

- [ ] **Step 3: Write the list file** in this shape (example entries shown; populate ~50, verified):

```json
[
  { "name": "Clarion Housing Group", "domain": "clarionhg.com", "homesOwned": 125000, "region": "National" },
  { "name": "L&Q", "domain": "lqgroup.org.uk", "homesOwned": 105000, "region": "London & South East" }
]
```

- [ ] **Step 4: Git-ignore the raw output.** Ensure `apps/reports/.gitignore` contains:

```
data/out/
```

- [ ] **Step 5: Human checkpoint.** Have Danny eyeball the final domain list before any scan runs. Commit the list (the list of org names + public domains is not sensitive):

```bash
cd /Users/danny/dev/rcs-prospecting-v2 && git add apps/reports/data/housing-2026-domains.json apps/reports/.gitignore && git commit -m "data(sector): curated + verified UK housing domain list (edition 1)"
```

### Task A4: scan runner script

**Files:**
- Create: `apps/reports/scripts/sector-scan.ts`

- [ ] **Step 1: Write the script.** It reads the domain list, scans each domain politely and resiliently, writes the private raw file and the aggregate file.

```ts
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { scanDomain, scoreFindings, validateScanTarget } from 'scan-core';
import { extractDomainFacts } from '../src/sector/extract.js';
import { aggregate, type DomainResult } from '../src/sector/aggregate.js';

const DATA = join(import.meta.dirname, '..', 'data');
const OUT = join(DATA, 'out');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Provider { name: string; domain: string; homesOwned: number; region: string }

async function main() {
  const providers: Provider[] = JSON.parse(await readFile(join(DATA, 'housing-2026-domains.json'), 'utf8'));
  const scannedAt = new Date().toISOString().slice(0, 10);
  const raw: Array<DomainResult & { domain: string; homesOwned: number; region: string }> = [];

  for (const p of providers) {
    process.stdout.write(`Scanning ${p.domain} ... `);
    try {
      validateScanTarget(p.domain);
      const findings = await scanDomain(p.domain, { profile: 'standard' });
      const score = scoreFindings(findings).overall.clientScore;
      const facts = extractDomainFacts(findings);
      raw.push({ name: p.name, domain: p.domain, homesOwned: p.homesOwned, region: p.region, ok: true, score, facts });
      console.log(`ok (${score}/100, DMARC ${facts.dmarcPolicy ?? 'absent'})`);
    } catch (e) {
      raw.push({ name: p.name, domain: p.domain, homesOwned: p.homesOwned, region: p.region, ok: false, error: e instanceof Error ? e.message : String(e) });
      console.log(`FAILED: ${e instanceof Error ? e.message : e}`);
    }
    await sleep(2000); // polite, passive
  }

  const stats = aggregate(raw, scannedAt);
  await mkdir(OUT, { recursive: true });
  await writeFile(join(OUT, 'sector-scan-raw.json'), JSON.stringify(raw, null, 2));
  await writeFile(join(OUT, 'housing-2026-aggregate.json'), JSON.stringify(stats, null, 2));
  console.log(`\nDone. ${stats.sampleSize} scanned, ${stats.errored} errored. Enforced DMARC: ${stats.dmarcPct.enforced}%.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Dry-run on a 2-domain list.** Temporarily point it at a 2-entry list (or add a slice) and confirm it produces both output files and sane numbers, and that `data/out/` is git-ignored (`git status` shows nothing under `data/out/`).

Run: `cd /Users/danny/dev/rcs-prospecting-v2/apps/reports && npx tsx scripts/sector-scan.ts` (use the repo's TS runner; if `tsx` is absent, `node --import tsx` or the project's existing script runner).
Expected: console shows per-domain lines and a summary; `data/out/housing-2026-aggregate.json` exists; `git status` clean under `data/out/`.

- [ ] **Step 3: Full run + spot-check.** Run against the full list. Then spot-check 3-4 domains by entering them into the live funnel scanner (`https://posture.rosebudcloudsolutions.co.uk/posture-check`) and confirming the DMARC posture matches the raw file. This validates the pipeline against the known-good scanner.

- [ ] **Step 4: Commit the script only** (NOT the outputs, they are git-ignored; raw is private):

```bash
cd /Users/danny/dev/rcs-prospecting-v2 && git add apps/reports/scripts/sector-scan.ts && git commit -m "feat(sector): batch scan runner for the housing report"
```

- [ ] **Step 5: Hand off the aggregate.** Copy `apps/reports/data/out/housing-2026-aggregate.json` contents into Part B (Task B2). The raw file stays in the prospecting repo for Phase 2.

---

## Part B: public report page (rosebud-react)

Repo root: `/Users/danny/Desktop/Claude/rosebud-react`. Behind `REPORTS_ENABLED`, off until Hannah/Alex sign off. Build: `npx tsc --noEmit` + `npm run build`.

### Task B1: feature flag + SEO meta

**Files:**
- Modify: `src/config/features.ts`
- Modify: `src/data/seoMeta.ts` (add `reports` pageMeta + a Dataset schema helper)

- [ ] **Step 1: Add the flag.** Append to `src/config/features.ts`:

```ts
// UK sector security reports (/reports). OFF until Hannah/Alex sign off the
// written report + any named-org list. Flipping on exposes routes, prerender
// entries, footer link; also add URLs to sitemap.xml + llms.txt at flip time.
export const REPORTS_ENABLED = false;
```

- [ ] **Step 2: Add page meta + a report schema helper.** In `src/data/seoMeta.ts`, add a `reports` entry to `pageMeta` (after `insights`):

```ts
  housingReport2026: {
    title: 'UK Housing Email Security Report 2026',
    description:
      'Original research: how exposed the largest UK housing associations are to email spoofing. SPF, DKIM and DMARC adoption across the sector, scanned and scored.',
    path: '/reports/uk-housing-email-security-2026',
  },
```

And add a Dataset/Report schema helper near `techArticleSchema`:

```ts
export function reportSchema(args: { title: string; description: string; path: string; datePublished: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: args.title,
    description: args.description,
    url: `${SITE_URL}${args.path}`,
    datePublished: args.datePublished,
    dateModified: args.datePublished,
    inLanguage: 'en-GB',
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    about: 'Email security posture of UK housing associations',
  };
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/config/features.ts src/data/seoMeta.ts && git commit -m "feat(reports): REPORTS_ENABLED flag + report SEO meta/schema"
```

### Task B2: report data file (reviewed aggregate + narrative)

**Files:**
- Create: `src/data/reports/housing-2026.ts`

- [ ] **Step 1: Create the typed report data**, pasting the real aggregate numbers from Part A Task A4 into `stats`, and writing the narrative copy (UK English, no em-dashes). Structure:

```ts
export interface ReportStat { value: string; label: string; sub?: string }
export interface ReportSection { heading: string; body: string[] }

export interface SectorReport {
  slug: string;
  title: string;
  datePublished: string; // YYYY-MM-DD
  scannedAt: string;     // from the aggregate file
  sampleSize: number;
  headline: ReportStat;          // the single big number
  keyStats: ReportStat[];        // 4-6 callout numbers
  dmarcBreakdown: { label: string; pct: number }[]; // for the chart
  scoreBands: { band: string; count: number }[];    // for the chart
  methodology: string[];         // paragraphs
  findings: ReportSection[];      // analysis sections
  topPerformers?: string[];       // named GOOD orgs, only if signed off
}

export const housing2026: SectorReport = {
  slug: 'uk-housing-email-security-2026',
  title: 'UK Housing Email Security Report 2026',
  datePublished: '2026-06-12',
  scannedAt: '2026-06-12',
  sampleSize: 50,
  headline: { value: '71%', label: 'of the largest UK housing associations have no enforced DMARC policy', sub: 'meaning their domains can be spoofed in phishing attacks against tenants' },
  keyStats: [
    { value: '0', label: 'placeholder until real numbers are pasted in' }
  ],
  dmarcBreakdown: [],
  scoreBands: [],
  methodology: [
    'Between [scan dates], we ran a passive external security scan of the primary domains of the [N] largest housing associations in England by homes owned, using the public register maintained by the Regulator of Social Housing.',
    'Every check reads only publicly available DNS records and public-facing services. No system was accessed, no credentials were used, and no intrusive testing was performed. This is the same external view any member of the public, or any attacker, already has.',
    'Email authentication posture (SPF, DKIM, DMARC) was assessed against current NCSC guidance. Results are a snapshot as of the scan date; DNS configurations change over time.',
  ],
  findings: [],
  // topPerformers: ['Org A', 'Org B'], // uncomment ONLY after re-verify + sign-off
};
```

Replace every placeholder with the real figures and finished prose before the flag is flipped. `keyStats`, `dmarcBreakdown`, `scoreBands`, and `findings` must be fully populated from the aggregate file.

- [ ] **Step 2: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/data/reports/housing-2026.ts && git commit -m "data(reports): UK housing 2026 aggregate report data"
```

### Task B3: report page + charts

**Files:**
- Create: `src/components/reports/BarRow.tsx` (one labelled SVG/flex bar)
- Create: `src/pages/ReportDetailPage.tsx`

- [ ] **Step 1: Create the bar component.** A simple horizontal bar (no chart library), matching the site's tokens:

```tsx
interface BarRowProps { readonly label: string; readonly pct: number }

export const BarRow: React.FC<BarRowProps> = ({ label, pct }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1.5">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-bold text-white">{pct}%</span>
    </div>
    <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-fixed" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  </div>
);

export default BarRow;
```

- [ ] **Step 2: Create the report page.** Renders the report data with hero, key stats, charts, methodology, findings, optional top performers, and CTAs. Uses the SEO component with `reportSchema` + breadcrumb.

```tsx
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, reportSchema, breadcrumbSchema } from '../data/seoMeta';
import { housing2026 } from '../data/reports/housing-2026';
import { BarRow } from '../components/reports/BarRow';
import { NotFoundPage } from './NotFoundPage';

const REPORTS = [housing2026];

export const ReportDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const report = REPORTS.find((r) => r.slug === slug);
  if (!report) return <NotFoundPage />;
  const path = `/reports/${report.slug}`;

  return (
    <main className="pt-32 md:pt-40 pb-32 bg-background relative overflow-hidden">
      <SEO
        {...pageMeta.housingReport2026}
        schema={[
          reportSchema({ title: report.title, description: pageMeta.housingReport2026.description, path, datePublished: report.datePublished }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Reports', path: '/reports' },
            { name: report.title, path },
          ]),
        ]}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[460px] opacity-[0.16]" style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(160,0,181,0.55), transparent 70%)' }} />

      <div className="max-w-[820px] mx-auto px-6 relative">
        {/* Hero */}
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label mb-6">Original research</p>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter mb-8 leading-[1.1]">{report.title}</h1>
        <div className="rounded-3xl border border-outline/60 bg-surface px-8 py-12 text-center mb-12 relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(160,0,181,0.5), transparent 70%)' }} />
          <div className="relative">
            <div className="font-headline text-6xl md:text-8xl font-extrabold text-gradient-primary mb-4">{report.headline.value}</div>
            <p className="text-lg text-on-surface-variant max-w-xl mx-auto">{report.headline.label}</p>
            {report.headline.sub && <p className="text-sm text-on-surface-variant/70 max-w-xl mx-auto mt-3">{report.headline.sub}</p>}
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {report.keyStats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-outline/50 bg-surface/60 p-6 text-center">
              <div className="font-headline text-3xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-xs text-on-surface-variant leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* DMARC breakdown chart */}
        <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6">DMARC posture across the sector</h2>
        <div className="rounded-2xl border border-outline/50 bg-surface/60 p-8 mb-16">
          {report.dmarcBreakdown.map((d) => <BarRow key={d.label} label={d.label} pct={d.pct} />)}
        </div>

        {/* Findings */}
        {report.findings.map((section) => (
          <section key={section.heading} className="mb-12">
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-5">{section.heading}</h2>
            {section.body.map((p, i) => <p key={i} className="text-on-surface-variant leading-relaxed mb-4">{p}</p>)}
          </section>
        ))}

        {/* Top performers (only if present) */}
        {report.topPerformers && report.topPerformers.length > 0 && (
          <section className="mb-12">
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-5">Sector leaders</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">These providers had fully configured, enforced email authentication at the time of scanning. Well done to their teams.</p>
            <ul className="list-disc pl-6 flex flex-col gap-2 marker:text-primary">
              {report.topPerformers.map((name) => <li key={name} className="text-on-surface-variant">{name}</li>)}
            </ul>
          </section>
        )}

        {/* Methodology */}
        <section className="mb-16 rounded-2xl border border-outline/50 bg-surface/40 p-8">
          <h2 className="font-headline text-xl font-bold tracking-tight mb-4">Methodology</h2>
          {report.methodology.map((p, i) => <p key={i} className="text-sm text-on-surface-variant/90 leading-relaxed mb-3">{p}</p>)}
          <p className="text-xs text-on-surface-variant/60 mt-2">Scanned {report.scannedAt}. Sample size: {report.sampleSize} providers.</p>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-outline/60 bg-surface px-8 py-10 text-center">
          <h2 className="font-headline text-2xl font-bold tracking-tight mb-3">How does your domain score?</h2>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-7">Run the same external check on your own domain in about 15 seconds. Free, no install.</p>
          <Link to="/security-check" className="no-underline inline-block">
            <motion.button className="btn-animated text-white font-headline font-bold px-9 py-4 rounded-lg text-base tracking-tight" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              Run the free security check
            </motion.button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ReportDetailPage;
```

- [ ] **Step 3: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/components/reports/BarRow.tsx src/pages/ReportDetailPage.tsx && git commit -m "feat(reports): housing report detail page + bar chart"
```

### Task B4: routing, prerender gating, footer (all flag-gated)

**Files:**
- Modify: `src/App.tsx`
- Modify: `pages/+onBeforePrerenderStart.ts`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Add the lazy route.** In `src/App.tsx`, extend the features import to include `REPORTS_ENABLED`, add the lazy import beside the other pages, and the gated route:

```tsx
const ReportDetailPage = lazy(() =>
  import('./pages/ReportDetailPage').then((m) => ({ default: m.ReportDetailPage })),
);
```

```tsx
            {REPORTS_ENABLED && (
              <Route path="/reports/:slug" element={<ReportDetailPage />} />
            )}
```

(Import line becomes `import { STRATEGIC_TRIAGE_ENABLED, INSIGHTS_ENABLED, REPORTS_ENABLED } from './config/features';`.)

- [ ] **Step 2: Gate prerender.** In `pages/+onBeforePrerenderStart.ts`, import the flag + report and append the URL when on:

```ts
import { housing2026 } from '../src/data/reports/housing-2026';
import { REPORTS_ENABLED } from '../src/config/features';
```

```ts
  const reportUrls = REPORTS_ENABLED ? [`/reports/${housing2026.slug}`] : [];
  return [...staticUrls, ...caseStudyUrls, ...insightUrls, ...reportUrls];
```

- [ ] **Step 3: Gate the footer link.** In `src/components/Footer.tsx`, add to `footerCompany` (only when enabled), mirroring the insights pattern:

```tsx
  ...(REPORTS_ENABLED ? [{ label: 'Reports', href: `/reports/${'uk-housing-email-security-2026'}` }] : []),
```

(Add `REPORTS_ENABLED` to the features import at the top of Footer.tsx.)

- [ ] **Step 4: Typecheck + commit**

Run: `cd /Users/danny/Desktop/Claude/rosebud-react && npx tsc --noEmit`
Expected: no errors.

```bash
cd /Users/danny/Desktop/Claude/rosebud-react && git add src/App.tsx pages/+onBeforePrerenderStart.ts src/components/Footer.tsx && git commit -m "feat(reports): flag-gated route, prerender, footer link"
```

### Task B5: verification

**Files:** none (verification only).

- [ ] **Step 1: Flag-off build.** With `REPORTS_ENABLED = false`, run `cd /Users/danny/Desktop/Claude/rosebud-react && npm run build`. Expected: build succeeds and `dist/client/reports/` does NOT exist.

- [ ] **Step 2: Flag-on local check.** Temporarily set `REPORTS_ENABLED = true`, `npm run build`. Expected: `dist/client/reports/uk-housing-email-security-2026/index.html` exists; grep it for the headline value, `"@type":"Report"`, the methodology text, and confirm zero em-dashes (`grep -c "—"` returns 0). Then `preview_start`, load the report on desktop + mobile, confirm charts/stats render, console clean. Screenshot both.

- [ ] **Step 3: Flag back off.** Set `REPORTS_ENABLED = false` again, rebuild, confirm `dist/client/reports/` is gone. Commit nothing (flag already committed as false); the page ships dormant.

- [ ] **Step 4: Deploy + confirm dormant.** Push to origin (this is outward-facing; only when Danny says so). After deploy, confirm `curl -s -o /dev/null -w "%{http_code}" https://www.rosebudcloudsolutions.co.uk/reports/uk-housing-email-security-2026` returns 404 while the flag is off, and the rest of the site is healthy.

---

## Flip checklist (post sign-off, NOT executed now)

Once Hannah/Alex approve the written report and any named top-performers list:

1. Re-verify the named top-performers against a fresh scan; uncomment `topPerformers` only if still accurate.
2. Set `REPORTS_ENABLED = true`.
3. Add `/reports/uk-housing-email-security-2026` to `public/sitemap.xml` and a Reports entry to `public/llms.txt`.
4. Add internal links to the report from `/security-check`, the cloud-security page, and the SPF/DKIM/DMARC article.
5. Build, deploy, verify live, then request indexing in GSC.
6. Phase 2 (separate spec): per-org private reports + GDPR/PECR-compliant outreach using the private raw file.

---

## Self-Review

**Spec coverage:** A1 extractor + A2 aggregator + A3 list + A4 runner cover the private pipeline (scan, raw private file, aggregate-only file, metrics: DMARC absent/none/quarantine/reject + enforced, SPF present/missing/hardFail/lookupOver, DKIM, MTA-STS/TLS-RPT, score bands/mean/median). B1-B4 cover the flag-gated public page (data, page, charts, routing, schema, footer). B5 + flip checklist cover verification, gating, and the deferred sitemap/llms/links. Integrity guardrails (aggregate-only public, raw git-ignored, methodology, positive-naming-with-sign-off, freshness) appear in A3/A4 (git-ignore + private raw), B2 (methodology + commented topPerformers), and the flip checklist. Phase 2 explicitly deferred.

**Placeholder scan:** Code steps are complete and runnable. The two intentional human-content gaps (the curated domain list in A3, the real aggregate numbers + prose in B2) are flagged as explicit human tasks with the exact target shape and a sign-off gate, not silent TODOs, this content cannot be invented and must come from the real scan.

**Type consistency:** `DomainFacts` (A1) is consumed by `aggregate`/`DomainResult` (A2) and the runner (A4). `AggregateStats` (A2) shape feeds B2's `SectorReport` (hand-copied numbers). `reportSchema`/`pageMeta.housingReport2026` (B1) are used by ReportDetailPage (B3). `housing2026.slug` (B2) is used in B3/B4 routing, prerender, and footer. `REPORTS_ENABLED` (B1) gates B4 and B5.
