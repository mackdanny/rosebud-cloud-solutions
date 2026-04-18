export interface CaseStudyDetail {
  clientSummary: {
    organisationSize: string;
    rcsRole: string;
    microsoftPlatform: string[];
  };
  challenge: string[];
  approach: {
    intro: string;
    elementsHeading?: string;
    elements: string[];
    closing?: string;
  };
  outcome: {
    intro: string;
    bullets: string[];
    closing?: string;
  };
  deliveryImpact?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  icon: string;
  image: string;
  description: string;
  detail: CaseStudyDetail;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'azure-platform-financial-services',
    title: 'Secure-by-Design Azure Platform for Tier-1 Financial Institution',
    industry: 'Financial Services (Tier-1)',
    icon: 'account_balance',
    image: 'case-study-01.webp',
    description:
      'Delivering a greenfield Azure platform under strict regulatory constraints. RCS embedded DevSecOps practices, automated policy enforcement, and Microsoft security baselines from day one.',
    detail: {
      clientSummary: {
        organisationSize: '1,500–2,000 employees',
        rcsRole: 'DevSecOps Delivery Lead',
        microsoftPlatform: ['Azure', 'Terraform', 'Azure Security Baseline', 'SIEM Integration'],
      },
      challenge: [
        'A Tier-1 financial institution needed a greenfield Azure platform built under strict regulatory and risk constraints. The organisation required that security, compliance, and operational governance needed to be embedded from day one. Retrofitting controls post-deployment was unacceptable in this highly regulated environment.',
        'The institution sought a secure foundation enabling product and engineering teams to move quickly without increasing risk exposure.',
      ],
      approach: {
        intro:
          'RCS designed and delivered a fully automated Azure platform aligned to the Microsoft Cloud Adoption Framework and Azure security best practices.',
        elementsHeading: 'Key elements included:',
        elements: [
          'Infrastructure-as-Code using Terraform for repeatable, auditable deployments',
          'Shift-left DevSecOps approach embedding security controls early in the lifecycle',
          'Integration of SIEM and cloud-native security tooling for continuous monitoring',
          'Codified policy enforcement to prevent configuration drift',
          'Role-based access controls aligned to least-privilege principles',
        ],
        closing:
          'Security controls were designed directly into the platform architecture rather than layered on afterward.',
      },
      outcome: {
        intro: 'The institution launched a secure, governed Azure platform delivering:',
        bullets: [
          'Security embedded into every deployment',
          'Reduced configuration drift through automation',
          'Improved audit readiness and operational visibility',
          'Faster delivery cycles without compromising regulatory posture',
        ],
        closing:
          'The result was a scalable Azure foundation supporting long-term growth under strict compliance requirements.',
      },
    },
  },
  {
    slug: 'hybrid-identity-public-sector',
    title: 'Secure Hybrid Identity for UK Public Sector Regulator',
    industry: 'Public Sector (Regulatory)',
    icon: 'badge',
    image: 'case-study-02.webp',
    description:
      'Modernising legacy Active Directory into a secure, governed Azure identity platform aligned to Microsoft security best practice. RCS embedded RBAC, automation, and resilience controls to strengthen audit readiness and reduce operational risk.',
    detail: {
      clientSummary: {
        organisationSize: '>1,000 employees',
        rcsRole: 'Cloud Identity & Security Partner',
        microsoftPlatform: [
          'Azure Active Directory',
          'Azure AD Connect',
          'RBAC',
          'Azure Site Recovery',
          'Azure DevOps',
          'Terraform',
        ],
      },
      challenge: [
        'A UK regulatory body maintained legacy on-premises Active Directory and messaging systems requiring modernisation and secure Azure integration. The organisation faced stringent regulatory demands regarding identity governance, resilience, and auditability. Leadership needed strengthened access controls, operational transparency, and service continuity while preserving regulatory function stability. The core objective involved transforming identity infrastructure into a secure, governed hybrid platform capable of supporting long-term digital growth.',
      ],
      approach: {
        intro:
          'RCS restructured the on-premises Active Directory and extended identity services securely to Azure, establishing identity as a central source of truth with embedded governance and automation.',
        elementsHeading: 'Key implementation elements:',
        elements: [
          'Secure hybrid identity architecture design and deployment',
          'Role-Based Access Control models for users and service accounts',
          'Infrastructure-as-Code for domain controller and platform deployments',
          'Automated build and deployment pipelines using Azure DevOps and Terraform',
          'Backup, disaster recovery, and Azure Site Recovery integration',
          'Enhanced auditing and logging aligned to regulatory requirements',
        ],
      },
      outcome: {
        intro: 'The regulatory authority successfully transitioned to a modern, resilient hybrid identity platform:',
        bullets: [
          'Centralised and standardised identity management',
          'Strengthened access control and least-privilege enforcement',
          'Improved audit readiness and traceability',
          'Enhanced resilience through automated recovery capabilities',
          'Reduced operational risk through codified infrastructure',
        ],
      },
      deliveryImpact: [
        'Hybrid identity platform standardisation across environments',
        'Automated infrastructure deployment for domain services',
        'Strengthened audit and compliance posture',
        'Improved resilience through integrated disaster recovery',
      ],
    },
  },
  {
    slug: 'azure-virtual-desktop-public-sector',
    title: 'Secure Azure Virtual Desktop Platform for Public Sector',
    industry: 'Public Sector',
    icon: 'desktop_windows',
    image: 'case-study-03.webp',
    description:
      'Designing and delivering a centrally governed Azure Virtual Desktop (AVD) environment to support a distributed workforce. Automation and embedded identity controls ensured secure, scalable operations aligned to Microsoft best practices.',
    detail: {
      clientSummary: {
        organisationSize: '~2,000 employees',
        rcsRole: 'Azure DevOps & Workplace Platform Partner',
        microsoftPlatform: [
          'Azure Virtual Desktop (AVD)',
          'Azure AD',
          'Azure DevOps',
          'RBAC',
          'Infrastructure-as-Code',
        ],
      },
      challenge: [
        'A public sector organisation sought a secure, centrally managed virtual desktop solution for their distributed workforce. The context required strong governance, identity control, and long-term operability due to environmental sensitivity. They needed scalability without manual configuration overhead and aimed to deliver a modern Azure Virtual Desktop environment without introducing configuration drift or governance gaps.',
      ],
      approach: {
        intro:
          'RCS created an AVD platform emphasising automation and embedded governance. The design prioritised repeatability, centralised management, and integrated security controls.',
        elementsHeading: 'Key components included:',
        elements: [
          'Infrastructure-as-Code deployment for AVD host pools and networking',
          'Automated image pipelines ensuring consistent desktop builds',
          'Identity and access controls based on least-privilege principles',
          'Centralised governance controls preventing configuration drift',
          'Operational monitoring integrated into the Azure environment',
        ],
        closing:
          'The team embedded security as an overlay by integrating governance directly into platform design rather than adding it afterward.',
      },
      outcome: {
        intro:
          'The organisation deployed a secure, scalable virtual desktop environment supporting their distributed workforce effectively:',
        bullets: [
          'Reduced manual desktop configuration effort',
          'Improved governance and access control visibility',
          'Increased consistency across desktop environments',
          'Scalable infrastructure aligned to Microsoft best practice',
        ],
      },
      deliveryImpact: [
        'Automated AVD infrastructure deployment model',
        'Standardised desktop image management across environments',
        'Reduced configuration drift through codified controls',
        'Strengthened access governance for remote workforce',
      ],
    },
  },
  {
    slug: 'azure-landing-zone-retail',
    title: 'Enterprise Azure Landing Zone for Global Retailer',
    industry: 'Retail (Global Operations)',
    icon: 'storefront',
    image: 'case-study-04.webp',
    description:
      'Building a standardised Azure landing zone architecture across multiple regions. RCS implemented Infrastructure-as-Code and Microsoft-aligned governance controls to enable secure, consistent cloud adoption at enterprise scale.',
    detail: {
      clientSummary: {
        organisationSize: '15,000+ employees',
        rcsRole: 'Senior Azure & DevOps Delivery Partner',
        microsoftPlatform: [
          'Azure Landing Zones',
          'Azure Management Groups',
          'Azure Policy',
          'Terraform',
          'Azure DevOps',
        ],
      },
      challenge: [
        'A worldwide retail company faced the complex task of transferring thousands of servers to Azure across multiple geographic regions. The organisation grappled with inconsistent governance frameworks and security protocols across different business units, resulting in operational fragmentation, architectural inconsistency, and heightened migration risks.',
        'The company needed a unified, enterprise-level Azure landing zone capable of operating at global scale while ensuring consistent governance, regulatory visibility, and security standards.',
      ],
      approach: {
        intro:
          'RCS facilitated joint discovery and design sessions to document business, security, and operational needs spanning multiple regions. This collaborative process produced a standardised enterprise Azure landing zone architecture aligned with Microsoft Cloud Adoption Framework guidelines.',
        elementsHeading: 'Core implementation components:',
        elements: [
          'Structured Azure Management Group hierarchy design',
          'Azure Policy framework codified for uniform governance compliance',
          'Infrastructure-as-Code deployment pipelines leveraging Terraform',
          'Network segmentation coupled with integrated security controls',
          'Template-driven deployment models ensuring regional consistency',
        ],
        closing:
          'Governance and security mechanisms were integrated into the platform\u2019s foundational layer rather than layered afterward.',
      },
      outcome: {
        intro: 'The organisation built a controlled Azure platform supporting large-scale retail operations worldwide.',
        bullets: [
          'Enhanced consistency in regional operations',
          'Unified governance and policy application',
          'Improved security posture transparency',
          'Minimised architectural inconsistency throughout cloud adoption',
          'Dependable infrastructure supporting future digital growth',
        ],
        closing:
          'This implementation delivered an integrated, enterprise-calibre Azure foundation designed for sustained expansion without compromising security or operational efficiency.',
      },
      deliveryImpact: [
        'Landing zone architecture standardised across global regions',
        'Policy controls implemented through Infrastructure-as-Code methodology',
        'Configuration inconsistency reduced across organisational units',
        'Enterprise-wide governance transparency strengthened',
      ],
    },
  },
  {
    slug: 'azure-governance-financial-services',
    title: 'Azure Governance & Security Foundations for Financial Services',
    industry: 'Financial Services',
    icon: 'policy',
    image: 'case-study-05.webp',
    description:
      'Redesigning Azure governance architecture to support safe cloud growth. Management group structures, policy frameworks, and security controls were codified using Terraform to improve audit readiness and reduce manual intervention.',
    detail: {
      clientSummary: {
        organisationSize: '~3,000 employees',
        rcsRole: 'Azure Governance & Platform Architecture Partner',
        microsoftPlatform: [
          'Azure Management Groups',
          'Azure Policy',
          'Terraform',
          'Azure Security Baseline',
          'RBAC',
        ],
      },
      challenge: [
        'A global financial services organisation experienced rapid Azure expansion without established governance structures. The organisation faced inconsistent management groups, varying policy enforcement across environments, and uncodified security controls. As cloud adoption accelerated, operational risk and configuration drift became pressing concerns.',
        'The organisation needed a structured governance model aligned to Microsoft best practice, one that could support secure growth without slowing delivery.',
      ],
      approach: {
        intro:
          'RCS performed a governance maturity assessment and redesigned the platform control structure comprehensively. The engagement emphasised establishing clear hierarchy, enforceable policy frameworks, and repeatable deployment standards.',
        elementsHeading: 'Key elements included:',
        elements: [
          'Design and implementation of a structured Azure Management Group hierarchy',
          'Codified Azure Policy definitions aligned to regulatory and security requirements',
          'Infrastructure-as-Code using Terraform for policy and platform deployment',
          'Standardised RBAC models aligned to least-privilege principles',
          'Automated compliance validation and configuration monitoring',
        ],
      },
      outcome: {
        intro: 'The organisation established a formalised governance foundation capable of supporting secure cloud growth with:',
        bullets: [
          'Consistent policy enforcement across environments',
          'Reduced configuration drift through codified controls',
          'Improved audit readiness and compliance visibility',
          'Clear separation of duties through structured RBAC models',
          'Stronger alignment to Microsoft security benchmarks',
        ],
      },
      deliveryImpact: [
        'Structured management hierarchy implemented across Azure estate',
        'Policy framework codified through Infrastructure-as-Code',
        'Reduced manual security intervention',
        'Improved governance transparency at executive level',
      ],
    },
  },
  {
    slug: 'azure-data-platform-legal',
    title: 'Secure Azure Data Platform for Sensitive Analytics Workloads',
    industry: 'Legal / Professional Services',
    icon: 'database',
    image: 'case-study-06.webp',
    description:
      'Designing a fully private Azure data platform for sensitive analytics environments. Network topology, security controls, and deployment pipelines were codified to align with CIS benchmarks and Microsoft security standards.',
    detail: {
      clientSummary: {
        organisationSize: '~1,900 employees',
        rcsRole: 'Cloud & Security Delivery Partner',
        microsoftPlatform: ['Azure', 'Bicep', 'Azure DevOps', 'Azure Security Baseline', 'CIS Benchmarks'],
      },
      challenge: [
        'A professional services firm required hosting sensitive analytics workloads in Azure with stringent security and compliance requirements. The organisation faced constraints prohibiting public network access while needing alignment with established security frameworks from initial deployment. The platform demanded a secure analytics environment that would maintain confidentiality and performance without sacrificing long-term operational sustainability.',
      ],
      approach: {
        intro:
          'RCS implemented a fully private Azure data platform leveraging secure-by-design principles.',
        elementsHeading: 'Key architectural components included:',
        elements: [
          'Codified network topology using Bicep and Azure DevOps pipelines',
          'Private connectivity and segmented network architecture',
          'Infrastructure-as-Code ensuring repeatable deployments across environments',
          'Alignment to CIS benchmarks and Azure Security Baseline',
          'Automated policy enforcement and configuration validation',
        ],
        closing: 'Security controls were engineered into the deployment model rather than applied retroactively.',
      },
      outcome: {
        intro: 'The organisation deployed a fully private, compliant Azure data platform with embedded security controls:',
        bullets: [
          'Consistent and repeatable deployments across development, test, and production environments',
          'Improved audit confidence through codified control enforcement',
          'Significantly reduced manual security intervention',
          'Secure foundation supporting advanced analytics expansion',
        ],
      },
      deliveryImpact: [
        '100% Infrastructure-as-Code deployment model',
        'CIS-aligned security baseline across environments',
        'Private connectivity enforced across all data workloads',
        'Reduced configuration drift through automated validation',
      ],
    },
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
