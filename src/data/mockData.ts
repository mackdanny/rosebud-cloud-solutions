// ─── Home Page ───────────────────────────────────────────────────────────────

export const heroContent = {
  eyebrow: 'Established Enterprise Architecture',
  headline: ['CLOUD, AI &', 'AUTOMATION', 'DESIGNED TO MAKE', 'YOUR BUSINESS', 'RUN BETTER'],
  gradientWord: 'AUTOMATION',
  cta: 'Get in Touch',
  body: 'We architect resilient infrastructure that bridges the gap between legacy complexity and cloud-native agility.',
};

export const certifications = [
  { src: '/cert-01.webp', alt: 'Microsoft Certified: Azure Solutions Architect Expert' },
  { src: '/cert-02.webp', alt: 'Microsoft Certified: DevOps Engineer Expert' },
  { src: '/cert-03.webp', alt: 'Microsoft Certified: Azure Administrator Associate' },
  { src: '/cert-04.webp', alt: 'Microsoft Certified: Azure Virtual Desktop Specialty' },
  { src: '/cert-05.webp', alt: 'Microsoft Certified: Azure AI Engineer Associate' },
  { src: '/cert-06.webp', alt: 'Microsoft Certified: Azure Network Engineer Associate' },
];

export const services = [
  {
    id: 'cloud-infrastructure',
    icon: 'cloud_done',
    title: 'Cloud & Infrastructure',
    description:
      'Resilient, highly-available architectures tailored for the demands of global enterprise. Expert Azure migrations and secure hybrid-cloud lifecycle management.',
    bgIcon: 'hub',
    colSpan: 8,
    variant: 'surface' as const,
  },
  {
    id: 'ai-automation',
    icon: 'analytics',
    title: 'AI & Automation',
    description: 'Implementing governed AI workflows and intelligent process automation that drives measurable ROI.',
    bullets: ['Enterprise LLM', 'Workflow Integrity', 'Data Governance'],
    colSpan: 4,
    variant: 'surface-variant' as const,
  },
  {
    id: 'managed-advisory',
    icon: 'security',
    title: 'Managed Advisory',
    description:
      'Proactive governance, security audits, and architectural continuity to ensure your systems evolve with your business.',
    colSpan: 4,
    variant: 'surface' as const,
  },
];

export const certBadges = [
  {
    alt: 'Azure Badge',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKYgF9O7GNuuzwzZLNxRDxrzIRSk1BGVDfn0TaYBsUW9TESkL6fYUsFhC3TZ4q7CUTzlgEe8rmgfbGiKMqo_MjNT8fmVWpEyS0tTCi0eGrI5Dk_OEUCd2eBPnPlUaox0w5kVgUoNR7DLyl36X1LArYrv8-UKsEp0iWULf8k4TwHrvPFr96f5fllF6B1j_dEXXhuBTrzTuAPDNOelWEtunAB3FVhMTGIlchukeHNBQfkAJplvRZfcH0P0xOPsNnM8JgXy0-UZ93OVWz',
  },
  {
    alt: 'Solutions Architect Badge',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM1Ly7bSjLj4-QU_WE9fBoHkagrTkZIQjqc8XfYjbp-S0jdXsR-EKbuInHy5bQ5eQd8IZao7bofezUZ1I3WDrP_gIT319zanln17YYftw7TwXeTpjOgqYcQkf-wFxu4D6ktggtr-XqGoMgXNA51G_uVhsWPowmtyp5xSIockMPeQQb_rtywQbZfOuDq5Q0riKX5pveBXjkA62CDWO0H-GJAJzk3QICA4opEzI3wSoo59NBGBwrsk4WZt2fPHw_hIm8aBFC1iUnrOdc',
  },
];

// ─── Azure Landing Zones Page ─────────────────────────────────────────────────

export const azureHero = {
  eyebrow: 'Azure Infrastructure',
  title: 'Azure Foundation &',
  titleAccent: 'Landing Zones',
  subtitle:
    'Build a secure, scalable Azure environment designed for long-term growth. We architect the core pillars of your cloud journey.',
  cta: 'Get Started',
  bgImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC9aJE50M4p_v6TJWwWcSO4XXdUGSVLYItrVOZmSZROMedYuds3m3p1yxy7kaPx0O1nUa8JQOOyqHFu0wyBbC_V4QYselKmQ-z7gW4IOKL7Lydi07tVrtwLgLfUAmFNZ0GLQp8VAcG4rP1IyHNCYe9RGl2H1uB9ErLz4GSy_dwt0JFePRBoKlQczmSbDMYBlBu5xY-LfOZoV_kbzqC-84mFnWyEAztXy6dJ_uF_fQxcBCGwHbxtVJawIA1HMweVBrRHPjQN4TXh-zVH',
};

