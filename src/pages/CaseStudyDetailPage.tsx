import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { breadcrumbSchema } from '../data/seoMeta';
import { SITE_URL, SITE_NAME } from '../config/site';
import { ParticleBackground } from '../components/ParticleBackground';
import { caseStudies, getCaseStudyBySlug } from '../data/caseStudies';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    transition={{ duration: 0.7, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
  >
    {children}
  </motion.div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const CaseStudyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!study) {
    return <Navigate to="/case-studies" replace />;
  }

  const { detail } = study;
  const currentIndex = caseStudies.findIndex((c) => c.slug === study.slug);
  const nextStudy = currentIndex >= 0 && currentIndex < caseStudies.length - 1
    ? caseStudies[currentIndex + 1]
    : null;

  const studyPath = `/case-studies/${study.slug}`;
  const caseStudyArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.description,
    image: `${SITE_URL}/${study.image}`,
    url: `${SITE_URL}${studyPath}`,
    about: study.industry,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}${studyPath}`,
  };

  return (
    <main key={study.slug} className="bg-background min-h-screen">
      <SEO
        title={`${study.title} | Case Study | ${SITE_NAME}`}
        description={study.description}
        path={studyPath}
        image={`/${study.image}`}
        type="article"
        schema={[
          caseStudyArticleSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Case Studies', path: '/case-studies' },
            { name: study.title, path: studyPath },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center overflow-hidden border-b border-outline">
        <ParticleBackground />

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

        <div className="max-w-[1440px] mx-auto px-8 pt-8 pb-16 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-300 text-sm font-headline font-medium mb-10 no-underline group"
            >
              <span aria-hidden="true" className="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1" style={{ fontSize: '1.1rem' }}>
                arrow_back
              </span>
              All case studies
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center lg:items-start">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-5">
                Case Study
              </span>
              <span className="inline-block self-start text-[10px] font-label uppercase tracking-[0.25em] text-primary/80 mb-6 ml-3 px-3 py-1 rounded-full border border-primary/25 bg-primary/5">
                {study.industry}
              </span>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[0.98] mb-8">
                {study.title}
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg max-w-xl leading-relaxed">
                {study.description}
              </p>
            </motion.div>

            {/* Right: image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-outline/60 shadow-2xl">
                <img
                  src={`${import.meta.env.BASE_URL}${study.image}`}
                  alt={study.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-primary/10 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                {/* Icon badge */}
                <div className="absolute top-5 left-5 w-12 h-12 rounded-xl bg-background/70 backdrop-blur-md border border-primary/30 flex items-center justify-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
                    {study.icon}
                  </span>
                </div>
              </div>
              {/* Subtle glow behind image */}
              <div className="absolute -inset-6 bg-primary/10 blur-3xl -z-10 rounded-full pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Client Summary ────────────────────────────────────────────── */}
      <section className="py-20 bg-surface relative overflow-hidden border-b border-outline">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <ScrollReveal>
            <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-6">
              Client Summary
            </span>
          </ScrollReveal>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Industry', value: study.industry, icon: 'business' },
              { label: 'Organisation Size', value: detail.clientSummary.organisationSize, icon: 'groups' },
              { label: 'RCS Role', value: detail.clientSummary.rcsRole, icon: 'handshake' },
              {
                label: 'Microsoft Platform',
                value: detail.clientSummary.microsoftPlatform,
                icon: 'cloud',
              },
            ].map((fact) => (
              <motion.div
                key={fact.label}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="relative p-6 rounded-2xl border border-outline/60 bg-surface-container/40 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="flex items-center gap-2 mb-3">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.1rem' }}>
                    {fact.icon}
                  </span>
                  <span className="text-[10px] font-label uppercase tracking-[0.25em] text-on-surface-variant">
                    {fact.label}
                  </span>
                </div>
                {Array.isArray(fact.value) ? (
                  <div className="flex flex-wrap gap-1.5">
                    {fact.value.map((pill) => (
                      <span
                        key={pill}
                        className="text-[11px] font-headline font-medium text-white px-2.5 py-1 rounded-md bg-primary/15 border border-primary/25"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white font-headline font-semibold text-base leading-snug">
                    {fact.value}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── The Challenge ─────────────────────────────────────────────── */}
      <section className="py-28 bg-background relative overflow-hidden">
        <motion.div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.08)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20">
            <ScrollReveal>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
                    emergency
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-2">
                    01
                  </span>
                  <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter">
                    The <span className="text-gradient-primary">Challenge</span>
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div className="space-y-5 max-w-3xl">
                {detail.challenge.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-on-surface-variant text-base md:text-lg leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── The Approach ──────────────────────────────────────────────── */}
      <section className="py-28 bg-surface relative overflow-hidden border-y border-outline">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20">
            <ScrollReveal>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
                    architecture
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-2">
                    02
                  </span>
                  <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter">
                    The <span className="text-gradient-primary">Approach</span>
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div className="max-w-3xl">
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8">
                  {detail.approach.intro}
                </p>
                {detail.approach.elementsHeading && (
                  <p className="text-white font-headline font-semibold text-sm tracking-tight mb-5">
                    {detail.approach.elementsHeading}
                  </p>
                )}
                <motion.ul
                  className="grid md:grid-cols-2 gap-3 mb-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {detail.approach.elements.map((item) => (
                    <motion.li
                      key={item}
                      variants={fadeUp}
                      transition={{ duration: 0.45 }}
                      className="flex items-start gap-3 p-4 rounded-xl border border-outline/60 bg-surface-container/40"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-primary mt-0.5 shrink-0" style={{ fontSize: '1.05rem' }}>
                        check_circle
                      </span>
                      <span className="text-on-surface-variant text-sm leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                {detail.approach.closing && (
                  <div className="border-l-2 border-primary/40 pl-5">
                    <p className="text-on-surface-variant/90 text-base italic leading-relaxed">
                      {detail.approach.closing}
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── The Outcome ───────────────────────────────────────────────── */}
      <section className="py-28 bg-background relative overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'rgba(217, 70, 239, 0.08)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20">
            <ScrollReveal>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
                    trending_up
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-2">
                    03
                  </span>
                  <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter">
                    The <span className="text-gradient-primary">Outcome</span>
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div className="max-w-3xl">
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8">
                  {detail.outcome.intro}
                </p>
                <motion.ul
                  className="space-y-3 mb-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {detail.outcome.bullets.map((item) => (
                    <motion.li
                      key={item}
                      variants={fadeUp}
                      transition={{ duration: 0.45 }}
                      className="flex items-start gap-3"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-primary mt-0.5 shrink-0" style={{ fontSize: '1.05rem' }}>
                        done_all
                      </span>
                      <span className="text-on-surface-variant text-base leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                {detail.outcome.closing && (
                  <div className="border-l-2 border-primary/40 pl-5">
                    <p className="text-on-surface-variant/90 text-base italic leading-relaxed">
                      {detail.outcome.closing}
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Delivery Impact (conditional) ─────────────────────────────── */}
      {detail.deliveryImpact && (
        <section className="py-28 bg-surface relative overflow-hidden border-y border-outline">
          <div className="max-w-[1440px] mx-auto px-8 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-4">
                  Delivery Impact
                </span>
                <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter">
                  Measurable <span className="text-gradient-primary">Results</span>
                </h2>
              </div>
            </ScrollReveal>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {detail.deliveryImpact.map((item, i) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="relative p-6 rounded-2xl border border-outline/60 bg-surface-container/40 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="block text-4xl font-headline font-extrabold text-primary/30 tracking-tighter mb-2">
                    0{i + 1}
                  </span>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Next case study teaser (hidden on last study) ─────────────── */}
      {nextStudy && (
      <section className="py-24 bg-background relative overflow-hidden border-t border-outline">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">
              <div>
                <span className="block text-[11px] font-label uppercase tracking-[0.3em] text-primary mb-3">
                  Next Case Study
                </span>
                <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Continue Exploring
                </h2>
              </div>
              <Link
                to="/case-studies"
                className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-300 text-sm font-headline font-medium no-underline group"
              >
                View all
                <span aria-hidden="true" className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1" style={{ fontSize: '1.1rem' }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <Link
              to={`/case-studies/${nextStudy.slug}`}
              className="group relative grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-10 items-center p-6 md:p-8 rounded-2xl border border-outline/60 bg-surface-container/40 hover:border-primary/40 transition-all duration-500 no-underline overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-surface">
                <img
                  src={`${import.meta.env.BASE_URL}${nextStudy.image}`}
                  alt={nextStudy.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container/80 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10">
                <span className="inline-block text-[10px] font-label uppercase tracking-[0.25em] text-primary/80 mb-3 px-3 py-1 rounded-full border border-primary/25 bg-primary/5">
                  {nextStudy.industry}
                </span>
                <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-white mb-3 leading-snug">
                  {nextStudy.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 mb-5">
                  {nextStudy.description}
                </p>
                <span className="inline-flex items-center gap-2 text-primary font-headline font-semibold text-sm tracking-tight">
                  Read case study
                  <span aria-hidden="true" className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1" style={{ fontSize: '1.1rem' }}>
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-36 bg-surface relative overflow-hidden border-t border-outline">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.12)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-8">
              Building Something
              <br />
              <span className="text-gradient-primary">Similar?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Let's talk about how RCS can help you deliver a secure, governed Azure platform that scales with confidence.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <Link to="/contact" className="no-underline">
              <motion.button
                className="btn-animated text-white font-headline font-bold px-12 py-5 rounded-lg text-lg tracking-tight"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Start a Conversation
                <span aria-hidden="true" className="material-symbols-outlined ml-3 align-middle" style={{ fontSize: '1.2rem' }}>
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

export default CaseStudyDetailPage;
