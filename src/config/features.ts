// Feature flags. Flip a value here to show/hide site-wide functionality.
// Strategic Triage Engine is in development — flip to `true` when ready to
// re-expose the nav link, home-page section, contact dropdown option, and route.
export const STRATEGIC_TRIAGE_ENABLED = false;

// Insights articles (/insights). OFF until Alex has approved the drafts that
// carry his byline (docs/drafts/insights/). Flipping this on exposes the
// routes, prerender entries, and footer link; remember to also add the URLs
// to public/sitemap.xml + public/llms.txt and bump the article dates (see
// docs/superpowers/specs/2026-06-12-insights-articles-design.md, "At flip time").
export const INSIGHTS_ENABLED = false;
