import { caseStudies } from '../src/data/caseStudies';
import { articles } from '../src/data/articles';
import { housing2026 } from '../src/data/reports/housing-2026';
import { INSIGHTS_ENABLED, REPORTS_ENABLED } from '../src/config/features';

export function onBeforePrerenderStart() {
  const staticUrls = [
    '/',
    '/security-check',
    '/services/azure-landing-zones',
    '/services/cloud-security',
    '/services/devsecops',
    '/services/cloud-optimisation',
    '/services/advisory-consulting',
    '/services/managed-cloud',
    '/services/email-security',
    // '/tools/strategic-triage' intentionally NOT prerendered while the feature
    // flag is off — with the route disabled it would prerender the 404 page.
    // Re-add when STRATEGIC_TRIAGE_ENABLED flips back on.
    '/about',
    '/how-we-work',
    '/contact',
    '/case-studies',
    '/faq',
    '/privacy',
    // Designed 404 page — hosting platform should serve this file for unknown paths.
    // E.g. Netlify: `/* /404.html 404`; Vercel: `rewrites: [{ source: '/(.*)', destination: '/404.html', statusCode: 404 }]`
    '/404',
  ];
  const caseStudyUrls = caseStudies.map((cs) => `/case-studies/${cs.slug}`);
  // Insights are prerendered only when the feature flag exposes the routes;
  // prerendering them while the flag is off would emit pages the app 404s on.
  const insightUrls = INSIGHTS_ENABLED
    ? ['/insights', ...articles.map((a) => `/insights/${a.slug}`)]
    : [];
  const reportUrls = REPORTS_ENABLED ? [`/reports/${housing2026.slug}`] : [];
  return [...staticUrls, ...caseStudyUrls, ...insightUrls, ...reportUrls];
}
