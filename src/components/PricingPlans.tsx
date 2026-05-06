import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Plan {
  icon: string;
  title: string;
  subtitle: string;
  engagement: string;       // shown where the price used to be
  features: string[];
  cta: string;
  ctaLink: string;
}

const plans: Plan[] = [
  {
    icon: 'search',
    title: 'Cloud Readiness Assessment',
    subtitle: 'Discovery-led engagement to scope your Azure environment',
    engagement: 'Fixed-price project',
    features: [
      'Workshop & discovery sessions',
      'Limitations & blockers analysis',
      'Written report & recommendations',
      'Right-sized to your headcount',
      'Pre-cursor to Landing Zone work',
    ],
    cta: 'Get a Quote',
    ctaLink: '/contact?service=cloud-readiness-assessment',
  },
  {
    icon: 'architecture',
    title: 'Azure Landing Zone Deployment',
    subtitle: 'Four-stage project: Assess, Design, Deploy, Adopt',
    engagement: 'Milestone-based, +30 days net',
    features: [
      'Microsoft-native Infrastructure as Code',
      'Governance & policy framework',
      'RBAC, security & compliance baselines',
      'Adoption support & handover',
      'Cyber Essentials–aligned operations',
    ],
    cta: 'Get a Quote',
    ctaLink: '/contact?service=azure-landing-zones',
  },
  {
    icon: 'star',
    title: 'Managed Azure Cloud',
    subtitle: 'Fixed monthly Azure platform management',
    engagement: 'Monthly subscription',
    features: [
      'Senior Azure engineers (SFIA 4/5)',
      'Monitoring & incident response',
      'Security, RBAC & policy governance',
      'Backup & DR oversight',
      'Defined P1/P2 SLA response',
    ],
    cta: 'Get a Quote',
    ctaLink: '/contact?service=managed-cloud',
  },
  {
    icon: 'grid_view',
    title: 'Enterprise (Large)',
    subtitle: '1,000+ headcount, multi-landing-zone estates',
    engagement: 'Scoped after Readiness Assessment',
    features: [
      'Named Technical Design Authority',
      'Architecture roadmap planning',
      'Priority change delivery',
      'Quarterly executive reviews',
      '15-min P1 SLA response',
    ],
    cta: 'Get a Quote',
    ctaLink: '/contact?service=managed-cloud&tier=large',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const PricingPlans: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
    >
      {plans.map((plan, i) => {
        const isHovered = hovered === i;
        return (
          <motion.div
            key={plan.title}
            variants={cardVariants}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered((h) => (h === i ? null : h))}
            className={`
              relative flex flex-col bg-surface rounded-2xl overflow-hidden
              border transition-[border-color,box-shadow] duration-300
              ${isHovered
                ? 'border-primary shadow-[0_0_30px_-5px_rgba(160,0,181,0.35)]'
                : 'border-outline/60'}
            `}
          >
            <div className="p-8 flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 rounded-full border border-primary/25 bg-primary/15 flex items-center justify-center mb-6">
                <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.6rem' }}>
                  {plan.icon}
                </span>
              </div>

              <h3 className="font-headline text-xl font-bold mb-1 min-h-[3.5rem] flex items-center">{plan.title}</h3>
              <p className="text-on-surface-variant text-sm mb-6 min-h-[3rem]">{plan.subtitle}</p>

              <div className="mb-8">
                <p className="text-on-surface-variant text-xs">{plan.engagement}</p>
              </div>

              <ul className="space-y-3 text-left w-full mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span aria-hidden="true" className="material-symbols-outlined shrink-0 mt-0.5 text-primary" style={{ fontSize: '1.1rem' }}>
                      check_circle
                    </span>
                    <span className="text-on-surface-variant">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto w-full">
                <Link to={plan.ctaLink} className="no-underline block">
                  <motion.button
                    className="relative w-full py-3.5 rounded-lg font-headline font-bold text-sm tracking-tight overflow-hidden border border-transparent btn-animated text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