export const azureOverview = {
  eyebrow: 'Strategic Architecture',
  title: 'Precision-Engineered Frameworks',
  body1:
    'A Landing Zone is not just a container; it\'s the operational heart of your Azure ecosystem. We design and implement tailored environments that align with the Microsoft Cloud Adoption Framework (CAF), ensuring your organisation can deploy workloads with confidence, security, and velocity.',
  body2:
    'By establishing guardrails early, we eliminate technical debt and provide a repeatable pattern for scaling from one application to an entire enterprise portfolio.',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBMH1Y5v6DgUES11qEouC-M_nD9L-9CKIN9Uzje8KET6pOqgLn_52J_eVubzls1ALVJQmPCoVaI1lpk-E4ED6U-wWuvGjk_OcHtwOXJDa9t9OrhjjBQdVcOElizwlSfBUT1hg2ouhPpJwDKeVjfCVd7sXyhytMZJ32KzQPOuuU8HKW0m3gNrv1P_ty3JX3NZ-5vVz1vvLUoyCsMm-h0HtHY40bWw33nxG8FvTAByirXawHnlssX7RYheH2APGB41L3yVhKLXDQLpMGn',
};

export const azureDeliverables = [
  { icon: 'architecture', title: 'Azure Landing Zone Architecture', description: 'Full conceptual and logical design aligned with the Well-Architected Framework and Microsoft CAF standards.' },
  { icon: 'security', title: 'Governance & Policy Design', description: 'Management Group hierarchy and custom Azure Policy implementation to enforce compliance and cost control automatically.' },
  { icon: 'fingerprint', title: 'Identity (RBAC & Entra ID)', description: 'Granular access control structures and managed identity strategies to secure every interaction within your tenant.' },
  { icon: 'hub', title: 'Network Architecture', description: 'Hub-and-spoke topologies with Azure Firewall, WAF, and private link integration for hardened perimeter security.' },
  { icon: 'code', title: 'Infrastructure as Code', description: 'Automated provisioning using Bicep or Terraform to ensure environment consistency and rapid disaster recovery.' },
  { icon: 'shield_with_heart', title: 'Secure Configuration', description: 'Hardened baseline configurations for storage, compute, and databases, following the principle of least privilege.' },
];

export const azureImpact = {
  title: 'Accelerate with',
  titleAccent: 'Confidence',
  body1: 'Many Azure environments are built quickly without proper structure, leading to security gaps, inconsistent deployments, and operational complexity.',
  body2: 'We establish a clear, well-architected foundation that enables your organisation to scale confidently. By embedding governance, security, and automation from the outset, your cloud environment remains controlled, efficient, and aligned with best practices as it grows.',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf8Bhdy6VVOSUT4dTau2cVPcPlmS3Hnw0KM3zWMHQFG6TsxbGVGb0yTDQ6Sc-MD23UA_w2-m45KUZgA_2yzsFNBwlgM2x-B8Cz66cZtIdeneOfSDQ2Sdbz26IPY8-hi76_cEy6pAvybUrfUBZwC8uQk6rPAPE1Qc7v4nIpZi6yw5JVQVIq_QGOr9ZNXHSiaI705-Xn82pHZcw33pEJRcYrss4HYiX6nm0JKEjHCaGuuNSdusvgvTvTTQKTAO1rFTStRslymp1tTOST',
  benefits: [
    { icon: 'trending_up', title: 'Faster Time to Market', description: 'Provision new environments in minutes, not weeks.' },
    { icon: 'verified_user', title: 'Compliant by Design', description: 'Governance is baked into the foundation, ensuring continuous compliance.' },
    { icon: 'payments', title: 'Predictable Costs', description: 'Tagging and budget policies prevent cloud spend from spiraling out of control.' },
  ],
};

