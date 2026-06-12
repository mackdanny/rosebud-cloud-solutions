// Feature flags. Flip a value here to show/hide site-wide functionality.
// Strategic Triage Engine is in development — flip to `true` when ready to
// re-expose the nav link, home-page section, contact dropdown option, and route.
export const STRATEGIC_TRIAGE_ENABLED = false;

// Insights articles (/insights). Approved 2026-06-12 (Hannah, for Alex's
// byline) and live. The flag gates the routes, prerender entries, and footer
// link; sitemap.xml + llms.txt entries are maintained by hand alongside it.
export const INSIGHTS_ENABLED = true;

// UK sector security reports (/reports). OFF until Hannah/Alex sign off the
// written report + any named-org list. Flipping on exposes routes, prerender
// entries, and the footer link; also add the URL to public/sitemap.xml +
// public/llms.txt at flip time. See the flip checklist in
// docs/superpowers/plans/2026-06-12-uk-housing-email-security-report.md.
export const REPORTS_ENABLED = true;
