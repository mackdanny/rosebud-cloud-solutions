import { caseStudies } from '../src/data/caseStudies';

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
    '/tools/strategic-triage',
    '/about',
    '/how-we-work',
    '/contact',
    '/case-studies',
    '/faq',
    // Designed 404 page — hosting platform should serve this file for unknown paths.
    // E.g. Netlify: `/* /404.html 404`; Vercel: `rewrites: [{ source: '/(.*)', destination: '/404.html', statusCode: 404 }]`
    '/404',
  ];
  const caseStudyUrls = caseStudies.map((cs) => `/case-studies/${cs.slug}`);
  return [...staticUrls, ...caseStudyUrls];
}
