import { SITE_URL, SITE_NAME } from '../config/site';

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly path: string;
}

// All descriptions kept ≤155 chars to avoid SERP truncation on mobile Google.
export const pageMeta = {
  home: {
    title: `${SITE_NAME} | Enterprise Azure & Cloud Security`,
    description:
      'Azure architecture, cloud security and DevSecOps from a Microsoft-certified UK consultancy, serving financial services, public sector and legal.',
    path: '/',
  },
  securityCheck: {
    title: 'Free Domain Security Check | SPF, DKIM & DMARC Scanner',
    description:
      "Check your domain's SPF, DKIM, DMARC, TLS and exposed services in seconds. A free external security scan from a UK Microsoft-certified consultancy.",
    path: '/security-check',
  },
  azureLandingZones: {
    title: 'Azure Landing Zone Consultancy UK',
    description:
      'Structured Azure landing zones delivering control, security, and scalability from day one. Management groups, policy, and IaC by certified architects.',
    path: '/services/azure-landing-zones',
  },
  cloudSecurity: {
    title: 'Azure Cloud Security & Compliance',
    description:
      'Identify cloud security gaps and align Azure to recognised standards. Zero-trust architecture, Microsoft Defender, and continuous compliance monitoring.',
    path: '/services/cloud-security',
  },
  devSecOps: {
    title: 'DevSecOps Consulting for Azure',
    description:
      'Embed security into Azure DevOps and GitHub Actions pipelines - automated policy enforcement, secret management, and vulnerability scanning.',
    path: '/services/devsecops',
  },
  cloudOptimisation: {
    title: 'Azure Cloud Optimisation & FinOps',
    description:
      'Reduce Azure spend and improve performance through architectural review, FinOps, and automation. Measurable cost cuts without compromising reliability.',
    path: '/services/cloud-optimisation',
  },
  advisoryConsulting: {
    title: 'Independent Azure Consulting UK',
    description:
      'Strategic Azure advisory for cloud adoption, architecture, and modernisation. Independent guidance from Microsoft-certified enterprise architects.',
    path: '/services/advisory-consulting',
  },
  managedCloud: {
    title: 'Managed Azure Services UK',
    description:
      'Ongoing management, monitoring, and improvement to keep Azure secure, compliant, and performing. Proactive operations with enterprise-grade SLAs.',
    path: '/services/managed-cloud',
  },
  // Retained while STRATEGIC_TRIAGE_ENABLED = false (see src/config/features.ts).
  // Flipping the flag re-exposes the route + nav; this meta is ready to go.
  strategicTriage: {
    title: 'Strategic Triage Engine | Graph & Ontology Reasoning Platform',
    description:
      'Compress the evaluation tax from months to minutes. A graph and ontology reasoning platform for operationalising board-level intent at scale.',
    path: '/tools/strategic-triage',
  },
  about: {
    title: 'About Us | Azure Consultancy UK',
    description:
      'Microsoft-certified Azure architects delivering secure, scalable cloud platforms for financial services, public sector, legal, and retail clients.',
    path: '/about',
  },
  howWeWork: {
    title: 'How We Work | Secure-by-Design Delivery',
    description:
      'See how RCS designs, builds, and manages Azure environments to a security-first standard, from initial assessment through to ongoing operations.',
    path: '/how-we-work',
  },
  contact: {
    title: 'Contact Rosebud Cloud Solutions',
    description:
      'Start a consultation to discuss your Azure architecture, cloud security, DevSecOps, or managed services needs with a Microsoft-certified team.',
    path: '/contact',
  },
  caseStudies: {
    title: 'Azure & Cloud Case Studies',
    description:
      'Real-world Azure platform, security, and governance engagements across financial services, public sector, legal, and retail - with measurable outcomes.',
    path: '/case-studies',
  },
  faq: {
    title: 'Frequently Asked Questions | Rosebud Cloud Solutions',
    description:
      'Answers on Azure landing zones, cloud security, DevSecOps, FinOps, and managed cloud - how Rosebud Cloud Solutions engages and delivers for clients.',
    path: '/faq',
  },
  privacy: {
    title: 'Privacy Policy | Rosebud Cloud Solutions',
    description:
      'How Rosebud Cloud Solutions collects, uses, and protects your personal data. UK GDPR compliant privacy policy for our website and services.',
    path: '/privacy',
  },
} as const satisfies Record<string, PageMeta>;

export const organisationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: `${SITE_URL}/rcs-logo-full.png`,
    contentUrl: `${SITE_URL}/rcs-logo-full.png`,
    caption: SITE_NAME,
  },
  image: `${SITE_URL}/rcs-og-card.png`,
  foundingDate: '2022',
  knowsAbout: [
    'Microsoft Azure',
    'Cloud Security',
    'Azure Landing Zones',
    'DevSecOps',
    'FinOps',
    'Email Security (SPF, DKIM, DMARC)',
    'Zero Trust Architecture',
    'Managed Cloud Services',
  ],
  description:
    'Enterprise Azure architecture, cloud security, DevSecOps, and managed cloud services. Microsoft-certified UK consultancy for regulated industries.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@rosebudcloudsolutions.co.uk',
    contactType: 'customer service',
    areaServed: 'GB',
    availableLanguage: ['en'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Worthing',
    addressRegion: 'West Sussex',
    addressCountry: 'GB',
  },
  sameAs: [
    'https://www.linkedin.com/company/rosebud-cloud-solutions-ltd/',
    'https://www.instagram.com/rosebudcloudsolutions/',
    'https://find-and-update.company-information.service.gov.uk/company/14500087',
  ],
  areaServed: 'United Kingdom',
  serviceType: [
    'Azure Landing Zones',
    'Cloud Security',
    'DevSecOps',
    'Cloud Optimisation',
    'Managed Cloud Services',
    'Advisory & Consulting',
  ],
} as const;

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-GB',
} as const;

export function breadcrumbSchema(items: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceSchema(args: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}${args.path}#service`,
    name: args.name,
    description: args.description,
    url: `${SITE_URL}${args.path}`,
    serviceType: args.serviceType,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: 'United Kingdom',
  };
}

// The free domain scanner on /security-check. WebApplication is the precise
// type for a browser-based interactive tool; it feeds AI/LLM tool discovery
// rather than a Google rich result panel.
export const securityCheckSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/security-check#tool`,
  name: 'Free Domain Security Check',
  description:
    'A free external domain security scanner that checks SPF, DKIM, DMARC, TLS certificates, HTTP security headers, and attacker-visible subdomains. No installation required. Results in around 15 seconds.',
  url: `${SITE_URL}/security-check`,
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  featureList: [
    'SPF record validation',
    'DKIM configuration check',
    'DMARC policy analysis',
    'TLS certificate inspection',
    'HTTP security header review',
    'Subdomain exposure check',
  ],
  provider: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-GB',
  isAccessibleForFree: true,
  browserRequirements: 'Requires JavaScript',
} as const;

// FAQ schema. Pass into <SEO schema={[...]}> on any page with visible FAQ copy -
// Google only shows rich results when on-page Q&A text matches. Answers may
// include markdown-style links [text](/path); they are stripped to plain text
// for the schema payload (the Faq component renders them as <Link>/<a>).
const MARKDOWN_LINK = /\[([^\]]+)\]\([^)]+\)/g;
const stripLinks = (s: string) => s.replace(MARKDOWN_LINK, '$1');

export function faqSchema(items: readonly { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: stripLinks(question),
      acceptedAnswer: { '@type': 'Answer', text: stripLinks(answer) },
    })),
  };
}
