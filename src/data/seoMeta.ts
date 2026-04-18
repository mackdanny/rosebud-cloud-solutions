import { SITE_URL, SITE_NAME } from '../config/site';

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly path: string;
}

export const pageMeta = {
  home: {
    title: `${SITE_NAME} | Enterprise Azure & Cloud Security`,
    description:
      'Rosebud Cloud Solutions — Enterprise Azure architecture, cloud security, DevSecOps, and managed cloud services. Microsoft-certified consultancy delivering secure, scalable infrastructure.',
    path: '/',
  },
  azureLandingZones: {
    title: 'Azure Landing Zones & Foundation Architecture',
    description:
      'Structured Azure landing zones that deliver control, security, and scalability from day one. Management groups, policy frameworks, and Infrastructure-as-Code by Microsoft-certified architects.',
    path: '/services/azure-landing-zones',
  },
  cloudSecurity: {
    title: 'Azure Cloud Security & Compliance',
    description:
      'Identify cloud security gaps and align your Azure platform to recognised security and compliance standards. Zero-trust architectures, Microsoft Defender, and continuous compliance monitoring.',
    path: '/services/cloud-security',
  },
  devSecOps: {
    title: 'DevSecOps Consulting for Azure',
    description:
      'Embed security into delivery pipelines with automated policy enforcement, secret management, and vulnerability scanning. DevSecOps for Azure DevOps and GitHub Actions.',
    path: '/services/devsecops',
  },
  cloudOptimisation: {
    title: 'Azure Cloud Optimisation & FinOps',
    description:
      'Reduce Azure spend and improve performance through architectural review, FinOps discipline, and automated optimisation. Measurable cost reductions without compromising reliability.',
    path: '/services/cloud-optimisation',
  },
  advisoryConsulting: {
    title: 'Azure Advisory & Consulting Services',
    description:
      'Strategic Azure advisory for cloud adoption, platform architecture, and modernisation. Independent guidance from Microsoft-certified architects with decades of enterprise delivery experience.',
    path: '/services/advisory-consulting',
  },
  managedCloud: {
    title: 'Managed Cloud & Security Support',
    description:
      'Ongoing management, monitoring, and improvement to keep your Azure platform secure, compliant, and performing. Proactive operations with enterprise-grade SLAs.',
    path: '/services/managed-cloud',
  },
  strategicTriage: {
    title: 'Strategic Triage Engine | Graph & Ontology Reasoning Platform',
    description:
      'Compress the evaluation tax from months to minutes. A graph and ontology reasoning platform for operationalising board-level intent with 80/20 automation and forensic signal capture.',
    path: '/tools/strategic-triage',
  },
  about: {
    title: 'About Rosebud Cloud Solutions',
    description:
      'Microsoft-certified Azure architects delivering secure, scalable cloud platforms for enterprise clients across financial services, public sector, legal, and retail.',
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
      'Start a consultation with Rosebud Cloud Solutions. Discuss your Azure architecture, cloud security, DevSecOps, or managed services needs with a Microsoft-certified consultancy.',
    path: '/contact',
  },
  caseStudies: {
    title: 'Azure & Cloud Case Studies',
    description:
      'Real-world Azure platform, security, and governance engagements across financial services, public sector, legal, and retail. How Rosebud Cloud Solutions delivers measurable outcomes.',
    path: '/case-studies',
  },
} as const satisfies Record<string, PageMeta>;

export const organisationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/rcs-logo-full.png`,
  image: `${SITE_URL}/rcs-logo-full.png`,
  description:
    'Enterprise Azure architecture, cloud security, DevSecOps, and managed cloud services. Microsoft-certified consultancy delivering secure, scalable infrastructure.',
  sameAs: [] as readonly string[],
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
