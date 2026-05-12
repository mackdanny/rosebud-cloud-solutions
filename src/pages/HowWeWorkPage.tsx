import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Faq } from '../components/Faq';
import { pageMeta, breadcrumbSchema, faqSchema } from '../data/seoMeta';
import { faqs } from '../data/faqs';
const ParticleBackground = lazy(() => import('../components/ParticleBackground'));

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
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

// ─── Step Data ────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    title: 'Assess & Understand',
    description: 'We start by reviewing your current environment, identifying risks, gaps, and inefficiencies.',
    icon: 'search',
    items: [
      'Environment and architecture review',
      'Security and compliance gap analysis',
      'Identity and access assessment',
      'Cost and performance insights',
    ],
  },
  {
    number: '02',
    title: 'Design & Architect',
    description: 'We design a structured, scalable Azure architecture aligned to best practices.',
    icon: 'architecture',
    items: [
      'Landing zone and network design',
      'Management group and policy structure',
      'Identity and access model (RBAC, least privilege)',
      'Security and compliance alignment',
    ],
  },
  {
    number: '03',
    title: 'Build & Deploy',
    description: 'We implement using Infrastructure as Code to ensure consistency and repeatability.',
    icon: 'rocket_launch',
    items: [
      'Bicep / Terraform deployments',
      'CI/CD pipeline integration',
      'Environment standardisation (dev/test/prod)',
      'Automated policy and governance enforcement',
    ],
  },
  {
    number: '04',
    title: 'Secure & Validate',
    description: 'Security is built in from the start, not added later.',
    icon: 'verified_user',
    items: [
      'Azure Policy and governance validation',
      'Continuous security monitoring integration',
      'Compliance alignment (e.g. CIS, Azure Security Benchmark)',
      'Testing and validation of controls',
    ],
  },
  {
    number: '05',
    title: 'Optimise & Support',
    description: 'We ensure your environment continues to perform as your business evolves.',
    icon: 'tune',
    items: [
      'Cost optimisation and resource tuning',
      'Performance monitoring and improvement',
      'Ongoing governance and policy refinement',
      'Continuous improvement recommendations',
    ],
  },
];

const outcomes = [
  { icon: 'shield', text: 'Secure Azure environments with reduced attack surface' },
  { icon: 'sync', text: 'Consistent, repeatable deployments across all environments' },
  { icon: 'policy', text: 'Built-in governance and compliance from day one' },
  { icon: 'savings', text: 'Improved cost control and performance visibility' },
  { icon: 'expand', text: 'A platform designed to scale without rework' },
];

