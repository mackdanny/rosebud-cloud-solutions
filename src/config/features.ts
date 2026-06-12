// Feature flags. Flip a value here to show/hide site-wide functionality.
// Strategic Triage Engine is in development — flip to `true` when ready to
// re-expose the nav link, home-page section, contact dropdown option, and route.
export const STRATEGIC_TRIAGE_ENABLED = false;

// Insights articles (/insights). Approved 2026-06-12 (Hannah, for Alex's
// byline) and live. The flag gates the routes, prerender entries, and footer
// link; sitemap.xml + llms.txt entries are maintained by hand alongside it.
export const INSIGHTS_ENABLED = true;
