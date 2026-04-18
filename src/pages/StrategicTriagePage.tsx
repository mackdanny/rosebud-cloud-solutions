import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, breadcrumbSchema } from '../data/seoMeta';
import { TiltCard } from '../components/TiltCard';

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

const capabilities = [
  {
    icon: 'auto_fix_high',
    title: '80/20 Automation',
    description:
      'Gen-AI agents and the Strategic Directed Graph absorb the 80% of busy-work — mapping signals to strategy, running GRC checks, scoring fit.',
  },
  {
    icon: 'biotech',
    title: 'Forensic Signal Capture',
    description:
      'Every requirement enters as a cited signal, cross-referenced against industry pain points and the 4 Voices: Customer, Business, Process, Market.',
  },
  {
    icon: 'precision_manufacturing',
    title: 'Atomic Value Engineering',
    description:
      'Decompose requirements to technical Primitives and price the cost of complexity at the atomic level — long before a sprint is committed.',
  },
  {
    icon: 'supervisor_account',
    title: 'Human-In-The-Loop',
    description:
      'Senior leadership is only interrupted for the Vital 20% — high-risk, high-value decisions, each backed by a fully cited Decision Brief.',
  },
  {
    icon: 'timeline',
    title: 'Strategic Golden Thread',
    description:
      'Every dollar is traceable from boardroom intent to commit hash — operationalising intent end-to-end through a graph-native lineage.',
  },
  {
    icon: 'verified_user',
    title: 'GRC by Design',
    description:
      'Compliance shifts from a toll booth to a built-in guardrail. Security and privacy are baked into the engineering process, not bolted on.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface StrategicTriagePageProps {
  readonly className?: string;
}

export const StrategicTriagePage: React.FC<StrategicTriagePageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.strategicTriage}
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Strategic Triage', path: pageMeta.strategicTriage.path },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center px-8 md:px-24 overflow-hidden bg-background">
        {/* Ambient glows */}
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.18) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
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
                Strategic Triage Engine
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-headline text-[3rem] md:text-[5rem] leading-[1.0] font-extrabold tracking-tighter mb-8">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                From Intake Paralysis
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                to{' '}
                <span className="text-gradient-primary">Operationalised Intent</span>
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62 }}
            >
              A Graph &amp; Ontology reasoning platform for CTOs and Portfolio Managers drowning in a sea of noise.
              Compress the Evaluation Tax from months to minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <motion.button
                className="btn-animated text-white font-headline font-bold px-10 py-4 rounded-lg text-base tracking-tight"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Request a Decision Brief
              </motion.button>
              <motion.button
                className="text-white font-headline font-bold px-10 py-4 border border-outline hover:bg-white/5 rounded-lg text-base transition-all"
                whileHover={{ scale: 1.05, borderColor: 'rgba(160,0,181,0.5)' }}
                whileTap={{ scale: 0.97 }}
              >
                See How It Works
              </motion.button>
            </motion.div>

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

      {/* ── Problem Statement ─────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-surface border-t border-outline">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

          {/* Text */}
          <div className="space-y-8">
            <ScrollReveal>
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
                The Problem
              </span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                The Evaluation Tax is the bottleneck.{' '}
                <span className="text-gradient-primary">Not the build.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Strategic leakage. Architectural sprawl. Zombie projects. By the time requirements
                are manually validated against strategy and compliance, the market has moved on.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                A Strategic Directed Graph and 4-Voices ontology do the cited reasoning before
                anyone touches a sprint. Senior leaders are only interrupted for the Vital 20%.
              </p>
            </ScrollReveal>
          </div>

          {/* Visual — abstract graph illustration */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative bg-surface-container-highest p-10 rounded-2xl border border-outline/30">
                <div className="flex flex-col items-center gap-8">
                  {/* Graph nodes */}
                  <div className="flex items-center gap-6">
                    {['strategy', 'gavel', 'security', 'trending_up'].map((icon, i) => (
                      <motion.div
                        key={icon}
                        className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.6rem' }}>{icon}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '2rem' }}>hub</span>
                      <span className="font-headline font-bold text-lg">Strategic Directed Graph</span>
                    </div>
                    <p className="text-on-surface-variant text-sm max-w-xs">
                      4 Voices: Customer, Business, Process, Market
                    </p>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-primary/15 rounded-lg border border-primary/20 text-sm font-label">
                      <span className="text-primary font-bold">80%</span>
                      <span className="text-on-surface-variant ml-2">Automated</span>
                    </div>
                    <div className="px-4 py-2 bg-primary/15 rounded-lg border border-primary/20 text-sm font-label">
                      <span className="text-primary font-bold">20%</span>
                      <span className="text-on-surface-variant ml-2">Human Decision</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Video Walkthrough ─────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-24 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              Walkthrough
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
              See How It Works
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-outline/30 bg-surface-container-highest aspect-video">
                <iframe
                  src="https://drive.google.com/file/d/1Nxa5XJgP_coeGWbT2GTDl1vU_HRWbBF4/preview"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Strategic Triage Engine Walkthrough"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Capabilities ──────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-surface border-t border-outline">
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal className="text-center mb-20 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block">
              Platform Capabilities
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
              Automate the thinking.{' '}
              <span className="text-gradient-primary">Protect the building.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {capabilities.map(({ icon, title, description }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                <TiltCard className="group h-full bg-background border border-outline/60 rounded-2xl p-8 hover:border-primary/30 transition-all relative overflow-hidden">
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

      {/* ── Target Audience ───────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <ScrollReveal>
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
                Who It's For
              </span>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
                Built for portfolios that can no longer afford the{' '}
                <span className="text-gradient-primary">Evaluation Tax.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                For CTOs and Portfolio Managers in 4,000+ headcount organisations who need to
                surgically focus engineering on the features that mathematically drive growth.
              </p>
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
              READY TO ELIMINATE THE
              <br />
              <span className="text-gradient-primary">EVALUATION TAX?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Book a triage walk-through and see how the Strategic Directed Graph transforms your portfolio intake.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Link to="/contact" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Book a Triage Walk-through
                </motion.button>
              </Link>
              <motion.button
                className="text-white font-headline font-bold px-14 py-6 border border-outline hover:bg-white/5 rounded-lg text-xl transition-all"
                whileHover={{ scale: 1.05, borderColor: 'rgba(160,0,181,0.5)' }}
                whileTap={{ scale: 0.97 }}
              >
                Download One-Pager
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
};

export default StrategicTriagePage;
