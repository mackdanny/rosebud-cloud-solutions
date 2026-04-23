import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { FaqItem } from '../data/faqs';

// Parses markdown-style [text](/path) links in FAQ answers. Internal paths
// (starting with "/") render as react-router <Link>; absolute URLs render
// as <a> with rel=noopener,noreferrer. Plain text is passed through unchanged.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderAnswer(answer: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(answer)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(answer.slice(lastIndex, match.index));
    }
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
  if (lastIndex < answer.length) {
    nodes.push(answer.slice(lastIndex));
  }
  return nodes.length === 0 ? answer : nodes;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export interface FaqProps {
  readonly items: readonly FaqItem[];
  // groupName enables the native HTML exclusive-accordion behaviour
  // (opening one item auto-closes its siblings) in modern browsers.
  readonly groupName: string;
  readonly eyebrow?: string;
  readonly heading?: string;
  readonly description?: string;
  readonly className?: string;
}

export const Faq: React.FC<FaqProps> = ({
  items,
  groupName,
  eyebrow = 'Questions',
  heading = 'Frequently asked questions',
  description,
  className = '',
}) => (
  <section className={`py-32 px-8 md:px-24 bg-surface border-t border-outline ${className}`}>
    <div className="max-w-[1440px] mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="mb-16 max-w-3xl"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
          {eyebrow}
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          {heading}
        </h2>
        {description && (
          <p className="text-on-surface-variant mt-6 leading-relaxed text-lg">
            {description}
          </p>
        )}
        <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
      </motion.div>

      <div className="max-w-4xl space-y-3">
        {items.map((item, i) => (
          <motion.details
            key={item.question}
            name={groupName}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
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
);