const engagementOptions = [
  {
    icon: 'deployed_code',
    title: 'Project Delivery',
    description: 'End-to-end design and implementation',
  },
  {
    icon: 'fact_check',
    title: 'Assessment & Review',
    description: 'Identify risks and define a roadmap',
  },
  {
    icon: 'support_agent',
    title: 'Ongoing Support',
    description: 'Continuous management and optimisation',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const HowWeWorkPage: React.FC = () => {
  return (
    <main className="bg-background min-h-screen">
      <SEO
        {...pageMeta.howWeWork}
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'How We Work', path: pageMeta.howWeWork.path },
          ]),
          faqSchema(faqs.howWeWork),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center overflow-hidden border-b border-outline">
        <Suspense fallback={null}><ParticleBackground /></Suspense>

        {/* Ambient glows */}
        <motion.div
          className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.15)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(217, 70, 239, 0.08)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        <div className="max-w-[1440px] mx-auto px-8 pt-12 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-6">
              Our Delivery Model
            </span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.92] mb-8">
              How We Deliver
              <br />
              <span className="text-gradient-primary">Secure Azure</span>
              <br />
              Platforms
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed mb-6">
              A structured, security-first approach to designing, building, and managing Azure environments that scale with confidence.
            </p>
          </motion.div>

          <motion.div
            className="border-l-2 border-primary/40 pl-6 max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-on-surface-variant/80 text-base leading-relaxed">
              We don't take a one-size-fits-all approach to cloud. Every engagement is designed around your current environment, business goals, and risk profile. Our delivery model combines architecture, automation, and security from the outset - ensuring your Azure platform is built to perform, remain compliant, and scale without unnecessary complexity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 1: Our Approach ──────────────────────────────────── */}
      <section className="py-32 bg-surface relative overflow-hidden">
        {/* Subtle connector line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent hidden lg:block" />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-4">
                Our Approach
              </span>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                A Proven <span className="text-gradient-primary">Delivery Model</span>
              </h2>
              <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                Our approach is built around real-world experience delivering secure Azure environments across complex organisations. We focus on consistency, automation, and security at every stage.
              </p>
            </div>
          </ScrollReveal>

          {/* Steps */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group"
              >
                <div className={`grid lg:grid-cols-2 gap-8 items-start p-8 md:p-10 rounded-2xl border border-outline/60 bg-surface-container/40 hover:border-primary/40 transition-all duration-500 relative overflow-hidden ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Left: Number + Title + Description */}
                  <div className={`relative z-10 ${i % 2 === 1 ? 'lg:order-2 lg:text-left' : ''}`} style={{ direction: 'ltr' }}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl md:text-6xl font-headline font-extrabold text-primary/20 tracking-tighter leading-none">
                        {step.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
                            {step.icon}
                          </span>
                          <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-white">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-on-surface-variant text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Bullet items */}
                  <div className={`relative z-10 ${i % 2 === 1 ? 'lg:order-1' : ''}`} style={{ direction: 'ltr' }}>
                    <ul className="space-y-3">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span aria-hidden="true" className="material-symbols-outlined text-primary mt-0.5 shrink-0" style={{ fontSize: '1rem' }}>
                            check_circle
                          </span>
                          <span className="text-on-surface-variant text-[15px] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: DevSecOps & Automation ────────────────────────── */}
      <section className="py-32 bg-background relative overflow-hidden border-t border-outline">
        <motion.div
          className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.1)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <ScrollReveal>
              <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-4">
                How We Work in Practice
              </span>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-8">
                Built on <span className="text-gradient-primary">DevSecOps</span>
                <br />
                and Automation
              </h2>
              <div className="space-y-5">
                <p className="text-on-surface-variant text-base leading-relaxed">
                  Our delivery model is grounded in DevSecOps principles, where security, automation, and development are fully integrated.
                </p>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  Rather than manual deployments and reactive fixes, we use Infrastructure as Code, automated pipelines, and policy-driven governance to create environments that are consistent, auditable, and secure by default.
                </p>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  This approach reduces risk, improves deployment speed, and ensures your platform can scale without introducing complexity or technical debt.
                </p>
              </div>
            </ScrollReveal>

            {/* Right: Visual element - DevSecOps loop */}
            <ScrollReveal delay={2}>
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto relative">
                  {/* Outer ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-primary/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Inner ring */}
                  <motion.div
                    className="absolute inset-8 rounded-full border border-primary/15"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Core ring */}
                  <motion.div
                    className="absolute inset-16 rounded-full border border-primary/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary mb-2 block" style={{ fontSize: '2.5rem' }}>
                        all_inclusive
                      </span>
                      <span className="text-white font-headline font-bold text-lg tracking-tight">DevSecOps</span>
                    </div>
                  </div>

                  {/* Orbiting nodes */}
                  {[
                    { label: 'Security', icon: 'security', angle: 0 },
                    { label: 'Automation', icon: 'smart_toy', angle: 120 },
                    { label: 'Development', icon: 'code', angle: 240 },
                  ].map((node, idx) => {
                    const rad = (node.angle * Math.PI) / 180;
                    const radius = 42;
                    const x = 50 + radius * Math.cos(rad);
                    const y = 50 + radius * Math.sin(rad);
                    return (
                      <motion.div
                        key={node.label}
                        className="absolute flex flex-col items-center gap-1"
                        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + idx * 0.2, duration: 0.5 }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-surface-container border border-primary/30 flex items-center justify-center">
                          <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.5rem' }}>
                            {node.icon}
                          </span>
                        </div>
                        <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant whitespace-nowrap">
                          {node.label}
                        </span>
                      </motion.div>
                    );
                  })}

                  {/* Ambient glow */}
                  <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 3: Outcomes ──────────────────────────────────────── */}
      <section className="py-32 bg-surface relative overflow-hidden border-t border-outline">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-4">
                What This Means for You
              </span>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter">
                Outcomes You Can <span className="text-gradient-primary">Rely On</span>
              </h2>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-5 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {outcomes.map((outcome) => (
              <motion.div
                key={outcome.text}
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                className="group relative p-6 rounded-2xl border border-outline/60 bg-surface-container/40 hover:border-primary/40 transition-all duration-500 text-center"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.5rem' }}>
                    {outcome.icon}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{outcome.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 4: Engagement Options ────────────────────────────── */}
      <section className="py-32 bg-background relative overflow-hidden border-t border-outline">
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.08)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-4">
                Engagement Options
              </span>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter">
                Flexible Ways to <span className="text-gradient-primary">Engage</span>
              </h2>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {engagementOptions.map((option) => (
              <motion.div
                key={option.title}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="group relative p-8 rounded-2xl border border-outline/60 bg-surface-container/40 hover:border-primary/40 transition-all duration-500 text-center"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.8rem' }}>
                      {option.icon}
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold tracking-tight text-white mb-3">
                    {option.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <Faq
        items={faqs.howWeWork}
        groupName="faq-how-we-work"
        eyebrow="Questions"
        heading="Frequently asked questions"
        description="How we structure, deliver, and hand over engagements - and what working with us looks like in practice."
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
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
              Ready to Build a
              <br />
              <span className="text-gradient-primary">Secure Azure Foundation?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              Whether you're starting from scratch or improving an existing environment, we can help you design and deliver a platform that is secure, scalable, and built to last.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <Link to="/contact" className="no-underline">
              <motion.button
                className="btn-animated text-white font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Start a Conversation
                <span aria-hidden="true" className="material-symbols-outlined ml-3 align-middle" style={{ fontSize: '1.3rem' }}>
                  arrow_forward
                </span>
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
};

export default HowWeWorkPage;
