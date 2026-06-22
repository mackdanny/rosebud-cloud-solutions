import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, breadcrumbSchema } from '../data/seoMeta';
import { articles, articleAuthor } from '../data/articles';

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const InsightsPage: React.FC = () => (
  <main className="pt-32 md:pt-40 pb-32 bg-background relative overflow-hidden">
    <SEO
      {...pageMeta.insights}
      schema={[
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ]),
      ]}
    />
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.14]" style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(160,0,181,0.5), transparent 70%)' }} />

    <div className="max-w-[900px] mx-auto px-6 relative">
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary-fixed font-bold font-label mb-6"
        >
          Insights
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-6"
        >
          Practical guides, <span className="text-gradient-primary">plain English</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto text-on-surface-variant text-lg leading-relaxed"
        >
          Azure, email authentication, and cloud security, written by the architects who do the work. No fluff, no scare tactics.
        </motion.p>
      </div>

      <div className="flex flex-col gap-6">
        {articles.map((article, i) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
          >
            <Link
              to={`/insights/${article.slug}`}
              className="group block no-underline rounded-2xl border border-outline/50 bg-surface/60 p-8 md:p-10 hover:border-primary/40 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <p className="text-xs text-on-surface-variant/70 font-label tracking-wide mb-3">
                {formatDate(article.datePublished)} · {article.readingMinutes} min read · {articleAuthor.name}
              </p>
              <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-white mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="text-on-surface-variant leading-relaxed max-w-3xl mb-5">{article.description}</p>
              <span className="inline-flex items-center gap-2 text-[11px] font-label uppercase tracking-[0.22em] text-primary">
                Read the guide
                <span aria-hidden="true" className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </main>
);

export default InsightsPage;
