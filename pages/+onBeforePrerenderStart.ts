import { caseStudies } from '../src/data/caseStudies';

export function onBeforePrerenderStart() {
  const staticUrls = [
    '/',
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
  ];
  const caseStudyUrls = caseStudies.map((cs) => `/case-studies/${cs.slug}`);
  return [...staticUrls, ...caseStudyUrls];
}
