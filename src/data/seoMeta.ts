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
      'Enterprise Azure architecture, cloud security, DevSecOps, and managed cloud services. Microsoft-certified UK consultancy for regulated industries.',
    path: '/',
  },
  securityCheck: {
    title: 'Free Security Check | Scan Your Domain',
    description:
      'Run a free external security scan of your domain in seconds. See your email, web and exposure risks from an attacker point of view. No install, no access to your systems.',
    path: '/security-check',
  },
  azureLandingZones: {
    title: 'Azure Landing Zones & Foundation Architecture',
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
    title: 'Azure Advisory & Consulting Services',
    description:
      'Strategic Azure advisory for cloud adoption, architecture, and modernisation. Independent guidance from Microsoft-certified enterprise architects.',
    path: '/services/advisory-consulting',
  },
  managedCloud: {
    title: 'Managed Cloud & Security Support',
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
    title: 'About Rosebud Cloud Solutions',
    description:
      'Microsoft-certified Azure architects delivering secure, scalable cloud platforms for financial services, public sector, legal, and retail clients.',
    path: '/about',
  },
  howWeWork: {
    title: 'How We Work | Secure-by-Design Delivery',
    description:
      'A structured, security-first approach to designing, building, and managing Azure environments that scale properly from day one.',
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
  logo: `${SITE_URL}/rcs-logo-full.png`,
  image: `${SITE_URL}/rcs-og-card.png`,
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
    name: args.name,
    description: args.description,
    url: `${SITE_URL}${args.path}`,
    serviceType: args.serviceType,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: 'United Kingdom',
  };
}

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
