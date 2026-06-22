# SEO Re-Audit and Fixes

**Site:** https://www.rosebudcloudsolutions.co.uk
**Date:** 2026-06-22
**Scope:** Full multi-agent re-audit (technical, content/E-E-A-T, schema, GEO, performance, SXO) and same-session implementation of the high-confidence in-code fixes. Follows [2026-06-12-seo-audit-and-actions.md](./2026-06-12-seo-audit-and-actions.md).

## Health score (this audit)

Overall **~67/100**. Strong technical/security baseline; the real gaps are performance (field TTFB), content depth/E-E-A-T proof, and commercial/off-site signals (reviews, directories).

| Category | Score |
|---|---|
| Technical | 74 |
| Content & E-E-A-T | 61 |
| On-page | 78 |
| Schema | 61 |
| Performance (CWV) | 45 |
| AI search (GEO) | 67 |
| Images | 80 |
| Commercial/SXO (separate lens) | 44 |

> Note: the SXO and GEO sub-agents used a fetch tool that missed the SSR `<head>` and wrongly reported "no meta descriptions" and "no schema sitewide." Verified false via curl — descriptions and JSON-LD are present on every page. The rest of their findings stand.

## Fixes implemented this session (working tree, built + verified, NOT yet deployed)

All verified in `dist/client/**` prerendered output after `npm run build` (exit 0, 26 pages).

1. **`<html lang>` → `en-GB`** (`pages/+onRenderHtml.tsx`). Was `en` while OG/JSON-LD already said en-GB.
2. **Case-study Article schema: `image` → `ImageObject`, `mainEntityOfPage` → `{WebPage,@id}`** (`src/pages/CaseStudyDetailPage.tsx`). Bare-string `image` was blocking Article rich-result eligibility on all 6 case studies. Dimensions set to the real **1024×1024** (the source webps are square, not 1200×630).
3. **TechArticle schema: `image` → `ImageObject`** 1200×630 (`src/data/seoMeta.ts`, `techArticleSchema`) — unblocks rich results on both insights articles.
4. **Asset caching + index redirects** (`public/staticwebapp.config.json`):
   - `/assets/*` (Vite content-hashed JS/CSS/fonts) now `cache-control: public, max-age=31536000, immutable` — was inheriting Azure SWA's default `max-age=30`, forcing constant revalidation of immutable files. Root-level images (`/rcs-logo.webp`, `/case-study-*.webp`) deliberately left on default since their names are stable/unhashed.
   - `/index.html` and `/index` → 301 → `/` (were live, indexable homepage duplicates).

## Verified against code, deliberately NOT changed

- **Service-page breadcrumbs** (`Home → Service`): an agent flagged the missing `/services` crumb, but there is **no `/services` index route** (services exist only at `/services/{slug}`). Adding the crumb would link to a 404. Leave as-is unless a hub page is built.

## Remaining — infra (needs Azure/Cloudflare dashboard, can't be done in repo)

| Priority | Item | Notes |
|---|---|---|
| Critical | **Investigate field TTFB.** Live curl showed warm TTFB 2.5–5.0s (one cold 9s) → likely "Poor" LCP. Cache fix above helps repeat/edge but NOT origin first-byte. | Confirm via CrUX/GSC field data; check Azure SWA tier/region. Performance score (45) is gated on this. |
| Medium | Collapse apex HTTP redirect chain (http apex → https apex → www = 2 hops) | Cloudflare/Azure rule. Carried over from 2026-06-12. |
| Medium | IndexNow key + per-deploy ping | Needs Bing Webmaster key. Carried over. |

## Remaining — content / business decisions (need Danny / client input)

| Priority | Item |
|---|---|
| High | **Quantify case-study outcomes** + fix the "Delivery Impact" counter rendering `0 1 / 0 2 / 0 3 / 0 4` (shows no real numbers). Anonymised + unquantified studies cap E-E-A-T. Needs real figures / client permission. |
| High | **Off-site authority:** create a Clutch profile + gather 3–5 reviews; apply to G-Cloud / Digital Marketplace (mandatory procurement route for public-sector/housing targets). |
| High | **Homepage commercial retarget:** title/H1/intro carry no "Azure consultancy UK" term — currently a brand slogan. Add testimonials/client logos. |
| High | **Monetise the housing report:** add a visible author byline + `<time>` date on the page; build a `/sectors/housing-associations` page anchored on the research with a sector-specific CTA. (Report JSON-LD already has author/dates; this is on-page visible attribution + a new page.) |
| Medium | **Content depth:** insights index is ~113 words / 2 articles (both email-auth). Add Azure landing-zone / FinOps / DevSecOps articles; expand the 2 existing to 1,500+ words. |
| Medium | **Name + verify certifications** (AZ-305/AZ-500/SC-100 etc.) with Credly links on /about — currently claimed but never named. |
| Medium | Bridge content → conversion: DMARC guides + report should link forward to `/security-check` and `/services/cloud-security` with intent CTAs. |
| Low | Add `streetAddress` to Organization PostalAddress; per-page sitemap `lastmod` (currently all 2026-06-12). |

## Deploy

Build artifact in `dist/client/` is ready. Not committed/pushed (per repo convention: personal fork by default; merge feature branch → main only when explicitly asked). Note: branch `feature/email-security-page` also has Danny's unrelated in-progress shadow-check worker changes in the working tree — do not bundle those into an SEO commit.