export const azureUseCases = [
  { title: 'New Azure Setup', description: 'Starting fresh with best practices from day one.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZxmh_rwb9QhWuywZCNFQhonAJMyxc6ClzVLwWqvjcTUD9_gIRxCSKJvWJoIBGHbUZd17CFwwQ-xNDy2gK1VGD5q4r2TQ6CY_LHO4xA8mh5HnkXTruWr3aEOEIhS4WtNSDGgb-1e7jbQ54Je0jrB0cAjHgHK29PxuYCQ2rGlEqWmnXpZYB5f65ok-RoizBmEnTq_6ZZVMqrFXSXCUGpUMwyZQJjSwAhH49kzC91Q7udF5M5HTRNE4_fSSA9AMNU-BoyHlOdUlIR8eR' },
  { title: 'Tenant Restructuring', description: 'Cleaning up technical debt and organising complex resources.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUmVss6YhmHAeZTnY9tgdGjeKObuOdVoKo-eu1QZIw5FbIQCVJha8iAXCpXQhJweMLYRa8CKfmHNDePS_F5f_9H0LxkQ4KCcL7wl2Hy4OtlD1CeEugzv2Pz5E6Oiqyp3WMyo8DdKxLtHdbUEcbKP14Ej8fFJDMXvZxgamz3gSd1wjKrhRjaQkWM4KJ5vfFLvgz-r86xEFicXr04J487MCjN62PsnWKF1RAWXJ14h0t4AaxSf459xLuFgL5rPesoBHCbHuBgnwZIHZB' },
  { title: 'IaC Adoption', description: 'Transitioning from manual clicks to automated pipelines.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKTafSUmVnKw5KVoye-4KYVStxoL0idGrcSauvf5YYg5NQai-tNd3bCEL7Vpt5dzu9j3OK3ejr0xj9eEkewZTrD9UuuzzedfUfgHtq-b_Ugcc6Dnr8b193M0OUfnSFf1OoOBj4RB02s66TYtwgWupnq4Xsyaf75itp0H4Shu1DFzsJbflUVTCo_tKhch0LubuS3lHb0jxTm_viftP3n1iTedvg8BLTkcrY3fYz7semjcF2gn5JoP_WbTFQJvz9CLEOVO6OTDjcX-d1' },
  { title: 'Enterprise Cloud Adoption', description: 'Scaling operations for multi-business unit management.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWzsJEMY_tMcgRhpvoarbT9ZfhbqkqebbUDnmpE371QHTZmkkGB__IWNHj3zqfeqmKKSbnnc36FuNcecAdgQiuWumA3HmpgRwwJRY7phbJjIFbwxmn_0J5e_ihoCpkpsGljpa2Xd09Jlc_DyTp1F_uuUQjbuLJpqZ4_xpIX9mE8y1zawdn46RxPbQC_T5KOCU17haH7VcKtpPJ1uJflQVKmBBO_nUfnKMBHSEkJxVeNMD_-H2eshnYtyHaYvYIaOGA2EYw8QLU55PE' },
  { title: 'Governance & Policy', description: 'Enforcing strict industry compliance and data sovereignty.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn8VpVY2N1J0hHE3GcjlUHMecjzShQLBTq7MMVBs5URGwrTzygfT-D6pwh9r7EAXMnfee8gmGdAN0MClkhYG__AJivqsZcfxlTCRWCD4giBMmERVsq7NU1-fbENieETpMtRsM136pMrh05aOUZ8VeDBpIFL3Xv6QpveppcfCda8EqUcGbqvh36MaqsuQSrvjpzIdXnHdlZj3hJBEJegPqvJz-uxAlGAh-IE-PPZg' },
  { title: 'Secure Network Design', description: 'Architecting Zero Trust networks for enterprise workloads.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABr4cXmF7CLYWKPWDY7TFkCYtoAiMlsNHvH14riMViHxjhrINvv2MkHkkJ7vsDfsm0EIghKKpoQ3u1Qee9_wz8oUI_C_6AsODDJrAKW9T25VLQ47Ittu6albmbyHOi0iwjaHSTcp8d0jAar3rdlRzFfYLNguzw7ERMJvzlGT_EZRejvkP9HtiUm9tQ7W1wFR9zf0RLXhte3YN8cJkgE4kQbIjZYB7ZdeN1Hh4wNesjnKCbP5LTcaP4jgKA3FznBImSA0HTbIOMDpsp' },
];
