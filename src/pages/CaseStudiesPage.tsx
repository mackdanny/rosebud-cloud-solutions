import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, breadcrumbSchema } from '../data/seoMeta';
import { ParticleBackground } from '../components/ParticleBackground';
import { caseStudies } from '../data/caseStudies';
import { SITE_URL } from '../config/site';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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

// Case study data is now defined in src/data/caseStudies.ts

// ─── Component ────────────────────────────────────────────────────────────────

export const CaseStudiesPage: React.FC = () => {
  const caseStudiesListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: caseStudies.map((cs, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/case-studies/${cs.slug}`,
      name: cs.title,
    })),
  };

  return (
    <main className="bg-background min-h-screen">
      <SEO
        {...pageMeta.caseStudies}
        schema={[
          caseStudiesListSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Case Studies', path: pageMeta.caseStudies.path },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center overflow-hidden border-b border-outline">
        <ParticleBackground />

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

        <div className="max-w-[1440px] mx-auto px-8 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-6">
              Case Studies
            </span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.92] mb-8">
              Proven Outcomes
              <br />
              <span className="text-gradient-primary">Across Regulated</span>
              <br />
              Industries
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed mb-6">
              Real engagements where secure Azure foundations, automation, and governance have helped organisations scale with confidence.
            </p>
          </motion.div>

          <motion.div
            className="border-l-2 border-primary/40 pl-6 max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-on-surface-variant/80 text-base leading-relaxed">
              From Tier-1 financial institutions to public sector regulators and global retailers, our case studies show how RCS embeds security, governance, and DevSecOps into every Azure platform we deliver — so the outcomes last long after the engagement ends.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Case Studies Grid ────────────────────────────────────────── */}
      <section className="py-32 bg-surface relative overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.08)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-4">
                Selected Engagements
              </span>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                Secure Azure, <span className="text-gradient-primary">Delivered</span>
              </h2>
              <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                Each engagement is grounded in the same principles — security by design, Infrastructure as Code, and governance built in from day one.
              </p>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {caseStudies.map((study) => (
              <motion.div
                key={study.slug}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link
                  to={`/case-studies/${study.slug}`}
                  className="group relative h-full flex flex-col rounded-2xl border border-outline/60 bg-surface-container/40 hover:border-primary/40 transition-all duration-500 no-underline overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <img
                      src={`${import.meta.env.BASE_URL}${study.image}`}
                      alt={study.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    {/* Image gradient overlay for legibility of the icon badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container/90 via-surface-container/20 to-transparent pointer-events-none" />
                    {/* Icon badge (top-left over image) */}
                    <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-background/70 backdrop-blur-md border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.3rem' }}>
                        {study.icon}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative z-10 flex flex-col flex-1 p-7">
                    {/* Industry tag */}
                    <span className="inline-block self-start text-[10px] font-label uppercase tracking-[0.25em] text-primary/80 mb-4 px-3 py-1 rounded-full border border-primary/25 bg-primary/5">
                      {study.industry}
                    </span>

                    {/* Title */}
                    <h3 className="font-headline text-xl md:text-[22px] font-bold tracking-tight text-white mb-4 leading-snug">
                      {study.title}
                    </h3>

                    {/* Description */}
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-1">
                      {study.description}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-2 text-primary font-headline font-semibold text-sm tracking-tight mt-auto">
                      <span className="transition-all duration-300 group-hover:tracking-wide">Read case study</span>
                      <span aria-hidden="true" className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1" style={{ fontSize: '1.1rem' }}>
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-44 bg-background relative overflow-hidden border-t border-outline">
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
              Have a Similar
              <br />
              <span className="text-gradient-primary">Challenge Ahead?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              If any of these engagements resonate with the problems you're trying to solve, we'd be glad to talk through how we can help.
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

export default CaseStudiesPage;
