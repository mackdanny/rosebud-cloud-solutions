import { lazy, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, organisationSchema, websiteSchema } from '../data/seoMeta';
import { ParticleBackground } from '../components/ParticleBackground';
import { TiltCard } from '../components/TiltCard';
import { useMouseSpotlight } from '../hooks/useMouseSpotlight';
import { heroContent, certifications } from '../data/mockData';

// Lazy-load: SparklesCore pulls in three.js (~500KB). Defer until after the hero
// text paints so LCP isn't blocked by the animation engine.
const SparklesCore = lazy(() =>
  import('../components/ui/sparkles').then((m) => ({ default: m.SparklesCore })),
);

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
};

// ─── Learn More flip button ───────────────────────────────────────────────────

const LearnMoreButton: React.FC<{ to?: string; label?: string }> = ({ to, label = 'Learn More' }) => {
  const [hovered, setHovered] = useState(false);
  const inner = (
    <motion.button
      className="mt-8 flex items-center gap-2 text-[11px] font-label uppercase tracking-[0.22em] self-start"
      style={{ perspective: 400 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Text flip container */}
      <span className="relative inline-block overflow-hidden" style={{ height: '1.3em' }}>
        {/* Front — primary colour, folds away upward */}
        <motion.span
          className="block text-primary whitespace-nowrap"
          style={{ transformOrigin: '50% 0%' }}
          animate={hovered ? { rotateX: -90, opacity: 0 } : { rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.18, ease: 'easeIn' }}
        >
          {label}
        </motion.span>
        {/* Back — white, unfolds in from below */}
        <motion.span
          className="absolute inset-0 text-white whitespace-nowrap"
          style={{ transformOrigin: '50% 100%' }}
          animate={hovered ? { rotateX: 0, opacity: 1 } : { rotateX: 90, opacity: 0 }}
          transition={
            hovered
              ? { duration: 0.18, delay: 0.14, ease: 'easeOut' }
              : { duration: 0.18, ease: 'easeIn' }
          }
        >
          {label}
        </motion.span>
      </span>
      {/* Arrow — also swaps to white on hover */}
      <motion.span aria-hidden="true"
        className="material-symbols-outlined text-[14px]"
        animate={{ color: hovered ? '#ffffff' : 'var(--color-primary)', x: hovered ? 2 : 0 }}
        transition={{ duration: 0.18, delay: hovered ? 0.14 : 0 }}
      >
        arrow_forward
      </motion.span>
    </motion.button>
  );
  if (to) return <Link to={to} className="no-underline self-start">{inner}</Link>;
  return inner;
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

// ─── Component ────────────────────────────────────────────────────────────────

interface HomePageProps {
  readonly className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ className = '' }) => {
  const heroRef = useRef<HTMLElement>(null);
  useMouseSpotlight(heroRef);

  return (
    <main className={className}>
      <SEO
        {...pageMeta.home}
        schema={[organisationSchema, websiteSchema]}
        preloadImages={[
          { href: '/rcs-logo.webp', type: 'image/webp', fetchPriority: 'high' },
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="spotlight relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden"
      >
        {/* Particle network */}
        <ParticleBackground />

        {/* Ambient glow */}
        <div className="absolute inset-0 rose-diffused-highlight pointer-events-none" />

        {/* RCS watermark — shape-traced glow + ambient particles */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center pr-4">
          <div className="relative w-[580px] h-[580px] flex items-center justify-center">

            {/* Ambient sparkles — lazy-loaded after hero text paints */}
            <Suspense fallback={null}>
              <SparklesCore
                className="absolute inset-0 z-10 pointer-events-auto"
                background="transparent"
                particleColor="#d946ef"
                particleDensity={35}
                minSize={0.6}
                maxSize={1.6}
                speed={1.0}
              />
            </Suspense>

            {/* Logo — drop-shadow traces the actual flower silhouette */}
            <motion.img
              src={`${import.meta.env.BASE_URL}rcs-logo.webp`}
              alt=""
              aria-hidden="true"
              className="relative z-20 w-full h-full object-contain opacity-40 mix-blend-lighten select-none"
              animate={{
                filter: [
                  'drop-shadow(0 0 6px rgba(217,70,239,0.55)) drop-shadow(0 0 18px rgba(160,0,181,0.40)) drop-shadow(0 0 50px rgba(160,0,181,0.18))',
                  'drop-shadow(0 0 12px rgba(217,70,239,0.90)) drop-shadow(0 0 35px rgba(160,0,181,0.65)) drop-shadow(0 0 80px rgba(160,0,181,0.30))',
                  'drop-shadow(0 0 6px rgba(217,70,239,0.55)) drop-shadow(0 0 18px rgba(160,0,181,0.40)) drop-shadow(0 0 50px rgba(160,0,181,0.18))',
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Hero content */}
        <div className="max-w-[1440px] mx-auto px-8 w-full relative z-10">
          <div className="max-w-5xl">

            {/* Eyebrow */}
            <motion.span
              className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {heroContent.eyebrow}
            </motion.span>

            {/* Headline — staggered lines */}
            <h1 className="font-headline text-[2.5rem] md:text-[5.25rem] leading-[1.05] font-extrabold tracking-tighter mb-12">
              {heroContent.headline.map((line, i) => (
                <motion.span
                  key={i}
                  className="block"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                  }}
                >
                  {line === heroContent.gradientWord ? (
                    <span className="text-gradient-primary">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </motion.span>
              ))}
            </h1>

            {/* CTA row */}
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center gap-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <Link to="/contact" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-12 py-5 rounded-lg text-lg tracking-tight"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {heroContent.cta}
                </motion.button>
              </Link>
              <div className="max-w-xl">
                <p className="text-on-surface-variant text-base leading-relaxed border-l-2 border-primary/20 pl-6">
                  {heroContent.body}
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </section>

      {/* ── Microsoft Certifications ───────────────────────────────── */}
      <section className="py-24 border-y border-outline bg-surface/30">
        <div className="max-w-[1440px] mx-auto px-8">
          <ScrollReveal className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-3">
              Microsoft-Certified Expertise
            </p>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-14">
              Our team holds active Microsoft certifications across Azure infrastructure, AI, networking, and DevOps.
            </p>
          </ScrollReveal>
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 md:gap-14 mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {certifications.map(({ src, alt }, i) => (
              <motion.div
                key={src}
                variants={scaleIn}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
                className="w-32 h-32 md:w-44 md:h-44 p-1 cursor-pointer transition-[filter] duration-400 hover:drop-shadow-[0_0_20px_rgba(160,0,181,0.65)]"
                style={{ filter: 'drop-shadow(0 0 0px rgba(160,0,181,0))' }}
                title={alt}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  width={176}
                  height={176}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section className="py-32 bg-background relative">
        <div className="max-w-[1440px] mx-auto px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block font-bold font-label">
                  Comprehensive Capabilities
                </span>
                <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                  Bespoke technical solutions for the modern enterprise
                </h2>
              </div>
              <div className="hidden md:block w-32 h-px bg-primary/20 mb-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Azure Foundation & Landing Zones */}
            <ScrollReveal className="md:col-span-8" delay={0}>
              <TiltCard className="group relative overflow-hidden bg-surface border border-outline/60 rounded-2xl h-full flex flex-col min-h-[500px]">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                {/* Ghost icon */}
                <div className="absolute right-[-2rem] bottom-[-2rem] opacity-[0.035] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none select-none">
                  <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '22rem' }}>architecture</span>
                </div>

                <div className="relative z-10 p-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-8 shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.6rem' }}>architecture</span>
                  </div>
                  {/* Eyebrow */}
                  <span className="text-[9px] font-label uppercase tracking-[0.28em] text-primary/70 mb-3 block">Core Service</span>
                  <h3 className="font-headline text-3xl font-bold mb-4">Azure Foundation &amp; Landing Zones</h3>
                  <p className="text-on-surface-variant leading-relaxed text-base max-w-lg mb-6">
                    Most Azure environments start messy and get expensive fast.
                  </p>
                  <p className="text-on-surface-variant/90 leading-relaxed text-base max-w-lg mb-auto italic border-l-2 border-primary/30 pl-5">
                    We design and deploy structured landing zones that bring control, security, and scalability from the very beginning.
                  </p>

                  <LearnMoreButton to="/services/azure-landing-zones" label="See How We Build Azure Foundations" />
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Cloud Security & Compliance */}
            <ScrollReveal className="md:col-span-4" delay={1}>
              <TiltCard className="group relative overflow-hidden bg-surface border border-outline/60 rounded-2xl h-full flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/5 rounded-full blur-[70px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 p-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-8 shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.6rem' }}>security</span>
                  </div>
                  <span className="text-[9px] font-label uppercase tracking-[0.28em] text-primary/70 mb-3 block">Core Service</span>
                  <h3 className="font-headline text-2xl font-bold mb-4">Cloud Security &amp; Compliance</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    Most cloud environments aren't as secure as people think.
                  </p>
                  <p className="text-on-surface-variant/90 text-sm leading-relaxed mb-auto italic border-l-2 border-primary/30 pl-4">
                    We help you identify gaps, apply the right controls, and align your Azure platform to recognised security and compliance standards.
                  </p>

                  <LearnMoreButton to="/services/cloud-security" label="See How We Secure Azure" />
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Managed Cloud & Security Support */}
            <ScrollReveal className="md:col-span-4" delay={2}>
              <TiltCard className="group relative overflow-hidden bg-surface border border-outline/60 rounded-2xl h-full flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 p-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-8 shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.6rem' }}>shield</span>
                  </div>
                  <span className="text-[9px] font-label uppercase tracking-[0.28em] text-primary/70 mb-3 block">Core Service</span>
                  <h3 className="font-headline text-2xl font-bold mb-4">Managed Cloud &amp; Security Support</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    Cloud environments don't stay optimised on their own.
                  </p>
                  <p className="text-on-surface-variant/90 text-sm leading-relaxed mb-auto italic border-l-2 border-primary/30 pl-4">
                    We provide ongoing management, monitoring, and improvement to keep your Azure platform secure, compliant, and performing as it should.
                  </p>

                  <LearnMoreButton to="/services/managed-cloud" label="See How We Support Your Cloud" />
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* How We Deliver */}
            <ScrollReveal className="md:col-span-8" delay={3}>
              <TiltCard className="group relative overflow-hidden bg-surface border border-outline/60 rounded-2xl h-full flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/6 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 p-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-8 shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.6rem' }}>route</span>
                  </div>
                  <span className="text-[9px] font-label uppercase tracking-[0.28em] text-primary/70 mb-3 block">Approach</span>
                  <h3 className="font-headline text-2xl font-bold mb-3">How We Deliver Secure Azure Platforms</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-8 max-w-lg">
                    We follow a structured, security-first approach to design, build, and manage Azure environments that scale properly from day one.
                  </p>

                  {/* Steps */}
                  <ul className="flex flex-col gap-3 mb-auto">
                    {[
                      'Assess your current environment and risks',
                      'Design a secure, scalable architecture',
                      'Deploy using Infrastructure as Code',
                      'Validate security, governance, and compliance',
                      'Continuously optimise and improve',
                    ].map((step, i) => (
                      <motion.li
                        key={step}
                        className="flex items-center gap-3 text-sm text-on-surface-variant"
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                        </div>
                        {step}
                      </motion.li>
                    ))}
                  </ul>

                  <LearnMoreButton to="/how-we-work" label="See How We Work" />
                </div>
              </TiltCard>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── Strategic Triage Engine Highlight ────────────────────────── */}
      <section className="py-32 bg-background relative overflow-hidden border-t border-outline">
        {/* Ambient glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">

            {/* Left — Text content */}
            <div className="w-full md:w-1/2 space-y-6">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.2rem' }}>hub</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label">
                    Strategic Triage Engine
                  </span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
                  From Intake Paralysis to{' '}
                  <span className="text-gradient-primary">Operationalised Intent</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  A Graph &amp; Ontology reasoning platform that compresses the Evaluation Tax from
                  months to minutes — without letting board-level intent evaporate before it reaches the backlog.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={3}>
                <div className="flex flex-wrap gap-3 pt-2">
                  {['80/20 Automation', 'Forensic Signal Capture', 'GRC by Design'].map((label) => (
                    <span
                      key={label}
                      className="px-4 py-2 bg-primary/8 border border-primary/20 rounded-lg text-xs font-label uppercase tracking-wider text-on-surface-variant"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={4}>
                <Link
                  to="/tools/strategic-triage"
                  className="inline-flex items-center gap-2 mt-4 no-underline"
                >
                  <motion.span
                    className="btn-animated text-white font-headline font-bold px-8 py-4 rounded-lg text-base tracking-tight inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Explore the Platform
                  </motion.span>
                </Link>
              </ScrollReveal>
            </div>

            {/* Right — Visual */}
            <ScrollReveal className="w-full md:w-1/2" delay={2}>
              <div className="relative">
                <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
                <div className="relative bg-surface p-8 rounded-2xl border border-outline/30">
                  {/* Miniature graph visualisation */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-label uppercase tracking-widest text-primary/60">Strategic Directed Graph</span>
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">Live</span>
                    </div>

                    {/* Graph nodes row */}
                    <div className="flex items-center justify-center gap-4">
                      {[
                        { icon: 'person', label: 'Customer' },
                        { icon: 'business', label: 'Business' },
                        { icon: 'settings', label: 'Process' },
                        { icon: 'storefront', label: 'Market' },
                      ].map(({ icon, label }, i) => (
                        <motion.div
                          key={label}
                          className="flex flex-col items-center gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.12 }}
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                            <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.2rem' }}>{icon}</span>
                          </div>
                          <span className="text-[9px] font-label uppercase tracking-wider text-on-surface-variant/60">{label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Connection lines */}
                    <div className="flex items-center gap-3 justify-center">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '0.9rem' }}>auto_fix_high</span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>

                    {/* Output row */}
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 rounded-lg border border-primary/20">
                        <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1rem' }}>bolt</span>
                        <span className="text-xs font-label font-bold text-primary">80%</span>
                        <span className="text-[10px] text-on-surface-variant">Auto-triaged</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-container rounded-lg border border-outline/30">
                        <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '1rem' }}>supervisor_account</span>
                        <span className="text-xs font-label font-bold">20%</span>
                        <span className="text-[10px] text-on-surface-variant">Leader review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

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
              ELEVATE YOUR
              <br />
              <span className="text-gradient-primary">DIGITAL ESTATE</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Partner with a consulting firm that values technical gravitas and long-term partnership.
              Let's engineer your future together.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/contact" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-10 py-4 rounded-lg text-base tracking-tight"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start a Consultation
                </motion.button>
              </Link>
              <Link to="/how-we-work" className="no-underline">
                <motion.button
                  className="text-white font-headline font-bold px-10 py-4 border border-outline hover:bg-white/5 rounded-lg text-base transition-all"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(160,0,181,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Our Philosophy
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
