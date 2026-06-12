# SEO Audit and Implementation Report

**Site:** https://www.rosebudcloudsolutions.co.uk
**Date:** 2026-06-12
**Scope:** Full-site audit (technical, on-page/content, schema, GEO/AI search, SXO) with same-day implementation of the high-value findings, focused on maximising visibility of the new free security scanner at /security-check.

## Health score

| Category | Weight | Before | After (projected) |
|---|---|---|---|
| Technical SEO | 22% | 61 | 88 |
| Content quality | 23% | 65 | 78 |
| On-page SEO | 20% | 70 | 84 |
| Schema / structured data | 10% | 72 | 90 |
| Performance (CWV) | 10% | ~85 | ~85 |
| AI search readiness (GEO) | 10% | 68 | 84 |
| Images | 5% | 80 | 80 |
| **Overall** | | **~69 / 100** | **~84 / 100** |

Performance was not re-audited: the site is fully prerendered with prior LCP optimisation work and no findings surfaced.

## What was implemented (deployed 2026-06-12)

### Indexing fixes (commit d640483)
- **/privacy was never prerendered.** It served the homepage shell with a canonical pointing at "/", making the page invisible to search. Now prerendered with its own title/canonical.
- **Soft-404s eliminated.** Every unknown URL returned HTTP 200 via the SWA navigation fallback. Unknown paths now return a real HTTP 404 serving the designed 404 page.
- **/tools/strategic-triage** removed from prerender while feature-flagged off (it was prerendering the 404 page; now a clean 404). Re-add to `pages/+onBeforePrerenderStart.ts` when the flag flips on.
- **Trailing slashes** now 301 to the canonical form (`trailingSlash: never`).
- **Sitemap:** /security-check (priority 0.9) and /faq added (both were missing), lastmod refreshed. 20 URLs.
- **llms.txt:** now leads with the Free Domain Security Check tool entry, drops the dead Strategic Triage link, adds FAQ + Case Studies resources, company registration facts, and a freshness stamp.

### Schema upgrades (commit 4018079)
- Organisation: logo as ImageObject, foundingDate, knowsAbout topics, Companies House sameAs.
- /about Person schemas: absolute image URLs (was a spec violation).
- Case studies: datePublished/dateModified added (required for Article rich results); page titles now suffix the full brand instead of "RCS".
- Services: stable @id per service.
- New WebApplication schema for the scanner.
- Title/meta retargeting: security-check (SPF/DKIM/DMARC + scanner keywords), about, landing zones, advisory, managed cloud (UK intent), homepage + how-we-work descriptions, two over-length case study descriptions shortened.

### /security-check content build-out (commit 0544b2c)
The page had ~80 words of body copy; competitor analysis showed every ranking scanner page carries 400-1,200 words of supporting content. Added below the tool (tool stays above the fold): keyword-led H1, "what the scan checks" explainers, UK context with a sourced Cyber Security Breaches Survey 2024 statistic, instant-vs-full-report table, honest data-handling note, 5-question FAQ with FAQPage JSON-LD, and contextual links to cloud-security, DevSecOps, and contact.

### Internal linking (commit e93137b)
- Footer Solutions column now links to /security-check (was absent).
- Keyword-anchored contextual paragraphs ("free domain security scan/check") added to the Overview sections of cloud-security, devsecops, and managed-cloud service pages.

All changes verified live post-deploy: 404 status correct, /privacy canonical correct, trailing-slash 301s, sitemap/llms.txt serving, schema present, footer + contextual links live, scanner CSP and form intact.

## Remaining recommendations (not implemented, need a human or are ongoing)

| Priority | Item | Why not done now |
|---|---|---|
| High | Submit the updated sitemap in Google Search Console and Bing Webmaster Tools, and request indexing of /security-check | Needs GSC/Bing account access |
| Medium | Noindex the dev subdomain and raw azurestaticapps.net host | SWA global headers apply to all hostnames of the same deployment, so a header would also noindex production; needs a Cloudflare worker/rule or separate dev deployment config |
| Medium | Collapse the apex HTTP redirect chain (http apex -> https apex -> www is 2 hops) | Cloudflare dashboard change |
| Medium | IndexNow key + per-deploy ping | Needs a Bing Webmaster key |
| Medium | Quantify case-study outcomes and add engagement dates (E-E-A-T: anonymised, undated, unquantified studies cap authority) | Needs client permission / real numbers |
| Medium | Add a visible phone number or call-back note + "West Sussex" to the contact page | Business decision on publishing a number |
| Ongoing | Publish dated, authored technical articles (e.g. "How to set up DMARC for Microsoft 365") with Article schema | Content programme; biggest long-term AI-citation lever |
| Low | YouTube channel linked via sameAs (strongest measured AI-citation correlation) | Content creation |
| Low | FAQ accordion questions render inside button elements; AI crawlers prefer heading tags | Component refactor, low urgency since text is in the HTML |
