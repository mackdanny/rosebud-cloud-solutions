import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Faq } from '../components/Faq';
import { pageMeta, serviceSchema, breadcrumbSchema, faqSchema } from '../data/seoMeta';
import { faqs } from '../data/faqs';
import { TiltCard } from '../components/TiltCard';
import AnoAI from '../components/ui/animated-shader-background';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// ─── Scroll-triggered wrapper ─────────────────────────────────────────────────

const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={fadeUp}
    transition={{ duration: 0.7, delay: delay * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
  >
    {children}
  </motion.div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const deliverables = [
  {
    icon: 'architecture',
    title: 'Landing Zone Architecture & Deployment',
    description:
      'Full conceptual and logical design aligned to the Microsoft Cloud Adoption Framework - then delivered directly into your tenant.',
  },
  {
    icon: 'account_tree',
    title: 'Management Group & Azure Policy Design',
    description:
      'Management Group hierarchy and custom Azure Policy implementation to enforce compliance, cost control, and standards automatically.',
  },
  {
    icon: 'fingerprint',
    title: 'Identity & Access (RBAC, Entra ID)',
    description:
      'Granular access control structures and managed identity strategies to secure every interaction within your tenant.',
  },
  {
    icon: 'hub',
    title: 'Network Architecture',
    description:
      'Hub & Spoke topologies with Azure Firewall, WAF, and private link integration for hardened perimeter security and private connectivity.',
  },
  {
    icon: 'code',
    title: 'Infrastructure as Code (Bicep / Terraform)',
    description:
      'Automated provisioning using Bicep or Terraform to ensure environment consistency, repeatability, and rapid disaster recovery.',
  },
  {
    icon: 'shield_with_heart',
    title: 'Secure Environment Configuration',
    description:
      'Hardened baseline configurations for storage, compute, and databases, aligned to best practices and the principle of least privilege.',
  },
];

const useCases = [
  {
    icon: 'rocket_launch',
    title: 'New Azure Environment Setup',
    description:
      'Build a secure, scalable foundation from day one using proven architecture and best practices.',
    image:
      '/alz/usecase-01.png',
  },
  {
    icon: 'cleaning_services',
    title: 'Tenant Restructuring & Clean-up',
    description:
      'Redesign poorly structured environments to improve governance, security, and manageability.',
    image:
      '/alz/usecase-02.png',
  },
  {
    icon: 'corporate_fare',
    title: 'Enterprise Cloud Adoption',
    description:
      'Establish a consistent, repeatable foundation to support large-scale or multi-team deployments.',
    image:
      '/alz/usecase-03.png',
  },
  {
    icon: 'policy',
    title: 'Governance & Policy Implementation',
    description:
      'Enforce standards across subscriptions using Management Groups and Azure Policy.',
    image:
      '/alz/usecase-04.png',
  },
  {
    icon: 'lan',
    title: 'Secure Network Architecture Design',
    description:
      'Implement Hub & Spoke and private connectivity to reduce exposure and improve control.',
    image:
      '/alz/usecase-05.png',
  },
  {
    icon: 'terminal',
    title: 'Infrastructure as Code Adoption',
    description:
      'Move from manual deployments to automated, consistent infrastructure provisioning.',
    image:
      '/alz/usecase-06.png',
  },
];

const benefits = [
  {
    icon: 'trending_up',
    title: 'Faster Time to Market',
    description: 'Provision new environments in minutes, not weeks.',
  },
  {
    icon: 'verified_user',
    title: 'Compliant by Design',
    description: 'Governance is baked into the foundation, ensuring continuous compliance.',
  },
  {
    icon: 'payments',
    title: 'Predictable Costs',
    description: 'Tagging and budget policies prevent cloud spend from spiralling out of control.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface AzureLandingZonesPageProps {
  readonly className?: string;
}

export const AzureLandingZonesPage: React.FC<AzureLandingZonesPageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.azureLandingZones}
        schema={[
          serviceSchema({
            name: 'Azure Landing Zones',
            description: pageMeta.azureLandingZones.description,
            path: pageMeta.azureLandingZones.path,
            serviceType: 'Cloud Platform Architecture',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Azure Landing Zones', path: pageMeta.azureLandingZones.path },
          ]),
          faqSchema(faqs.azureLandingZones),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-36 flex items-center px-8 md:px-24 overflow-hidden bg-background">
        {/* Shader background */}
        <AnoAI />

        {/* Ambient glows */}
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.18) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.10) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(160,0,181,1) 1px, transparent 1px), linear-gradient(90deg, rgba(160,0,181,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <div className="max-w-4xl">

            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label">
                Azure Infrastructure
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-headline text-[3.5rem] md:text-[5.5rem] leading-[1.0] font-extrabold tracking-tighter mb-8">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                Azure Foundation &amp;
              </motion.span>
              <motion.span
                className="block text-gradient-primary"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                Landing Zones
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62 }}
            >
              Build a secure, scalable Azure environment designed for long-term growth.
              Every deployment built with security, governance, and scalability at its core.
            </motion.p>

          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-label">Scroll</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── Overview ──────────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-surface border-t border-outline">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

          {/* Text */}
          <div className="space-y-8">
            <ScrollReveal>
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
                Overview
              </span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                A Structured Foundation for{' '}
                <span className="text-gradient-primary">Long-Term Growth</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                We design and implement Azure landing zones that provide a strong, structured
                foundation for your cloud environment. Every deployment is built with security,
                governance, and scalability at its core, ensuring your platform can grow without
                introducing risk or complexity.
              </p>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                <img
                  src="/alz/hero.png"
                  alt="Azure architecture overview"
                  width={768}
                  height={460}
                  className="rounded-xl w-full h-[460px] object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── What We Deliver ───────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal className="mb-20">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              Deliverables
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
              What We Deliver
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliverables.map(({ icon, title, description }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                <TiltCard className="group h-full bg-surface border border-outline/60 rounded-2xl p-8 hover:border-primary/30 transition-all relative overflow-hidden">
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  {/* Corner glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
                        {icon}
                      </span>
                    </div>
                    <h4 className="font-headline text-lg font-bold mb-3">{title}</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How This Helps ────────────────────────────────────────────── */}
      <section className="py-32 bg-surface border-t border-outline">
        <div className="max-w-[1440px] mx-auto px-8 md:px-24">
          <div className="flex flex-col md:flex-row gap-20 items-center">

            {/* Image */}
            <ScrollReveal className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                  <img
                    src="/alz/usecase-05.png"
                    alt="Azure landing zone business impact and governance illustration"
                    width={768}
                    height={500}
                    className="rounded-xl w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-8">
              <ScrollReveal>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
                  Business Impact
                </span>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
                  Scale with{' '}
                  <span className="text-gradient-primary">Confidence</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Many Azure environments are built quickly without proper structure, leading to
                  security gaps, inconsistent deployments, and operational complexity.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  We establish a clear, well-architected foundation that enables your organisation
                  to scale confidently. By embedding governance, security, and automation from the
                  outset, your cloud environment remains controlled, efficient, and aligned with
                  best practices as it grows.
                </p>
              </ScrollReveal>

              {/* Benefit cards */}
              <div className="space-y-4 pt-2">
                {benefits.map(({ icon, title, description }, i) => (
                  <ScrollReveal key={title} delay={3 + i}>
                    <div className="flex items-start gap-4 p-5 bg-surface-container rounded-xl border border-outline/30 hover:border-primary/30 transition-colors group">
                      <div className="bg-primary/15 p-2.5 rounded-lg text-primary shrink-0 group-hover:bg-primary/25 transition-colors">
                        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                          {icon}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-headline font-bold mb-1">{title}</h5>
                        <p className="text-on-surface-variant text-sm">{description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use Cases ─────────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal className="text-center mb-20 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block">
              Application
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
              Common Use Cases
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Strategic triggers for Azure foundation modernisation.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(({ icon, title, description, image }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="group relative h-[320px] rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Background image */}
                <img
                  src={image}
                  alt={title}
                  width={768}
                  height={320}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
                {/* Hover tint */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                {/* Border */}
                <div className="absolute inset-0 rounded-2xl border border-outline/20 group-hover:border-primary/40 transition-colors duration-500" />
                {/* Top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/40 transition-colors">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1rem' }}>
                        {icon}
                      </span>
                    </div>
                    <h4 className="font-headline text-lg font-bold">{title}</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-20">
                    <p className="text-sm text-on-surface-variant leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <Faq
        items={faqs.azureLandingZones}
        groupName="faq-azure-landing-zones"
        eyebrow="Questions"
        heading="Frequently asked questions"
        description="What clients ask us most often about Azure landing zones and platform foundations."
      />

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-44 bg-surface relative overflow-hidden border-t border-outline">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.12)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'rgba(217, 70, 239, 0.08)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-12">
              READY TO BUILD YOUR
              <br />
              <span className="text-gradient-primary">AZURE FOUNDATION?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Schedule a consultation with our cloud architects to discuss your landing zone strategy.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Link to="/contact" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Book a Consultation
                </motion.button>
              </Link>
              <Link to="/how-we-work" className="no-underline">
                <motion.button
                  className="border border-outline/50 hover:border-primary/40 text-on-surface font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Our Process
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── References / Further Reading ─────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-8 pb-10 text-center text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/50 font-label">
        Further reading:{' '}
        <a
          href="https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Microsoft CAF Landing Zones
        </a>
        {' · '}
        <a
          href="https://learn.microsoft.com/azure/governance/management-groups/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Azure Management Groups
        </a>
      </div>

    </main>
  );
};

export default AzureLandingZonesPage;
