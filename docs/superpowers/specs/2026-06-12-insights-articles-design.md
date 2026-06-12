# Spec: /insights articles section (technical content for SEO + AI citation)

**Date:** 2026-06-12
**Status:** Approved (Danny), content pending Alex Hunte's sign-off
**Repo:** rosebud-react

## Goal

Publish dated, authored technical articles that build E-E-A-T and make RCS a
citable source for AI assistants (the audit's biggest remaining lever), each
funnelling readers to the free Domain Security Check. Launch with two articles
under Alex Hunte's byline, hidden behind a feature flag until he approves the
drafts.

## Decisions (locked in brainstorm)

1. **Author:** Alex Hunte (Founder & Lead Architect), reusing his existing
   Person identity from /about. Articles must NOT go live before his sign-off.
2. **Topics:**
   - "SPF, DKIM and DMARC explained in plain English" (slug
     `spf-dkim-dmarc-explained`), the definitional piece AI assistants quote.
   - "How to set up DMARC for Microsoft 365 without breaking your email"
     (slug `set-up-dmarc-microsoft-365`), step-by-step for the simple case,
     with an explicit "where this gets risky" bridge to services. This framing
     answers Alex's reluctance to give things away: the generic steps are
     already public in Microsoft docs; the article demonstrates competence and
     advertises the hard part RCS sells.
3. **Path:** `/insights` (listing) + `/insights/:slug` (articles).
4. **Gating:** `INSIGHTS_ENABLED = false` in `src/config/features.ts`,
   mirroring the existing STRATEGIC_TRIAGE_ENABLED pattern. Flag gates routes,
   prerender entries, and footer link. Sitemap + llms.txt entries are added at
   flip time (static files cannot read the flag).
5. **Review artefacts:** both drafts exported as markdown to
   `docs/drafts/insights/` so Danny can forward them to Alex.

## Architecture

- **`src/data/articles.tsx`**: article content as typed structured blocks
  (mirrors the caseStudies.ts data-driven pattern). Block types (YAGNI,
  exactly what the two articles need): `h2`, `h3`, `p` (markdown-style links
  allowed), `list` (ordered/unordered), `code` (label + monospace block),
  `callout` (icon + emphasised aside), `table` (headers + rows). Article
  fields: slug, title, description (meta), datePublished, dateModified,
  readingMinutes, blocks. Author is a module constant (Alex), not per-article,
  until a second author exists.
- **`src/pages/InsightsPage.tsx`**: listing page. Hero + one card per article
  (title, description, date, reading time). Premium dark style, ScrollReveal
  idiom.
- **`src/pages/ArticlePage.tsx`**: renders an article by slug (404 fallback to
  NotFoundPage for unknown slugs). Byline block (Alex, role, link to
  /about#team), published/updated dates visible on page (freshness signal),
  block renderer, end-of-article scanner CTA (link to /security-check), and a
  "talk to us" bridge.
- **Schema:** TechArticle (headline, description, datePublished, dateModified,
  author = Person Alex with sameAs LinkedIn + url /about, publisher = org @id,
  image = OG default, inLanguage en-GB) + BreadcrumbList. Listing page gets
  Breadcrumb + CollectionPage-lite (just SEO meta; no ItemList needed at n=2).
- **SEO meta:** `pageMeta.insights` entry; per-article title/description come
  from article data via the SEO component.
- **Routing:** lazy routes in App.tsx wrapped in `INSIGHTS_ENABLED &&`, same as
  Strategic Triage. Prerender: `pages/+onBeforePrerenderStart.ts` imports the
  flag and conditionally appends `/insights` + article URLs.
- **Footer:** "Insights" link in the Company column, flag-gated.
- **Nav:** unchanged (crowded; footer + internal links suffice at launch).

## Content requirements (both articles)

- UK English, no em-dashes anywhere, 1,200-1,800 words.
- Technically accurate and current; no invented statistics. The only external
  stats permitted are ones verifiable from named sources (NCSC guidance, UK
  Cyber Security Breaches Survey 2024, Microsoft documentation), attributed
  inline.
- Citable structure: self-contained definitional paragraphs near the top,
  question-shaped H2/H3s, a comparison table in the explainer.
- Each ends with: scanner CTA ("check your domain in about 15 seconds") and a
  one-line service bridge.
- Visible dates and author byline on the page (not just schema).

## At flip time (separate tiny change once Alex approves)

1. `INSIGHTS_ENABLED = true`.
2. Add 3 URLs to `public/sitemap.xml`; add an Insights section to
   `public/llms.txt`.
3. Add contextual links to the articles from /security-check FAQ answers and
   the cloud-security service page.
4. Build, deploy, verify, then request indexing in GSC.

## Out of scope

- No CMS, no markdown pipeline, no RSS, no comments, no tags/categories at n=2.
- No nav changes.
- No third article (reading-your-results piece can follow once the scanner has
  real user volume).

## Verification

- `npx tsc --noEmit` clean; `npm run build` prerenders WITHOUT the insights
  URLs while the flag is off (and WITH them when flipped locally as a test,
  then flipped back).
- Preview check of listing + both articles with the flag temporarily on:
  console clean, byline/dates/CTA/schema present, mobile + desktop screenshots.
- Confirm deployed site serves 404 for /insights while flag is off.
