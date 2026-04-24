import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import React from 'react';
import { SEO } from '../components/SEO';
import { pageMeta, faqSchema, breadcrumbSchema } from '../data/seoMeta';
import { faqs, type FaqItem } from '../data/faqs';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Markdown-style link parser — mirrors the Faq component so answers here
// render the same inline navigation.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderAnswer(answer: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(answer)) !== null) {
    if (match.index > lastIndex) nodes.push(answer.slice(lastIndex, match.index));
    const [, label, href] = match;
    if (href.startsWith('/')) {
      nodes.push(
        <Link
          key={`${match.index}-${href}`}
          to={href}
          className="text-primary underline-offset-4 hover:underline transition-colors"
        >
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={`${match.index}-${href}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline transition-colors"
        >
          {label}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < answer.length) nodes.push(answer.slice(lastIndex));
  return nodes.length === 0 ? answer : nodes;
}

interface Group {
  readonly id: string;
  readonly title: string;
  readonly blurb: string;
  readonly items: readonly FaqItem[];
}

const groups: readonly Group[] = [
  {
    id: 'about-rcs',
    title: 'About Rosebud Cloud Solutions',
    blurb: 'Who we are, where we work, and how we engage.',
    items: [...faqs.home, ...faqs.about],
  },
  {
    id: 'how-we-work',
    title: 'How we work',
    blurb: 'Our delivery model, engagement shape, and working principles.',
    items: faqs.howWeWork,
  },
  {
    id: 'azure-landing-zones',
    title: 'Azure landing zones',
    blurb: 'Foundations, governance, and platform architecture on Azure.',
    items: faqs.azureLandingZones,
  },
  {
    id: 'cloud-security',
    title: 'Cloud security & compliance',
    blurb: 'Controls, standards alignment, and Defender-led hardening.',
    items: faqs.cloudSecurity,
  },
  {
    id: 'devsecops',
    title: 'DevSecOps',
    blurb: 'Security embedded in Azure DevOps and GitHub Actions pipelines.',
    items: faqs.devSecOps,
  },
  {
    id: 'cloud-optimisation',
    title: 'Cloud optimisation & FinOps',
    blurb: 'Reducing Azure spend without compromising reliability.',
    items: faqs.cloudOptimisation,
  },
  {
    id: 'managed-cloud',
    title: 'Managed cloud & security support',
    blurb: 'Ongoing operations, monitoring, and platform improvement.',
    items: faqs.managedCloud,
  },
  {
    id: 'advisory-consulting',
    title: 'Advisory & consulting',
    blurb: 'Strategic input without open-ended implementation.',
    items: faqs.advisoryConsulting,
  },
];

const allItems: FaqItem[] = groups.flatMap((g) => [...g.items]);

interface FaqPageProps {
  readonly className?: string;
}

export const FaqPage: React.FC<FaqPageProps> = ({ className = '' }) => (
  <main className={className}>
    <SEO
      {...pageMeta.faq}
      schema={[
        faqSchema(allItems),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]),
      ]}
    />

    {/* ── Hero ─────────────────────────────────────────────────────── */}
    <section className="relative pt-32 pb-20 px-8 md:px-24 bg-background overflow-hidden">
      <div className="absolute inset-0 rose-diffused-highlight pointer-events-none" />
      <div className="max-w-[1440px] mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
            Answers
          </span>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            Frequently asked <span className="text-gradient-primary">questions</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Every question we get asked on first calls — from how we're structured, to what
            Azure landing zones actually involve, to the way we price engagements. Grouped by
            topic so you can jump straight to the section that matters.
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-8" />
        </motion.div>

        {/* Topic index */}
        <motion.nav
          aria-label="FAQ topics"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="mt-12 flex flex-wrap gap-2"
        >
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="px-4 py-2 bg-surface/60 border border-outline/60 rounded-lg text-xs font-label uppercase tracking-wider text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors no-underline"
            >
              {g.title}
            </a>
          ))}
        </motion.nav>
      </div>
    </section>

    {/* ── Grouped FAQs ─────────────────────────────────────────────── */}
    {groups.map((group, gi) => (
      <section
        id={group.id}
        key={group.id}
        className={`scroll-mt-24 py-24 px-8 md:px-24 border-t border-outline ${
          gi % 2 === 0 ? 'bg-surface' : 'bg-background'
        }`}
      >
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="mb-10 max-w-3xl"
          >
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
              {group.title}
            </h2>
            <p className="text-on-surface-variant mt-4 leading-relaxed">{group.blurb}</p>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
          </motion.div>

          <div className="max-w-4xl space-y-3">
            {group.items.map((item, i) => (
              <motion.details
                key={item.question}
                name={`faq-page-${group.id}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="group bg-surface-container-highest/40 border border-outline/60 rounded-2xl overflow-hidden hover:border-primary/30 open:border-primary/40 transition-colors [&::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-6 px-8 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-headline text-base md:text-lg font-semibold text-on-surface pr-4">
                    {item.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-primary shrink-0 transition-transform duration-300 group-open:rotate-45"
                    style={{ fontSize: '1.5rem' }}
                  >
                    add
                  </span>
                </summary>
                <div className="px-8 pb-8 pt-0">
                  <p className="text-on-surface-variant leading-relaxed">
                    {renderAnswer(item.answer)}
                  </p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    ))}

    {/* ── CTA ──────────────────────────────────────────────────────── */}
    <section className="py-28 px-8 md:px-24 bg-surface border-t border-outline text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Still have a question?
        </h2>
        <p className="text-on-surface-variant text-base leading-relaxed mb-10">
          First conversations are short, free, and under no obligation. We'll tell you
          honestly whether we can help or whether someone else is better placed.
        </p>
        <Link to="/contact" className="no-underline">
          <motion.button
            className="btn-animated text-white font-headline font-bold px-10 py-4 rounded-lg text-base tracking-tight"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Start a Consultation
          </motion.button>
        </Link>
      </div>
    </section>
  </main>
);

export default FaqPage;
