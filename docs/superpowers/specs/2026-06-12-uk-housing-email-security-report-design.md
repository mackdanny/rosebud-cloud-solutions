# Spec: UK Housing Email Security Report 2026 (Phase 1)

**Date:** 2026-06-12
**Status:** Approved (Danny)
**Repos:** rcs-prospecting-v2 (`apps/reports` scan pipeline) + rosebud-react (public report page)

## Goal

Produce RCS's first piece of original sector research: scan the email-security
posture of the UK's largest housing associations using the existing scan
engine, aggregate the findings, and publish a flagship report. The report is
the linkable, AI-citable, PR-worthy asset that establishes RCS as a sector
authority. The private per-org scan data becomes the lead list for Phase 2
(outreach, separate spec).

## Decisions (locked in brainstorm)

1. **Vertical:** UK housing associations (RCS's existing prospecting target).
2. **Disclosure model:** aggregate-only public report; never name a poor
   performer; optional named list of GOOD performers (positive only, signed off
   + re-verified before publish). Each org's raw data stays private. This is
   responsible disclosure and keeps every org a potential client.
3. **Scale (edition 1):** ~50 domains (the largest providers by homes owned).
4. **Format:** dedicated report page (`/reports/uk-housing-email-security-2026`)
   plus a downloadable PDF. Behind a `REPORTS_ENABLED` flag (off until
   Hannah/Alex sign off), mirroring the INSIGHTS_ENABLED pattern.

## Architecture

### Part A: scan pipeline (rcs-prospecting-v2, private)

- **Domain list:** `apps/reports/data/housing-2026-domains.json`, a curated,
  hand-verified list of ~50 providers `{ name, domain, homesOwned, region }`,
  sourced from the Regulator of Social Housing's public statistical data return
  (largest by homes owned). EVERY domain verified by hand; Danny eyeballs the
  final list before any scan runs. A wrong domain discredits the whole report.
- **Scan script:** `apps/reports/scripts/sector-scan.ts`. Reads the list, runs
  `scanDomain()` + `scoreFindings()` from `scan-core` per domain, sequentially
  with a polite delay (e.g. 2s) so it is unmistakably passive and low-impact.
  Reuses the same standard profile the public funnel uses. Resilient: a failing
  domain is recorded with an error, not fatal.
- **Outputs:**
  - `apps/reports/data/out/sector-scan-raw.json` (per-org findings + scores).
    **git-ignored.** Feeds Phase 2 and the private per-org reports.
  - `apps/reports/data/out/housing-2026-aggregate.json` (sector statistics
    only, zero org identifiers). The ONLY artefact that crosses into the
    website. Hand-copied into rosebud-react once reviewed.
- **Metrics computed** (email-authentication focused):
  - DMARC: % none/absent, % p=none (ineffective), % p=quarantine, % p=reject;
    % at enforcement (quarantine+reject).
  - SPF: % present, % missing, % with a hard fail (-all) vs softfail, % over
    the 10-lookup limit / with errors.
  - DKIM: % with a published, valid selector.
  - Secondary: % with MTA-STS, % with TLS-RPT, % web TLS issues.
  - Distribution of overall scores (banded), sector mean/median.
  - Named good-performers candidate list (enforced DMARC + valid SPF + DKIM),
    held in the RAW file only; promotion to the public page requires re-verify
    + sign-off.

### Part B: public report page (rosebud-react)

- **Data:** `src/data/reports/housing-2026.ts`, the reviewed aggregate stats as
  a typed object (no per-org data) + the curated narrative copy. Authored after
  the scan, content reviewed like the articles.
- **Pages:** `src/pages/ReportsPage.tsx` (optional index of reports) and
  `src/pages/ReportDetailPage.tsx` (renders a report by slug, 404 fallback).
  Premium dark style; big-number stat callouts; simple SVG bar/donut charts
  (no chart library, hand-rolled SVG consistent with existing graphics);
  sections: hero + headline stat, methodology, key findings, what it means,
  top performers (if approved), CTA to /security-check + /contact.
- **Author/credibility:** RCS-branded, with an Alex Hunte byline + the
  methodology section. Visible scan date.
- **Schema:** Dataset + Report (or Article with isBasedOn a Dataset) JSON-LD,
  plus self-contained citable stat sentences in the body. This is what makes AI
  assistants quote RCS as the origin of the numbers.
- **PDF:** a downloadable PDF for press/sharing. v1 approach: a print
  stylesheet on the report page so "Save as PDF" produces a clean document, or
  a generated PDF if the print route proves fiddly. Kept deliberately simple;
  not a blocker for launch.
- **Routing / gating:** `REPORTS_ENABLED` flag in `src/config/features.ts`,
  off by default. Gates routes, prerender entries, footer link. Sitemap +
  llms.txt entries added at flip time (same playbook as insights).
- **Internal links:** at flip time, link the report from /security-check, the
  cloud-security page, and the SPF/DKIM/DMARC article.

## Integrity, accuracy and legal basis

- **Legal basis:** the scan performs passive reads of publicly published DNS
  records and public-facing web services. No access to any system, no
  credentials, no intrusive probing. Publishing aggregate statistics derived
  from public data is well-precedented (security vendors publish equivalent
  reports routinely). The methodology section states this plainly.
- **Public = aggregate only.** No mechanism on the public page or in the
  committed site data exposes a single org's posture. Anonymisation is
  structural (the per-org file never leaves the prospecting repo), not a
  display toggle.
- **Positive naming only**, re-verified at publish time and signed off by
  Hannah/Alex, because naming external organisations is outward-facing.
- **Freshness:** scan date shown; the report is a snapshot and says so.
- **Sign-off gate:** nothing is publicly reachable until REPORTS_ENABLED is
  flipped, after Hannah/Alex approve the written report and any named list.

## Out of scope (Phase 2, separate spec)

- Per-org private report generation and delivery.
- Any outreach email (needs its own GDPR/PECR + deliverability design, built on
  the existing journey/funnel rails).
- Automating the domain-list sourcing (edition 1 is hand-curated).
- Multi-sector or multi-year automation (edition 1 is one sector, one
  snapshot).

## Verification

- Pipeline: a small fixture test of the aggregation maths (counts -> percentages)
  with a handful of synthetic findings, run under the existing reports vitest
  setup. The scan itself is validated by spot-checking 3-4 known domains against
  the live funnel scanner.
- Site: `tsc --noEmit` clean; build prerenders the report URL ONLY when
  REPORTS_ENABLED is on (verified by flipping locally then back); preview check
  of the page desktop + mobile with the flag temporarily on, console clean,
  schema + citable stats present; confirm /reports 404s on the deployed site
  while the flag is off.
